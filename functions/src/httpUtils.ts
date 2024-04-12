import * as logger from "firebase-functions/logger";

const RATE_LIMIT_OR_EXCEEDED_QUOTA = 429;
const SERVER_ERROR = 500;
const ENGINE_OVERLOADED = 503;

/**
 * Retry a function on certain HTTP failures. Handles logging and waiting between retries.
 * @param {() => Promise<T>} fn The function to run.
 * @param {number} maxRetries The maximum number of times to retry the function.
 * @param {number} waitTimeSeconds The number of seconds to wait between retries.
 */
export async function retryOnFailure<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  waitTimeSeconds: number
): Promise<T> {
  let attempts = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) {
        throw new Error(
          `Max retries (${maxRetries}) reached. Most recent error: ${error}`
        );
      } else if (
        error instanceof HttpError &&
        [
          RATE_LIMIT_OR_EXCEEDED_QUOTA,
          SERVER_ERROR,
          ENGINE_OVERLOADED,
        ].includes(error.status)
      ) {
        logger.warn(
          `Error, but will retry ${
            maxRetries - attempts
          } more times. Current error: ${error}`
        );
        logger.debug(`Waiting ${waitTimeSeconds} seconds before retrying`);
        await new Promise((resolve) =>
          setTimeout(resolve, waitTimeSeconds * 1000)
        );
      } else {
        logger.error(`Error, but will not retry: ${error}`);
        throw error;
      }
    }
  }
}

export class HttpError extends Error {
  public source: string;
  public status: number;

  /**
   * @param {string} source The resource that caused the error.
   * @param {number} status The HTTP status code.
   * @param {string} message The error message.
   */
  constructor(source: string, status: number, message?: string) {
    super(message);
    this.source = source;
    this.status = status;
  }

  toString(): string {
    return `Source: ${this.source}, Status: ${
      this.status
    }, ${super.toString()}`;
  }
}

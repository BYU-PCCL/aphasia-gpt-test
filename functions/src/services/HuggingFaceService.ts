import {HttpError} from "../httpUtils";
const fetch = require('node-fetch');

/**
 * A service to interact with the Hugging Face API.
 */
export class HuggingFaceService {
  private readonly apiKey: string;
  private readonly BASE_URL: string =
    "https://api-inference.huggingface.co/models/";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get embeddings for a list of texts.
   * @param texts The texts to get embeddings for.
   * @param embeddingsModelName The Hugging Face model to use.
   * @return The embeddings for the texts.
   */
  public async embedTexts(
    texts: string[],
    embeddingsModelName: string
  ): Promise<number[][]> {
    const apiUrl = this.BASE_URL + embeddingsModelName;
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        inputs: texts,
      }),
    });

    if (response.ok) {
      try {
        return this.readEmbeddingsFromResponse(response);
      } catch (error) {
        throw new Error(
          `Error reading embeddings from HuggingFace response: ${error}`
        );
      }
    } else {
      throw new HttpError("Hugging Face", response.status, response.statusText);
    }
  }

  /**
   * Extract embeddings from an API response.
   * @param response The response to read from.
   * @return The embeddings from the response.
   */
  private async readEmbeddingsFromResponse(
    response: Response
  ): Promise<number[][]> {
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error);
    }

    const allEmbeddings = json as number[][];
    const eachEmbeddingIsArrayOfNumbers =
      allEmbeddings &&
      allEmbeddings.length > 0 &&
      allEmbeddings.every(
        (embedding) =>
          Array.isArray(embedding) &&
          embedding.every((item) => typeof item === "number")
      );

    if (!eachEmbeddingIsArrayOfNumbers) {
      throw new Error(
        "Embeddings returned are not arrays of numbers as expected"
      );
    }

    return allEmbeddings;
  }
}

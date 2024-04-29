import * as logger from "firebase-functions/logger";
import OpenAI from "openai";
import {ChatCompletion} from "openai/resources";

import {HttpError} from "../httpUtils";

/**
 * A service to interact with the OpenAI API.
 */
export class OpenAIService {
  private readonly openAI: OpenAI;

  constructor(apiKey: string) {
    this.openAI = new OpenAI({apiKey});
  }

  /**
   * Get completions from the LLM.
   * @param prompt The prompt to use.
   * @param openaiModel The OpenAI model to use.
   * @param temperature The temperature to use.
   * @param maxTokens The maximum number of tokens to generate.
   * @return The completions from the LLM.
   */
  public async getGptCompletion(
    prompt: string,
    openaiModel: string,
    temperature: number,
    maxTokens: number
  ): Promise<string[]> {
    try {
      const chatCompletion = await this.openAI.chat.completions.create({
        messages: [{role: "system", content: prompt}],
        model: openaiModel,
        max_tokens: maxTokens,
        temperature,
      });
      return this.extractCompletionTexts(chatCompletion);
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        if (error.status) {
          // If 401, modify error message to not include the API key
          if (error.status === 401) {
            throw new HttpError(
              "OpenAI",
              error.status,
              "Authorization error. Check your API key."
            );
          } else {
            throw new HttpError("OpenAI", error.status, error.message);
          }
        }
      }
      throw new Error(`OpenAI API error: ${error}`);
    }
  }

  /**
   * Extract completion texts from a chat completion, cleaning the strings.
   * @param chatCompletion The chat completion to extract from.
   * @return The completion texts.
   */
  private extractCompletionTexts(chatCompletion: ChatCompletion): string[] {
    const text: string | null = chatCompletion.choices[0].message.content;
    if (!text) {
      throw new Error("No completion text found in chat completion");
    }
    logger.debug(`Completion text extracted from response: ${text}`);

    const texts = text
      .split("\n")
      .filter((s: string) => s.length > 0)
      // Remove quotes
      .map((s) => s.replace(/['"]+/g, ""))
      // Remove "Prediction n: " prefix
      .map((s) => s.replace(/Prediction \d+: /g, ""));

    return texts;
  }
}

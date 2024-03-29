import {defineString} from "firebase-functions/params";
import * as math from "mathjs";
import OpenAI from "openai";
import {ChatCompletion} from "openai/resources";

import {PromptCandidate, TestCase} from "../../shared/types";

const HUGGINGFACE_API_TOKEN = defineString("HUGGINGFACE_API_TOKEN");
const OPENAI_API_KEY = defineString("OPENAI_API_KEY");

/**
 * Run a test case against a prompt, getting completions from the LLM and
 * calculating the cosine similarity of the embeddings of the completions
 * and the good completions.
 * @param {PromptCandidate} prompt The prompt to test.
 * @param {TestCase} testCase The test case to run.
 * @param {string} openaiModel The OpenAI model to use.
 * @param {string} embeddingsModelName The Hugging Face model to use
 *  for embeddings.
 * @param {number} temperature The temperature to use for the LLM.
 * @param {number} maxTokens The maximum number of tokens to generate.
 * @param {number} numResponses The number of responses to generate.
 * @return {Promise<{llmCompletions: string[], cosineSimilarityScore: number}>}
 *  The completions from the LLM and the cosine similarity score.
 */
export async function runPromptTestCase(
  prompt: PromptCandidate,
  testCase: TestCase,
  openaiModel: string,
  embeddingsModelName: string,
  temperature: number,
  maxTokens: number,
  numResponses: number
): Promise<{llmCompletions: string[]; cosineSimilarityScore: number}> {
  const gptCompletions = await getGptCompletion(
    prompt.prompt,
    openaiModel,
    temperature,
    maxTokens,
    numResponses
  );
  const gptEmbeddings = await embedTexts(gptCompletions, embeddingsModelName);
  const goodEmbeddings = await embedTexts(
    testCase.goodCompletions,
    embeddingsModelName
  );

  const avgGptEmbedding: number[] = averageOfVectors(gptEmbeddings);
  const avgGoodEmbedding = averageOfVectors(goodEmbeddings);

  return {
    llmCompletions: gptCompletions,
    cosineSimilarityScore: cosineSimilarity(avgGptEmbedding, avgGoodEmbedding),
  };
}

/**
 * Calculate the cosine similarity between two vectors.
 * Output is in the range [-1, 1].
 * @param {number[]} A First vector
 * @param {number[]} B Second vector
 * @return {number} The cosine similarity between the two vectors.
 */
function cosineSimilarity(A: number[], B: number[]): number {
  const dotProduct = math.dot(A, B);
  const magnitudeA = math.norm(A);
  const magnitudeB = math.norm(B);

  return Number(math.divide(dotProduct, math.multiply(magnitudeA, magnitudeB)));
}

/**
 * Calculate the average of a list of vectors.
 * @param {Array<Array<number>>} vectors The list of vectors.
 * @return {Array<number>} The average of the vectors.
 */
function averageOfVectors(vectors: number[][]): number[] {
  return vectors
    .reduce((acc, vector) => {
      return acc.map((val, i) => val + vector[i]);
    }, Array(vectors[0].length).fill(0))
    .map((val) => val / vectors.length);
}

/**
 * Get completions from the LLM.
 * @param {string} prompt The prompt to use.
 * @param {string} openaiModel The OpenAI model to use.
 * @param {number} temperature The temperature to use.
 * @param {number} maxTokens The maximum number of tokens to generate.
 * @param {number} numResponses The number of responses to generate.
 * @return {Promise<string[]>} The completions from the LLM.
 */
async function getGptCompletion(
  prompt: string,
  openaiModel: string,
  temperature: number,
  maxTokens: number,
  numResponses: number
): Promise<string[]> {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY.value(),
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: [{role: "system", content: prompt}],
    model: openaiModel,
    max_tokens: maxTokens,
    temperature,
    n: numResponses,
  });

  return chatCompletion.choices
    .map((choice: ChatCompletion.Choice) => choice.message.content)
    .filter((content): content is string => content !== null);
}

/**
 * Get embeddings for a list of texts.
 * @param {Array<string>} texts The texts to get embeddings for.
 * @param {string} embeddingsModelName The Hugging Face model to use.
 * @return {Promise<Array<Array<number>>>} The embeddings for the texts.
 */
async function embedTexts(
  texts: string[],
  embeddingsModelName: string
): Promise<number[][]> {
  const apiUrl =
    "https://api-inference.huggingface.co/models/" + embeddingsModelName;
  const headers = {
    Authorization: `Bearer ${HUGGINGFACE_API_TOKEN.value()}`,
  };
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      inputs: texts,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(json.error);
  }

  const allEmbeddings = json as number[][][][];
  const clsEmbeddings: number[][] = allEmbeddings.map(
    (embeddings: number[][][]) => {
      return getClsTokenEmbedding(embeddings);
    }
  );
  return clsEmbeddings;
}

/**
 * Get the CLS token embedding from a list of embeddings.
 * @param {Array<Array<Array<number>>>} embeddings The embeddings to get the
 *  CLS token from.
 * @return {Array<number>} The CLS token embedding.
 */
function getClsTokenEmbedding(embeddings: number[][][]): number[] {
  if (embeddings.length === 0) {
    throw new Error("Embeddings array is empty");
  }
  if (embeddings[0].length === 0) {
    throw new Error("Embeddings inner array is empty");
  }
  return embeddings[0][0];
}

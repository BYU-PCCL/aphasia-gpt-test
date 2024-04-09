import * as logger from "firebase-functions/logger";
import {defineString} from "firebase-functions/params";
import * as math from "mathjs";
import OpenAI from "openai";
import {ChatCompletion} from "openai/resources";

import {
  PromptCandidate,
  PromptTestResults,
  TestCase,
  TestResultsStatus,
} from "../../shared/types";
import {saveTestCaseResult, updateTestCaseResultStatus} from "./firebaseUtils";

const MAX_TEST_CASE_RETRIES = 4;
const HUGGINGFACE_API_TOKEN = defineString("HUGGINGFACE_API_TOKEN");
const OPENAI_API_KEY = defineString("OPENAI_API_KEY");

/**
 * Process a test case against a prompt.
 * The test case is run against the prompt, and the results are saved.
 * @param {PromptCandidate} prompt The prompt to test.
 * @param {TestCase} testCase The test case to run.
 * @param {PromptTestResults} promptTestResults The prompt test results.
 */
export async function processTestCase(
  prompt: PromptCandidate,
  testCase: TestCase,
  promptTestResults: PromptTestResults
) {
  if (!testCase.id) {
    throw new Error("Test case id is missing");
  }
  if (!promptTestResults.id) {
    throw new Error("Prompt test results id is missing");
  }

  let llmCompletions: string[] = [];
  let cosineSimilarityScore = -Infinity;

  updateTestCaseResultStatus(
    promptTestResults.id,
    testCase.id,
    TestResultsStatus.IN_PROGRESS
  );

  for (let i = 0; i < MAX_TEST_CASE_RETRIES; i++) {
    try {
      logger.debug(
        `Attempt #${i + 1} for test case ${testCase.id} against prompt ${
          prompt.id
        }`
      );

      const result = await runPromptTestCase(
        prompt,
        testCase,
        promptTestResults.llmModel,
        promptTestResults.embeddingsModel,
        promptTestResults.temperature,
        promptTestResults.maxTokens
      );
      llmCompletions = result.llmCompletions;
      cosineSimilarityScore = result.cosineSimilarityScore;

      if (cosineSimilarityScore > 1 || cosineSimilarityScore < -1) {
        throw new Error(
          `Cosine similarity score is out of range
            [-1, 1]: ${cosineSimilarityScore}`
        );
      }

      logger.info(
        `Test case ${testCase.id} completed with cosine similarity
          score: ${cosineSimilarityScore}`
      );
      logger.info(
        `Saving test case ${testCase.id} result with cosine similarity
          score: ${cosineSimilarityScore}`
      );
      await saveTestCaseResult(
        promptTestResults.id,
        testCase.id,
        cosineSimilarityScore,
        llmCompletions
      );
      break;
    } catch (error) {
      if (i < MAX_TEST_CASE_RETRIES - 1) {
        logger.warn(
          `Error running test case ${testCase.id}, but will retry ${
            i + 1
          } more times: ${error}`
        );
      } else {
        logger.error(
          `Max retries reached for test case ${testCase.id}: ${error}`
        );
        await updateTestCaseResultStatus(
          promptTestResults.id,
          testCase.id,
          TestResultsStatus.ERROR
        );
      }
    }
  }
}

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
 * @return {Promise<{llmCompletions: string[], cosineSimilarityScore: number}>}
 *  The completions from the LLM and the cosine similarity score.
 */
async function runPromptTestCase(
  prompt: PromptCandidate,
  testCase: TestCase,
  openaiModel: string,
  embeddingsModelName: string,
  temperature: number,
  maxTokens: number
): Promise<{llmCompletions: string[]; cosineSimilarityScore: number}> {
  logger.info(`Running test case ${testCase.id} against prompt ${prompt.id}`);

  const gptCompletions = await getGptCompletion(
    prompt.prompt,
    openaiModel,
    temperature,
    maxTokens
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
 * @return {Promise<string[]>} The completions from the LLM.
 */
async function getGptCompletion(
  prompt: string,
  openaiModel: string,
  temperature: number,
  maxTokens: number
): Promise<string[]> {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY.value(),
  });
  const chatCompletion = await openai.chat.completions.create({
    messages: [{role: "system", content: prompt}],
    model: openaiModel,
    max_tokens: maxTokens,
    temperature,
  });

  return extractCompletionTexts(chatCompletion);
}

/**
 * Extract completion texts from a chat completion, cleaning the strings.
 * @param {ChatCompletion} chatCompletion The chat completion to extract from.
 * @return {string[]} The completion texts.
 */
function extractCompletionTexts(chatCompletion: ChatCompletion): string[] {
  const text: string | null = chatCompletion.choices[0].message.content;
  if (!text) {
    throw new Error("No completion text found in chat completion");
  }
  logger.debug(`Completion text: ${text}`);

  const texts = text
    .split("\n")
    .filter((s: string) => s.length > 0)
    // Remove quotes
    .map((s) => s.replace(/['"]+/g, ""))
    // Remove "Prediction n: " prefix
    .map((s) => s.replace(/Prediction \d+: /g, ""));

  return texts;
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

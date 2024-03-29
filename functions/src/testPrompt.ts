import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";

import {
  PromptCandidate,
  TestCase,
  TestCaseResult,
  TestResultsStatus,
} from "../../shared/types";
import {getUnixTimestamp} from "../../shared/utils";
import {PRODUCTION_APP_URL} from "./constants";
import {
  getPromptById,
  getPromptTestResultsRef,
  initializePromptTestResultsRecord,
  readTestCases,
} from "./firebaseUtils";
import {runPromptTestCase} from "./runPromptTestCase";

const OPENAI_MODEL = "gpt-3.5-turbo";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 50;
const NUM_RESPONSES = 4;
const EMBEDDING_MODEL_NAME = "WhereIsAI/UAE-Large-V1";

/**
 * Run all test cases in the DB against the provided prompt.
 * Persist the results in the DB.
 */
export const testPromptHandler = onRequest(
  {cors: PRODUCTION_APP_URL},
  async (req, res) => {
    const data = req.body;
    const promptId = data.promptId;
    if (!promptId) {
      res.status(400).send("No promptId parameter provided");
      return;
    }
    const prompt: PromptCandidate | null = await getPromptById(promptId);
    if (!prompt) {
      res.status(400).send(`Prompt with id ${promptId} not found`);
      return;
    }

    const testCases: TestCase[] = await readTestCases();

    const testResultsId = await initializePromptTestResultsRecord(
      testCases,
      promptId,
      OPENAI_MODEL,
      EMBEDDING_MODEL_NAME,
      TEMPERATURE,
      MAX_TOKENS,
      NUM_RESPONSES
    );

    for (const testCase of testCases) {
      if (!testCase.id) {
        logger.error("Test case has no id");
        continue;
      }

      logger.info(
        `Testing prompt ${promptId} against test case ${testCase.id}`
      );

      const {llmCompletions, cosineSimilarityScore} = await runPromptTestCase(
        prompt,
        testCase,
        OPENAI_MODEL,
        EMBEDDING_MODEL_NAME,
        TEMPERATURE,
        MAX_TOKENS,
        NUM_RESPONSES
      );
      logger.info(
        `Savings results for case ${testCase.id} against prompt ${promptId}:
       cosineSimilarityScore = ${cosineSimilarityScore}`
      );
      await saveTestCaseResult(
        testResultsId,
        testCase.id,
        cosineSimilarityScore,
        llmCompletions
      );
    }

    console.log("All tests completed");
    res.send({message: "Tests completed"});
  }
);

/**
 * Save the results of a test case to the DB.
 * @param {string} promptTestResultsId The ID of the prompt test results record.
 * @param {string} testCaseId The ID of the test case.
 * @param {number} cosineSimilarityScore The cosine similarity score.
 * @param {string[]} llmCompletions The completions from the LLM.
 */
async function saveTestCaseResult(
  promptTestResultsId: string,
  testCaseId: string,
  cosineSimilarityScore: number,
  llmCompletions: string[]
) {
  const testCaseResult: TestCaseResult = {
    testCaseId: testCaseId,
    status: TestResultsStatus.COMPLETED,
    cosineSimilarityScore: cosineSimilarityScore,
    llmCompletions: llmCompletions,
    dateCompletedUtc: getUnixTimestamp(),
  };
  const resultRef = getPromptTestResultsRef().child(promptTestResultsId);
  await resultRef
    .child("testCaseResults")
    .child(testCaseId)
    .set(testCaseResult);
}

import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

import {
  PromptCandidate,
  PromptTestResults,
  TestCase,
  TestCaseResult,
  TestResultsStatus,
} from "../../shared/types";
import {getUnixTimestamp} from "../../shared/utils";

admin.initializeApp();
export const db = admin.database();

/**
 * Get a reference to the test cases in the Realtime DB.
 * @return {admin.database.Reference} The reference to the test cases.
 */
export function getCaseListRef() {
  return db.ref("/prompt-testing/cases");
}

/**
 * Get a reference to the prompt test results in the Realtime DB.
 * @return {admin.database.Reference} The reference to the prompt test results.
 */
export function getPromptTestResultsRef() {
  return db.ref("/prompt-testing/results");
}

/**
 * Get a reference to a test case result in the Realtime DB.
 * @param {string} testResultsId The ID of the test results record.
 * @param {string} testCaseId The ID of the test case.
 * @return {admin.database.Reference} The reference to the test case result.
 */
export function getTestCaseResultRef(
  testResultsId: string,
  testCaseId: string
) {
  return getPromptTestResultsRef()
    .child(testResultsId)
    .child("testCaseResults")
    .child(testCaseId);
}

/**
 * Get a reference to the prompts in the Realtime DB.
 * @return {admin.database.Reference} The reference to the prompts.
 */
export function getPromptListRef() {
  return db.ref("/prompt-testing/prompts");
}

/**
 * Read all test cases from the Realtime DB.
 * @return {Promise<TestCase[]>} The list of test cases.
 */
export async function readTestCases(): Promise<TestCase[]> {
  const caseListSnapshot = await getCaseListRef().once("value");
  const caseList = caseListSnapshot.val();
  let testCases: TestCase[] = [];
  if (caseList) {
    testCases = Object.keys(caseList).map((key) => {
      const testCase: TestCase = caseList[key];
      testCase.id = key;
      return testCase;
    });
  }
  return testCases;
}

/**
 * Read all test results from the Realtime DB.
 * @return {Promise<PromptTestResults[]>} The list of test results.
 */
export async function readTestResults(): Promise<PromptTestResults[]> {
  const resultSnapshot = await getPromptTestResultsRef().once("value");
  const result = resultSnapshot.val();
  let testResults: PromptTestResults[] = [];
  if (result) {
    testResults = Object.keys(result).map((key) => {
      const testResult: PromptTestResults = result[key];
      testResult.id = key;
      return testResult;
    });
  }
  return testResults;
}

/**
 * Read all prompts from the Realtime DB.
 * @return {Promise<PromptCandidate[]>} The list of prompts.
 */
export async function readPrompts(): Promise<PromptCandidate[]> {
  const promptListSnapshot = await getPromptListRef().once("value");
  const promptList = promptListSnapshot.val();
  let prompts: PromptCandidate[] = [];
  if (promptList) {
    prompts = Object.keys(promptList).map((key) => {
      const prompt: PromptCandidate = promptList[key];
      prompt.id = key;
      return prompt;
    });
  }
  return prompts;
}

/**
 * Get a prompt by ID.
 * @param {string} promptId The ID of the prompt to get.
 * @return {Promise<PromptCandidate | null>} The prompt with the given ID,
 *  or null if not found.
 */
export async function getPromptById(
  promptId: string
): Promise<PromptCandidate | null> {
  const prompts: PromptCandidate[] = await readPrompts();
  return prompts.find((prompt) => prompt.id === promptId) || null;
}

/**
 * Create a new test results record for a prompt.
 * @param {TestCase[]} testCases The test cases to run against the prompt.
 * @param {string} promptId The ID of the prompt to test.
 * @param {string} model The LLM model to use.
 * @param {string} embeddingsModelName The embeddings model to use.
 * @param {number} temperature The temperature to use.
 * @param {number} maxTokens The maximum number of tokens to generate.
 *  test case.
 * @return {Promise<string>} The ID of the new test results record.
 */
export async function initializePromptTestResultsRecord(
  testCases: TestCase[],
  promptId: string,
  model: string,
  embeddingsModelName: string,
  temperature: number,
  maxTokens: number
): Promise<PromptTestResults> {
  const curDateTime = getUnixTimestamp();
  const testCaseResults: Record<string, TestCaseResult> = {};
  for (const testCase of testCases) {
    if (testCase.id) {
      testCaseResults[testCase.id] = {
        testCaseId: testCase.id,
        status: TestResultsStatus.NOT_STARTED,
      };
    }
  }
  const promptTestResults: PromptTestResults = {
    promptId: promptId,
    llmModel: model,
    embeddingsModel: embeddingsModelName,
    temperature: temperature,
    maxTokens: maxTokens,
    testCaseResults: testCaseResults,
    dateCreatedUtc: curDateTime,
    dateUpdatedUtc: curDateTime,
  };

  const resultRef = getPromptTestResultsRef();
  const newResultRef = await resultRef.push(promptTestResults);
  if (newResultRef.key === null) {
    throw new Error("Failed to create new test results record");
  }

  promptTestResults.id = newResultRef.key;
  return promptTestResults;
}

/**
 * Get a prompt test results record by ID.
 * @param {string} promptTestResultsId The ID of the prompt test results record.
 * @return {Promise<PromptTestResults | null>} The prompt test results record
 * with the given ID, or null if not found.
 */
export async function getPromptTestResultsById(
  promptTestResultsId: string
): Promise<PromptTestResults | null> {
  const results = await readTestResults();
  return results.find((result) => result.id === promptTestResultsId) || null;
}

/**
 * Get a test case by ID.
 * @param {string} testCaseId The ID of the test case to get.
 * @return {Promise<TestCase | null>} The test case with the given ID,
 *  or null if not found.
 */
export async function getTestCaseById(
  testCaseId: string
): Promise<TestCase | null> {
  const cases = await readTestCases();
  return cases.find((testCase) => testCase.id === testCaseId) || null;
}

/**
 * Update the status of a prompt test results record.
 * @param {string} promptTestResultsId The ID of the prompt test results record.
 * @param {TestResultsStatus} status The new status to set.
 * @return {Promise<void>} A promise that resolves when the update is complete.
 */
export async function updatePromptTestResultsStatus(
  promptTestResultsId: string,
  status: TestResultsStatus
): Promise<void> {
  const resultRef = getPromptTestResultsRef().child(promptTestResultsId);
  await resultRef.update({status});
}

/**
 * Save the results of a test case to the DB. Sets the status to COMPLETE.
 * @param {string} promptTestResultsId The ID of the prompt test results record.
 * @param {string} testCaseId The ID of the test case.
 * @param {number} cosineSimilarityScore The cosine similarity score.
 * @param {string[]} llmCompletions The completions from the LLM.
 */
export async function saveTestCaseResult(
  promptTestResultsId: string,
  testCaseId: string,
  cosineSimilarityScore: number,
  llmCompletions: string[]
) {
  const testCaseResult: TestCaseResult = {
    testCaseId: testCaseId,
    status: TestResultsStatus.COMPLETE,
    cosineSimilarityScore: cosineSimilarityScore,
    llmCompletions: llmCompletions,
    dateCompletedUtc: getUnixTimestamp(),
  };
  const resultRef = getTestCaseResultRef(promptTestResultsId, testCaseId);
  await resultRef.set(testCaseResult);
}

/**
 * Delete a prompt test results record from the DB.
 * @param {string} promptTestResultsId The ID of the prompt test results record.
 */
export async function deletePromptTestResultsRecord(
  promptTestResultsId: string
): Promise<void> {
  const resultRef = getPromptTestResultsRef().child(promptTestResultsId);
  await resultRef.remove();
}

/**
 * Update the status of a test case result.
 * @param {string} testResultsId The ID of the test results record.
 * @param {string} testCaseId The ID of the test case.
 * @param {TestResultsStatus} status The new status to set.
 * @return {Promise<void>} A promise that resolves when the update is complete.
 */
export async function updateTestCaseResultStatus(
  testResultsId: string,
  testCaseId: string,
  status: TestResultsStatus
): Promise<void> {
  logger.info(
    `Updating status of test case ${testCaseId} in test results 
      ${testResultsId} to ${status}`
  );
  const resultRef = getTestCaseResultRef(testResultsId, testCaseId);
  await resultRef.update({status: status});
}

/**
 * Set the average cosine similarity score for a test results record.
 * @param {string} testResultsId The ID of the test results record.
 */
export async function setAverageCosineSimilarityScore(
  testResultsId: string
): Promise<void> {
  logger.info(
    `Calculating average cosine similarity score for test
      results ${testResultsId}`
  );
  const promptTestResults = await getPromptTestResultsById(testResultsId);
  if (!promptTestResults) {
    throw new Error(`Prompt test results with id ${testResultsId} not found`);
  }

  const scores: number[] = Object.values(promptTestResults.testCaseResults)
    .map((result) => result.cosineSimilarityScore)
    .filter((score): score is number => score !== null && score !== undefined);
  const average = scores.reduce((acc, score) => acc + score, 0) / scores.length;

  logger.info(
    `Average cosine similarity score for test 
      results ${testResultsId}: ${average}`
  );
  const resultRef = getPromptTestResultsRef().child(testResultsId);
  await resultRef.update({averageCosineSimilarityScore: average});
}

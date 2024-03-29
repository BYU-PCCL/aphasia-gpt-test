import * as admin from "firebase-admin";

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
 * @param {number} numResponses The number of responses to generate per
 *  test case.
 * @return {Promise<string>} The ID of the new test results record.
 */
export async function initializePromptTestResultsRecord(
  testCases: TestCase[],
  promptId: string,
  model: string,
  embeddingsModelName: string,
  temperature: number,
  maxTokens: number,
  numResponses: number
): Promise<string> {
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
    status: TestResultsStatus.IN_PROGRESS,
    promptId: promptId,
    llmModel: model,
    embeddingsModel: embeddingsModelName,
    temperature: temperature,
    maxTokens: maxTokens,
    numResponses: numResponses,
    testCaseResults: testCaseResults,
    dateCreatedUtc: curDateTime,
    dateUpdatedUtc: curDateTime,
  };

  const resultRef = getPromptTestResultsRef();
  const newResultRef = await resultRef.push(promptTestResults);
  if (newResultRef.key === null) {
    throw new Error("Failed to create new test results record");
  }

  return newResultRef.key;
}

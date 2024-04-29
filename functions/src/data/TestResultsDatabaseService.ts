import {Reference} from "firebase-admin/database";
import {Database} from "firebase-admin/lib/database/database";
import * as logger from "firebase-functions/logger";

import {
  PromptTestResults,
  TestCase,
  TestCaseResult,
  TestResultsStatus,
} from "../../../shared/types";
import {getUnixTimestamp} from "../../../shared/utils";
import {DatabaseService} from "./DatabaseService";

/**
 * Interacts with the Realtime DB to read and write test results data.
 */
export class TestResultsDatabaseService {
  private readonly databaseService: DatabaseService<PromptTestResults>;
  private readonly DICT_REF_PATH: string = "/prompt-testing/results";
  private readonly TEST_CASE_RESULTS_SUB_PATH: string = "testCaseResults";

  constructor(db: Database) {
    this.databaseService = new DatabaseService<PromptTestResults>(
      db,
      this.DICT_REF_PATH
    );
  }

  /**
   * Read all test results from the Realtime DB.
   * @return The list of test results.
   */
  public async getAll(): Promise<PromptTestResults[]> {
    return await this.databaseService.getAll();
  }

  /**
   * Get a test result by ID.
   * @param promptTestResultsId The ID of the prompt test results record.
   * @return The prompt test results record
   * with the given ID, or null if not found.
   */
  public async get(
    promptTestResultsId: string
  ): Promise<PromptTestResults | null> {
    return await this.databaseService.get(promptTestResultsId);
  }

  /**
   * Create a new test results record for a prompt.
   * @param testCases The test cases to run against the prompt.
   * @param promptId The ID of the prompt to test.
   * @param model The LLM model to use.
   * @param embeddingsModelName The embeddings model to use.
   * @param temperature The temperature to use.
   * @param maxTokens The maximum number of tokens to generate.
   *  test case.
   * @return The ID of the new test results record.
   */
  public async initializePromptTestResultsRecord(
    testCases: TestCase[],
    promptId: string,
    model: string,
    embeddingsModelName: string,
    temperature: number,
    maxTokens: number
  ): Promise<PromptTestResults> {
    const testCaseResults: Record<string, TestCaseResult> = {};
    for (const testCase of testCases) {
      if (testCase.id) {
        testCaseResults[testCase.id] = {
          id: testCase.id,
          status: TestResultsStatus.NOT_STARTED,
          error: null,
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
    };

    return this.databaseService.add(promptTestResults);
  }

  /**
   * Update the status of a prompt test results record.
   * @param promptTestResultsId The ID of the prompt test results record.
   * @param status The new status to set.
   * @return A promise that resolves when the update is complete.
   */
  public async updatePromptTestResultsStatus(
    promptTestResultsId: string,
    status: TestResultsStatus
  ): Promise<void> {
    const resultRef = this.databaseService
      .getDictRef()
      .child(promptTestResultsId);
    await resultRef.update({status});
  }

  /**
   * Save the results of a test case to the DB. Sets the status to COMPLETE.
   * @param promptTestResultsId The ID of the prompt test results record.
   * @param testCaseId The ID of the test case.
   * @param cosineSimilarityScore The cosine similarity score.
   * @param llmCompletions The completions from the LLM.
   */
  public async saveTestCaseResult(
    promptTestResultsId: string,
    testCaseId: string,
    cosineSimilarityScore: number,
    llmCompletions: string[]
  ) {
    const testCaseResult: TestCaseResult = {
      id: testCaseId,
      status: TestResultsStatus.COMPLETE,
      cosineSimilarityScore: cosineSimilarityScore,
      error: null,
      llmCompletions: llmCompletions,
      dateUpdatedUtc: getUnixTimestamp(),
    };
    const resultRef = this.getTestCaseResultRef(
      promptTestResultsId,
      testCaseId
    );
    await resultRef.set(testCaseResult);
  }

  /**
   * Delete a prompt test results record from the DB.
   * @param promptTestResultsId The ID of the prompt test results record.
   */
  public async deletePromptTestResultsRecord(
    promptTestResultsId: string
  ): Promise<void> {
    const resultRef = this.databaseService
      .getDictRef()
      .child(promptTestResultsId);
    await resultRef.remove();
  }

  /**
   * Update the status (and error message) of a test case result.
   * @param testResultsId The ID of the test results record.
   * @param testCaseId The ID of the test case.
   * @param status The new status to set. If not ERROR, the error message is ignored and set to null.
   * @param error An error message. Ignored and set to null unless the status is being set to ERROR.
   * @return A promise that resolves when the update is complete.
   */
  public async updateTestCaseResultStatus(
    testResultsId: string,
    testCaseId: string,
    status: TestResultsStatus,
    error: string | null = null
  ): Promise<void> {
    logger.info(
      `Updating status of test case ${testCaseId} in test results 
      ${testResultsId} to ${status}`
    );
    const resultRef = this.getTestCaseResultRef(testResultsId, testCaseId);
    if (status !== TestResultsStatus.ERROR) {
      error = null;
    }
    await resultRef.update({
      status: status,
      error: error,
      dateUpdatedUtc: getUnixTimestamp(),
    });
  }

  /**
   * Get a reference to a test case result in the Realtime DB.
   * @param testResultsId The ID of the test results record.
   * @param testCaseId The ID of the test case.
   * @return The DB reference to the test case result.
   */
  private getTestCaseResultRef(
    testResultsId: string,
    testCaseId: string
  ): Reference {
    return this.databaseService
      .getDictRef()
      .child(testResultsId)
      .child(this.TEST_CASE_RESULTS_SUB_PATH)
      .child(testCaseId);
  }
}

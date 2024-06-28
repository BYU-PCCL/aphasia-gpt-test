import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";

import {
  PromptCandidate,
  TestCase,
  TestResultsStatus,
  PromptTestResults,
} from "../../../shared/types";
import {PromptDatabaseService} from "../data/PromptDatabaseService";
import {TestCaseDatabaseService} from "../data/TestCaseDatabaseService";
import {TestResultsDatabaseService} from "../data/TestResultsDatabaseService";
import {processTestCase} from "../processTestCase";

const OPENAI_MODEL = "gpt-3.5-turbo";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 50;
const EMBEDDING_MODEL_NAME = "WhereIsAI/UAE-Large-V1";

/**
 * Starts running the test cases for a prompt.
 * Initializes the prompt test results record and processes each test case.
 * The test cases are processed asynchronously.
 * The function returns a response immediately after starting the tests.
 */

async function copyTestCase(
  resultsId : string,
  testCase: TestCase,
  promptTestResults: PromptTestResults,
  testResultsService: TestResultsDatabaseService
) {
  if (!resultsId) {
    throw new Error("Test case id is missing");
  }
  if (!testCase.id) {
    throw new Error("Test case id is missing");
  }
  if (!promptTestResults.id) {
    throw new Error("Prompt test results id is missing");
  }

  let promptResults: PromptTestResults | null;
  let testResults = null;
  // let llmCompletions = null;
  // let cosineSimilarityScore = null;
  let cosineSimilarityScore: number | null;
  let llmCompletions: string[] | null;

  logger.debug(`Copying test case ${testCase.id} for result ${resultsId}`);

  try {
    // Get the results record
    promptResults = await testResultsService.get(resultsId);
    logger.info(`Got prompt results: ${promptResults?.id}`);
    if (!promptResults) {
      throw new Error(`Test result with id ${resultsId} not found`);
    }
    // Get the test case results record
    testResults = await promptResults.testCaseResults[testCase.id];
    if (!testResults) {
      throw new Error(`Test result with id ${resultsId} not found`);
    }

    // Copy the values from the previous test to the new test
    llmCompletions = testResults.llmCompletions || [];
    cosineSimilarityScore = testResults.cosineSimilarityScore || 0;

    logger.info(
      `Test case ${testCase.id} copied with cosine similarity
          score: ${cosineSimilarityScore}`
    );
    logger.info(
      `Saving test case ${testCase.id} result with cosine similarity
          score: ${cosineSimilarityScore}`
    );
    await testResultsService.saveTestCaseResult(
      promptTestResults.id,
      testCase.id,
      cosineSimilarityScore,
      llmCompletions
    );
  } catch (error) {
    logger.error(`Error copying test case ${testCase.id}: ${error}`);
    await testResultsService.updateTestCaseResultStatus(
      promptTestResults.id,
      testCase.id,
      TestResultsStatus.ERROR,
      error instanceof Error ? error.toString() : "unknown error"
    );
  }
}

export const retryPromptTestsHandler = (
  testCaseService: TestCaseDatabaseService,
  promptService: PromptDatabaseService,
  testResultsService: TestResultsDatabaseService
) =>
  onRequest({cors: true}, async (req, res) => {
    const data = req.body;
    const resultsId = data.resultsId;
    const failedTestCasesIds: string[] = Array.isArray(data.testCasesIds) ? data.testCasesIds : [data.testCasesIds];
    if (!resultsId) {
      res.status(400).send("No resultsId parameter provided");
      return;
    }
    if (failedTestCasesIds.length === 0) {
      res.status(400).send("No failedTestCasesIds parameter provided or it is empty");
      return;
    }

    // Get the the results record to get the prompt ID
    const resultsRecord: PromptTestResults | null = await testResultsService.get(resultsId);
    if (!resultsRecord) {
      res.status(400).send(`Results record with id ${resultsId} not found`);
      return;
    }
    const promptId = resultsRecord.promptId;

    const prompt: PromptCandidate | null = await promptService.get(promptId);
    if (!prompt) {
      res.status(400).send(`Prompt with id ${promptId} not found`);
      return;
    }

    const testCases: TestCase[] = await testCaseService.getAll();

    const promptTestResults =
      await testResultsService.initializePromptTestResultsRecord(
        testCases,
        promptId,
        OPENAI_MODEL,
        EMBEDDING_MODEL_NAME,
        TEMPERATURE,
        MAX_TOKENS,
        prompt.promptName,
        prompt.prompt
      );

    if (!promptTestResults.id) {
      res.status(500).send("Error initializing prompt test results record");
      return;
    }

    try {
      testCases.forEach((testCase: TestCase) => {
        var testCaseId = testCase.id;
        if (testCaseId && failedTestCasesIds.includes(testCaseId)) {
          // Do not `await` here so that the tests can all start and we can
          // return a response while they run.
          processTestCase(
            prompt,
            testCase,
            promptTestResults,
            testResultsService
          ).catch((error) => {
            logger.error(`Error running test case ${testCase.id}: ${error}`);
          });
        }
        else{
          // Do not `await` here so that the tests can all start and we can
          // return a response while they run.
          copyTestCase(
            resultsId,
            testCase,
            promptTestResults,
            testResultsService
          ).catch((error) => {
            logger.error(`Error copying on test case ${testCase.id}: ${error}`);
          });
        }
      });
    } catch (error) {
      logger.error(`Error starting tests for prompt ${promptId}: ${error}`);

      // delete the prompt test results record if there was an error
      // try setting its status to ERROR if that deletion failed
      try {
        await testResultsService.deletePromptTestResultsRecord(
          promptTestResults.id
        );
      } catch (error) {
        logger.error(
          `Error deleting prompt test results
            record ${promptTestResults.id}: ${error}`
        );
        await testResultsService.updatePromptTestResultsStatus(
          promptTestResults.id,
          TestResultsStatus.ERROR
        );
      }

      res
        .status(500)
        .send(`Error starting tests for prompt ${promptId}: ${error}`);
      return;
    }

    res.send({message: `Started tests for prompt ${promptId}`});
  });

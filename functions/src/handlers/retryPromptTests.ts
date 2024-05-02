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
export const retryPromptTestsHandler = (
  testCaseService: TestCaseDatabaseService,
  promptService: PromptDatabaseService,
  testResultsService: TestResultsDatabaseService
) =>
  onRequest({cors: true}, async (req, res) => {
    const data = req.body;
    const resultsId = data.resultsId;
    const testCasesIds: string[] = Array.isArray(data.testCasesIds) ? data.testCasesIds : [data.testCasesIds];
    if (!resultsId) {
      res.status(400).send("No resultsId parameter provided");
      return;
    }
    if (testCasesIds.length === 0) {
      res.status(400).send("No testCasesIds parameter provided or it is empty");
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

    const testCases: TestCase[] = await testCaseService.getMultiple(testCasesIds);

    const promptTestResults =
      await testResultsService.initializePromptTestResultsRecord(
        testCases,
        promptId,
        OPENAI_MODEL,
        EMBEDDING_MODEL_NAME,
        TEMPERATURE,
        MAX_TOKENS
      );

    if (!promptTestResults.id) {
      res.status(500).send("Error initializing prompt test results record");
      return;
    }

    try {
      testCases.forEach((testCase: TestCase) => {
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

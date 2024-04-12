import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";

import {
  PromptCandidate,
  TestCase,
  TestResultsStatus,
} from "../../../shared/types";
import {
  deletePromptTestResultsRecord,
  getPromptById,
  initializePromptTestResultsRecord,
  readTestCases,
  updatePromptTestResultsStatus,
} from "../firebaseUtils";
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
export const startPromptTestsHandler = onRequest(
  {cors: true},
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

    const promptTestResults = await initializePromptTestResultsRecord(
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
        //  return a response while they run.
        processTestCase(prompt, testCase, promptTestResults).catch((error) => {
          logger.error(`Error running test case ${testCase.id}: ${error}`);
        });
      });
    } catch (error) {
      logger.error(`Error starting tests for prompt ${promptId}: ${error}`);

      // delete the prompt test results record if there was an error
      // try setting its status to ERROR if that deletion failed
      try {
        await deletePromptTestResultsRecord(promptTestResults.id);
      } catch (error) {
        logger.error(
          `Error deleting prompt test results
            record ${promptTestResults.id}: ${error}`
        );
        await updatePromptTestResultsStatus(
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
  }
);

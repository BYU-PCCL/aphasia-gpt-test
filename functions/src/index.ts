import * as admin from "firebase-admin";

import {PromptDatabaseService} from "./data/PromptDatabaseService";
import {TestCaseDatabaseService} from "./data/TestCaseDatabaseService";
import {TestResultsDatabaseService} from "./data/TestResultsDatabaseService";
import {getAllPromptsHandler} from "./handlers/getAllPrompts";
import {getAllTestCasesHandler} from "./handlers/getAllTestCases";
import {getAllTestsHandler} from "./handlers/getAllTests";
import {setPromptHandler} from "./handlers/setPrompt";
import {setTestCaseHandler} from "./handlers/setTestCase";
import {startPromptTestsHandler} from "./handlers/startPromptTests";

admin.initializeApp();
const db = admin.database();
const testCaseDatabaseService: TestCaseDatabaseService =
  new TestCaseDatabaseService(db);
const promptDatabaseService: PromptDatabaseService = new PromptDatabaseService(
  db
);
const testResultsDatabaseService: TestResultsDatabaseService =
  new TestResultsDatabaseService(db);

//  ~~~~ Firebase Function API Endpoints ~~~~ //

// Test Cases
export const setTestCase = setTestCaseHandler(testCaseDatabaseService);
export const getAllTestCases = getAllTestCasesHandler(testCaseDatabaseService);

// Prompts
export const setPrompt = setPromptHandler(promptDatabaseService);
export const getAllPrompts = getAllPromptsHandler(promptDatabaseService);

// Tests
export const getAllTests = getAllTestsHandler(testResultsDatabaseService);
export const startPromptTests = startPromptTestsHandler(
  testCaseDatabaseService,
  promptDatabaseService,
  testResultsDatabaseService
);

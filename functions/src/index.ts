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
import {retryPromptTestsHandler} from "./handlers/retryPromptTests";
import {deleteTestResultHandler} from "./handlers/deleteTestResult";
import {deletePromptHandler} from "./handlers/deletePrompt";
import {deleteTestCaseHandler} from "./handlers/deleteTestCase";
import {getTestCaseHandler} from "./handlers/getTestCase";
import {updateTestCaseHandler} from "./handlers/updateTestCase";
import {updatePromptHandler} from "./handlers/updatePrompt";


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
// In local development, the names of these exported functions are used as the
// API endpoint names. In production, the deployed Firebase function URLs are
// used instead (see the Firebase console).

// Test Cases
export const setTestCase = setTestCaseHandler(testCaseDatabaseService);
export const getAllTestCases = getAllTestCasesHandler(testCaseDatabaseService);
export const deleteTestCase = deleteTestCaseHandler(testCaseDatabaseService);
export const getTestCase = getTestCaseHandler(testCaseDatabaseService);
export const updateTestCase = updateTestCaseHandler(testCaseDatabaseService);

// Prompts
export const setPrompt = setPromptHandler(promptDatabaseService);
export const getAllPrompts = getAllPromptsHandler(promptDatabaseService);
export const deletePrompt = deletePromptHandler(promptDatabaseService);
export const updatePrompt = updatePromptHandler(promptDatabaseService);

// Tests
export const getAllTests = getAllTestsHandler(testResultsDatabaseService);
export const startPromptTests = startPromptTestsHandler(
  testCaseDatabaseService,
  promptDatabaseService,
  testResultsDatabaseService
);
export const retryPromptTests = retryPromptTestsHandler(
  testCaseDatabaseService,
  promptDatabaseService,
  testResultsDatabaseService
);
export const deleteTestResult = deleteTestResultHandler(
  testResultsDatabaseService
);

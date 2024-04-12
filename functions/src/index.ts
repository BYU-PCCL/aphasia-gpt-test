import {TestCaseDatabaseService} from "./data/TestCaseDatabaseService";
import {db} from "./firebaseUtils";
import {getAllPromptsHandler} from "./handlers/getAllPrompts";
import {getAllTestCasesHandler} from "./handlers/getAllTestCases";
import {getAllTestsHandler} from "./handlers/getAllTests";
import {setPromptHandler} from "./handlers/setPrompt";
import {setTestCaseHandler} from "./handlers/setTestCase";
import {startPromptTestsHandler} from "./handlers/startPromptTests";

// admin.initializeApp();
// const db = admin.database();
const testCaseDatabaseService: TestCaseDatabaseService =
  new TestCaseDatabaseService(db);

//  ~~~~ Firebase Function API Endpoints ~~~~ //

// Test Cases
export const setTestCase = setTestCaseHandler(testCaseDatabaseService);
export const getAllTestCases = getAllTestCasesHandler(testCaseDatabaseService);

// Prompts
export const setPrompt = setPromptHandler;
export const getAllPrompts = getAllPromptsHandler;

// Tests
export const getAllTests = getAllTestsHandler;
export const startPromptTests = startPromptTestsHandler(
  testCaseDatabaseService
);

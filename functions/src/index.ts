import {getAllPromptsHandler} from "./handlers/getAllPrompts";
import {getAllTestCasesHandler} from "./handlers/getAllTestCases";
import {getAllTestsHandler} from "./handlers/getAllTests";
import {setPromptHandler} from "./handlers/setPrompt";
import {setTestCaseHandler} from "./handlers/setTestCase";
import {startPromptTestsHandler} from "./handlers/startPromptTests";

//  ~~~~ Firebase Function API Endpoints ~~~~ //

// Test Cases
export const setTestCase = setTestCaseHandler;
export const getAllTestCases = getAllTestCasesHandler;

// Prompts
export const setPrompt = setPromptHandler;
export const getAllPrompts = getAllPromptsHandler;

// Tests
export const getAllTests = getAllTestsHandler;
export const startPromptTests = startPromptTestsHandler;

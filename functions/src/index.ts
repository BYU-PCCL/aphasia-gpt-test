import {getAllPromptsHandler} from "./getAllPrompts";
import {getAllTestCasesHandler} from "./getAllTestCases";
import {getAllTestsHandler} from "./getAllTests";
import {setPromptHandler} from "./setPrompt";
import {setTestCaseHandler} from "./setTestCase";
import {startPromptTestsHandler} from "./startPromptTests";

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

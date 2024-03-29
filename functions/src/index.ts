import {getAllPromptsHandler} from "./getAllPrompts";
import {getAllTestCasesHandler} from "./getAllTestCases";
import {setPromptHandler} from "./setPrompt";
import {setTestCaseHandler} from "./setTestCase";
import {testPromptHandler} from "./testPrompt";

// Firebase Function API Endpoints

// Test Cases
export const setTestCase = setTestCaseHandler;
export const getAllTestCases = getAllTestCasesHandler;

// Prompts
export const setPrompt = setPromptHandler;
export const getAllPrompts = getAllPromptsHandler;

// Tests
export const testPrompt = testPromptHandler;

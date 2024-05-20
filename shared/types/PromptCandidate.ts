import { DataItem } from "./";

export interface PromptCandidate extends Partial<DataItem> {
  prompt: string;
}

export function isPromptCandidate(
  promptCandidate: any
): promptCandidate is PromptCandidate {
  return promptCandidate && promptCandidate.prompt;
}

export const requiredPromptParams = ["utterance"];

export const optionalPromptParams = [
  "name",
  "age",
  "about_me",
  "setting",
  "conversation_type",
  "tone",
];

export const getPromptParamEncoding = (param: string) => `{${param}}`;

export const encodedAllPromptParams: string[] = requiredPromptParams
  .concat(optionalPromptParams)
  .map(getPromptParamEncoding);

export const encodedRequiredPromptParams: string[] = requiredPromptParams.map(
  getPromptParamEncoding
);

export const encodedOptionalPromptParams: string[] = optionalPromptParams.map(
  getPromptParamEncoding
);

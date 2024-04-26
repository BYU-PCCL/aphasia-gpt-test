import { DataItem } from "./";

export interface PromptCandidate extends Partial<DataItem> {
  prompt: string;
}

export function isPromptCandidate(
  promptCandidate: any
): promptCandidate is PromptCandidate {
  return promptCandidate && promptCandidate.prompt;
}

export const promptParams = [
  "name",
  "age",
  "about_me",
  "setting",
  "conversation_type",
  "tone",
  "utterance",
];
export const encodedPromptParams: string[] = promptParams.map(
  (param) => `{${param}}`
);

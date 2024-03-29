export interface PromptCandidate {
  id?: string;
  prompt: string;
  dateCreatedUtc?: number;
  dateUpdatedUtc?: number;
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

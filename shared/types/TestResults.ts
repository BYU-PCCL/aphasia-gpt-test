import { DataItem } from "./";

/**
 * The status of the test results
 */
export enum TestResultsStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETE = "Complete",
  ERROR = "Error",
}

export interface PromptTestResults extends Partial<DataItem> {
  /** The unique Firebase identifier of the prompt these test results are for */
  promptId: string;
  /** The name of the language model used */
  llmModel: string;
  /** The name of the embeddings model used */
  embeddingsModel: string;
  /** The temperature used for generation */
  temperature: number;
  /** The maximum number of tokens requested per generation */
  maxTokens: number;
  /** A dictionary of test case Firebase ids and their results */
  testCaseResults: Record<string, TestCaseResult>;
}

export interface TestCaseResult extends Partial<DataItem> {
  /** The unique Firebase identifier of the test case this result is for */
  id?: string;
  /** The status of the test case result */
  status: TestResultsStatus;
  /** Error message. Only applies if status is ERROR */
  error: string | null;
  /** The cosine similarity score of the generated response */
  cosineSimilarityScore?: number;
  /** The AI-generated responses */
  llmCompletions?: string[];
}

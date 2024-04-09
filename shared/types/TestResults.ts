/**
 * The status of the test results
 */
export enum TestResultsStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETE = "Complete",
  ERROR = "Error",
}

export interface PromptTestResults {
  /** The unique Firebase identifier of the test case. */
  id?: string;
  /** The status of the test results */
  status: TestResultsStatus;
  /** The unique Firebase identifier of the prompt */
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
  /** Unix timestamp of when the test result was created */
  dateCreatedUtc?: number;
  /** Unix timestamp of when the test result was last updated */
  dateUpdatedUtc?: number;
  /** The average cosine similarity score of the responses generated */
  averageCosineSimilarityScore?: number;
}

export interface TestCaseResult {
  /** The unique Firebase identifier of the test case */
  testCaseId: string;
  /** The status of the test case result */
  status: TestResultsStatus;
  /** The cosine similarity score of the generated response */
  cosineSimilarityScore?: number;
  /** The AI-generated responses */
  llmCompletions?: string[];
  /** Unix timestamp of when the test case execution was completed */
  dateCompletedUtc?: number;
}

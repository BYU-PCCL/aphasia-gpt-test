/**
 * The status of the test results
 */
enum TestResultsStatus {
  IN_PROGRESS = "In-Progress",
  COMPLETED = "Completed",
}

/**
 * Test results data structure
 */
interface TestResults {
  /** The unique Firebase identifier of the test case. */
  id: string;
  /** The status of the test results */
  status: TestResultsStatus;
  /** The unique identifier of the prompt */
  promptId: number;
  /** The name of the language model used */
  llmModel: string;
  /** The name of the embeddings model used */
  embeddingsModel: string;
  /** The temperature used for generation */
  temperature: number;
  /** The maximum number of tokens requested per generation */
  max_tokens: number;
  /** The number of responses requested per generation */
  numResponses: number;
  /** A dictionary of test case Firebase ids and their cosine similarity scores */
  cosineSimilarityScores: Record<string, number | null>;
  /** Unix timestamp of when the test result was created */
  dateCreatedUtc: number;
  /** Unix timestamp of when the test result was last updated */
  dateUpdatedUtc: number;
  /** The average cosine similarity score of the responses generated */
  averageCosineSimilarityScore?: number;
}

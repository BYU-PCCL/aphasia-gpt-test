import { PromptTestResults, TestResultsStatus } from "../types";

/**
 * Computes the status of the prompt test results based on the status of the test case results
 * @param promptTestResults The prompt test results
 * @returns The status of the prompt test results
 */
export function getPromptTestResultsStatus(
  promptTestResults: PromptTestResults
): TestResultsStatus {
  if (
    Object.values(promptTestResults.testCaseResults).every(
      (testCaseResult) =>
        testCaseResult.status === TestResultsStatus.NOT_STARTED
    )
  ) {
    return TestResultsStatus.NOT_STARTED;
  }
  if (
    Object.values(promptTestResults.testCaseResults).every(
      (testCaseResult) => testCaseResult.status === TestResultsStatus.COMPLETE
    )
  ) {
    return TestResultsStatus.COMPLETE;
  } else if (
    Object.values(promptTestResults.testCaseResults).some(
      (testCaseResult) => testCaseResult.status === TestResultsStatus.ERROR
    )
  ) {
    return TestResultsStatus.ERROR;
  } else {
    return TestResultsStatus.IN_PROGRESS;
  }
}

import {onRequest} from "firebase-functions/v2/https";

import {TestResultsDatabaseService} from "../data/TestResultsDatabaseService";

/**
 * Get all test cases from the Realtime DB.
 */
export const getAllTestsHandler = (
  testResultsService: TestResultsDatabaseService
) =>
  onRequest({cors: true}, async (req, res) => {
    const testResults = await testResultsService.getAll();
    res.send(testResults);
  });

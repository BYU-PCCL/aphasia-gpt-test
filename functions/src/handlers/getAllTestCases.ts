import {onRequest} from "firebase-functions/v2/https";

import {TestCaseDatabaseService} from "../data/TestCaseDatabaseService";

/**
 * Get all test cases from the Realtime DB.
 * @param {TestCaseDatabaseService} testCaseService The test case service.
 */
export const getAllTestCasesHandler = (
  testCaseService: TestCaseDatabaseService
) =>
  onRequest({cors: true}, async (req, res) => {
    const testCases = await testCaseService.getAll();
    res.send(testCases);
  });

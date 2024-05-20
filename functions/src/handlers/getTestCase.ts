import {onRequest} from "firebase-functions/v2/https";

import {TestCaseDatabaseService} from "../data/TestCaseDatabaseService";

/**
 * Get one test case from the Realtime DB.
 */
export const getTestCaseHandler = (
  testCaseService: TestCaseDatabaseService
) =>
  onRequest({cors: true}, async (req, res) => {
    const testCaseId = req.query.testCaseId as string;
    if (!testCaseId) {
      res.status(400).send("testCaseId is required");
      return;
    }
    const testCase = await testCaseService.get(testCaseId);
    res.send(testCase);
  });

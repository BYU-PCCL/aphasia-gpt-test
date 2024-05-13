import {onRequest} from "firebase-functions/v2/https";

import {TestCaseDatabaseService} from "../data/TestCaseDatabaseService";

/**
 * Update a test case in the Realtime DB.
 */
export const updateTestCaseHandler = (
  testCaseService: TestCaseDatabaseService
) =>
  onRequest({cors: true}, async (req, res) => {
    const testCaseId = req.query.testCaseId as string;
    const testCase = req.body;
    if (!testCaseId) {
      res.status(400).send("testCaseId is required");
      return;
    }
    if (!testCase) {
      res.status(400).send("testCase is required");
      return;
    }

    await testCaseService.update(testCaseId, testCase);

    res.send({message: "Test Case updated in Realtime DB"});
  });

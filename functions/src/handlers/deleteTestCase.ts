import {onRequest} from "firebase-functions/v2/https";

import {TestCaseDatabaseService} from "../data/TestCaseDatabaseService";

/**
 * Delete a test case from the Realtime DB.
 */
export const deleteTestCaseHandler = (testCaseService: TestCaseDatabaseService) =>
  onRequest({cors: true}, async (req, res) => {
    const testCaseId: string = req.body.testCaseId;
    if (!testCaseId) {
      res.status(400).send("No testCaseId parameter provided");
      return;
    }

    await testCaseService.delete(testCaseId);

    res.send({message: "Test case removed from Realtime DB"});
  });

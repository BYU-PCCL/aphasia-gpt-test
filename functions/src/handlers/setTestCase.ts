import {onRequest} from "firebase-functions/v2/https";

import {isTestCase, TestCase} from "../../../shared/types";
import {TestCaseDatabaseService} from "../data/TestCaseDatabaseService";

/**
 * Add a test case to the Realtime DB.
 */
export const setTestCaseHandler = (testCaseService: TestCaseDatabaseService) =>
  onRequest({cors: true}, async (req, res) => {
    const testCase: TestCase = req.body;
    if (!isTestCase(testCase)) {
      res.status(400).send("Invalid test case");
      return;
    }

    await testCaseService.add(testCase);

    res.send({message: "Test case added to Realtime DB"});
  });

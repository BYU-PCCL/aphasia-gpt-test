import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";

import {isTestCase, TestCase} from "../../../shared/types";
import {getUnixTimestamp} from "../../../shared/utils";
import {getCaseListRef} from "../firebaseUtils";

/**
 * Add a test case to the Realtime DB.
 */
export const setTestCaseHandler = onRequest({cors: true}, async (req, res) => {
  const testCase: TestCase = req.body;
  if (!isTestCase(testCase)) {
    res.status(400).send("Invalid test case");
    return;
  }

  logger.info("Adding test case to Realtime DB", testCase);
  const newCaseRef = await getCaseListRef().push(testCase);
  logger.info("Test case added to Realtime DB", newCaseRef.key);
  const curDateTime = getUnixTimestamp();
  await newCaseRef.update({
    dateCreatedUtc: curDateTime,
    dateUpdatedUtc: curDateTime,
  });
  res.send({message: "Test case added to Realtime DB"});
});

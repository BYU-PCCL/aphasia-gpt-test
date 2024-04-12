import {onRequest} from "firebase-functions/v2/https";

import {readTestResults} from "../firebaseUtils";

/**
 * Get all test cases from the Realtime DB.
 */
export const getAllTestsHandler = onRequest({cors: true}, async (req, res) => {
  const testResults = await readTestResults();
  res.send(testResults);
});

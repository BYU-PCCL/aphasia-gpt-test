import {onRequest} from "firebase-functions/v2/https";

import {readTestCases} from "./firebaseUtils";

/**
 * Get all test cases from the Realtime DB.
 */
export const getAllTestCasesHandler = onRequest(
  {cors: true},
  async (req, res) => {
    const testCases = await readTestCases();
    res.send(testCases);
  }
);

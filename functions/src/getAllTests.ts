import {onRequest} from "firebase-functions/v2/https";

import {PRODUCTION_APP_URL} from "./constants";
import {readTestResults} from "./firebaseUtils";

/**
 * Get all test cases from the Realtime DB.
 */
export const getAllTestsHandler = onRequest(
  {cors: PRODUCTION_APP_URL},
  async (req, res) => {
    const testResults = await readTestResults();
    res.send(testResults);
  }
);

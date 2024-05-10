import {onRequest} from "firebase-functions/v2/https";

import {TestResultsDatabaseService} from "../data/TestResultsDatabaseService";
import * as logger from "firebase-functions/logger";

/**
 * Get all test cases from the Realtime DB.
 */
export const deleteTestResultHandler = (
  testResultsService: TestResultsDatabaseService
) =>
  onRequest({cors: true}, async (req, res) => {
    logger.info("CALLED deleteTestResultHandler");
    logger.info("req.body: " + JSON.stringify(req.body));
    const testResultId = req.body.testResultId; 
    logger.info("testResultId: " + testResultId);
    if (!testResultId) {
      res.status(400).send("No testResultId parameter provided");
      return;
    }

    await testResultsService.deletePromptTestResultsRecord(testResultId);
    
    res.send({message: "Results record deleted from Realtime DB"});
  });

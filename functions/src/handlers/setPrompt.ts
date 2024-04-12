import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";

import {isPromptCandidate, PromptCandidate} from "../../../shared/types";
import {getUnixTimestamp} from "../../../shared/utils";
import {getPromptListRef} from "../firebaseUtils";

/**
 * Add a prompt to the Realtime DB.
 */
export const setPromptHandler = onRequest({cors: true}, async (req, res) => {
  const prompt: PromptCandidate = req.body;
  if (!isPromptCandidate(prompt)) {
    res.status(400).send("Invalid prompt");
    return;
  }

  logger.info("Adding prompt to Realtime DB", prompt);
  const newPromptRef = await getPromptListRef().push(prompt);
  logger.info("Prompt added to Realtime DB", newPromptRef.key);
  const curDateTime = getUnixTimestamp();
  await newPromptRef.update({
    dateCreatedUtc: curDateTime,
    dateUpdatedUtc: curDateTime,
  });
  res.send({message: "Prompt added to Realtime DB"});
});

import {onRequest} from "firebase-functions/v2/https";

import {isPromptCandidate, PromptCandidate} from "../../../shared/types";
import {PromptDatabaseService} from "../data/PromptDatabaseService";

/**
 * Add a prompt to the Realtime DB.
 */
export const setPromptHandler = (promptService: PromptDatabaseService) =>
  onRequest({cors: true}, async (req, res) => {
    const prompt: PromptCandidate = req.body;
    if (!isPromptCandidate(prompt)) {
      res.status(400).send("Invalid prompt");
      return;
    }

    await promptService.add(prompt);

    res.send({message: "Prompt added to Realtime DB"});
  });

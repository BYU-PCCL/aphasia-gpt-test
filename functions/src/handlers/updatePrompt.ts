import {onRequest} from "firebase-functions/v2/https";

import {isPromptCandidate, PromptCandidate} from "../../../shared/types";
import {PromptDatabaseService} from "../data/PromptDatabaseService";

/**
 * Update a prompt in the Realtime DB.
 */
export const updatePromptHandler = (
  promptService: PromptDatabaseService
) =>
  onRequest({cors: true}, async (req, res) => {
    const promptId = req.body.id as string;
    if (!promptId) {
      res.status(400).send("promptId is required");
      return;
    }
    const prompt: PromptCandidate = req.body;
    if (!isPromptCandidate(prompt)) {
      res.status(400).send("Invalid prompt");
      return;
    }

    await promptService.update(promptId, prompt);

    res.send({message: "Prompt updated in Realtime DB"});
  });

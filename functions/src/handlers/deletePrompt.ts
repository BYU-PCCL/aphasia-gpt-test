import {onRequest} from "firebase-functions/v2/https";

import {PromptDatabaseService} from "../data/PromptDatabaseService";

/**
 * Delete a prompt from the Realtime DB.
 */
export const deletePromptHandler = (promptService: PromptDatabaseService) =>
  onRequest({cors: true}, async (req, res) => {
    const promptId: string = req.body.promptId;
    if (!promptId) {
      res.status(400).send("No promptId parameter provided");
      return;
    }

    await promptService.delete(promptId);

    res.send({message: "Prompt deleted from Realtime DB"});
  });

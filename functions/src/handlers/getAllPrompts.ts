import {onRequest} from "firebase-functions/v2/https";

import {PromptDatabaseService} from "../data/PromptDatabaseService";

/**
 * Get all prompts from the Realtime DB.
 */
export const getAllPromptsHandler = (promptService: PromptDatabaseService) =>
  onRequest({cors: true}, async (req, res) => {
    const prompts = await promptService.getAll();
    res.send(prompts);
  });

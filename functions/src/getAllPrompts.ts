import {onRequest} from "firebase-functions/v2/https";

import {readPrompts} from "./firebaseUtils";

/**
 * Get all prompts from the Realtime DB.
 */
export const getAllPromptsHandler = onRequest(async (req, res) => {
  const prompts = await readPrompts();
  res.send(prompts);
});

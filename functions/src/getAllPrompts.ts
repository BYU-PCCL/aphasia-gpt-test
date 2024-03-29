import {onRequest} from "firebase-functions/v2/https";

import {PRODUCTION_APP_URL} from "./constants";
import {readPrompts} from "./firebaseUtils";

/**
 * Get all prompts from the Realtime DB.
 */
export const getAllPromptsHandler = onRequest(
  {cors: PRODUCTION_APP_URL},
  async (req, res) => {
    const prompts = await readPrompts();
    res.send(prompts);
  }
);

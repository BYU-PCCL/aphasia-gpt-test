import {Database} from "firebase-admin/lib/database/database";
import * as logger from "firebase-functions/logger";

import {PromptCandidate} from "../../../shared/types";
import {getUnixTimestamp} from "../../../shared/utils";

export class PromptDatabaseService {
  private readonly db: Database;
  private readonly REF_PATH: string = "/prompt-testing/prompts";

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Read all test results from the Realtime DB.
   * @return {Promise<PromptTestResults[]>} The list of test results.
   */
  public async getAll(): Promise<PromptCandidate[]> {
    const snapshot = await this.getListRef().get();
    if (snapshot.exists()) {
      const promptDict: Record<string, PromptCandidate> = snapshot.val();

      let prompts: PromptCandidate[] = [];
      if (promptDict) {
        prompts = Object.keys(promptDict).map((key) => {
          const prompt: PromptCandidate = promptDict[key];
          prompt.id = key;
          return prompt;
        });
      }
      return prompts;
    }
    return [];
  }

  /**
   * Get a prompt by ID.
   * @param {string} promptId The ID of the prompt to get.
   * @return {Promise<PromptCandidate | null>} The prompt with the given ID,
   *  or null if not found.
   */
  public async get(promptId: string): Promise<PromptCandidate | null> {
    const snapshot = await this.getListRef().child(promptId).get();
    if (snapshot.exists()) {
      const prompt: PromptCandidate = snapshot.val();
      prompt.id = promptId;
      return prompt;
    }

    return null;
  }

  /**
   * Add a prompt to the Realtime DB.
   * @param {PromptCandidate} prompt The prompt to add.
   * @return {Promise<PromptCandidate>} The added prompt.
   */
  public async add(prompt: PromptCandidate): Promise<PromptCandidate> {
    logger.info("Adding test case to Realtime DB", prompt);

    const curDateTime = getUnixTimestamp();
    prompt.dateCreatedUtc = curDateTime;
    prompt.dateUpdatedUtc = curDateTime;
    const newPromptRef = await this.getListRef().push(prompt);

    logger.info("Test case added to Realtime DB", newPromptRef.key);

    prompt.id = newPromptRef.key || undefined;
    return prompt;
  }

  /**
   * Get a reference to the prompts in the Realtime DB.
   * @return {admin.database.Reference} The reference to the prompts.
   */
  private getListRef() {
    return this.db.ref(this.REF_PATH);
  }
}

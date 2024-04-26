import {Database} from "firebase-admin/lib/database/database";

import {PromptCandidate} from "../../../shared/types";
import {DatabaseService} from "./DatabaseService";

export class PromptDatabaseService {
  private readonly databaseService: DatabaseService<PromptCandidate>;
  private readonly DICT_REF_PATH: string = "/prompt-testing/prompts";

  constructor(db: Database) {
    this.databaseService = new DatabaseService<PromptCandidate>(
      db,
      this.DICT_REF_PATH
    );
  }

  /**
   * Read all prompts from the Realtime DB.
   * @return {Promise<PromptTestResults[]>} The list of prompts.
   */
  public async getAll(): Promise<PromptCandidate[]> {
    return await this.databaseService.getAll();
  }

  /**
   * Get a prompt by ID.
   * @param {string} promptId The ID of the prompt to get.
   * @return {Promise<PromptCandidate | null>} The prompt with the given ID,
   *  or null if not found.
   */
  public async get(promptId: string): Promise<PromptCandidate | null> {
    return await this.databaseService.get(promptId);
  }

  /**
   * Add a prompt to the Realtime DB.
   * @param {PromptCandidate} prompt The prompt to add.
   * @return {Promise<PromptCandidate>} The added prompt.
   */
  public async add(prompt: PromptCandidate): Promise<PromptCandidate> {
    return await this.databaseService.add(prompt);
  }
}

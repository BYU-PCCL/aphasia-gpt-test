import {Database} from "firebase-admin/lib/database/database";

import {PromptCandidate} from "../../../shared/types";
import {DatabaseService} from "./DatabaseService";

/**
 * Interacts with the Realtime DB to read and write prompt data.
 */
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
   * @return The list of prompts.
   */
  public async getAll(): Promise<PromptCandidate[]> {
    return await this.databaseService.getAll();
  }

  /**
   * Get a prompt by ID.
   * @param promptId The ID of the prompt to get.
   * @return The prompt with the given ID, or null if not found.
   */
  public async get(promptId: string): Promise<PromptCandidate | null> {
    return await this.databaseService.get(promptId);
  }

  /**
   * Add a prompt to the Realtime DB.
   * @param prompt The prompt to add.
   * @return The added prompt.
   */
  public async add(prompt: PromptCandidate): Promise<PromptCandidate> {
    return await this.databaseService.add(prompt);
  }
}

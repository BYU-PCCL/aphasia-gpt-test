import {Database} from "firebase-admin/lib/database/database";

import {TestCase} from "../../../shared/types";
import {DatabaseService} from "./DatabaseService";

/**
 * Interacts with the Realtime DB to read and write test case data.
 */
export class TestCaseDatabaseService {
  private readonly databaseService: DatabaseService<TestCase>;
  private readonly DICT_REF_PATH: string = "/prompt-testing/cases";

  constructor(db: Database) {
    this.databaseService = new DatabaseService<TestCase>(
      db,
      this.DICT_REF_PATH
    );
  }

  /**
   * Read all test cases from the Realtime DB.
   * @return {Promise<TestCase[]>} The list of test cases.
   */
  public async getAll(): Promise<TestCase[]> {
    return await this.databaseService.getAll();
  }

  /**
   * Get a test case by ID.
   * @param {string} testCaseId The ID of the test case to get.
   * @return {Promise<TestCase | null>} The test case with the given ID,
   *  or null if not found.
   */
  public async get(testCaseId: string): Promise<TestCase | null> {
    return await this.databaseService.get(testCaseId);
  }

  /**
   * Add a test case to the Realtime DB.
   * @param {TestCase} testCase The test case to add.
   * @return {Promise<TestCase>} The added test case.
   */
  public async add(testCase: TestCase): Promise<TestCase> {
    return await this.databaseService.add(testCase);
  }
}

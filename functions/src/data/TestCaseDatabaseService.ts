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
   * @return The list of test cases.
   */
  public async getAll(): Promise<TestCase[]> {
    return await this.databaseService.getAll();
  }

  /**
   * Get a test case by ID.
   * @param testCaseId The ID of the test case to get.
   * @return The test case with the given ID, or null if not found.
   */
  public async get(testCaseId: string): Promise<TestCase | null> {
    return await this.databaseService.get(testCaseId);
  }

  /**
   * Get multiple test cases by their IDs.
   * @param testCaseIds The IDs of the test cases to retrieve.
   * @return An array of test cases corresponding to the provided IDs.
   */
  public async getMultiple(testCaseIds: string[]): Promise<TestCase[]> {
    const testCases: TestCase[] = [];
    for (const testCaseId of testCaseIds) {
      if (testCaseId) { // Check if testCaseId is not undefined
        const testCase = await this.databaseService.get(testCaseId);
        if (testCase) {
          testCases.push(testCase);
        }
      }
    }
    return testCases;
  }

  /**
   * Add a test case to the Realtime DB.
   * @param testCase The test case to add.
   * @return The added test case.
   */
  public async add(testCase: TestCase): Promise<TestCase> {
    return await this.databaseService.add(testCase);
  }

  /**
  * Delete a test case record from the Realtime DB.
  * @param testCaseId The ID of the test case record.
  */
  public async delete(testCaseId: string): Promise<void> {
    const resultRef = this.databaseService
      .getDictRef()
      .child(testCaseId);
    await resultRef.remove();
  }

  /**
  * Update a test case in the Realtime DB.
  * @param testCaseId The ID of the test case to update.
  * @param testCase The test case with updated values.
  * @return The updated test case.
  */
  public async update(testCaseId: string, testCase: TestCase): Promise<TestCase> {

    return await this.databaseService.update(testCaseId, testCase);
  }
}

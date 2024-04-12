import {Database} from "firebase-admin/lib/database/database";
import * as logger from "firebase-functions/logger";

import {TestCase} from "../../../shared/types";
import {getUnixTimestamp} from "../../../shared/utils";

export class TestCaseDatabaseService {
  private readonly db: Database;
  private readonly REF_PATH: string = "/prompt-testing/cases";

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Read all test cases from the Realtime DB.
   * @return {Promise<TestCase[]>} The list of test cases.
   */
  public async getAll(): Promise<TestCase[]> {
    const snapshot = await this.getListRef().get();
    if (snapshot.exists()) {
      const testCaseDict: Record<string, TestCase> = snapshot.val();

      let testCases: TestCase[] = [];
      if (testCaseDict) {
        testCases = Object.keys(testCaseDict).map((key) => {
          const testCase: TestCase = testCaseDict[key];
          testCase.id = key;
          return testCase;
        });
      }
      return testCases;
    }
    return [];
  }

  /**
   * Get a test case by ID.
   * @param {string} testCaseId The ID of the test case to get.
   * @return {Promise<TestCase | null>} The test case with the given ID,
   *  or null if not found.
   */
  public async get(testCaseId: string): Promise<TestCase | null> {
    const snapshot = await this.getListRef().child(testCaseId).get();
    if (snapshot.exists()) {
      const testCase: TestCase = snapshot.val();
      testCase.id = testCaseId;
      return testCase;
    }

    return null;
  }

  /**
   * Add a test case to the Realtime DB.
   * @param {TestCase} testCase The test case to add.
   * @return {Promise<TestCase>} The added test case.
   */
  public async add(testCase: TestCase): Promise<TestCase> {
    logger.info("Adding test case to Realtime DB", testCase);

    const curDateTime = getUnixTimestamp();
    testCase.dateCreatedUtc = curDateTime;
    testCase.dateUpdatedUtc = curDateTime;
    const newCaseRef = await this.getListRef().push(testCase);

    logger.info("Test case added to Realtime DB", newCaseRef.key);

    testCase.id = newCaseRef.key || undefined;
    return testCase;
  }

  /**
   * Get a reference to the test cases in the Realtime DB.
   * @return {admin.database.Reference} The reference to the test cases.
   */
  private getListRef() {
    return this.db.ref(this.REF_PATH);
  }
}

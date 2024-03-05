export interface TestCase {
  id: number;
  dateCreatedUTC: Date;
  context: Context;
  bio: Bio;
  utterance: string;
  goodCompletions: string[];
}

export interface Context {
  tone: string;
  setting: string;
  conversationType: string;
}

export interface Bio {
  name: string;
  age: number;
  aboutMe: string;
}

/**
 * A draft of a test case, which may or may not have an ID.
 * If it does not have an ID, it is considered a new test case.
 * If it does have an ID, it already exists in the database.
 */
export type TestCaseDraft = TestCase & { id?: number };

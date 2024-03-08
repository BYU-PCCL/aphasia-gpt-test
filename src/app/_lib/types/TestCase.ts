export interface TestCase {
  /**
   * Firebase ID
   */
  id?: string;
  /**
   * Date as Unix timestamp
   */
  dateCreatedUtc?: number;
  /**
   * Date as Unix timestamp
   */
  dateUpdatedUtc?: number;
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

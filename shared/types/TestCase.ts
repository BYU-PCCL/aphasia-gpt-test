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

export function isTestCase(testCase: any): testCase is TestCase {
  return (
    testCase &&
    testCase.context &&
    testCase.context.tone &&
    testCase.context.setting &&
    testCase.context.conversationType &&
    testCase.bio &&
    testCase.bio.name &&
    testCase.bio.age &&
    testCase.bio.aboutMe &&
    testCase.utterance &&
    testCase.goodCompletions
  );
}

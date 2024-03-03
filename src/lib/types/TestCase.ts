export interface TestCase {
  id: number;
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

export type TestCaseDraft = TestCase & { id?: number };

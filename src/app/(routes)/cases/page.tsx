import { TestCase, TestCaseDraft } from "@/app/_lib/types/TestCase";
import TestCases from "../../_components/TestCases";

async function getData(): Promise<TestCase[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          dateCreatedUTC: new Date(),
          utterance: "Hello",
          context: {
            setting: "In a store",
            tone: "Neutral",
            conversationType: "Customer service",
          },
          bio: {
            name: "John",
            age: 25,
            aboutMe: `
              I'm a software engineer.
              I'm from New York City.
              I like to play the guitar and read books.
              My wife's name is Sarah. We have a dog named Max.
            `,
          },
          goodCompletions: [
            "Hello, how can I help you?",
            "Hi, what can I do for you?",
          ],
        },
        {
          id: 2,
          dateCreatedUTC: new Date(),
          utterance: "I'm looking for a book",
          context: {
            setting: "In a store",
            tone: "Neutral",
            conversationType: "Customer service",
          },
          bio: {
            name: "John",
            age: 25,
            aboutMe: "I'm a software engineer",
          },
          goodCompletions: [
            "Sure, what kind of book are you looking for?",
            "I can help you with that. What kind of book are you looking for?",
          ],
        },
      ]);
    }, 500);
  });
}

const Cases: React.FC = async () => {
  const cases = await getData();

  return <TestCases testCases={cases} />;
};

export default Cases;

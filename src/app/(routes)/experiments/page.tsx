"use client";
import { Button } from "@mantine/core";
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { firebaseCloudFunctions } from "../../../firebase";

const Experiments: React.FC = () => {
  const [result, setResult] = useState("");
  const addMessage = httpsCallable(firebaseCloudFunctions, "addmessage");
  const testPrompt = httpsCallable(firebaseCloudFunctions, "testPrompt");

  const handleOnClick = async () => {
    const messageText = "uppercasemeplease";
    addMessage({ text: messageText })
      .then((result) => {
        // Read result of the Cloud Function.
        const data = result.data as { message: string }; // Type assertion
        const sanitizedMessage = data.message;
        setResult(sanitizedMessage);
      })
      .catch((error) => {
        // Getting the Error details.
        const code = error.code;
        const message = error.message;
        const details = error.details;
        console.log("error code and details: ", code, details);
        // ...
      });
  };

  const handleOnClick2 = async () => {
    // to testPrompt message, passing in getPrompt() as the prompt parameter
    const prompt = getPrompt();
    testPrompt({ prompt: prompt })
      .then((result) => {
        // Read result of the Cloud Function.
        const data = result.data as { message: string }; // Type assertion
        const sanitizedMessage = data.message;
        setResult(sanitizedMessage);
      })
      .catch((error) => {
        // Getting the Error details.
        const code = error.code;
        const message = error.message;
        const details = error.details;
        console.log("error code and details: ", code, details);
        // ...
      });
  };

  return (
    <>
      <Button onClick={handleOnClick2}>Test API Call</Button>
      <div>Result: {result}</div>
    </>
  );
};

export default Experiments;

function getPrompt(): string {
  return `You are an expert in communication disorders, specifically Broca's aphasia. Your task is to transform an utterance from a person with Broca's aphasia into a grammatically correct sentence and predict the next several words they will say. Do NOT request any additional information or context or ask any questions. Only provide the transformed predicted utterances. Examples:
    1. "Walk dog" => "I will take the dog for a walk"
    2. "Book book two table" => "There are two books on the table"
    3. "i want take kids" => "I want to take the kids to the park"
    4. "sweaty i need" => "I am sweaty and I need a hot shower"
    5. "cat seems cat" => "The cat seems hungry"
    6. "i i need i need some" => "I need to get some sleep"
      
    Please consider the following about the speaker:
      - name: {name}
      - age: {age}
      - self-description: {about_me}
      - current setting: {setting}
      - type of conversation they are having: {conversation_type}
      - tone of voice they are trying to convey: {tone}
    Please provide a single transformed/predicted sentece for the following utterance: 
    {utterance}
  `;
}

"use client";
import { Button } from "@mantine/core";
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { firebaseCloudFunctions } from "../../../firebase";

const Experiments: React.FC = () => {
  const [result, setResult] = useState("");
  const addMessage = httpsCallable(firebaseCloudFunctions, "addmessage");

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

  return (
    <>
      <Button onClick={handleOnClick}>Test API Call</Button>
      <div>Result: {result}</div>
    </>
  );
};

export default Experiments;

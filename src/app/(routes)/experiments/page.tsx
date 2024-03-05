"use client";
import { Button } from "@mantine/core";
import { useState } from "react";

async function testApiCall(): Promise<string> {
  const response = await fetch("api/");
  // const data = await response.json();
  const data = await response.text();
  return data;
}

const Experiments: React.FC = () => {
  const [result, setResult] = useState("");

  const handleOnClick = async () => {
    const data = await testApiCall();
    setResult(data);
  };

  return (
    <>
      <Button onClick={handleOnClick}>Test API Call</Button>
      <div>Result: {result}</div>
    </>
  );
};

export default Experiments;

"use client";
import { TEST_PROMPT_API_ENDPOINT } from "@/firebase";
import { Button, Container, JsonInput, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

const params = [
  "name",
  "age",
  "about_me",
  "setting",
  "conversation_type",
  "tone",
  "utterance",
];

async function callTestPrompt(prompt: string) {
  try {
    const response = await fetch(TEST_PROMPT_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

const Experiments: React.FC = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      prompt: "",
    },
    validate: {
      prompt: (value) => {
        if (!value.trim()) {
          return "Prompt is required";
        }
        const missingParams: string[] = [];
        paramStrings.forEach((param) => {
          if (!value.includes(param)) {
            missingParams.push(param);
          }
        });
        return missingParams.length > 0
          ? `Missing parameters: ${missingParams.join(", ")}`
          : null;
      },
    },
    validateInputOnBlur: true,
  });

  const paramStrings: string[] = params.map((param) => `{${param}}`);

  const handleOnSubmit = async () => {
    setLoading(true);
    const prompt = getPrompt();
    const testResultsObj: object = await callTestPrompt(prompt);
    setResult(JSON.stringify(testResultsObj));
    setLoading(false);
  };

  return (
    <Container size="sm">
      <form onSubmit={form.onSubmit(handleOnSubmit)}>
        <Stack gap="sm">
          <Textarea
            label="Prompt"
            description={`Prompt template must use the following parameters: ${paramStrings.join(
              ", "
            )}`}
            placeholder="Enter your prompt here"
            withAsterisk
            minRows={10}
            maxRows={20}
            autosize
            {...form.getInputProps("prompt")}
          />
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!form.isValid()}
          >
            Run Test Cases
          </Button>
        </Stack>
        {result && (
          <>
            <JsonInput
              value={result}
              label="Results"
              formatOnBlur={true}
              autosize
            />
          </>
        )}
      </form>
    </Container>
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

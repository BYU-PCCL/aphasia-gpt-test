"use client";

import React, { useEffect, useState } from "react";

import { TestCase } from "@/app/_lib/types";
import { SET_TEST_CASE_API_ENDPOINT } from "@/firebase";
import {
  Button,
  Checkbox,
  Fieldset,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

async function setTestCase(testCase: TestCase) {
  try {
    const response = await fetch(SET_TEST_CASE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ testCase: testCase }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

interface EditTestCaseProps {
  testCase?: TestCase | null;
  closeEdit: () => void;
}

const EditTestCase: React.FC<EditTestCaseProps> = ({
  testCase = null,
  closeEdit,
}) => {
  const [keepValues, setKeepValues] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ifSaved, setIfSaved] = useState(false);

  const form = useForm({
    initialValues: {
      goodCompletions: testCase?.goodCompletions.join("\n") ?? "",
      utterance: testCase?.utterance ?? "",
      setting: testCase?.context?.setting ?? "",
      tone: testCase?.context?.tone ?? "",
      conversationType: testCase?.context?.conversationType ?? "",
      name: testCase?.bio?.name ?? "",
      age: testCase?.bio?.age.toString() ?? "",
      aboutMe: testCase?.bio?.aboutMe ?? "",
    },
    validate: {
      utterance: isNotEmpty("Utterance is required"),
      goodCompletions: isNotEmpty("Good completions are required"),
      setting: isNotEmpty("Setting is required"),
      tone: isNotEmpty("Tone is required"),
      conversationType: isNotEmpty("Conversation type is required"),
      name: isNotEmpty("Name is required"),
      age: (value) => {
        if (!value.trim()) {
          return "Age is required";
        }
        const age = parseInt(value);
        if (isNaN(age) || age < 0) {
          return "Age must be a nonnegative number";
        }
        return null;
      },
      aboutMe: isNotEmpty("About me is required"),
    },
    validateInputOnBlur: true,
    transformValues: (values) => ({
      ...values,
      goodCompletions: values.goodCompletions.split("\n"),
      age: parseInt(values.age),
    }),
  });

  const handleOnSubmit = async () => {
    setIsLoading(true);
    const formValues = form.getTransformedValues();
    const testCaseDraftToSave: TestCase = {
      id: testCase?.id,
      utterance: formValues.utterance,
      context: {
        setting: formValues.setting,
        tone: formValues.tone,
        conversationType: formValues.conversationType,
      },
      bio: {
        name: formValues.name,
        age: formValues.age,
        aboutMe: formValues.aboutMe,
      },
      goodCompletions: formValues.goodCompletions,
    };
    const result = await setTestCase(testCaseDraftToSave);
    if (addAnother) {
      if (!keepValues) {
        form.reset();
      }
    } else {
      closeEdit();
    }
    setIfSaved(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (ifSaved) {
      const timeout = setTimeout(() => {
        setIfSaved(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [ifSaved]);

  return (
    <form onSubmit={form.onSubmit(handleOnSubmit)}>
      <Stack>
        <Fieldset legend="Speech">
          <TextInput label="Utterance" {...form.getInputProps("utterance")} />
          <Textarea
            label="Good Completions (one per line)"
            autosize
            minRows={3}
            maxRows={6}
            {...form.getInputProps("goodCompletions")}
          />
        </Fieldset>
        <Fieldset legend="Context">
          <TextInput label="Setting" {...form.getInputProps("setting")} />
          <TextInput label="Tone" {...form.getInputProps("tone")} />
          <TextInput
            label="Conversation Type"
            {...form.getInputProps("conversationType")}
          />
        </Fieldset>
        <Fieldset legend="Bio">
          <TextInput label="Name" {...form.getInputProps("name")} />
          <TextInput label="Age" type="number" {...form.getInputProps("age")} />
          <Textarea
            label="About Me"
            autosize
            minRows={3}
            maxRows={6}
            {...form.getInputProps("aboutMe")}
          />
        </Fieldset>
        <Group justify="space-between" align="center">
          <Group>
            <Checkbox
              label="Add another after save"
              checked={addAnother}
              onChange={(event) => setAddAnother(event.currentTarget.checked)}
            />
            {addAnother && (
              <Checkbox
                label="Keep values"
                checked={keepValues}
                onChange={(event) => setKeepValues(event.currentTarget.checked)}
              />
            )}
          </Group>
          {ifSaved && (
            <Text c="green" size="sm">
              Saved!
            </Text>
          )}
        </Group>
        <Group grow>
          <Button onClick={closeEdit} variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleOnSubmit}
            loading={isLoading}
            disabled={!form.isValid()}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default EditTestCase;

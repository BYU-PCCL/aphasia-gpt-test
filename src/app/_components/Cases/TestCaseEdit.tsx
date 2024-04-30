"use client";

import React from "react";

import { SET_TEST_CASE_API_ENDPOINT } from "@/firebase";
import { Fieldset, Textarea, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

import { TestCase } from "../../../../shared/types";
import ItemEdit from "../ItemEdit";
import { ItemEditProps } from "../ListDetailView";

type FormReturnType = {
  goodCompletions: string;
  utterance: string;
  setting: string;
  tone: string;
  conversationType: string;
  name: string;
  age: string;
  aboutMe: string;
};

const TestCaseEdit: React.FC<ItemEditProps<TestCase>> = ({
  item: testCase = null,
  closeEdit,
}) => {
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
    } as FormReturnType,
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
    transformValues: (values: FormReturnType) => ({
      ...values,
      goodCompletions: values.goodCompletions.split("\n"),
      age: parseInt(values.age),
    }),
    validateInputOnBlur: true,
  });

  const formatItemToSave = (values: FormReturnType) => ({
    id: testCase?.id,
    utterance: values.utterance,
    context: {
      setting: values.setting,
      tone: values.tone,
      conversationType: values.conversationType,
    },
    bio: {
      name: values.name,
      age: values.age,
      aboutMe: values.aboutMe,
    },
    goodCompletions: values.goodCompletions,
  });

  return (
    <ItemEdit
      closeEdit={closeEdit}
      apiEndpoint={SET_TEST_CASE_API_ENDPOINT}
      title="Test Case"
      form={form}
      formatItemToSave={formatItemToSave}
    >
      {(form) => (
        <>
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
            <TextInput
              label="Age"
              type="number"
              {...form.getInputProps("age")}
            />
            <Textarea
              label="About Me"
              autosize
              minRows={3}
              maxRows={6}
              {...form.getInputProps("aboutMe")}
            />
          </Fieldset>
        </>
      )}
    </ItemEdit>
  );
};

export default TestCaseEdit;

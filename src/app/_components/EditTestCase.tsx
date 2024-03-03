"use client";

import React, { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Title,
  Stack,
  Paper,
  Group,
  Checkbox,
} from "@mantine/core";
import { TestCaseDraft, Context, Bio } from "@/app/_lib/types";

interface EditTestCaseProps {
  testCaseDraft?: TestCaseDraft | null;
  onCancel: () => void;
}

const EditTestCase: React.FC<EditTestCaseProps> = ({
  testCaseDraft: testCase = null,
  onCancel,
}) => {
  const [keepValues, setKeepValues] = useState(false);
  const [utterance, setUtterance] = useState(testCase?.utterance ?? "");
  const [context, setContext] = useState(
    testCase?.context ??
      ({
        setting: "",
        tone: "",
        conversationType: "",
      } as Context)
  );
  const [bio, setBio] = useState(
    testCase?.bio ??
      ({
        name: "",
        age: 0,
        aboutMe: "",
      } as Bio)
  );
  const [goodCompletions, setGoodCompletions] = useState(
    testCase?.goodCompletions ?? []
  );

  const handleSave = () => {
    console.log("handleSave");
    if (!keepValues) {
      setUtterance("");
      setContext({
        setting: "",
        tone: "",
        conversationType: "",
      });
      setBio({
        name: "",
        age: 0,
        aboutMe: "",
      });
      setGoodCompletions([]);
    }
  };

  return (
    <Stack>
      <Paper withBorder p="md">
        <Title order={4}>Speech</Title>
        <TextInput
          label="Utterance"
          value={utterance}
          onChange={(event) => setUtterance(event.currentTarget.value)}
        />
        <Textarea
          label="Good Completions (one per line)"
          value={goodCompletions.join("\n")}
          onChange={(event) =>
            setGoodCompletions(event.currentTarget.value.split("\n"))
          }
          autosize
          minRows={3}
          maxRows={6}
        />
      </Paper>
      <Paper withBorder p="md">
        <Title order={4}>Context</Title>
        <TextInput
          label="Setting"
          value={context.setting}
          onChange={(event) =>
            setContext({ ...context, setting: event.currentTarget.value })
          }
        />
        <TextInput
          label="Tone"
          value={context.tone}
          onChange={(event) =>
            setContext({ ...context, tone: event.currentTarget.value })
          }
        />
        <TextInput
          label="Conversation Type"
          value={context.conversationType}
          onChange={(event) =>
            setContext({
              ...context,
              conversationType: event.currentTarget.value,
            })
          }
        />
      </Paper>
      <Paper withBorder p="md">
        <Title order={4}>Bio</Title>
        <TextInput
          label="Name"
          value={bio.name}
          onChange={(event) =>
            setBio({ ...bio, name: event.currentTarget.value })
          }
        />
        <TextInput
          label="Age"
          type="number"
          value={bio.age.toString()}
          onChange={(event) =>
            setBio({ ...bio, age: parseInt(event.currentTarget.value) })
          }
        />
        <Textarea
          label="About Me"
          value={bio.aboutMe}
          onChange={(event) =>
            setBio({ ...bio, aboutMe: event.currentTarget.value })
          }
          autosize
          minRows={3}
          maxRows={6}
        />
      </Paper>
      <Checkbox
        label="Keep values after save"
        checked={keepValues}
        onChange={(event) => setKeepValues(event.currentTarget.checked)}
      />
      <Group grow>
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </Group>
    </Stack>
  );
};

export default EditTestCase;

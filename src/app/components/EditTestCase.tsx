"use client";

import React, { useState } from "react";
import { TextInput, Textarea, Button } from "@mantine/core";
import { TestCaseDraft, TestCase, Context, Bio } from "@/lib/types";

interface EditTestCaseProps {
  testCaseDraft?: TestCaseDraft | null;
  onCancel: () => void;
}

const EditTestCase: React.FC<EditTestCaseProps> = ({
  testCaseDraft: testCase = null,
  onCancel,
}) => {
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
  };

  return (
    <div>
      <TextInput
        label="Utterance"
        value={utterance}
        onChange={(event) => setUtterance(event.currentTarget.value)}
      />

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
      />

      <Textarea
        label="Good Completions (one per line)"
        value={goodCompletions.join("\n")}
        onChange={(event) =>
          setGoodCompletions(event.currentTarget.value.split("\n"))
        }
      />

      <Button onClick={handleSave}>Save</Button>
      <Button onClick={onCancel} variant="outline">
        Cancel
      </Button>
    </div>
  );
};

export default EditTestCase;

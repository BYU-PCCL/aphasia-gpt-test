"use client";
import { useState } from "react";

import { START_PROMPT_TESTS_API_ENDPOINT } from "@/firebase";
import {
  Button,
  Container,
  CopyButton,
  Divider,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCopy, IconTestPipe2 } from "@tabler/icons-react";

import { PromptCandidate } from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";
import { ItemDetailsProps } from "../ListDetailView";
import PromptText from "../PromptText";

const PromptDetails: React.FC<ItemDetailsProps<PromptCandidate>> = ({
  item: prompt,
}) => {
  const [runTestsLoading, setRunTestsLoading] = useState(false);

  const runTestsClick = async () => {
    setRunTestsLoading(true);
    try {
      const response = await fetch(START_PROMPT_TESTS_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: prompt.id,
        }),
      });

      if (!response.ok) {
        notifications.show({
          title: `Tests failed due to HTTP error: ${response.status} - ${response.statusText}`,
          message: `Error: ${await response.json()}`,
          color: "red",
        });
        console.error("HTTP error:", response.status);
        return;
      }

      console.log(response.json()); // TODO: Do something with this
      notifications.show({
        title: "Tests started",
        message: 'Monitor the results in the "Results" tab.',
        color: "teal",
      });
    } catch (error) {
      console.error("Error:", error);
      notifications.show({
        title: "Tests failed",
        message: (error as Error).message ?? "An unknown error occurred.",
        color: "red",
      });
    }
    setRunTestsLoading(false);
  };

  return (
    <>
      <Group justify="space-between" align="center">
        <Group>
          <Button
            leftSection={<IconTestPipe2 />}
            color="teal"
            onClick={runTestsClick}
            loading={runTestsLoading}
          >
            Run Tests
          </Button>
          <CopyButton value={prompt.prompt} timeout={3000}>
            {({ copied, copy }) => (
              <Tooltip label="Copied!" withArrow opened={copied}>
                <Button
                  color="gray"
                  leftSection={copied ? <IconCheck /> : <IconCopy />}
                  onClick={copy}
                >
                  Copy Prompt
                </Button>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
        {prompt.dateCreatedUtc && (
          <Text c="dimmed">
            Created: {unixTimestampToDateString(prompt.dateCreatedUtc)}
          </Text>
        )}
      </Group>
      <Divider mt="xs" mb="sm" />
      <Container fluid>
        <PromptText prompt={prompt} />
      </Container>
    </>
  );
};

export default PromptDetails;

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { TEST_PROMPT_API_ENDPOINT } from "@/firebase";
import {
  Button,
  Container,
  CopyButton,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCopy, IconTestPipe2 } from "@tabler/icons-react";

import {
  encodedPromptParams,
  PromptCandidate,
  TestResultsStatus,
} from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";
import { ItemDetailsProps } from "../ListDetailView";

const PromptDetails: React.FC<ItemDetailsProps<PromptCandidate>> = ({
  item: prompt,
}) => {
  const [runTestsLoading, setRunTestsLoading] = useState(false);

  const runTestsClick = async () => {
    setRunTestsLoading(true);
    try {
      const response = await fetch(TEST_PROMPT_API_ENDPOINT, {
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
        title: "Tests successful",
        message: 'View the results in the "Tests" tab.',
        color: "teal",
      });
    } catch (error) {
      console.error("Error:", error);
    }
    setRunTestsLoading(false);
  };

  return (
    <Paper withBorder p="md" h="100%">
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
        {prompt.prompt.split("\n").map((line, i) => {
          return (
            <span key={i}>
              {line.split(" ").map((word, j) => {
                return (
                  <Text
                    key={j}
                    fw={encodedPromptParams.includes(word) ? 700 : 300}
                    span
                  >
                    {word}{" "}
                  </Text>
                );
              })}
              <br />
            </span>
          );
        })}
      </Container>
    </Paper>
  );
};

export default PromptDetails;

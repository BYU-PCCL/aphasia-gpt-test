"use client";
import { useRouter } from "next/navigation";

import { TEST_PROMPT_API_ENDPOINT } from "@/firebase";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  CopyButton,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy, IconTestPipe2 } from "@tabler/icons-react";

import { encodedPromptParams, PromptCandidate } from "../../../../shared/types";
import { ItemDetailsProps } from "../ListDetailView";

const PromptDetails: React.FC<ItemDetailsProps<PromptCandidate>> = ({
  item: prompt,
}) => {
  const router = useRouter();

  const runTestsClick = async () => {
    try {
      const response = await fetch(TEST_PROMPT_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prompt),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(response.json()); // TODO: Do something with this
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Stack>
      <Title order={3}>{prompt.id}</Title>
      <Group>
        <Button
          leftSection={<IconTestPipe2 />}
          color="teal"
          onClick={runTestsClick}
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
    </Stack>
  );
};

export default PromptDetails;

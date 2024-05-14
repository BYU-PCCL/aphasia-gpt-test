"use client";
import { useState } from "react";

import { START_PROMPT_TESTS_API_ENDPOINT, DELETE_PROMPT_API_ENDPOINT } from "@/firebase";
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
import { IconCheck, IconCopy, IconTestPipe2, IconX } from "@tabler/icons-react";

import { PromptCandidate } from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";
import { ItemDetailsProps } from "../ListDetailView";
import PromptText from "../PromptText";
import { Modal } from "rsuite"; 
import "rsuite/dist/rsuite.min.css";
import UpdateButton from "../UpdateButton";

const PromptDetails: React.FC<ItemDetailsProps<PromptCandidate>> = ({
  item: prompt,
  setIsUpdating,
}) => {
  const [runTestsLoading, setRunTestsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  
  const handleDelete = async () => {
    setDeleteLoading(true);
    // Perform delete action here
    const req_body = JSON.stringify({
      promptId: prompt.id
    });
    const response = await fetch(DELETE_PROMPT_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: req_body,
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
    setDeleteLoading(false);
    closeDeleteModal();
  };

  const handleUpdate = () => {
    setIsUpdating(true);
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
          <UpdateButton onClick={handleUpdate} />
          <Button
            leftSection={<IconX />}
            color="red"
            onClick={openDeleteModal}
            loading={deleteLoading}
          >
            Delete
        </Button>
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
      <Modal
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          title="Confirm Delete"
          size="sm"
        >
          <Modal.Body>Are you sure you want to delete this prompt?</Modal.Body>
          <Modal.Footer>
            <Button onClick={closeDeleteModal} variant="light">
              Cancel
            </Button>
            <Button onClick={handleDelete} loading={deleteLoading} color="red">
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  );
};

export default PromptDetails;

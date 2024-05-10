import { useState } from "react";

import { DELETE_TEST_RESULT_API_ENDPOINT, RETRY_PROMPT_TESTS_API_ENDPOINT } from "@/firebase";
import {
  Accordion,
  AccordionControl,
  AccordionPanel,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridCol,
  Group,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  List,
  ListItem,
  Loader,
  NumberFormatter,
  Spoiler,
  Table,
  TableTd,
  TableTr,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconDots,
  IconExclamationCircle,
  IconInfoCircle,
  IconX,
  IconXboxA,
} from "@tabler/icons-react";

import {
  PromptCandidate,
  PromptTestResults,
  TestCase,
  TestCaseResult,
  TestResultsStatus,
} from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";
import { ItemDetailsProps } from "../ListDetailView";
import PromptText from "../PromptText";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCopy, IconTestPipe2 } from "@tabler/icons-react";
// import { Modal } from "@mantine/core";
import { Modal } from "rsuite"; 
import "rsuite/dist/rsuite.min.css"; 

interface ResultsDetailsProps extends ItemDetailsProps<PromptTestResults> {
  testCases: TestCase[];
  prompts: PromptCandidate[];
}

const ResultsDetails: React.FC<ResultsDetailsProps> = ({
  item: promptTestResults,
  testCases,
  prompts,
}) => {
  const infoTableRowData = [
    { key: "LLM Model", value: promptTestResults.llmModel },
    { key: "Embeddings Model", value: promptTestResults.embeddingsModel },
    { key: "Temperature", value: promptTestResults.temperature },
    { key: "Max Tokens", value: promptTestResults.maxTokens },
  ];

  function calculateAverageCosineSimilarityScore(
    testCaseResults: TestCaseResult[]
  ): number | null {
    const scores: number[] = Object.values(testCaseResults)
      .filter((result) => result.status === TestResultsStatus.COMPLETE)
      .map((result) => result.cosineSimilarityScore)
      .filter(
        (score): score is number => score !== null && score !== undefined
      );

    if (scores.length === 0) {
      return null;
    }

    return scores.reduce((acc, score) => acc + score, 0) / scores.length;
  }

  const score = (value: number) => (
    <NumberFormatter value={value} decimalScale={3} />
  );

  const averageCosineSimilarityScore = (
    testCaseResults: Record<string, TestCaseResult>
  ) => {
    const average = calculateAverageCosineSimilarityScore(
      Object.values(testCaseResults)
    );

    return average ? score(average) : "Score not available";
  };

  const statusIcon = (testResultsStatus: TestResultsStatus) => {
    switch (testResultsStatus) {
      case TestResultsStatus.COMPLETE:
        return <IconCircleCheck color="teal" />;
      case TestResultsStatus.ERROR:
        return <IconExclamationCircle color="red" />;
      case TestResultsStatus.NOT_STARTED:
        return <IconDots />;
      case TestResultsStatus.IN_PROGRESS:
        return <Loader />;
      default:
        return null;
    }
  };

  const prompt: PromptCandidate | null =
    prompts.find((p) => p.id === promptTestResults.promptId) ?? null;

  const getTestCase = (testCaseId: string) =>
    testCases.find((tc) => tc.id === testCaseId);

  const completionsList = (title: string, completions: string[]) =>
    completions.length > 0 ? (
      <Box>
        <Title order={6}>{title}:</Title>
        <List withPadding>
          {completions.map((completion, index) => (
            <ListItem key={index}>{completion}</ListItem>
          ))}
        </List>
      </Box>
    ) : null;

  const CardHeader: React.FC = () => (
    <Group justify="space-between" align="center">
      <Group>
        <Title order={3}>
          {averageCosineSimilarityScore(promptTestResults.testCaseResults)}
        </Title>
        <Box>
          <HoverCard>
            <HoverCardTarget>
              <IconInfoCircle />
            </HoverCardTarget>
            <HoverCardDropdown>
              <Table>
                {infoTableRowData.map((row) => (
                  <TableTr key={row.key}>
                    <TableTd>{row.key}</TableTd>
                    <TableTd>{row.value}</TableTd>
                  </TableTr>
                ))}
              </Table>
            </HoverCardDropdown>
          </HoverCard>
        </Box>
      </Group>
      {promptTestResults.dateCreatedUtc && (
        <Text c="dimmed">
          Created: {unixTimestampToDateString(promptTestResults.dateCreatedUtc)}
        </Text>
      )}
    </Group>
  );

  const [retryTestsLoading, setRetryTestsLoading] = useState(false);

  const retryTestsClick = async () => {
    setRetryTestsLoading(true);
    try {
      if (testCases.length === 0) {
        notifications.show({
          title: "Tests failed",
          message: "No test cases found.",
          color: "red",
        });
        return;
      }

      let failedTestResults = [];
      for (const testCaseId in promptTestResults.testCaseResults) {
        if (
          promptTestResults.testCaseResults[testCaseId].status ===
          TestResultsStatus.ERROR
        ) {
          failedTestResults.push(testCaseId);
        }
      }

      const req_body = JSON.stringify({
        resultsId: promptTestResults.id,
        testCasesIds: failedTestResults
      });
      const response = await fetch(RETRY_PROMPT_TESTS_API_ENDPOINT, {
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

      // console.log(response.json()); // TODO: Do something with this
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
    setRetryTestsLoading(false);
  };

  const hasError = (testResults: PromptTestResults): boolean => {
    const testCaseResults = testResults.testCaseResults;
    for (const testCaseId in testCaseResults) {
      if (testCaseResults[testCaseId].status === TestResultsStatus.ERROR) {
        return true;
      }
    }
    return false;
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      testResultId: promptTestResults.id
    });
    const response = await fetch(DELETE_TEST_RESULT_API_ENDPOINT, {
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


  return (
    <div>
      <CardHeader />
      <Divider mt="sm" mb="sm" />
      <Spoiler showLabel="See more" hideLabel="Hide" maxHeight={150}>
        <Title order={4}>Prompt</Title>
        <Text>
          {prompt ? <PromptText prompt={prompt} /> : "Prompt not found"}
        </Text>
      </Spoiler>
      <Divider mt="sm" mb="sm" />
      <Group align="center">
      {hasError(promptTestResults) && (
        <Button
          leftSection={<IconTestPipe2 />}
          color="teal"
          onClick={retryTestsClick}
          loading={retryTestsLoading}
        >
          Retry Tests
        </Button>
      )}
      {!hasError(promptTestResults) && (
        <Button
          leftSection={<IconTestPipe2 />}
          color="grey"
          disabled
        >
          Retry Tests
      </Button>
      )}
      <Button
        leftSection={<IconX />}
        color="red"
        onClick={openDeleteModal}
        loading={deleteLoading}
      >
        Delete
      </Button>
      </Group>
      <Container fluid p={0}>
        <Title order={4}>Test Case Results</Title>
        <Accordion variant="separated" multiple>
          {Object.keys(promptTestResults.testCaseResults).map((testCaseId) => {
            const testCaseResult =
              promptTestResults.testCaseResults[testCaseId];
            return (
              <Accordion.Item key={testCaseId} value={testCaseId}>
                <AccordionControl>
                  <Group align="center">
                    {statusIcon(testCaseResult.status)}
                    <Title order={5} lineClamp={2}>
                      {testCaseResult.cosineSimilarityScore &&
                        score(testCaseResult.cosineSimilarityScore)}
                      {testCaseResult.cosineSimilarityScore && " | "}
                      {getTestCase(testCaseId)?.utterance ??
                        "Test case not found"}
                    </Title>
                  </Group>
                </AccordionControl>
                <AccordionPanel>
                  <Container fluid>
                    <Box py="xs">
                      <Box pb="sm">
                        <Title order={6}>Status:</Title>
                        <Text>{testCaseResult.status}</Text>
                      </Box>
                      {testCaseResult.status === TestResultsStatus.ERROR &&
                        testCaseResult.error && (
                          <Box pb="sm">
                            <Title order={6}>Error:</Title>
                            <Text>{testCaseResult.error}</Text>
                          </Box>
                        )}
                      <Box pb="sm">
                        <Title order={6}>Utterance:</Title>
                        <Text>{getTestCase(testCaseId)?.utterance}</Text>
                      </Box>
                    </Box>
                    <Grid gutter="md">
                      <GridCol span={6}>
                        {testCaseResult.llmCompletions &&
                          completionsList(
                            "Output Completions",
                            testCaseResult.llmCompletions
                          )}
                      </GridCol>
                      <GridCol span={6}>
                        {getTestCase(testCaseId)?.goodCompletions &&
                          completionsList(
                            "Known Good Completions",
                            getTestCase(testCaseId)?.goodCompletions ?? []
                          )}
                      </GridCol>
                    </Grid>
                  </Container>
                </AccordionPanel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Container>
      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        size="sm"
      >
        <Modal.Body>Are you sure you want to delete this batch of results?</Modal.Body>
        <Modal.Footer>
          <Button onClick={closeDeleteModal} variant="light">
            Cancel
          </Button>
          <Button onClick={handleDelete} loading={deleteLoading} color="red">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResultsDetails;

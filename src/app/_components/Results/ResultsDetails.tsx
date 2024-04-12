import { useState } from "react";

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
    </div>
  );
};

export default ResultsDetails;

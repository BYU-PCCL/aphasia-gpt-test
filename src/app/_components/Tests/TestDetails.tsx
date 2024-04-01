import {
  Accordion,
  AccordionControl,
  AccordionPanel,
  Box,
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
  NumberFormatter,
  Spoiler,
  Table,
  TableTd,
  TableTr,
  Text,
  Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import {
  PromptCandidate,
  PromptTestResults,
  TestCase,
} from "../../../../shared/types";
import { ItemDetailsProps } from "../ListDetailView";
import PromptText from "../PromptText";

interface TestDetailsProps extends ItemDetailsProps<PromptTestResults> {
  testCases: TestCase[];
  prompts: PromptCandidate[];
}

const TestDetails: React.FC<TestDetailsProps> = ({
  item: promptTestResults,
  testCases,
  prompts,
}) => {
  const infoTableRowData = [
    { key: "LLM Model", value: promptTestResults.llmModel },
    { key: "Embeddings Model", value: promptTestResults.embeddingsModel },
    { key: "Temperature", value: promptTestResults.temperature },
    { key: "Max Tokens", value: promptTestResults.maxTokens },
    { key: "Num Responses", value: promptTestResults.numResponses },
  ];

  const calcAverageCosineSimilarityScore: () => number = () => {
    const scores: number[] = Object.values(promptTestResults.testCaseResults)
      .map((result) => result.cosineSimilarityScore)
      .filter(
        (score): score is number => score !== null && score !== undefined
      );
    const average =
      scores.reduce((acc, score) => acc + score, 0) / scores.length;
    return average;
  };

  const score = (value: number) => (
    <NumberFormatter value={value} decimalScale={3} />
  );

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

  return (
    <div>
      <Group>
        <Title order={3}>
          {score(calcAverageCosineSimilarityScore())} | {promptTestResults.id}
        </Title>
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
      </Group>
      <Divider mt="xs" mb="sm" />
      <Spoiler showLabel="See more" hideLabel="Hide" maxHeight={200}>
        <Title order={4}>Prompt</Title>
        <Text>
          {prompt ? <PromptText prompt={prompt} /> : "Prompt not found"}
        </Text>
      </Spoiler>
      <Divider mt="xs" mb="sm" />
      <Container fluid p={0}>
        <Title order={4}>Test Case Results</Title>
        <Accordion multiple variant="separated">
          {Object.keys(promptTestResults.testCaseResults).map((testCaseId) => {
            const testCaseResult =
              promptTestResults.testCaseResults[testCaseId];
            return (
              <Accordion.Item key={testCaseId} value={testCaseId}>
                <AccordionControl>
                  <Title order={5} lineClamp={1}>
                    {testCaseResult.cosineSimilarityScore &&
                      score(testCaseResult.cosineSimilarityScore)}
                    {' | "'}
                    {getTestCase(testCaseId)?.utterance ??
                      "Test case not found"}
                    {'"'}
                  </Title>
                </AccordionControl>
                <AccordionPanel>
                  <Container fluid>
                    <Title order={6}>Utterance:</Title>
                    <Text>{getTestCase(testCaseId)?.utterance}</Text>
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

export default TestDetails;

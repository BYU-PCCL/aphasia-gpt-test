import {
  Accordion,
  AccordionControl,
  AccordionPanel,
  Container,
  Divider,
  Group,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  NumberFormatter,
  Spoiler,
  Table,
  TableTd,
  TableTr,
  Text,
  Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import { PromptTestResults } from "../../../../shared/types";
import { ItemDetailsProps } from "../ListDetailView";

const TestDetails: React.FC<ItemDetailsProps<PromptTestResults>> = ({
  item: promptTestResults,
}) => {
  const infoTableRowData = [
    { key: "LLM Model", value: promptTestResults.llmModel },
    { key: "Embeddings Model", value: promptTestResults.embeddingsModel },
    { key: "Temperature", value: promptTestResults.temperature },
    { key: "Max Tokens", value: promptTestResults.maxTokens },
    { key: "Num Responses", value: promptTestResults.numResponses },
  ];

  const score = (value: number) => (
    <NumberFormatter value={value} decimalScale={3} />
  );

  return (
    <div>
      <Group>
        <Title order={3}>{promptTestResults.id}</Title>
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
        <Title order={5}>Prompt</Title>
        <Text>{promptTestResults.promptId}</Text>
      </Spoiler>
      <Divider mt="xs" mb="sm" />
      <Container fluid p={0}>
        <Title order={5}>Test Cases</Title>
        <Accordion multiple>
          {Object.keys(promptTestResults.testCaseResults).map((testCaseId) => {
            const testCaseResult =
              promptTestResults.testCaseResults[testCaseId];
            return (
              <Accordion.Item key={testCaseId} value={testCaseId}>
                <AccordionControl>
                  <Group>
                    {testCaseId}:{" "}
                    {testCaseResult.cosineSimilarityScore &&
                      score(testCaseResult.cosineSimilarityScore)}
                  </Group>
                </AccordionControl>
                <AccordionPanel>
                  <Text>Test Case ID: {testCaseResult.testCaseId}</Text>
                  <Text>Status: {testCaseResult.status}</Text>
                  {testCaseResult.cosineSimilarityScore && (
                    <Text>
                      Cosine Similarity Score:{" "}
                      {score(testCaseResult.cosineSimilarityScore)}
                    </Text>
                  )}
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

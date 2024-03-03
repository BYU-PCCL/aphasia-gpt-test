import React from "react";
import {
  Paper,
  Text,
  Title,
  Divider,
  Table,
  Group,
  Spoiler,
  Grid,
} from "@mantine/core";
import { TestCase } from "@/lib/types";

interface TestCaseCardProps {
  testCase: TestCase;
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({ testCase }) => {
  const row = (label: string, value: string, isLong: boolean = false) => (
    <Table.Tr>
      <Table.Td fw={600}>{label}</Table.Td>
      <Table.Td>
        {isLong ? (
          <Spoiler maxHeight={75} showLabel="More" hideLabel="Less">
            {value.split("\n").map((line, index) => (
              <Text key={index}>{line}</Text>
            ))}
          </Spoiler>
        ) : (
          value
        )}
      </Table.Td>
    </Table.Tr>
  );

  return (
    <Paper withBorder p="md" h="100%">
      <Title order={2}>#{testCase.id}</Title>
      <Divider mb={15} />
      <Grid>
        <Grid.Col span={12}>
          <Title order={4}>Utterance</Title>
          <Text>{testCase.utterance}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Title order={4}>Good Completions</Title>
          <ul style={{ margin: 0 }}>
            {testCase.goodCompletions.map((completion, index) => (
              <li key={index}>
                <Text>{completion}</Text>
              </li>
            ))}
          </ul>
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={4}>Bio</Title>
          <Table>
            <Table.Tbody>
              {row("Name", testCase.bio.name)}
              {row("Age", testCase.bio.age.toString())}
              {row("About me", testCase.bio.aboutMe, true)}
            </Table.Tbody>
          </Table>
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={4}>Context</Title>
          <Table>
            <Table.Tbody>
              {row("Tone", testCase.context.tone)}
              {row("Setting", testCase.context.setting)}
              {row("Conversation Type", testCase.context.conversationType)}
            </Table.Tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default TestCaseCard;

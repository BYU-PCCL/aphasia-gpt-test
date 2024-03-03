"use client";

import { TestCase } from "@/app/_lib/types";
import React, { useState } from "react";
import EditTestCase from "./EditTestCase";
import { Button, Container, Grid, Title } from "@mantine/core";
import TestCaseCard from "./TestCaseCard";

interface TestCasesProps {
  testCases: TestCase[];
}

const TestCases: React.FC<TestCasesProps> = ({ testCases }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <Title order={1} mb="sm">
        Test Cases
      </Title>
      {isEditing ? (
        <Container size="xs">
          <EditTestCase onCancel={() => setIsEditing(false)} />
        </Container>
      ) : (
        <>
          <Button onClick={() => setIsEditing(true)}>Add</Button>
          <Grid mt="sm">
            {testCases.map((testCase) => (
              <Grid.Col span={{ base: 12, md: 6 }} key={testCase.id}>
                <TestCaseCard testCase={testCase} />
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default TestCases;

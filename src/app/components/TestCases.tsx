"use client";

import { TestCase, TestCaseDraft } from "@/lib/types";
import React, { useState } from "react";
import EditTestCase from "./EditTestCase";
import { Button, Grid } from "@mantine/core";
import test from "node:test";
import TestCaseCard from "./TestCaseCard";

interface TestCasesProps {
  testCases: TestCase[];
}

const TestCases: React.FC<TestCasesProps> = ({ testCases }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {isEditing ? (
        <EditTestCase onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <Button onClick={() => setIsEditing(true)}>Add Test Case</Button>
          <Grid mt={15}>
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

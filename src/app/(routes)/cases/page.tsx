"use client";
import { useEffect, useState } from "react";

import EditTestCase from "@/app/_components/EditTestCase";
import TestCaseCard from "@/app/_components/TestCaseCard";
import { TestCase } from "@/app/_lib/types/TestCase";
import { unixTimestampToDateString } from "@/app/_lib/utils";
import { GET_ALL_TEST_CASES_API_ENDPOINT } from "@/firebase";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Loader,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";

const Cases: React.FC = () => {
  const [cases, setCases] = useState<TestCase[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(
    null
  );

  async function getAllTestCases(): Promise<TestCase[] | null> {
    try {
      const response = await fetch(GET_ALL_TEST_CASES_API_ENDPOINT);

      if (!response.ok) {
        setLoadingError(
          `Error fetching test cases from the database: HTTP status of ${response.status}`
        );
      }
      const data = await response.json();
      if (data) {
        const cases: TestCase[] = Array.isArray(data)
          ? (data as TestCase[])
          : data
          ? [data]
          : [];
        // Newest first
        return cases.sort(
          (a, b) => (b.dateCreatedUtc ?? 0) - (a.dateCreatedUtc ?? 0)
        );
      } else {
        return [];
      }
    } catch (error) {
      setLoadingError(`Error fetching test cases from the database: ${error}`);
    }

    return [];
  }

  useEffect(() => {
    let isMounted = true;

    const fetchCases = async () => {
      const cases = await getAllTestCases();
      if (isMounted) {
        // This is to prevent a memory leak, only update state if the component is still mounted (had to await)
        setCases(cases);
        setLoading(false);
      }
    };
    fetchCases();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTestCase) {
      setSelectedTestCase(cases?.[0] ?? null);
    }
  }, [cases, selectedTestCase]);

  return (
    <>
      <Flex h="100%" direction={{ base: "column", sm: "row" }} gap={30}>
        {isEditing ? (
          <Container size="xs">
            <EditTestCase closeEdit={() => setIsEditing(false)} />
          </Container>
        ) : (
          <>
            <Stack
              gap={0}
              h={{ base: "50%", sm: "100%" }}
              w={{ base: "100%", sm: "33%", md: "25%" }}
              px={0}
            >
              <Title order={1} mb="sm">
                Test Cases
              </Title>
              <Button onClick={() => setIsEditing(true)} mb="sm">
                Add
              </Button>
              <ScrollArea>
                <Stack gap={0}>
                  {cases && cases.length > 0 && (
                    <>
                      {cases.map((testCase) => {
                        return (
                          testCase.id &&
                          testCase.dateCreatedUtc && (
                            <NavLink
                              key={testCase.id}
                              onClick={() => setSelectedTestCase(testCase)}
                              active={selectedTestCase?.id === testCase.id}
                              label={testCase.utterance}
                              description={unixTimestampToDateString(
                                testCase.dateCreatedUtc
                              )}
                            />
                          )
                        );
                      })}
                    </>
                  )}
                </Stack>
              </ScrollArea>
            </Stack>
            <ScrollArea
              h={{ base: "50%", sm: "100%" }}
              w={{ base: "100%", sm: "67%", md: "75%" }}
            >
              {isLoading ? (
                <>
                  <Stack>
                    <Center>
                      <Loader size="xl" />
                    </Center>
                    <Text c="dimmed" ta="center">
                      If this page has not been loaded in a while, this may take
                      up to 30 seconds
                    </Text>
                  </Stack>
                </>
              ) : loadingError ? (
                <Text c="red" ta="center">
                  {loadingError}
                </Text>
              ) : selectedTestCase ? (
                <TestCaseCard testCase={selectedTestCase} />
              ) : (
                <Title order={5}>Select a test case to view its details</Title>
              )}
            </ScrollArea>
          </>
        )}
      </Flex>
    </>
  );
};

export default Cases;

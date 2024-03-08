"use client";
import { TestCase } from "@/app/_lib/types/TestCase";
import { useEffect, useState } from "react";
import {
  Button,
  Center,
  Container,
  Grid,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import EditTestCase from "@/app/_components/EditTestCase";
import TestCaseCard from "@/app/_components/TestCaseCard";

const Cases: React.FC = () => {
  const [cases, setCases] = useState<TestCase[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  async function getAllTestCases(): Promise<TestCase[] | null> {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/personal-aphasia-testing/us-central1/getAllTestCases"
      );

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

  return (
    <div>
      <Title order={1} mb="sm">
        Test Cases
      </Title>
      {isEditing ? (
        <Container size="xs">
          <EditTestCase closeEdit={() => setIsEditing(false)} />
        </Container>
      ) : (
        <>
          <Button onClick={() => setIsEditing(true)}>Add</Button>
          {isLoading ? (
            <>
              <Stack>
                <Center>
                  <Loader size="xl" />
                </Center>
                <Text c="dimmed" ta="center">
                  If this page has not been loaded in a while, this may take up
                  to 30 seconds
                </Text>
              </Stack>
            </>
          ) : loadingError ? (
            <Text c="red" ta="center">
              {loadingError}
            </Text>
          ) : cases && cases.length > 0 ? (
            <>
              <Grid mt="sm">
                {cases.map((testCase) => (
                  <Grid.Col span={{ base: 12, md: 6 }} key={testCase.id ?? "1"}>
                    <TestCaseCard testCase={testCase} />
                  </Grid.Col>
                ))}
              </Grid>
            </>
          ) : (
            <div>No test cases found</div>
          )}
        </>
      )}
    </div>
  );
};

export default Cases;

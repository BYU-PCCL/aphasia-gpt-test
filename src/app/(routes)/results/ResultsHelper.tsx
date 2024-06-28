import React from "react";
import { useState } from "react";
import ListDetailView from "@/app/_components/ListDetailView";
import ResultsDetails from "@/app/_components/Results/ResultsDetails";
import useDataFetcher from "@/app/_hooks/useDataFetcher";
import {
  GET_ALL_PROMPTS_API_ENDPOINT,
  GET_ALL_TEST_CASES_API_ENDPOINT,
  GET_ALL_TESTS_API_ENDPOINT,
} from "@/firebase";

import {
  PromptCandidate,
  PromptTestResults,
  TestCase,
  TestCaseResult,
  TestResultsStatus
} from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";
import { getPromptTestResultsStatus } from "../../../../shared/utils/statusUtils";

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Loader,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";

interface ResultsProps {
    isUpdating: boolean;
    setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  }

const ResultsHelper: React.FC<ResultsProps> = ( {isUpdating, setIsUpdating} ) => {
  const [results, isResultsLoading] = useDataFetcher<PromptTestResults>({
    apiEndpoint: GET_ALL_TESTS_API_ENDPOINT,
    sortByProperty: "dateCreatedUtc",
  });
  const [prompts, isPromptsLoading] = useDataFetcher<PromptCandidate>({
    apiEndpoint: GET_ALL_PROMPTS_API_ENDPOINT,
    sortByProperty: "dateCreatedUtc",
  });
  const [testCases, isTestCasesLoading] = useDataFetcher<TestCase>({
    apiEndpoint: GET_ALL_TEST_CASES_API_ENDPOINT,
    sortByProperty: "dateCreatedUtc",
  });
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

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

    const average = scores.reduce((acc, score) => acc + score, 0) / scores.length;
    return parseFloat(average.toFixed(3));
  }

  function prepareLabel(test: PromptTestResults): JSX.Element {
    // Get the dateTime
    const dateTime = test.dateCreatedUtc
      ? unixTimestampToDateString(test.dateCreatedUtc)
      : test.id ?? "ERROR displaying test date";
    // Get the promptName
    const promptName = test.promptName;
    if (!promptName) {
      // Render without promptName
      return (
        <Box>
          <Text lineClamp={3}>{dateTime}</Text>
        </Box>
      );
    }
    // Render with promptName available
    return (
      <Box>
        <Text>{promptName}</Text>
        <Text lineClamp={3}>{dateTime}</Text>
      </Box>
    );
  }

  return (
    <ListDetailView
      title="Results"
      subtitle="Data does not update in real-time. Refresh the page to see the latest results."
      data={results}
      isUpdating={isUpdating}
      setIsUpdating={setIsUpdating}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      isDataLoading={isResultsLoading || isPromptsLoading || isTestCasesLoading}
      ItemDetails={(test) => (
        <ResultsDetails
          item={test}
          prompts={prompts ?? []}
          testCases={testCases ?? []}
          setIsUpdating={() => {}}
        />
      )}
      getLabel={(test) => prepareLabel(test)}
      getDescription={(test) => getPromptTestResultsStatus(test)}
      getScore={(test) => calculateAverageCosineSimilarityScore(test.testCaseResults)}
    />
  );
};

export default ResultsHelper;

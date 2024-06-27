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
      getLabel={(test) =>
        test.dateCreatedUtc
          ? unixTimestampToDateString(test.dateCreatedUtc)
          : test.id ?? "ERROR displaying test date"
      }
      getDescription={(test) => getPromptTestResultsStatus(test)}
      getScore={(test) => calculateAverageCosineSimilarityScore(test.testCaseResults)}
    />
  );
};

export default ResultsHelper;

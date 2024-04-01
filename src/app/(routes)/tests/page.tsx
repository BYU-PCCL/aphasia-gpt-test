"use client";

import ListDetailView from "@/app/_components/ListDetailView";
import TestDetails from "@/app/_components/Tests/TestDetails";
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
} from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";

const Tests: React.FC = () => {
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

  return (
    <ListDetailView
      title="Tests"
      data={results}
      isDataLoading={isResultsLoading && isPromptsLoading && isTestCasesLoading}
      ItemDetails={(test) => (
        <TestDetails
          item={test}
          prompts={prompts ?? []}
          testCases={testCases ?? []}
        />
      )}
      getLabel={(test) => test.id ?? test.promptId}
      getDescription={(test) =>
        test.dateCreatedUtc
          ? unixTimestampToDateString(test.dateCreatedUtc)
          : ""
      }
    />
  );
};

export default Tests;

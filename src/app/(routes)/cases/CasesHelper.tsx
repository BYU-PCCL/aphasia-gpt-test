// CasesHelper.tsx
import React from "react";
import TestCaseDetails from "@/app/_components/Cases/TestCaseDetails";
import TestCaseEdit from "@/app/_components/Cases/TestCaseEdit";
import ListDetailView from "@/app/_components/ListDetailView";
import useDataFetcher from "@/app/_hooks/useDataFetcher";
import { GET_ALL_TEST_CASES_API_ENDPOINT } from "@/firebase";

import { TestCase } from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";

interface CasesProps {
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}

const CasesHelper: React.FC<CasesProps> = ({ isUpdating, setIsUpdating }) => {
  const [data, isDataLoading] = useDataFetcher<TestCase>({
    apiEndpoint: GET_ALL_TEST_CASES_API_ENDPOINT,
    sortByProperty: "dateCreatedUtc",
  });

  return (
    <ListDetailView
      title="Test Cases"
      data={data}
      isDataLoading={isDataLoading}
      isUpdating={isUpdating}
      setIsUpdating={setIsUpdating}
      ItemEdit={TestCaseEdit}
      ItemDetails={(testCase) => <TestCaseDetails item={testCase} setIsUpdating={setIsUpdating} isUpdating={isUpdating} />}
      getLabel={(testCase) => testCase.utterance}
      getDescription={(testCase) =>
        testCase.dateCreatedUtc
          ? unixTimestampToDateString(testCase.dateCreatedUtc)
          : ""
      }
    />
  );
};

export default CasesHelper;

"use client";
import TestCaseDetails from "@/app/_components/Cases/TestCaseDetails";
import TestCaseEdit from "@/app/_components/Cases/TestCaseEdit";
import ListDetailView from "@/app/_components/ListDetailView";
import { GET_ALL_TEST_CASES_API_ENDPOINT } from "@/firebase";

import { unixTimestampToDateString } from "../../../../shared/utils";

const Cases: React.FC = () => {
  return (
    <ListDetailView
      title="Test Cases"
      ItemEdit={TestCaseEdit}
      ItemDetails={TestCaseDetails}
      apiEndpoint={GET_ALL_TEST_CASES_API_ENDPOINT}
      getLabel={(testCase) => testCase.utterance}
      getDescription={(testCase) =>
        testCase.dateCreatedUtc
          ? unixTimestampToDateString(testCase.dateCreatedUtc)
          : ""
      }
    />
  );
};

export default Cases;

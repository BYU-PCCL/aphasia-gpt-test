"use client";

import ListDetailView from "@/app/_components/ListDetailView";
import TestDetails from "@/app/_components/Tests/TestDetails";
import { GET_ALL_TESTS_API_ENDPOINT } from "@/firebase";

import { unixTimestampToDateString } from "../../../../shared/utils";

const Tests: React.FC = () => {
  return (
    <ListDetailView
      title="Tests"
      ItemDetails={TestDetails}
      apiEndpoint={GET_ALL_TESTS_API_ENDPOINT}
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

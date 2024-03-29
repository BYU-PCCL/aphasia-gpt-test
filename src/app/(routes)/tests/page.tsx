"use client";

import ListDetailView from "@/app/_components/ListDetailView";
import TestDetails from "@/app/_components/Tests/TestDetails";
import { GET_ALL_TESTS_API_ENDPOINT } from "@/firebase";

const Tests: React.FC = () => {
  return (
    <ListDetailView
      title="Tests"
      ItemDetails={TestDetails}
      apiEndpoint={GET_ALL_TESTS_API_ENDPOINT}
      getLabel={(test) => test.id ?? test.promptId}
      getDescription={(test) => test.id ?? test.promptId}
    />
  );
};

export default Tests;

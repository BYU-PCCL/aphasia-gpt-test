// CasesHelper.tsx
import React from "react";
import { useState } from "react";
import TestCaseDetails from "@/app/_components/Cases/TestCaseDetails";
import TestCaseEdit from "@/app/_components/Cases/TestCaseEdit";
import ListDetailView from "@/app/_components/ListDetailView";
import useDataFetcher from "@/app/_hooks/useDataFetcher";
import { GET_ALL_TEST_CASES_API_ENDPOINT } from "@/firebase";

import { TestCase } from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";

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

interface CasesProps {
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}

const CasesHelper: React.FC<CasesProps> = ({ isUpdating, setIsUpdating }) => {
  const [data, isDataLoading] = useDataFetcher<TestCase>({
    apiEndpoint: GET_ALL_TEST_CASES_API_ENDPOINT,
    sortByProperty: "dateCreatedUtc",
  });
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  return (
    <ListDetailView
      title="Test Cases"
      data={data}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      isDataLoading={isDataLoading}
      isUpdating={isUpdating}
      setIsUpdating={setIsUpdating}
      ItemEdit={TestCaseEdit}
      ItemDetails={(testCase) => <TestCaseDetails
        item={testCase}
        setIsUpdating={setIsUpdating} />}
      // getLabel={(testCase) => testCase.utterance}
      getLabel={(testCase) => (
        <Box>
          <Text lineClamp={3}>{testCase.utterance}</Text>
        </Box>
      )}
      getDescription={(testCase) =>
        testCase.dateCreatedUtc
          ? unixTimestampToDateString(testCase.dateCreatedUtc)
          : ""
      }
    />
  );
};

export default CasesHelper;

"use client";
import ListDetailView from "@/app/_components/ListDetailView";
import PromptDetails from "@/app/_components/Prompts/PromptDetails";
import PromptEdit from "@/app/_components/Prompts/PromptEdit";
import useDataFetcher from "@/app/_hooks/useDataFetcher";
import { GET_ALL_PROMPTS_API_ENDPOINT } from "@/firebase";

import { PromptCandidate } from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";

const Prompts: React.FC = () => {
  const [data, isDataLoading] = useDataFetcher<PromptCandidate>({
    apiEndpoint: GET_ALL_PROMPTS_API_ENDPOINT,
    sortByProperty: "dateCreatedUtc",
  });

  return (
    <ListDetailView
      title="Prompts"
      data={data}
      isDataLoading={isDataLoading}
      ItemEdit={PromptEdit}
      ItemDetails={(prompt) => <PromptDetails item={prompt} />}
      getLabel={(prompt) => prompt.prompt}
      getDescription={(prompt) =>
        prompt.dateCreatedUtc
          ? unixTimestampToDateString(prompt.dateCreatedUtc)
          : ""
      }
    />
  );
};

export default Prompts;

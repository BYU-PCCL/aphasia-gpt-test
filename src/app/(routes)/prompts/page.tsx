"use client";
import ListDetailView from "@/app/_components/ListDetailView";
import PromptDetails from "@/app/_components/Prompts/PromptDetails";
import PromptEdit from "@/app/_components/Prompts/PromptEdit";
import { GET_ALL_PROMPTS_API_ENDPOINT } from "@/firebase";

import {
  getUnixTimestamp,
  unixTimestampToDateString,
} from "../../../../shared/utils";

const Prompts: React.FC = () => {
  return (
    <ListDetailView
      title="Prompts"
      ItemEdit={PromptEdit}
      ItemDetails={PromptDetails}
      apiEndpoint={GET_ALL_PROMPTS_API_ENDPOINT}
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

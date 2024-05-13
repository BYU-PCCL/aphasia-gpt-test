// CasesHelper.tsx
import React from "react";
import ListDetailView from "@/app/_components/ListDetailView";
import useDataFetcher from "@/app/_hooks/useDataFetcher";
import PromptDetails from "@/app/_components/Prompts/PromptDetails";
import PromptEdit from "@/app/_components/Prompts/PromptEdit";
import { GET_ALL_PROMPTS_API_ENDPOINT } from "@/firebase";

import { PromptCandidate } from "../../../../shared/types";
import { unixTimestampToDateString } from "../../../../shared/utils";

interface PromptsProps {
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}

const PromptsHelper: React.FC<PromptsProps> = ( {isUpdating, setIsUpdating} ) => {
    const [data, isDataLoading] = useDataFetcher<PromptCandidate>({
        apiEndpoint: GET_ALL_PROMPTS_API_ENDPOINT,
        sortByProperty: "dateCreatedUtc",
    });

    return (
        <ListDetailView
        title="Prompts"
        data={data}
        isDataLoading={isDataLoading}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        ItemEdit={PromptEdit}
        ItemDetails={(prompt) => <PromptDetails item={prompt} setIsUpdating={setIsUpdating} isUpdating={isUpdating} />}
        getLabel={(prompt) => prompt.prompt}
        getDescription={(prompt) =>
            prompt.dateCreatedUtc
            ? unixTimestampToDateString(prompt.dateCreatedUtc)
            : ""
        }
        />
    );
};

export default PromptsHelper;

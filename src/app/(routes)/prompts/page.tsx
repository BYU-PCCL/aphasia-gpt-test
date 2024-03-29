"use client";
import ListDetailView from "@/app/_components/ListDetailView";
import PromptDetails from "@/app/_components/Prompts/PromptDetails";
import PromptEdit from "@/app/_components/Prompts/PromptEdit";
import { GET_ALL_PROMPTS_API_ENDPOINT } from "@/firebase";

const Prompts: React.FC = () => {
  return (
    <ListDetailView
      title="Prompts"
      ItemEdit={PromptEdit}
      ItemDetails={PromptDetails}
      apiEndpoint={GET_ALL_PROMPTS_API_ENDPOINT}
      getLabel={(prompt) => prompt.id ?? prompt.prompt}
      getDescription={(prompt) => prompt.id ?? prompt.prompt}
    />
  );
};

export default Prompts;

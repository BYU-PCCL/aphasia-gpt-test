import { SET_PROMPT_API_ENDPOINT } from "@/firebase";
import { Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

import { encodedPromptParams, PromptCandidate } from "../../../../shared/types";
import ItemEdit from "../ItemEdit";
import { ItemEditProps } from "../ListDetailView";

type FormReturnType = {
  prompt: string;
};

const PromptEdit: React.FC<ItemEditProps<PromptCandidate>> = ({
  item: prompt = null,
  closeEdit,
}) => {
  const form = useForm({
    initialValues: {
      prompt: prompt?.prompt ?? "",
    } as FormReturnType,
    validate: {
      prompt: (value) => {
        if (!value.trim()) {
          return "Prompt is required";
        }
        const missingParams: string[] = [];
        encodedPromptParams.forEach((param) => {
          if (!value.includes(param)) {
            missingParams.push(param);
          }
        });
        return missingParams.length > 0
          ? `Missing parameters: ${missingParams.join(", ")}`
          : null;
      },
    },
    validateInputOnBlur: true,
  });

  const formatItemToSave = (formValues: FormReturnType) => ({
    prompt: formValues.prompt,
  });

  return (
    <ItemEdit
      closeEdit={closeEdit}
      apiEndpoint={SET_PROMPT_API_ENDPOINT}
      form={form}
      formatItemToSave={formatItemToSave}
    >
      {(form) => (
        <>
          <Textarea
            label="Prompt"
            description={`Prompt template must use the following parameters: ${encodedPromptParams.join(
              ", "
            )}`}
            placeholder="Enter your prompt here"
            withAsterisk
            minRows={10}
            maxRows={20}
            autosize
            {...form.getInputProps("prompt")}
          />
        </>
      )}
    </ItemEdit>
  );
};

export default PromptEdit;

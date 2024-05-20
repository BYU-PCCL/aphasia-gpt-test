import { SET_PROMPT_API_ENDPOINT, UPDATE_PROMPT_API_ENDPOINT } from "@/firebase";
import {
  Flex,
  Group,
  List,
  ListItem,
  Paper,
  rem,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleDashed,
} from "@tabler/icons-react";

import {
  encodedOptionalPromptParams,
  encodedRequiredPromptParams,
  PromptCandidate,
} from "../../../../shared/types";
import ItemEdit from "../ItemEdit";
import { ItemEditProps } from "../ListDetailView";

type FormReturnType = {
  prompt: string;
};

const PromptEdit: React.FC<ItemEditProps<PromptCandidate>> = ({
  item: prompt = null,
  closeEdit,
  isUpdating,
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
        encodedRequiredPromptParams.forEach((param) => {
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
    id: prompt?.id,
  });

  const checkedIfIncludedList = (params: string[]) => (
    <List withPadding size="sm" center>
      <Flex wrap="wrap">
        {params.map((param) => (
          <ListItem
            key={param}
            w="50%"
            icon={
              form.values.prompt.includes(param) ? (
                <IconCircleCheck style={{ width: rem(20), height: rem(20) }} />
              ) : (
                <IconCircleDashed style={{ width: rem(20), height: rem(20) }} />
              )
            }
          >
            {param}
          </ListItem>
        ))}
      </Flex>
    </List>
  );

  const parameterUsage = (
    <Stack gap={1}>
      <Text fw={700} size="sm">
        Required Parameters
      </Text>
      {checkedIfIncludedList(encodedRequiredPromptParams)}
      <Text fw={700} size="sm">
        Optional Parameters
      </Text>
      {checkedIfIncludedList(encodedOptionalPromptParams)}
    </Stack>
  );

  return (
    <ItemEdit
      closeEdit={closeEdit}
      apiEndpoint={isUpdating ? UPDATE_PROMPT_API_ENDPOINT : SET_PROMPT_API_ENDPOINT}
      title="Prompt"
      form={form}
      formatItemToSave={formatItemToSave}
    >
      {(form) => (
        <>
          {parameterUsage}
          <Textarea
            label="Prompt"
            placeholder="Enter your prompt here"
            withAsterisk
            minRows={10}
            maxRows={20}
            autosize
            {...form.getInputProps("prompt")}
          />
          <Paper radius="md" p="md" withBorder>
            <Group align="center" wrap="nowrap">
              <IconAlertTriangle color="orange" />
              <Text>
                When writing a prompt, consider the following regarding LLM
                response processing:
              </Text>
            </Group>
            <List pl="lg">
              <ListItem>
                Only 1 response is explicitly requested from the LLM in the API
                request, so the prompt itself should elicit multiple
                completions.
              </ListItem>
              <ListItem>
                Newlines (&quot;\n&quot;) separate completions
              </ListItem>
              <ListItem>
                Completions are stripped of any quote characters (single or
                double)
              </ListItem>
              <ListItem>
                &quot;Prediction n: &quot; prefixes are removed from completions
                (where &quot;n&quot; is a number)
              </ListItem>
            </List>
          </Paper>
        </>
      )}
    </ItemEdit>
  );
};

export default PromptEdit;

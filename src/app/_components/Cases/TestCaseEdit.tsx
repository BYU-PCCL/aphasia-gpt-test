"use client";

import React from "react";

import { SET_TEST_CASE_API_ENDPOINT } from "@/firebase";
import { Fieldset, Textarea, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

import { TestCase } from "../../../../shared/types";
import ItemEdit from "../ItemEdit";
import { ItemEditProps } from "../ListDetailView";

type FormReturnType = {
  goodCompletions: string;
  utterance: string;
  setting: string;
  tone: string;
  conversationType: string;
  name: string;
  age: string;
  aboutMe: string;
};

const TestCaseEdit: React.FC<ItemEditProps<TestCase>> = ({
  item: testCase = null,
  closeEdit,
}) => {
  const form = useForm({
    initialValues: {
      goodCompletions: testCase?.goodCompletions.join("\n") ?? "",
      utterance: testCase?.utterance ?? "",
      setting: testCase?.context?.setting ?? "",
      tone: testCase?.context?.tone ?? "",
      conversationType: testCase?.context?.conversationType ?? "",
      name: testCase?.bio?.name ?? "",
      age: testCase?.bio?.age.toString() ?? "",
      aboutMe: testCase?.bio?.aboutMe ?? "",
    } as FormReturnType,
    validate: {
      utterance: isNotEmpty("Utterance is required"),
      goodCompletions: isNotEmpty("Good completions are required"),
      setting: isNotEmpty("Setting is required"),
      tone: isNotEmpty("Tone is required"),
      conversationType: isNotEmpty("Conversation type is required"),
      name: isNotEmpty("Name is required"),
      age: (value) => {
        if (!value.trim()) {
          return "Age is required";
        }
        const age = parseInt(value);
        if (isNaN(age) || age < 0) {
          return "Age must be a nonnegative number";
        }
        return null;
      },
      aboutMe: isNotEmpty("About me is required"),
    },
    transformValues: (values: FormReturnType) => ({
      ...values,
      goodCompletions: values.goodCompletions.split("\n"),
      age: parseInt(values.age),
    }),
    validateInputOnBlur: true,
  });

  const formatItemToSave = (values: FormReturnType) => ({
    id: testCase?.id,
    utterance: values.utterance,
    context: {
      setting: values.setting,
      tone: values.tone,
      conversationType: values.conversationType,
    },
    bio: {
      name: values.name,
      age: values.age,
      aboutMe: values.aboutMe,
    },
    goodCompletions: values.goodCompletions,
  });

  return (
    <ItemEdit
      closeEdit={closeEdit}
      apiEndpoint={SET_TEST_CASE_API_ENDPOINT}
      form={form}
      formatItemToSave={formatItemToSave}
    >
      {(form) => (
        <>
          <Fieldset legend="Speech">
            <TextInput label="Utterance" {...form.getInputProps("utterance")} />
            <Textarea
              label="Good Completions (one per line)"
              autosize
              minRows={3}
              maxRows={6}
              {...form.getInputProps("goodCompletions")}
            />
          </Fieldset>
          <Fieldset legend="Context">
            <TextInput label="Setting" {...form.getInputProps("setting")} />
            <TextInput label="Tone" {...form.getInputProps("tone")} />
            <TextInput
              label="Conversation Type"
              {...form.getInputProps("conversationType")}
            />
          </Fieldset>
          <Fieldset legend="Bio">
            <TextInput label="Name" {...form.getInputProps("name")} />
            <TextInput
              label="Age"
              type="number"
              {...form.getInputProps("age")}
            />
            <Textarea
              label="About Me"
              autosize
              minRows={3}
              maxRows={6}
              {...form.getInputProps("aboutMe")}
            />
          </Fieldset>
        </>
      )}
    </ItemEdit>
  );
};

// const TestCaseEdit2: React.FC<ItemEditProps<TestCase>> = ({
//   item: testCase = null,
//   closeEdit,
// }) => {
//   const [keepValues, setKeepValues] = useState(false);
//   const [addAnother, setAddAnother] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [ifSaved, setIfSaved] = useState(false);

//   const form = useForm({
//     initialValues: {
//       goodCompletions: testCase?.goodCompletions.join("\n") ?? "",
//       utterance: testCase?.utterance ?? "",
//       setting: testCase?.context?.setting ?? "",
//       tone: testCase?.context?.tone ?? "",
//       conversationType: testCase?.context?.conversationType ?? "",
//       name: testCase?.bio?.name ?? "",
//       age: testCase?.bio?.age.toString() ?? "",
//       aboutMe: testCase?.bio?.aboutMe ?? "",
//     },
//     validate: {
//       utterance: isNotEmpty("Utterance is required"),
//       goodCompletions: isNotEmpty("Good completions are required"),
//       setting: isNotEmpty("Setting is required"),
//       tone: isNotEmpty("Tone is required"),
//       conversationType: isNotEmpty("Conversation type is required"),
//       name: isNotEmpty("Name is required"),
//       age: (value) => {
//         if (!value.trim()) {
//           return "Age is required";
//         }
//         const age = parseInt(value);
//         if (isNaN(age) || age < 0) {
//           return "Age must be a nonnegative number";
//         }
//         return null;
//       },
//       aboutMe: isNotEmpty("About me is required"),
//     },
//     validateInputOnBlur: true,
//     transformValues: (values) => ({
//       ...values,
//       goodCompletions: values.goodCompletions.split("\n"),
//       age: parseInt(values.age),
//     }),
//   });

//   const handleOnSubmit = async () => {
//     setIsLoading(true);
//     const formValues = form.getTransformedValues();
//     const testCaseDraftToSave: TestCase = {
//       id: testCase?.id,
//       utterance: formValues.utterance,
//       context: {
//         setting: formValues.setting,
//         tone: formValues.tone,
//         conversationType: formValues.conversationType,
//       },
//       bio: {
//         name: formValues.name,
//         age: formValues.age,
//         aboutMe: formValues.aboutMe,
//       },
//       goodCompletions: formValues.goodCompletions,
//     };
//     await setTestCase(testCaseDraftToSave);
//     if (addAnother) {
//       if (!keepValues) {
//         form.reset();
//       }
//     } else {
//       closeEdit();
//     }
//     setIfSaved(true);
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     if (ifSaved) {
//       const timeout = setTimeout(() => {
//         setIfSaved(false);
//       }, 3000);
//       return () => clearTimeout(timeout);
//     }
//   }, [ifSaved]);

//   return (
//     <form onSubmit={form.onSubmit(handleOnSubmit)}>
//       <Stack>
//         <Fieldset legend="Speech">
//           <TextInput label="Utterance" {...form.getInputProps("utterance")} />
//           <Textarea
//             label="Good Completions (one per line)"
//             autosize
//             minRows={3}
//             maxRows={6}
//             {...form.getInputProps("goodCompletions")}
//           />
//         </Fieldset>
//         <Fieldset legend="Context">
//           <TextInput label="Setting" {...form.getInputProps("setting")} />
//           <TextInput label="Tone" {...form.getInputProps("tone")} />
//           <TextInput
//             label="Conversation Type"
//             {...form.getInputProps("conversationType")}
//           />
//         </Fieldset>
//         <Fieldset legend="Bio">
//           <TextInput label="Name" {...form.getInputProps("name")} />
//           <TextInput label="Age" type="number" {...form.getInputProps("age")} />
//           <Textarea
//             label="About Me"
//             autosize
//             minRows={3}
//             maxRows={6}
//             {...form.getInputProps("aboutMe")}
//           />
//         </Fieldset>
//         <Group justify="space-between" align="center">
//           <Group>
//             <Checkbox
//               label="Add another after save"
//               checked={addAnother}
//               onChange={(event) => setAddAnother(event.currentTarget.checked)}
//             />
//             {addAnother && (
//               <Checkbox
//                 label="Keep values"
//                 checked={keepValues}
//                 onChange={(event) => setKeepValues(event.currentTarget.checked)}
//               />
//             )}
//           </Group>
//           {ifSaved && (
//             <Text c="green" size="sm">
//               Saved!
//             </Text>
//           )}
//         </Group>
//         <Group grow>
//           <Button onClick={closeEdit} variant="outline">
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             onClick={handleOnSubmit}
//             loading={isLoading}
//             disabled={!form.isValid()}
//           >
//             Save
//           </Button>
//         </Group>
//       </Stack>
//     </form>
//   );
// };

export default TestCaseEdit;

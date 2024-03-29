import React, { useEffect, useState } from "react";

import { Button, Checkbox, Group, Stack, Text } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";

interface ItemEditProps<T, FormReturnType> {
  closeEdit: () => void;
  apiEndpoint: string;
  form: UseFormReturnType<FormReturnType>;
  formatItemToSave: (formValues: FormReturnType) => T;
  children: (form: UseFormReturnType<FormReturnType>) => React.ReactNode;
}

const ItemEdit: React.FC<ItemEditProps<any, any>> = ({
  closeEdit,
  apiEndpoint,
  form,
  formatItemToSave,
  children,
}) => {
  const [keepValues, setKeepValues] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ifSaved, setIfSaved] = useState(false);

  const saveItem = async (itemToSave: any) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToSave),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOnSubmit = async () => {
    setIsLoading(true);
    const formValues = form.getTransformedValues();
    const itemToSave = formatItemToSave(formValues);
    await saveItem(itemToSave);
    if (addAnother) {
      if (!keepValues) {
        form.reset();
      }
    } else {
      closeEdit();
    }
    setIfSaved(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (ifSaved) {
      const timeout = setTimeout(() => {
        setIfSaved(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [ifSaved]);

  return (
    <form onSubmit={form.onSubmit(handleOnSubmit)}>
      <Stack>
        {children(form)}
        <Group justify="space-between" align="center">
          <Group>
            <Checkbox
              label="Add another after save"
              checked={addAnother}
              onChange={(event) => setAddAnother(event.currentTarget.checked)}
            />
            {addAnother && (
              <Checkbox
                label="Keep values"
                checked={keepValues}
                onChange={(event) => setKeepValues(event.currentTarget.checked)}
              />
            )}
          </Group>
          {ifSaved && (
            <Text c="green" size="sm">
              Saved!
            </Text>
          )}
        </Group>
        <Group grow>
          <Button onClick={closeEdit} variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleOnSubmit}
            loading={isLoading}
            disabled={!form.isValid()}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ItemEdit;

import React, { useState } from "react";

import { Button, Checkbox, Group, Stack, Title } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";

interface ItemEditProps<T, FormReturnType> {
  closeEdit: () => void;
  apiEndpoint: string;
  title: string;
  form: UseFormReturnType<FormReturnType>;
  formatItemToSave: (formValues: FormReturnType) => T;
  children: (form: UseFormReturnType<FormReturnType>) => React.ReactNode;
}

const ItemEdit: React.FC<ItemEditProps<any, any>> = ({
  closeEdit,
  apiEndpoint,
  title,
  form,
  formatItemToSave,
  children,
}) => {
  const [keepValues, setKeepValues] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Save the item using the API endpoint.
   * @param itemToSave
   * @returns True if the save was successful, false otherwise.
   */
  const saveItem = async (itemToSave: any): Promise<boolean> => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToSave),
      });

      if (!response.ok) {
        notifications.show({
          title: `Save failed due to HTTP error: ${response.status} - ${response.statusText}`,
          message: `Error: ${await response.json()}`,
          color: "red",
        });
        console.error("HTTP error:", response.status);
        return false;
      }

      notifications.show({
        title: "Save successful",
        message: "The item was saved successfully.",
        color: "teal",
      });
      return true;
    } catch (error) {
      notifications.show({
        title: "Save failed",
        message: (error as Error).message ?? "An unknown error occurred.",
        color: "red",
      });
      console.error("Error:", error);
      return false;
    }
  };

  const handleOnSubmit = async () => {
    setIsLoading(true);
    const formValues = form.getTransformedValues();
    const itemToSave = formatItemToSave(formValues);
    const isSaveSuccessful = await saveItem(itemToSave);
    if (isSaveSuccessful) {
      if (addAnother) {
        if (!keepValues) {
          form.reset();
        }
      } else {
        closeEdit();
      }
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleOnSubmit)}>
      <Title order={3} mb="sm">
        {title}
      </Title>
      <Stack>
        {children(form)}
        <Group align="center">
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

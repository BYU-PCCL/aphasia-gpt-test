// ListDetailView.tsx
import { useEffect, useState } from "react";

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

export type ItemEditProps<T> = {
  item?: T;
  closeEdit: () => void;
};

export type ItemDetailsProps<T> = {
  item: T;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
};

interface ListDetailViewProps<T> {
  title: string;
  subtitle?: string;
  data: T[] | null;
  selectedItem: T | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<T | null>>;
  isDataLoading: boolean;
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  ItemEdit?: React.FC<ItemEditProps<T>>;
  ItemDetails: (item: T) => React.ReactNode;
  getLabel: (item: T) => string;
  getDescription: (item: T) => string;
}

const ListDetailView = <T,>({
  title,
  subtitle,
  data,
  selectedItem,
  setSelectedItem,
  isDataLoading,
  isUpdating,
  setIsUpdating,
  ItemEdit: EditComponent,
  ItemDetails: CardComponent,
  getLabel,
  getDescription,
}: ListDetailViewProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!selectedItem) {
      setSelectedItem(data?.[0] ?? null);
    }
  }, [data, selectedItem]);

  const stopAllEditing = () => {
    setIsEditing(false);
    setIsUpdating(false);
  }

  return (
    <Flex h="100%" direction={{ base: "column", sm: "row" }} gap={30}>
      {isEditing || isUpdating ? (
        EditComponent && (
          <Container size="lg" w={400}>
            <EditComponent item={selectedItem as T} closeEdit={() => stopAllEditing()} />
          </Container>
        )
      ) : (
        <>
          <Stack
            gap={0}
            h={{ base: "50%", sm: "100%" }}
            w={{ base: "100%", sm: "33%", md: "25%" }}
            px={0}
          >
            <Box mb="sm">
              <Title order={1}>{title}</Title>
              <Text>{subtitle}</Text>
            </Box>
            {EditComponent && (
              <Button onClick={() => setIsEditing(true)} mb="sm">
                Add
              </Button>
            )}
            <ScrollArea>
              <Stack gap={0}>
                {data && data.length > 0 && (
                  <>
                    {data.map((item, index) => (
                      <NavLink
                        key={index}
                        onClick={() => setSelectedItem(item)}
                        active={selectedItem === item}
                        label={<Text lineClamp={3}>{getLabel(item)}</Text>}
                        description={getDescription(item)}
                      />
                    ))}
                  </>
                )}
              </Stack>
            </ScrollArea>
          </Stack>
          <ScrollArea
            h={{ base: "50%", sm: "100%" }}
            w={{ base: "100%", sm: "67%", md: "75%" }}
          >
            {isDataLoading ? (
              <Center>
                <Loader size="xl" />
              </Center>
            ) : selectedItem ? (
              <Paper withBorder p="md" h="100%">
                {CardComponent(selectedItem)}
              </Paper>
            ) : (
              <Title order={5}>Select an item to view its details</Title>
            )}
          </ScrollArea>
        </>
      )}
    </Flex>
  );
};

export default ListDetailView;

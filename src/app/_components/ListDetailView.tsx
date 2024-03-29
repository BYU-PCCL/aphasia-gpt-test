import { get } from "http";
import { useEffect, useState } from "react";

import {
  Button,
  Center,
  Container,
  Flex,
  Loader,
  NavLink,
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
};

interface ListDetailViewProps<T> {
  title: string;
  ItemEdit?: React.FC<ItemEditProps<T>>;
  ItemDetails: React.FC<ItemDetailsProps<T>>;
  apiEndpoint: string;
  getLabel: (item: T) => string;
  getDescription: (item: T) => string;
}

const ListDetailView = <T,>({
  title,
  ItemEdit: EditComponent,
  ItemDetails: CardComponent,
  apiEndpoint,
  getLabel,
  getDescription,
}: ListDetailViewProps<T>) => {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
          throw new Error(
            `Error fetching data: HTTP status of ${response.status}`
          );
        }
        const data = await response.json();
        if (isMounted) {
          setData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoadingError(`Error fetching data: ${error}`);
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiEndpoint]);

  useEffect(() => {
    if (!selectedItem) {
      setSelectedItem(data?.[0] ?? null);
    }
  }, [data, selectedItem]);

  return (
    <Flex h="100%" direction={{ base: "column", sm: "row" }} gap={30}>
      {isEditing ? (
        EditComponent && (
          <Container size="xs">
            <EditComponent closeEdit={() => setIsEditing(false)} />
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
            <Title order={1} mb="sm">
              {title}
            </Title>
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
            {isLoading ? (
              <Center>
                <Loader size="xl" />
              </Center>
            ) : loadingError ? (
              <Text c="red" ta="center">
                {loadingError}
              </Text>
            ) : selectedItem ? (
              <CardComponent item={selectedItem} />
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

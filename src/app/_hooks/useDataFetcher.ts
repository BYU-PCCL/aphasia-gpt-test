import { useEffect, useState } from "react";

import { notifications } from "@mantine/notifications";

interface FetchResultProps<T> {
  apiEndpoint: string;
  sortByProperty: keyof T;
}

const useDataFetcher = <T>({
  apiEndpoint,
  sortByProperty,
}: FetchResultProps<T>): [T[] | null, boolean] => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
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
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        notifications.show({
          title: "Error fetching data",
          message: errorMessage,
          color: "red",
        });
        setLoading(false);
        return;
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiEndpoint]);

  if (data) {
    data.sort((a: any, b: any) => {
      if (a[sortByProperty] > b[sortByProperty]) {
        return -1;
      }
      if (a[sortByProperty] < b[sortByProperty]) {
        return 1;
      }
      return 0;
    });
  }

  return [data, loading];
};

export default useDataFetcher;

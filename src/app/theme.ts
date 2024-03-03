import { createTheme } from "@mantine/core";

export const theme = createTheme({
  /* Mantine UI theme overrides */
  defaultRadius: "md",
  primaryColor: "byu-navy",
  colors: {
    "byu-navy": [
      "#99ABBE",
      "#8097AE",
      "#66829E",
      "#4D6D8E",
      "#33587D",
      "#1A436D",
      "#002E5D", // Base color - 700 (see https://brand.byu.edu/web-colors)
      "#002954",
      "#00254A",
      "#002041",
    ],
  },
});

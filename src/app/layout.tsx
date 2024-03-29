import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { headers } from "next/headers";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import AppHeader from "./_components/AppHeader";
import { theme } from "./theme";

export const metadata: Metadata = {
  title: "AphasiaGPT Test",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathnameOnLoad = headers().get("x-pathname") || ""; // Custom header from middleware

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <AppShell header={{ height: 60 }} padding="md">
            <AppShellHeader px="sm">
              <AppHeader initialPathname={pathnameOnLoad} />
            </AppShellHeader>
            <AppShellMain h={"100dvh"}>{children}</AppShellMain>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;

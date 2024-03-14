import type { Metadata } from "next";
import { headers } from "next/headers";
import "@mantine/core/styles.css";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  MantineProvider,
} from "@mantine/core";
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

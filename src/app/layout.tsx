import type { Metadata } from "next";
import "@mantine/core/styles.css";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Button,
  ColorSchemeScript,
  Group,
  MantineProvider,
} from "@mantine/core";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AphasiaGPT Test",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AppShell header={{ height: 60 }} padding="md">
            <AppShellHeader px="sm">
              <Group h="100%" gap="md" style={{ flex: 1 }}>
                <Button component={Link} href="/cases">
                  Cases
                </Button>
                <Button component={Link} href="/experiments">
                  Tests
                </Button>
              </Group>
            </AppShellHeader>
            <AppShellMain>{children}</AppShellMain>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;

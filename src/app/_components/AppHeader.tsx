"use client";

import { Group, Title, Button } from "@mantine/core";
import Link from "next/link";
import React, { useState } from "react";

type AppHeaderProps = {
  initialPathname: string;
};

const AppHeader: React.FC<AppHeaderProps> = ({ initialPathname }) => {
  const [currentPathname, setCurrentPathname] = useState(initialPathname);

  return (
    <Group h="100%" gap="md" style={{ flex: 1 }}>
      <Title order={3}>AphasiaGPT Prompt Testing</Title>
      <HeaderLink
        pathname="/cases"
        label="Cases"
        currentPathnameState={{ currentPathname, setCurrentPathname }}
      />
      <HeaderLink
        pathname="/experiments"
        label="Tests"
        currentPathnameState={{ currentPathname, setCurrentPathname }}
      />
    </Group>
  );
};

type HeaderLinkProps = {
  pathname: string;
  label: string;
  currentPathnameState: {
    currentPathname: string;
    setCurrentPathname: (pathname: string) => void;
  };
};

const HeaderLink: React.FC<HeaderLinkProps> = ({
  pathname,
  label,
  currentPathnameState: { currentPathname, setCurrentPathname },
}) => {
  return (
    <Button
      component={Link}
      href={pathname}
      variant={currentPathname === pathname ? "light" : "subtle"}
      onClick={() => setCurrentPathname(pathname)}
    >
      {label}
    </Button>
  );
};

export default AppHeader;

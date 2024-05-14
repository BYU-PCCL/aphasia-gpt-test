// UpdateButton.tsx
import React from "react";
import { Button } from "@mantine/core";

import { IconEdit } from "@tabler/icons-react";

interface UpdateButtonProps {
  onClick: () => void;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick }) => {
  return (
    <Button
        onClick={onClick}
        leftSection={<IconEdit />}
        color="blue">
      Edit
    </Button>
  );
};

export default UpdateButton;

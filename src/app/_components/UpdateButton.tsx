// UpdateButton.tsx
import React from "react";
import { Button } from "@mantine/core";

import { IconEdit } from "@tabler/icons-react";

interface UpdateButtonProps {
  onClick: () => void;
  isUpdating: boolean;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick, isUpdating }) => {
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

// create PromptText component
import React from "react";

import { Text } from "@mantine/core";

import { encodedPromptParams, PromptCandidate } from "../../../shared/types";

interface Props {
  prompt: PromptCandidate;
}

const PromptText: React.FC<Props> = ({ prompt }) => {
  return prompt.prompt.split("\n").map((line, i) => {
    return (
      <span key={i}>
        {line.split(" ").map((word, j) => {
          return (
            <Text
              key={j}
              fw={encodedPromptParams.includes(word) ? 700 : 300}
              span
            >
              {word}{" "}
            </Text>
          );
        })}
        <br />
      </span>
    );
  });
};

export default PromptText;

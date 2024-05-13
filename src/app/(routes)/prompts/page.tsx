'use client';
import React, { useState } from "react";
import PromptsHelper from "./PromptsHelper";

const Prompts: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  return <PromptsHelper isUpdating={isUpdating} setIsUpdating={setIsUpdating} />;
};

export default Prompts;

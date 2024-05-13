'use client';
import React, { useState } from "react";
import PromptsHelper from "./PromptsHelper";

const Cases: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  return <PromptsHelper isUpdating={isUpdating} setIsUpdating={setIsUpdating} />;
};

export default Cases;

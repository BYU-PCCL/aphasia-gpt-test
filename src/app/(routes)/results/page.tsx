"use client";
import React, { useState } from "react";
import ResultsHelper from "./ResultsHelper";

const Tests: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  return <ResultsHelper isUpdating={isUpdating} setIsUpdating={setIsUpdating} />;
};

export default Tests;

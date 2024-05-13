// page.tsx
'use client';
import React, { useState } from "react";
import CasesHelper from "./CasesHelper";

const Cases: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  return <CasesHelper isUpdating={isUpdating} setIsUpdating={setIsUpdating} />;
};

export default Cases;

"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ChartType = "pie" | "bar" | "line";

interface SettingsContextType {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [chartType, setChartType] = useState<ChartType>("pie");

  useEffect(() => {
    const saved = localStorage.getItem("chartType") as ChartType;
    if (saved) setChartType(saved);
  }, []);

  const saveChartType = (type: ChartType) => {
    setChartType(type);
    localStorage.setItem("chartType", type);
  };

  return (
    <SettingsContext.Provider value={{ chartType, setChartType: saveChartType }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}

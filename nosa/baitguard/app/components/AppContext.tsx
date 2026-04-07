"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  isSimulatorActive: boolean;
  setIsSimulatorActive: (val: boolean) => void;
  recentThreatLevel: "Safe" | "Threat" | null;
  setRecentThreatLevel: (val: "Safe" | "Threat" | null) => void;
  isQuizOpen: boolean;
  setIsQuizOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [recentThreatLevel, setRecentThreatLevel] = useState<"Safe" | "Threat" | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isSimulatorActive,
        setIsSimulatorActive,
        recentThreatLevel,
        setRecentThreatLevel,
        isQuizOpen,
        setIsQuizOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

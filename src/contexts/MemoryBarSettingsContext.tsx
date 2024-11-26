import React, { createContext, useContext, useState } from 'react';

export interface MemoryBar {
  id: string;
  title: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  isEnabled: boolean;
}

interface MemoryBarSettingsContextType {
  memoryBars: MemoryBar[];
  addMemoryBar: (bar: Omit<MemoryBar, 'id'>) => void;
  updateMemoryBar: (id: string, bar: Partial<MemoryBar>) => void;
  deleteMemoryBar: (id: string) => void;
}

const MemoryBarSettingsContext = createContext<MemoryBarSettingsContextType | undefined>(undefined);

const defaultMemoryBars: MemoryBar[] = [
  {
    id: 'nrs-pain',
    title: '痛みのNRS',
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 5,
    isEnabled: true
  },
  {
    id: 'nrs-stiffness',
    title: '硬さのNRS',
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 5,
    isEnabled: true
  }
];

export function MemoryBarSettingsProvider({ children }: { children: React.ReactNode }) {
  const [memoryBars, setMemoryBars] = useState<MemoryBar[]>(defaultMemoryBars);

  const addMemoryBar = (bar: Omit<MemoryBar, 'id'>) => {
    const newBar: MemoryBar = {
      ...bar,
      id: crypto.randomUUID()
    };
    setMemoryBars(prev => [...prev, newBar]);
  };

  const updateMemoryBar = (id: string, bar: Partial<MemoryBar>) => {
    setMemoryBars(prev => prev.map(b => 
      b.id === id ? { ...b, ...bar } : b
    ));
  };

  const deleteMemoryBar = (id: string) => {
    setMemoryBars(prev => prev.filter(b => b.id !== id));
  };

  return (
    <MemoryBarSettingsContext.Provider value={{
      memoryBars,
      addMemoryBar,
      updateMemoryBar,
      deleteMemoryBar
    }}>
      {children}
    </MemoryBarSettingsContext.Provider>
  );
}

export function useMemoryBarSettings() {
  const context = useContext(MemoryBarSettingsContext);
  if (context === undefined) {
    throw new Error('useMemoryBarSettings must be used within a MemoryBarSettingsProvider');
  }
  return context;
}
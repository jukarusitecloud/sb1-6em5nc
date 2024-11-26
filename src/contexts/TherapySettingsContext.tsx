import React, { createContext, useContext, useState } from 'react';

export interface TherapyOption {
  id: string;
  name: string;
  isEnabled: boolean;
  category: string;
}

interface TherapySettingsContextType {
  therapyOptions: TherapyOption[];
  addTherapyOption: (option: Omit<TherapyOption, 'id'>) => void;
  updateTherapyOption: (id: string, option: Partial<TherapyOption>) => void;
  deleteTherapyOption: (id: string) => void;
  getEnabledOptions: () => TherapyOption[];
}

const TherapySettingsContext = createContext<TherapySettingsContextType | undefined>(undefined);

const defaultTherapyOptions: TherapyOption[] = [
  {
    id: 'therapy-1',
    name: '超音波療法',
    isEnabled: true,
    category: '物理療法'
  },
  {
    id: 'therapy-2',
    name: '低周波療法',
    isEnabled: true,
    category: '物理療法'
  },
  {
    id: 'therapy-3',
    name: 'ホットパック',
    isEnabled: true,
    category: '温熱療法'
  }
];

export function TherapySettingsProvider({ children }: { children: React.ReactNode }) {
  const [therapyOptions, setTherapyOptions] = useState<TherapyOption[]>(defaultTherapyOptions);

  const addTherapyOption = (option: Omit<TherapyOption, 'id'>) => {
    const newOption: TherapyOption = {
      ...option,
      id: crypto.randomUUID()
    };
    setTherapyOptions(prev => [...prev, newOption]);
  };

  const updateTherapyOption = (id: string, option: Partial<TherapyOption>) => {
    setTherapyOptions(prev => prev.map(o => 
      o.id === id ? { ...o, ...option } : o
    ));
  };

  const deleteTherapyOption = (id: string) => {
    setTherapyOptions(prev => prev.filter(o => o.id !== id));
  };

  const getEnabledOptions = () => {
    return therapyOptions.filter(option => option.isEnabled);
  };

  return (
    <TherapySettingsContext.Provider value={{
      therapyOptions,
      addTherapyOption,
      updateTherapyOption,
      deleteTherapyOption,
      getEnabledOptions
    }}>
      {children}
    </TherapySettingsContext.Provider>
  );
}

export function useTherapySettings() {
  const context = useContext(TherapySettingsContext);
  if (context === undefined) {
    throw new Error('useTherapySettings must be used within a TherapySettingsProvider');
  }
  return context;
}
import React, { createContext, useContext, useState } from 'react';

export interface ReminderSetting {
  id: string;
  weeks: number;
  message: string;
  isEnabled: boolean;
}

interface ReminderSettingsContextType {
  reminderSettings: ReminderSetting[];
  addReminderSetting: (setting: Omit<ReminderSetting, 'id' | 'isEnabled'>) => void;
  updateReminderSetting: (id: string, updates: Partial<ReminderSetting>) => void;
  deleteReminderSetting: (id: string) => void;
}

const ReminderSettingsContext = createContext<ReminderSettingsContextType | undefined>(undefined);

const defaultSettings: ReminderSetting[] = [
  {
    id: 'reminder-1',
    weeks: 4,
    message: '初診から1ヶ月経過: 経過評価を実施してください',
    isEnabled: true
  },
  {
    id: 'reminder-2',
    weeks: 12,
    message: '初診から3ヶ月経過: 治療計画の見直しを検討してください',
    isEnabled: true
  }
];

export function ReminderSettingsProvider({ children }: { children: React.ReactNode }) {
  const [reminderSettings, setReminderSettings] = useState<ReminderSetting[]>(defaultSettings);

  const addReminderSetting = (setting: Omit<ReminderSetting, 'id' | 'isEnabled'>) => {
    const newSetting: ReminderSetting = {
      ...setting,
      id: crypto.randomUUID(),
      isEnabled: true
    };
    setReminderSettings(prev => [...prev, newSetting]);
  };

  const updateReminderSetting = (id: string, updates: Partial<ReminderSetting>) => {
    setReminderSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, ...updates } : setting
      )
    );
  };

  const deleteReminderSetting = (id: string) => {
    setReminderSettings(prev => prev.filter(setting => setting.id !== id));
  };

  return (
    <ReminderSettingsContext.Provider
      value={{
        reminderSettings,
        addReminderSetting,
        updateReminderSetting,
        deleteReminderSetting
      }}
    >
      {children}
    </ReminderSettingsContext.Provider>
  );
}

export function useReminderSettings() {
  const context = useContext(ReminderSettingsContext);
  if (context === undefined) {
    throw new Error('useReminderSettings must be used within a ReminderSettingsProvider');
  }
  return context;
}
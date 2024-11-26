import React, { createContext, useContext, useState } from 'react';

interface ReminderRule {
  weeks: number;
  message: string;
}

interface TreatmentRemindersContextType {
  reminderRules: ReminderRule[];
  addReminderRule: (rule: ReminderRule) => void;
  removeReminderRule: (index: number) => void;
  getReminderMessages: (weeks: number) => string[];
}

const TreatmentRemindersContext = createContext<TreatmentRemindersContextType | undefined>(undefined);

export function TreatmentRemindersProvider({ children }: { children: React.ReactNode }) {
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([
    { weeks: 4, message: '1ヶ月経過: 経過評価を実施してください' },
    { weeks: 12, message: '3ヶ月経過: 詳細な治療評価を行ってください' },
    { weeks: 24, message: '半年経過: 治療計画の見直しを検討してください' },
  ]);

  const addReminderRule = (rule: ReminderRule) => {
    setReminderRules(prev => [...prev, rule]);
  };

  const removeReminderRule = (index: number) => {
    setReminderRules(prev => prev.filter((_, i) => i !== index));
  };

  const getReminderMessages = (weeks: number): string[] => {
    return reminderRules
      .filter(rule => rule.weeks === weeks)
      .map(rule => rule.message);
  };

  return (
    <TreatmentRemindersContext.Provider 
      value={{ 
        reminderRules, 
        addReminderRule, 
        removeReminderRule,
        getReminderMessages
      }}
    >
      {children}
    </TreatmentRemindersContext.Provider>
  );
}

export function useTreatmentReminders() {
  const context = useContext(TreatmentRemindersContext);
  if (context === undefined) {
    throw new Error('useTreatmentReminders must be used within a TreatmentRemindersProvider');
  }
  return context;
}
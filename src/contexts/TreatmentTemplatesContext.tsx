import React, { createContext, useContext, useState } from 'react';

export interface TreatmentTemplate {
  id: string;
  title: string;
  content: string;
  category?: string;
}

interface TreatmentTemplatesContextType {
  templates: TreatmentTemplate[];
  addTemplate: (template: Omit<TreatmentTemplate, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<TreatmentTemplate>) => void;
  deleteTemplate: (id: string) => void;
}

const TreatmentTemplatesContext = createContext<TreatmentTemplatesContextType | undefined>(undefined);

const defaultTemplates: TreatmentTemplate[] = [
  {
    id: 'template-1',
    title: '通常施術',
    content: '施術内容：\n1. 評価\n2. 治療\n3. 次回予定',
    category: '基本'
  },
  {
    id: 'template-2',
    title: '初診時',
    content: '主訴：\n現病歴：\n所見：\n治療計画：',
    category: '基本'
  }
];

export function TreatmentTemplatesProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<TreatmentTemplate[]>(defaultTemplates);

  const addTemplate = (template: Omit<TreatmentTemplate, 'id'>) => {
    const newTemplate: TreatmentTemplate = {
      ...template,
      id: crypto.randomUUID()
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<TreatmentTemplate>) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === id ? { ...template, ...updates } : template
      )
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  return (
    <TreatmentTemplatesContext.Provider
      value={{
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate
      }}
    >
      {children}
    </TreatmentTemplatesContext.Provider>
  );
}

export function useTreatmentTemplates() {
  const context = useContext(TreatmentTemplatesContext);
  if (context === undefined) {
    throw new Error('useTreatmentTemplates must be used within a TreatmentTemplatesProvider');
  }
  return context;
}
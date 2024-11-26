import React, { createContext, useContext, useState } from 'react';

export interface ChartEntry {
  id: string;
  date: string;             // 施術内容
  content: string;          // 施術内容
  therapyMethods: string[]; // 実施した物理療法
  nextAppointment?: string; // 次回予約日
  createdAt: string;
  modifiedAt?: string;
  modifiedReason?: string;
  deletedAt?: string;
  deleteReason?: string;
  isDeleted?: boolean;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  dateOfBirth: string;
  gender: string;
  firstVisitDate: string;
  address?: string;
  phone?: string;
  email?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  currentMedications?: string;
  allergies?: string;
  status: 'active' | 'completed';
  chartEntries: ChartEntry[];
}

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'status' | 'chartEntries'>) => Promise<void>;
  updatePatientStatus: (id: string, status: Patient['status']) => void;
  addChartEntry: (patientId: string, entry: {
    date: string;
    content: string;
    therapyMethods?: string[];
    nextAppointment?: string;
    createdAt: string;
  }) => Promise<void>;
  editChartEntry: (
    patientId: string, 
    entryId: string, 
    updates: { 
      content: string;
      therapyMethods: string[];
      nextAppointment?: string;
    },
    reason: string
  ) => Promise<void>;
  deleteChartEntry: (
    patientId: string,
    entryId: string,
    reason: string
  ) => Promise<void>;
  getPatient: (id: string) => Patient | undefined;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const demoPatient: Patient = {
  id: 'demo-patient-001',
  firstName: '太郎',
  lastName: '山田',
  firstNameKana: 'タロウ',
  lastNameKana: 'ヤマダ',
  dateOfBirth: '1980-01-01',
  gender: 'male',
  firstVisitDate: '2024-01-01',
  status: 'active',
  chartEntries: []
};

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([demoPatient]);

  const getPatient = (id: string) => {
    return patients.find(p => p.id === id);
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'status' | 'chartEntries'>): Promise<void> => {
    try {
      const newPatient: Patient = {
        ...patientData,
        id: crypto.randomUUID(),
        status: 'active',
        chartEntries: []
      };
      
      setPatients(prev => [...prev, newPatient]);
    } catch (error) {
      console.error('Failed to add patient:', error);
      throw new Error('患者の登録に失敗しました');
    }
  };

  const updatePatientStatus = (id: string, status: Patient['status']) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === id ? { ...patient, status } : patient
      )
    );
  };

  const addChartEntry = async (patientId: string, entry: {
    date: string;
    content: string;
    therapyMethods?: string[];
    nextAppointment?: string;
    createdAt: string;
  }): Promise<void> => {
    try {
      const patient = patients.find(p => p.id === patientId);
      if (!patient) {
        throw new Error('患者が見つかりません');
      }

      const newEntry: ChartEntry = {
        ...entry,
        id: crypto.randomUUID(),
        therapyMethods: entry.therapyMethods || [],
        createdAt: new Date().toISOString()
      };
      
      setPatients(prev => 
        prev.map(p => 
          p.id === patientId
            ? {
                ...p,
                chartEntries: [newEntry, ...p.chartEntries]
              }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to add chart entry:', error);
      throw new Error('カルテの保存に失敗しました');
    }
  };

  const editChartEntry = async (
    patientId: string,
    entryId: string,
    updates: {
      content: string;
      therapyMethods: string[];
      nextAppointment?: string;
    },
    reason: string
  ): Promise<void> => {
    try {
      setPatients(prev =>
        prev.map(patient => {
          if (patient.id !== patientId) return patient;

          const updatedEntries = patient.chartEntries.map(entry => {
            if (entry.id !== entryId) return entry;

            return {
              ...entry,
              ...updates,
              modifiedAt: new Date().toISOString(),
              modifiedReason: reason
            };
          });

          return {
            ...patient,
            chartEntries: updatedEntries
          };
        })
      );
    } catch (error) {
      console.error('Failed to edit chart entry:', error);
      throw new Error('カルテの修正に失敗しました');
    }
  };

  const deleteChartEntry = async (
    patientId: string,
    entryId: string,
    reason: string
  ): Promise<void> => {
    try {
      setPatients(prev =>
        prev.map(patient => {
          if (patient.id !== patientId) return patient;

          const updatedEntries = patient.chartEntries.map(entry => {
            if (entry.id !== entryId) return entry;

            return {
              ...entry,
              isDeleted: true,
              deletedAt: new Date().toISOString(),
              deleteReason: reason
            };
          });

          return {
            ...patient,
            chartEntries: updatedEntries
          };
        })
      );
    } catch (error) {
      console.error('Failed to delete chart entry:', error);
      throw new Error('カルテの削除に失敗しました');
    }
  };

  return (
    <PatientContext.Provider value={{
      patients,
      addPatient,
      updatePatientStatus,
      addChartEntry,
      editChartEntry,
      deleteChartEntry,
      getPatient
    }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}
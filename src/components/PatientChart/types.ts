export interface ChartEntryFormData {
  date: string;
  content: string;
  therapyMethods: string[];
  memoryBarValues: Record<string, number>;
}

export interface TreatmentRecordDisplayProps {
  date: string;
  content: string;
  therapyMethods: string[];
  memoryBarValues: Record<string, number>;
  firstVisitDate: string;
}
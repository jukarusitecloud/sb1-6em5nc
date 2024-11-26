export interface ExportError extends Error {
  format: 'pdf' | 'csv' | 'json';
  details?: string;
}

export interface ExportResult {
  success: boolean;
  error?: ExportError;
  data?: Blob;
}
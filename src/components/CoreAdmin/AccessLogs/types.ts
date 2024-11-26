export type LogType = 'all' | 'auth' | 'system' | 'data' | 'security';

export interface AuditLog {
  id: string;
  type: Exclude<LogType, 'all'>;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  ip?: string;
  userAgent?: string;
  location?: string;
  severity: 'info' | 'warning' | 'error';
}
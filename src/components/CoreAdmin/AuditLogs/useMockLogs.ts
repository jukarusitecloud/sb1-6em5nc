import { useState } from 'react';
import { AuditLog } from './types';

export function useMockLogs() {
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      type: 'auth',
      action: 'ログイン成功',
      user: '管理者',
      timestamp: new Date().toISOString(),
      details: '管理者アカウントでログインしました',
      ip: '192.168.1.1',
      location: '東京, 日本',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      severity: 'info'
    },
    {
      id: '2',
      type: 'security',
      action: '不正アクセス検知',
      user: 'システム',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      details: '複数回の認証失敗を検知しました。IPアドレスを一時的にブロックしました。',
      ip: '203.0.113.1',
      location: '不明',
      severity: 'error'
    },
    {
      id: '3',
      type: 'system',
      action: 'システム設定変更',
      user: '管理者',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      details: 'バックアップスケジュールを毎日 23:00 に変更しました',
      ip: '192.168.1.1',
      location: '東京, 日本',
      severity: 'info'
    },
    {
      id: '4',
      type: 'data',
      action: 'データベースバックアップ',
      user: 'システム',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      details: '定期バックアップが正常に完了しました',
      severity: 'info'
    },
    {
      id: '5',
      type: 'security',
      action: '2要素認証の無効化',
      user: '管理者',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      details: 'ユーザー "staff1@example.com" の2要素認証が無効化されました',
      ip: '192.168.1.1',
      location: '東京, 日本',
      severity: 'warning'
    }
  ]);

  return logs;
}
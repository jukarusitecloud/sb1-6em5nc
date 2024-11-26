import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Search, Filter, Download, AlertCircle, User, Settings, Shield, Database } from 'lucide-react';
import PageTransition from '../PageTransition';

type LogType = 'all' | 'auth' | 'system' | 'data';

interface AuditLog {
  id: string;
  type: LogType;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  ip?: string;
}

const mockLogs: AuditLog[] = [
  {
    id: '1',
    type: 'auth',
    action: 'ログイン',
    user: '管理者',
    timestamp: new Date().toISOString(),
    details: '管理者としてログイン',
    ip: '192.168.1.1'
  },
  {
    id: '2',
    type: 'system',
    action: 'システム設定変更',
    user: '管理者',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    details: 'バックアップスケジュールを変更',
  }
];

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<LogType>('all');
  const [logs] = useState<AuditLog[]>(mockLogs);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || log.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getLogIcon = (type: LogType) => {
    switch (type) {
      case 'auth':
        return <Shield className="h-5 w-5" />;
      case 'system':
        return <Settings className="h-5 w-5" />;
      case 'data':
        return <Database className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mono-900">監査ログ</h1>
            <p className="mt-2 text-mono-500">
              システムの操作履歴を確認できます
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800">
            <Download className="h-5 w-5" />
            ログをエクスポート
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ログを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'all'
                  ? 'bg-mono-900 text-white'
                  : 'bg-mono-100 text-mono-600 hover:bg-mono-200'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setSelectedType('auth')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'auth'
                  ? 'bg-mono-900 text-white'
                  : 'bg-mono-100 text-mono-600 hover:bg-mono-200'
              }`}
            >
              認証
            </button>
            <button
              onClick={() => setSelectedType('system')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedType === 'system'
                  ? 'bg-mono-900 text-white'
                  : 'bg-mono-100 text-mono-600 hover:bg-mono-200'
              }`}
            >
              システム
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-mono-100 rounded-lg">
                    {getLogIcon(log.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-mono-900">{log.action}</h3>
                    <p className="text-sm text-mono-500">
                      {format(new Date(log.timestamp), 'yyyy年M月d日 HH:mm', { locale: ja })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-mono-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{log.user}</span>
                  </div>
                  {log.ip && (
                    <span className="text-sm text-mono-500">{log.ip}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-mono-600">{log.details}</p>
            </motion.div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-8 w-8 text-mono-400 mx-auto mb-3" />
              <p className="text-mono-500">
                該当するログが見つかりません
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
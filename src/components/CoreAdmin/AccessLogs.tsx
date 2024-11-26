import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Activity, Search, AlertCircle, User, MapPin, Monitor } from 'lucide-react';
import PageTransition from '../PageTransition';

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
}

const mockLogs: AccessLog[] = [
  {
    id: '1',
    userId: 'admin-1',
    userName: '管理者',
    action: 'ログイン',
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'success'
  },
  {
    id: '2',
    userId: 'user-1',
    userName: '山田 太郎',
    action: 'パスワード変更',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success'
  }
];

export default function AccessLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs] = useState<AccessLog[]>(mockLogs);

  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.userName.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.ipAddress.includes(searchLower)
    );
  });

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mono-900">アクセスログ</h1>
            <p className="mt-2 text-mono-500">
              システムへのアクセス記録を確認できます
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ログを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-96 border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-mono-400" />
                  <div>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                </div>
                <time className="text-sm text-mono-500">
                  {format(new Date(log.timestamp), 'yyyy年M月d日 HH:mm', { locale: ja })}
                </time>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-mono-600">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{log.userName}</span>
                </div>

                <div className="flex items-center gap-2 text-mono-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{log.ipAddress}</span>
                </div>

                <div className="flex items-center gap-2 text-mono-600 md:col-span-2">
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm truncate" title={log.userAgent}>
                    {log.userAgent}
                  </span>
                </div>
              </div>
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
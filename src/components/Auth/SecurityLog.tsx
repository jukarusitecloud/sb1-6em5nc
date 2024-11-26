import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Shield, Search, AlertCircle, MapPin, Monitor, Calendar } from 'lucide-react';

interface SecurityLogEntry {
  id: string;
  type: 'login' | 'logout' | 'password_change' | '2fa_enable' | '2fa_disable';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
}

const mockLogs: SecurityLogEntry[] = [
  {
    id: '1',
    type: 'login',
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    location: '東京, 日本',
    success: true
  },
  {
    id: '2',
    type: '2fa_enable',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    location: '東京, 日本',
    success: true
  }
];

const typeLabels: Record<SecurityLogEntry['type'], string> = {
  login: 'ログイン',
  logout: 'ログアウト',
  password_change: 'パスワード変更',
  '2fa_enable': '2要素認証の有効化',
  '2fa_disable': '2要素認証の無効化'
};

export default function SecurityLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs] = useState<SecurityLogEntry[]>(mockLogs);

  const filteredLogs = logs.filter(log => 
    typeLabels[log.type].toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.includes(searchTerm) ||
    log.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-mono-900">セキュリティログ</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
          <input
            type="text"
            placeholder="ログを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-8 w-8 text-mono-400 mx-auto mb-3" />
          <p className="text-mono-500">該当するログが見つかりません</p>
        </div>
      ) : (
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    log.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {typeLabels[log.type]}
                  </span>
                  <span className="text-mono-500">
                    {log.success ? '成功' : '失敗'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-mono-500">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={log.timestamp}>
                    {format(new Date(log.timestamp), 'yyyy年M月d日 HH:mm', { locale: ja })}
                  </time>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-mono-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {log.location || '場所不明'} ({log.ipAddress})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-mono-600">
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm truncate" title={log.userAgent}>
                    {log.userAgent}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
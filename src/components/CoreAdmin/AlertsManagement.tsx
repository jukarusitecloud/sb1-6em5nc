import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Clock, Settings } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function AlertsManagement() {
  const alerts = [
    {
      id: 1,
      type: 'error',
      title: 'データベース接続エラー',
      message: 'プライマリデータベースへの接続が失敗しました',
      timestamp: '2024-03-15 15:30:00',
      status: 'unresolved'
    },
    {
      id: 2,
      type: 'warning',
      title: 'ディスク使用量警告',
      message: 'ディスク使用量が80%を超過しています',
      timestamp: '2024-03-15 14:45:00',
      status: 'investigating'
    },
    {
      id: 3,
      type: 'info',
      title: 'バックアップ完了',
      message: '定期バックアップが正常に完了しました',
      timestamp: '2024-03-15 14:00:00',
      status: 'resolved'
    }
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mono-900">アラート管理</h1>
            <p className="mt-2 text-mono-500">
              システムアラートの管理と設定
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Settings className="h-5 w-5" />
            アラート設定
          </button>
        </div>

        <div className="space-y-6">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border ${
                alert.type === 'error' ? 'border-red-200' :
                alert.type === 'warning' ? 'border-yellow-200' :
                'border-mono-200'
              } p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.type === 'error' ? 'bg-red-100' :
                    alert.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {alert.type === 'error' ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : alert.type === 'warning' ? (
                      <Bell className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-mono-900">{alert.title}</h3>
                    <p className="text-sm text-mono-500">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-mono-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{alert.timestamp}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.status === 'unresolved' ? 'bg-red-100 text-red-800' :
                    alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.status === 'unresolved' ? '未解決' :
                     alert.status === 'investigating' ? '調査中' :
                     '解決済み'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
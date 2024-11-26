import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Server, AlertTriangle } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function CoreAdminDashboard() {
  const stats = [
    {
      title: '総ユーザー数',
      value: '1,234',
      change: '+12%',
      isPositive: true,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'アクティブユーザー',
      value: '892',
      change: '+5%',
      isPositive: true,
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'サーバー負荷',
      value: '23%',
      change: '-2%',
      isPositive: true,
      icon: <Server className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'エラー発生数',
      value: '3',
      change: '+2',
      isPositive: false,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'bg-red-500'
    }
  ];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">システム概要</h1>
          <p className="mt-2 text-mono-500">
            システム全体の状態とパフォーマンスを確認できます
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-mono-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.color} bg-opacity-10 rounded-xl`}>
                  <div className={`${stat.color} text-white rounded-lg p-2`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-mono-900">
                    {stat.value}
                  </span>
                  <span className={`ml-2 text-sm ${
                    stat.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <h3 className="text-mono-600 font-medium">{stat.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* システムステータス */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-mono-200"
          >
            <h2 className="text-lg font-medium text-mono-900 mb-4">
              システムステータス
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-mono-600">API サーバー</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  正常稼働中
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mono-600">データベース</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  正常稼働中
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mono-600">キャッシュサーバー</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  パフォーマンス低下
                </span>
              </div>
            </div>
          </motion.div>

          {/* 最近のアラート */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-mono-200"
          >
            <h2 className="text-lg font-medium text-mono-900 mb-4">
              最近のアラート
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    高負荷検知
                  </p>
                  <p className="text-sm text-red-700">
                    2024-03-15 15:30 - サーバー負荷が閾値を超過
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    ディスク使用量警告
                  </p>
                  <p className="text-sm text-yellow-700">
                    2024-03-15 14:45 - ディスク使用量が80%を超過
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
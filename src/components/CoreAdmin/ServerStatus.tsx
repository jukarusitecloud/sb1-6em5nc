import React from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, Database, Network, HardDrive } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function ServerStatus() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">サーバー状態</h1>
          <p className="mt-2 text-mono-500">
            システムリソースとパフォーマンスの監視
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CPU使用率 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mono-100 rounded-full">
                <Cpu className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">CPU使用率</h2>
                <p className="text-2xl font-bold text-mono-900">23%</p>
              </div>
            </div>
            <div className="w-full bg-mono-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </motion.div>

          {/* メモリ使用率 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mono-100 rounded-full">
                <Database className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">メモリ使用率</h2>
                <p className="text-2xl font-bold text-mono-900">45%</p>
              </div>
            </div>
            <div className="w-full bg-mono-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </motion.div>

          {/* ディスク使用率 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mono-100 rounded-full">
                <HardDrive className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">ディスク使用率</h2>
                <p className="text-2xl font-bold text-mono-900">67%</p>
              </div>
            </div>
            <div className="w-full bg-mono-100 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </motion.div>
        </div>

        {/* 詳細情報 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <h2 className="text-lg font-medium text-mono-900 mb-4">システム情報</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-mono-600">OS</span>
                <span className="text-mono-900">Linux 5.15.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mono-600">アップタイム</span>
                <span className="text-mono-900">14日 3時間</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mono-600">プロセス数</span>
                <span className="text-mono-900">124</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <h2 className="text-lg font-medium text-mono-900 mb-4">ネットワーク状態</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-mono-600">受信</span>
                <span className="text-mono-900">2.3 MB/s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mono-600">送信</span>
                <span className="text-mono-900">1.1 MB/s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mono-600">アクティブ接続</span>
                <span className="text-mono-900">47</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
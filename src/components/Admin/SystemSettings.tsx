import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Database, Bell, Activity } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function SystemSettings() {
  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">システム設定</h1>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Settings className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">一般設定</h2>
                <p className="text-mono-500">基本的なシステム設定を管理します</p>
              </div>
            </div>

            {/* 設定項目を追加 */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Database className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">データベース設定</h2>
                <p className="text-mono-500">データベース接続とバックアップを管理します</p>
              </div>
            </div>

            {/* データベース設定項目を追加 */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Bell className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">通知設定</h2>
                <p className="text-mono-500">システム通知の設定を管理します</p>
              </div>
            </div>

            {/* 通知設定項目を追加 */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Activity className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">パフォーマンス設定</h2>
                <p className="text-mono-500">システムのパフォーマンスを最適化します</p>
              </div>
            </div>

            {/* パフォーマンス設定項目を追加 */}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
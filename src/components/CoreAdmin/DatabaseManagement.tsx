import React from 'react';
import { motion } from 'framer-motion';
import { Database, Download, Upload, History, AlertCircle, Save } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function DatabaseManagement() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">データベース管理</h1>

        <div className="space-y-6">
          {/* バックアップ設定 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Database className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">バックアップ設定</h2>
                <p className="text-mono-500">自動バックアップの設定を行います</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-mono-700">自動バックアップを有効にする</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  バックアップ頻度
                </label>
                <select className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400">
                  <option value="daily">毎日</option>
                  <option value="weekly">毎週</option>
                  <option value="monthly">毎月</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  保持期間（日）
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  defaultValue="30"
                />
              </div>
            </div>
          </motion.div>

          {/* 手動バックアップ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Download className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">手動バックアップ</h2>
                <p className="text-mono-500">データベースの手動バックアップを作成します</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Download className="h-4 w-4" />
              バックアップを作成
            </button>
          </motion.div>

          {/* リストア */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Upload className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">リストア</h2>
                <p className="text-mono-500">バックアップからデータを復元します</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-mono-300 border-dashed rounded-lg cursor-pointer bg-mono-50 hover:bg-mono-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-mono-400 mb-2" />
                    <p className="text-sm text-mono-500">
                      バックアップファイルをドロップするか、クリックして選択
                    </p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  リストアを実行
                </button>
              </div>
            </div>
          </motion.div>

          {/* バックアップ履歴 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <History className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">バックアップ履歴</h2>
                <p className="text-mono-500">過去のバックアップ記録を確認できます</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-mono-50 rounded-lg">
                <div>
                  <p className="font-medium text-mono-900">自動バックアップ</p>
                  <p className="text-sm text-mono-500">2024-03-15 15:30</p>
                </div>
                <button className="px-3 py-1.5 text-sm text-mono-600 hover:bg-mono-100 rounded-lg">
                  ダウンロード
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
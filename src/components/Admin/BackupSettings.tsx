import React from 'react';
import { motion } from 'framer-motion';
import { Database, Download, Upload, Calendar, Check } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function BackupSettings() {
  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">バックアップ設定</h1>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Calendar className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">自動バックアップ</h2>
                <p className="text-mono-500">定期的なバックアップのスケジュールを設定します</p>
              </div>
            </div>

            {/* バックアップスケジュール設定を追加 */}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <h2 className="text-lg font-medium text-mono-900">バックアップを作成</h2>
                  <p className="text-mono-500">手動でバックアップを作成します</p>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800">
                バックアップを作成
              </button>
            </motion.div>

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
                  <h2 className="text-lg font-medium text-mono-900">バックアップを復元</h2>
                  <p className="text-mono-500">既存のバックアップから復元します</p>
                </div>
              </div>

              <button className="w-full px-4 py-2 border border-mono-200 text-mono-600 rounded-lg hover:bg-mono-50">
                バックアップを選択
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Database className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">バックアップ履歴</h2>
                <p className="text-mono-500">過去のバックアップ記録を確認できます</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* バックアップ履歴リストを追加 */}
              <div className="flex items-center justify-between p-4 bg-mono-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-mono-900">自動バックアップ</p>
                    <p className="text-sm text-mono-500">2024年3月15日 15:30</p>
                  </div>
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
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, BarChart2, FileText, Download } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function Reports() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">レポート生成</h1>
          <p className="mt-2 text-mono-500">
            システムの各種レポートを生成できます
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ユーザーアクティビティレポート */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Activity className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">アクティビティ</h2>
                <p className="text-sm text-mono-500">ユーザーの行動分析</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  期間
                </label>
                <select className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400">
                  <option value="7days">過去7日間</option>
                  <option value="30days">過去30日間</option>
                  <option value="90days">過去90日間</option>
                </select>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Download className="h-4 w-4" />
                レポートを生成
              </button>
            </div>
          </motion.div>

          {/* ユーザー統計レポート */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Users className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">ユーザー統計</h2>
                <p className="text-sm text-mono-500">ユーザー数の推移</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  集計単位
                </label>
                <select className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400">
                  <option value="daily">日次</option>
                  <option value="weekly">週次</option>
                  <option value="monthly">月次</option>
                </select>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Download className="h-4 w-4" />
                レポートを生成
              </button>
            </div>
          </motion.div>

          {/* システムパフォーマンスレポート */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <BarChart2 className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">パフォーマンス</h2>
                <p className="text-sm text-mono-500">システム性能の分析</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  レポート種別
                </label>
                <select className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400">
                  <option value="server">サーバー負荷</option>
                  <option value="response">応答時間</option>
                  <option value="errors">エラー率</option>
                </select>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Download className="h-4 w-4" />
                レポートを生成
              </button>
            </div>
          </motion.div>

          {/* カスタムレポート */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <FileText className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">カスタムレポート</h2>
                <p className="text-sm text-mono-500">独自の条件でレポートを作成</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  データ項目
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-mono-700">ユーザー情報</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-mono-700">アクセスログ</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-mono-700">エラーログ</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  期間
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-mono-500 mb-1">開始日</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-mono-500 mb-1">終了日</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Download className="h-4 w-4" />
                レポートを生成
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
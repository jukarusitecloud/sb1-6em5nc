import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Mail, Image, Save } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function SystemSettings() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">システム設定</h1>

        <div className="space-y-6">
          {/* 基本設定 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Globe className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">基本設定</h2>
                <p className="text-mono-500">サービスの基本情報を設定します</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  サービス名
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  defaultValue="メディレコード"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  サービス説明
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  defaultValue="電子カルテ管理システム"
                />
              </div>
            </div>
          </motion.div>

          {/* メール設定 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Mail className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">メール設定</h2>
                <p className="text-mono-500">システムメールの設定を行います</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  送信元メールアドレス
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  defaultValue="no-reply@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  送信者名
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  defaultValue="メディレコード運営事務局"
                />
              </div>
            </div>
          </motion.div>

          {/* ロゴ設定 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Image className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">ロゴ設定</h2>
                <p className="text-mono-500">サービスロゴの設定を行います</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  ロゴ画像
                </label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-lg overflow-hidden bg-mono-100">
                    <svg
                      className="h-full w-full text-mono-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <button
                    type="button"
                    className="ml-5 bg-white py-2 px-3 border border-mono-300 rounded-md shadow-sm text-sm leading-4 font-medium text-mono-700 hover:bg-mono-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    変更
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Save className="h-4 w-4" />
              設定を保存
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
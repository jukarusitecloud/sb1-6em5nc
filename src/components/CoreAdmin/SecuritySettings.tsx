import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, AlertTriangle, Save } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function SecuritySettings() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">セキュリティ設定</h1>

        <div className="space-y-6">
          {/* パスワードポリシー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Lock className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">パスワードポリシー</h2>
                <p className="text-mono-500">パスワードの要件と有効期限を設定します</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  最小文字数
                </label>
                <input
                  type="number"
                  min="8"
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  defaultValue="8"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-mono-700">大文字を必須にする</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-mono-700">数字を必須にする</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-mono-700">特殊文字を必須にする</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  パスワード有効期限（日）
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  defaultValue="90"
                />
              </div>
            </div>
          </motion.div>

          {/* 2要素認証設定 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Key className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">2要素認証設定</h2>
                <p className="text-mono-500">2要素認証の要件を設定します</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-mono-700">管理者に2要素認証を必須にする</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-mono-700">全ユーザーに2要素認証を必須にする</span>
              </label>
            </div>
          </motion.div>

          {/* セッション設定 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <Shield className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">セッション設定</h2>
                <p className="text-mono-500">セッションのセキュリティ設定を行います</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  セッションタイムアウト（分）
                </label>
                <input
                  type="number"
                  min="5"
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  defaultValue="30"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-mono-700">同時ログインを制限する</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-mono-700">非アクティブ時の自動ログアウトを有効にする</span>
              </label>
            </div>
          </motion.div>

          {/* IPアドレス制限 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mono-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-mono-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-mono-900">IPアドレス制限</h2>
                <p className="text-mono-500">アクセスを許可するIPアドレスを設定します</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-mono-700">IPアドレス制限を有効にする</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  許可するIPアドレス（1行に1つ）
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
                  placeholder="例：&#10;192.168.1.1&#10;10.0.0.0/24"
                />
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
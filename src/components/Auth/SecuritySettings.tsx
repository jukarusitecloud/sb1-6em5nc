import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, UserCog, AlertCircle, Save, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../PageTransition';
import AdminGuard from './AdminGuard';

export default function SecuritySettings() {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    loginPolicy: {
      maxAttempts: 5,
      lockoutDuration: 30,
      sessionTimeout: 60,
      requireTwoFactor: false
    },
    accessControl: {
      singleSessionOnly: true,
      ipWhitelist: false,
      autoLogoutOnInactive: true
    }
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminGuard>
      <PageTransition>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-mono-900">セキュリティ設定</h1>
            <p className="mt-2 text-mono-500">
              システム全体のセキュリティポリシーを設定します
            </p>
          </div>

          {saved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span>設定を保存しました</span>
            </div>
          )}

          <div className="space-y-6">
            {/* パスワードポリシー */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-mono-100 rounded-full">
                  <Key className="h-6 w-6 text-mono-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-mono-900">パスワードポリシー</h2>
                  <p className="text-mono-500">パスワードの要件と有効期限を設定します</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">最小文字数</label>
                  <input
                    type="number"
                    value={settings.passwordPolicy.minLength}
                    onChange={(e) => setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        minLength: parseInt(e.target.value)
                      }
                    })}
                    className="w-24 rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">大文字を必須にする</label>
                  <input
                    type="checkbox"
                    checked={settings.passwordPolicy.requireUppercase}
                    onChange={(e) => setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        requireUppercase: e.target.checked
                      }
                    })}
                    className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">数字を必須にする</label>
                  <input
                    type="checkbox"
                    checked={settings.passwordPolicy.requireNumbers}
                    onChange={(e) => setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        requireNumbers: e.target.checked
                      }
                    })}
                    className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">特殊文字を必須にする</label>
                  <input
                    type="checkbox"
                    checked={settings.passwordPolicy.requireSpecialChars}
                    onChange={(e) => setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        requireSpecialChars: e.target.checked
                      }
                    })}
                    className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">パスワード有効期限（日）</label>
                  <input
                    type="number"
                    value={settings.passwordPolicy.expiryDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        expiryDays: parseInt(e.target.value)
                      }
                    })}
                    className="w-24 rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  />
                </div>
              </div>
            </motion.div>

            {/* ログインポリシー */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-mono-100 rounded-full">
                  <Lock className="h-6 w-6 text-mono-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-mono-900">ログインポリシー</h2>
                  <p className="text-mono-500">ログインの試行回数と制限を設定します</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">最大試行回数</label>
                  <input
                    type="number"
                    value={settings.loginPolicy.maxAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      loginPolicy: {
                        ...settings.loginPolicy,
                        maxAttempts: parseInt(e.target.value)
                      }
                    })}
                    className="w-24 rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">アカウントロック時間（分）</label>
                  <input
                    type="number"
                    value={settings.loginPolicy.lockoutDuration}
                    onChange={(e) => setSettings({
                      ...settings,
                      loginPolicy: {
                        ...settings.loginPolicy,
                        lockoutDuration: parseInt(e.target.value)
                      }
                    })}
                    className="w-24 rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">セッションタイムアウト（分）</label>
                  <input
                    type="number"
                    value={settings.loginPolicy.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      loginPolicy: {
                        ...settings.loginPolicy,
                        sessionTimeout: parseInt(e.target.value)
                      }
                    })}
                    className="w-24 rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">2要素認証を必須にする</label>
                  <input
                    type="checkbox"
                    checked={settings.loginPolicy.requireTwoFactor}
                    onChange={(e) => setSettings({
                      ...settings,
                      loginPolicy: {
                        ...settings.loginPolicy,
                        requireTwoFactor: e.target.checked
                      }
                    })}
                    className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* アクセス制御 */}
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
                  <h2 className="text-lg font-medium text-mono-900">アクセス制御</h2>
                  <p className="text-mono-500">セッションとアクセス制限を設定します</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">シングルセッションのみ許可</label>
                  <input
                    type="checkbox"
                    checked={settings.accessControl.singleSessionOnly}
                    onChange={(e) => setSettings({
                      ...settings,
                      accessControl: {
                        ...settings.accessControl,
                        singleSessionOnly: e.target.checked
                      }
                    })}
                    className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">IPアドレス制限を有効にする</label>
                  <input
                    type="checkbox"
                    checked={settings.accessControl.ipWhitelist}
                    onChange={(e) => setSettings({
                      ...settings,
                      accessControl: {
                        ...settings.accessControl,
                        ipWhitelist: e.target.checked
                      }
                    })}
                    className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-mono-700">非アクティブ時の自動ログアウト</label>
                  <input
                    type="checkbox"
                    checked={settings.accessControl.autoLogoutOnInactive}
                    onChange={(e) => setSettings({
                      ...settings,
                      accessControl: {
                        ...settings.accessControl,
                        autoLogoutOnInactive: e.target.checked
                      }
                    })}
                    className="rounded border-mono-300 text-mono-600 focus:ring-mono-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-mono-900 text-white rounded-lg hover:bg-mono-800 transition-colors"
            >
              <Save className="h-4 w-4" />
              設定を保存
            </button>
          </div>
        </div>
      </PageTransition>
    </AdminGuard>
  );
}
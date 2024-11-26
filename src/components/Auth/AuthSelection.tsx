import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Users, UserPlus } from 'lucide-react';

interface AuthSelectionProps {
  onSelectAdminLogin: () => void;
  onSelectStaffLogin: () => void;
  onSelectRegister: () => void;
}

export default function AuthSelection({ 
  onSelectAdminLogin,
  onSelectStaffLogin,
  onSelectRegister
}: AuthSelectionProps) {
  return (
    <div className="min-h-screen bg-mono-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Activity className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-mono-900">
          メディレコードへようこそ
        </h2>
        <p className="mt-2 text-center text-sm text-mono-600">
          電子カルテ管理システム
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectAdminLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Shield className="h-5 w-5" />
              <span className="text-lg font-medium">管理者ログイン</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectStaffLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-mono-900 text-white rounded-xl hover:bg-mono-800 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span className="text-lg font-medium">スタッフログイン</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectRegister}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span className="text-lg font-medium">新規管理者登録</span>
            </motion.button>
          </div>

          <div className="mt-6">
            <p className="text-center text-xs text-mono-500">
              続行することで、
              <a href="/terms" className="text-blue-600 hover:text-blue-500">利用規約</a>
              と
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">プライバシーポリシー</a>
              に同意したことになります。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
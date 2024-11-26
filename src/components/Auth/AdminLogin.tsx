import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Shield, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('メールアドレスが無効です'),
  password: z.string().min(1, 'パスワードを入力してください'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AdminLoginProps {
  onResetPassword: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onResetPassword, onBack }: AdminLoginProps) {
  const { loginAsAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsLoggingIn(true);
      await loginAsAdmin(data.email, data.password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'ログインに失敗しました');
      setIsLoggingIn(false);
    }
  };

  return (
    <AnimatePresence>
      {isLoggingIn ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col items-center justify-center space-y-6 p-8"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              borderRadius: ["50% 50% 50% 50%", "40% 60% 60% 40%", "50% 50% 50% 50%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-mono-900 mb-2">管理パネルにアクセス中...</h2>
            <p className="text-mono-500">セキュリティチェックを実行しています</p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-mono-600 hover:text-mono-900"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </button>

          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-mono-900">管理者ログイン</h2>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-purple-800">
            <h3 className="font-medium mb-2">デモ用アカウント:</h3>
            <div className="space-y-1 text-sm">
              <p>メールアドレス: admin@example.com</p>
              <p>パスワード: admin123</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600"
            >
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-mono-700">
              メールアドレス
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
              <input
                type="email"
                {...register('email')}
                className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="admin@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700">
              パスワード
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="block w-full pl-10 pr-10 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-mono-400" />
                ) : (
                  <Eye className="h-5 w-5 text-mono-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 rounded border-mono-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-mono-600">ログイン状態を保持</span>
            </label>

            <button
              type="button"
              onClick={onResetPassword}
              className="text-sm text-purple-600 hover:text-purple-500"
            >
              パスワードをお忘れの方
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
          >
            <Key className="h-5 w-5" />
            管理者としてログイン
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
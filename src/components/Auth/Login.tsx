import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TwoFactorVerify from './TwoFactorVerify';

const loginSchema = z.object({
  email: z.string().email('メールアドレスが無効です'),
  password: z.string().min(1, 'パスワードを入力してください'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  onResetPassword: () => void;
  onBack: () => void;
}

export default function Login({ onResetPassword, onBack }: LoginProps) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password);
      setCredentials({ email: data.email, password: data.password });
      setRequires2FA(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'ログインに失敗しました');
    }
  };

  const handle2FAVerify = async (code: string) => {
    if (!credentials) return;
    
    try {
      setError(null);
      await login(credentials.email, credentials.password, code);
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証に失敗しました');
    }
  };

  if (requires2FA && credentials) {
    return (
      <TwoFactorVerify
        onVerify={handle2FAVerify}
        onCancel={() => {
          setRequires2FA(false);
          setCredentials(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-mono-600 hover:text-mono-900"
      >
        <ArrowLeft className="h-4 w-4" />
        戻る
      </button>

      <h2 className="text-2xl font-bold text-mono-900">ログイン</h2>

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
            className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
            placeholder="your@email.com"
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
            className="block w-full pl-10 pr-10 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-mono-400"
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
            className="h-4 w-4 rounded border-mono-300 text-mono-600 focus:ring-mono-500"
          />
          <span className="text-sm text-mono-600">ログイン状態を保持</span>
        </label>

        <button
          type="button"
          onClick={onResetPassword}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          パスワードをお忘れの方
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-mono-900 hover:bg-mono-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-500 disabled:opacity-50"
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}
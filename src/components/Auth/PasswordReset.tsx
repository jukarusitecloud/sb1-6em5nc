import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const resetSchema = z.object({
  email: z.string().email('メールアドレスが無効です'),
});

type ResetFormData = z.infer<typeof resetSchema>;

interface PasswordResetProps {
  onBack: () => void;
}

export default function PasswordReset({ onBack }: PasswordResetProps) {
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      setError(null);
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'パスワードリセットに失敗しました');
      console.error('Password reset failed:', error);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-mono-900">
          リセット手順を送信しました
        </h3>
        <p className="text-sm text-mono-600">
          メールに記載されたリンクからパスワードの再設定を行ってください。
        </p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          ログイン画面に戻る
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-mono-600 hover:text-mono-900"
      >
        <ArrowLeft className="h-4 w-4" />
        戻る
      </button>

      <div>
        <h2 className="text-xl font-bold text-mono-900">パスワードをリセット</h2>
        <p className="mt-2 text-sm text-mono-600">
          登録したメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-mono-700">
            メールアドレス
          </label>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
            <input
              type="email"
              {...register('email')}
              className="block w-full pl-10 pr-3 py-2 border border-mono-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '送信中...' : 'リセットリンクを送信'}
          </button>
        </div>
      </form>
    </div>
  );
}
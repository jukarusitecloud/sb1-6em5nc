import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const verifySchema = z.object({
  code: z.string().length(6, '認証コードは6桁で入力してください'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

interface TwoFactorVerifyProps {
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
  onResendCode?: () => Promise<void>;
}

export default function TwoFactorVerify({ onVerify, onCancel, onResendCode }: TwoFactorVerifyProps) {
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ''
    }
  });

  // カウントダウンタイマー
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // コードの自動フォーカス処理
  const code = watch('code');
  useEffect(() => {
    if (code.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [code, handleSubmit]);

  const handleResendCode = async () => {
    if (onResendCode && countdown === 0) {
      try {
        setIsResending(true);
        setError(null);
        await onResendCode();
        setCountdown(30);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'コードの再送信に失敗しました');
      } finally {
        setIsResending(false);
      }
    }
  };

  const onSubmit = async (data: VerifyFormData) => {
    try {
      setError(null);
      await onVerify(data.code);
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証に失敗しました');
      setValue('code', '');
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 text-mono-600 hover:text-mono-900"
      >
        <ArrowLeft className="h-4 w-4" />
        戻る
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-mono-900">2要素認証</h2>
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

      <div className="bg-mono-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-mono-600" />
          <p className="text-sm font-medium text-mono-700">
            認証コードの有効期限
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-mono font-bold text-mono-900">
            {String(Math.floor(countdown / 60)).padStart(2, '0')}:
            {String(countdown % 60).padStart(2, '0')}
          </div>
          {onResendCode && (
            <button
              onClick={handleResendCode}
              disabled={countdown > 0 || isResending}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white text-mono-600 rounded-lg hover:bg-mono-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              コードを再送信
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-mono-700 mb-2">
            認証コードを入力
          </label>
          <input
            type="text"
            {...register('code')}
            className="block w-full px-4 py-3 border border-mono-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-[1em] font-mono"
            placeholder="000000"
            maxLength={6}
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isSubmitting || code.length !== 6}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            {isSubmitting ? '認証中...' : '認証する'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-mono-500">
            認証アプリに表示された6桁のコードを入力してください。
            コードは30秒ごとに更新されます。
          </p>
        </div>
      </form>
    </motion.div>
  );
}
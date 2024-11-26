import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, AlertCircle, Copy, Check, Smartphone, QrCode, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const setupSchema = z.object({
  code: z.string().length(6, '認証コードは6桁で入力してください'),
});

type SetupFormData = z.infer<typeof setupSchema>;

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const { enable2FA, verify2FA } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState<'intro' | 'setup' | 'verify'>('intro');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
  });

  const handleSetup = async () => {
    try {
      setError(null);
      const { secret, qrCode } = await enable2FA();
      setSecret(secret);
      setQrCode(qrCode);
      setCurrentStep('setup');
    } catch (error) {
      setError(error instanceof Error ? error.message : '2要素認証の設定に失敗しました');
      console.error('2FA setup failed:', error);
    }
  };

  const onSubmit = async (data: SetupFormData) => {
    try {
      setError(null);
      const isValid = await verify2FA(data.code);
      if (isValid) {
        onComplete();
      } else {
        setError('認証コードが正しくありません');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証に失敗しました');
      console.error('2FA verification failed:', error);
    }
  };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderIntroStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-mono-900">2要素認証の設定</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <Smartphone className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900">認証アプリが必要です</h3>
            <p className="text-sm text-blue-700">
              以下のいずれかの認証アプリをインストールしてください：
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• Google Authenticator</li>
              <li>• Microsoft Authenticator</li>
              <li>• Authy</li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-mono-50 rounded-lg">
          <Shield className="h-5 w-5 text-mono-600 mt-1" />
          <div>
            <h3 className="font-medium text-mono-900">セキュリティが向上します</h3>
            <p className="text-sm text-mono-600">
              2要素認証を有効にすると、パスワードが漏洩した場合でもアカウントを保護できます。
              ログイン時に認証アプリで生成されるコードの入力が必要になります。
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSetup}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          設定を開始
        </button>
      </div>
    </motion.div>
  );

  const renderSetupStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-mono-900">QRコードをスキャン</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-mono-50 p-6 rounded-lg flex items-center justify-center">
        {qrCode && <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />}
      </div>

      {secret && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-mono-700">
            手動設定用コード
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-mono-50 rounded-lg font-mono text-sm break-all">
              {secret}
            </code>
            <button
              onClick={copySecret}
              className="p-2 text-mono-500 hover:text-mono-900 hover:bg-mono-100 rounded-lg transition-colors"
              title={copied ? 'コピーしました' : 'コピー'}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-mono-500">
            QRコードをスキャンできない場合は、このコードを手動で入力してください
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={() => setCurrentStep('verify')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Key className="h-4 w-4" />
          コードを入力
        </button>
      </div>
    </motion.div>
  );

  const renderVerifyStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Key className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-mono-900">認証コードを確認</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-mono-700 mb-2">
            認証アプリに表示されたコードを入力
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
            onClick={() => setCurrentStep('setup')}
            className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
          >
            戻る
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? '検証中...' : '設定を完了'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 text-mono-600 hover:text-mono-900"
      >
        <ArrowLeft className="h-4 w-4" />
        戻る
      </button>

      {currentStep === 'intro' && renderIntroStep()}
      {currentStep === 'setup' && renderSetupStep()}
      {currentStep === 'verify' && renderVerifyStep()}
    </div>
  );
}
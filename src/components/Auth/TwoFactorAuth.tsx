import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { AlertCircle, QrCode, Shield, Copy, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const twoFactorSchema = z.object({
  code: z.string().length(6, '認証コードは6桁で入力してください')
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

interface TwoFactorAuthProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function TwoFactorAuth({ onComplete, onCancel }: TwoFactorAuthProps) {
  const { enableTwoFactor } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backupCodes] = useState(() => 
    Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    )
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema)
  });

  const handleEnable = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const qrCodeData = await enableTwoFactor();
      setQrCode(qrCodeData);
    } catch (error) {
      setError(error instanceof Error ? error.message : '2要素認証の設定に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TwoFactorFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Verify 2FA code with backend
      onComplete();
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証コードの検証に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!qrCode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white rounded-xl shadow-sm max-w-md mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-mono-900">2要素認証の設定</h2>
        </div>

        <p className="text-mono-600 mb-6">
          2要素認証を有効にすると、ログイン時にスマートフォンなどの認証アプリで生成されるコードの入力が必要になります。
          アカウントのセキュリティが大幅に向上します。
        </p>

        <div className="space-y-4">
          <button
            onClick={handleEnable}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <QrCode className="h-5 w-5" />
            {isLoading ? '設定中...' : '2要素認証を有効にする'}
          </button>
          
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg"
          >
            キャンセル
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-xl shadow-sm max-w-md mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-mono-900">認証アプリの設定</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <p className="text-mono-600 mb-4">
            1. 認証アプリ（Google AuthenticatorやMicrosoft Authenticatorなど）で以下のQRコードをスキャンしてください。
          </p>
          <div className="bg-mono-100 p-4 rounded-lg flex items-center justify-center">
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
          </div>
        </div>

        <div>
          <p className="text-mono-600 mb-4">
            2. 以下のバックアップコードを安全な場所に保管してください。2要素認証が利用できない場合に使用できます。
          </p>
          <div className="bg-mono-100 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-mono-600">
                  {code}
                </div>
              ))}
            </div>
            <button
              onClick={copyBackupCodes}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white text-mono-600 rounded-lg hover:bg-mono-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  コピーしました
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  バックアップコードをコピー
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mono-700 mb-2">
              3. 認証アプリに表示されたコードを入力してください
            </label>
            <input
              type="text"
              {...register('code')}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-offset-0 ${
                errors.code
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-mono-200 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="000000"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? '検証中...' : '設定を完了'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
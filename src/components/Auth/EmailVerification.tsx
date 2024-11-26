import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Loader } from 'lucide-react';
import PageTransition from '../PageTransition';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          throw new Error('認証トークンが見つかりません');
        }

        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || '認証に失敗しました');
        }

        setStatus('success');
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setError(error instanceof Error ? error.message : '認証に失敗しました');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-mono-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm max-w-md w-full p-6 text-center"
        >
          {status === 'verifying' && (
            <>
              <Loader className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-bold text-mono-900 mb-2">
                メールアドレスを認証中...
              </h2>
              <p className="text-mono-600">
                しばらくお待ちください
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-mono-900 mb-2">
                認証が完了しました
              </h2>
              <p className="text-mono-600">
                ログイン画面に移動します...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-mono-900 mb-2">
                認証に失敗しました
              </h2>
              {error && (
                <p className="text-red-600 mb-4">{error}</p>
              )}
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800"
              >
                ログイン画面に戻る
              </button>
            </>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
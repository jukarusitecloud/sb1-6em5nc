import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, AlertCircle, X } from 'lucide-react';

interface SecurityGuideProps {
  onClose: () => void;
  onEnable2FA: () => void;
}

export default function SecurityGuide({ onClose, onEnable2FA }: SecurityGuideProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideSecurityGuide', 'true');
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-mono-900">セキュリティガイド</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-mono-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-mono-900">強力なパスワード</h3>
              <p className="text-sm text-mono-600">
                パスワードは8文字以上で、大文字・小文字・数字・記号を含める必要があります。
                定期的なパスワードの変更も推奨されます。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-mono-900">2要素認証の利用</h3>
              <p className="text-sm text-mono-600 mb-2">
                2要素認証を有効にすると、アカウントのセキュリティが大幅に向上します。
                認証アプリを使用して簡単に設定できます。
              </p>
              <button
                onClick={onEnable2FA}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                2要素認証を設定する →
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-mono-900">セキュリティ通知</h3>
              <p className="text-sm text-mono-600">
                不審なログインや重要な設定変更があった場合、メールで通知されます。
                通知を受け取ったら必ず内容を確認してください。
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-mono-200">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-4 w-4 rounded border-mono-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-mono-600">
                次回から表示しない
              </span>
            </label>
          </div>

          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800"
          >
            理解しました
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
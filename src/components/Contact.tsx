import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, AlertCircle, Check } from 'lucide-react';
import PageTransition from './PageTransition';

const contactSchema = z.object({
  subject: z.string().min(1, '件名を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  message: z.string().min(10, 'メッセージは10文字以上で入力してください'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setError(null);
      // TODO: Implement actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'メッセージの送信に失敗しました');
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-2">お問い合わせ</h1>
        <p className="text-mono-500 mb-8">
          システムに関するご質問やご要望がございましたら、以下のフォームよりお問い合わせください。
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-green-900 mb-2">
              お問い合わせを受け付けました
            </h2>
            <p className="text-green-700">
              内容を確認の上、ご登録いただいたメールアドレスへ回答させていただきます。
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                件名
              </label>
              <input
                type="text"
                {...register('subject')}
                className="w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                placeholder="お問い合わせの件名"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                お問い合わせ内容
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-mono-400 h-5 w-5" />
                <textarea
                  {...register('message')}
                  rows={6}
                  className="w-full pl-10 rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  placeholder="お問い合わせ内容を入力してください"
                />
              </div>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? '送信中...' : 'メッセージを送信'}
            </button>
          </form>
        )}
      </div>
    </PageTransition>
  );
}
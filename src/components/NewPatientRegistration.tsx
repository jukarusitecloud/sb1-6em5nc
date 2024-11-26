import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePatients } from '../contexts/PatientContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Phone, Mail, MapPin, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import PageTransition from './PageTransition';

const patientSchema = z.object({
  firstVisitDate: z.string().min(1, '初診日は必須です'),
  lastName: z.string().min(1, '姓は必須です'),
  firstName: z.string().min(1, '名は必須です'),
  lastNameKana: z.string().min(1, 'セイは必須です'),
  firstNameKana: z.string().min(1, 'メイは必須です'),
  dateOfBirth: z.string().min(1, '生年月日は必須です'),
  gender: z.string().min(1, '性別は必須です'),
  phone: z.string().optional(),
  email: z.string().email('メールアドレスが無効です').optional().or(z.literal('')),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  allergies: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

const steps = [
  { id: 'basic', title: '基本情報' },
  { id: 'contact', title: '連絡先' },
  { id: 'medical', title: '医療情報' },
];

export default function NewPatientRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { addPatient } = usePatients();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstVisitDate: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      setError(null);
      await addPatient(data);
      reset();
      navigate('/active-patients');
    } catch (error) {
      setError(error instanceof Error ? error.message : '患者の登録に失敗しました');
      console.error('Registration failed:', error);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof PatientFormData)[] = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = ['firstName', 'lastName', 'firstNameKana', 'lastNameKana', 'dateOfBirth', 'gender', 'firstVisitDate'];
        break;
      case 1:
        fieldsToValidate = ['phone', 'email', 'address', 'emergencyContact'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <PageTransition>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-mono-900 mb-8">新規患者登録</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex flex-col items-center relative z-10 ${
                    index <= currentStep ? 'text-mono-900' : 'text-mono-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index <= currentStep ? 'bg-mono-900 text-white' : 'bg-mono-100'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${
                    index < currentStep ? 'bg-mono-900' : 'bg-mono-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700">姓</label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                      placeholder="山田"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700">名</label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                      placeholder="太郎"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700">セイ</label>
                    <input
                      type="text"
                      {...register('lastNameKana')}
                      className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                      placeholder="ヤマダ"
                    />
                    {errors.lastNameKana && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastNameKana.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700">メイ</label>
                    <input
                      type="text"
                      {...register('firstNameKana')}
                      className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                      placeholder="タロウ"
                    />
                    {errors.firstNameKana && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstNameKana.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700">生年月日</label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700">性別</label>
                  <select
                    {...register('gender')}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  >
                    <option value="">選択してください</option>
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="other">その他</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700">初診日</label>
                  <input
                    type="date"
                    {...register('firstVisitDate')}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                  />
                  {errors.firstVisitDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstVisitDate.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-mono-700">電話番号</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                    placeholder="090-1234-5678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700">メールアドレス</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700">住所</label>
                  <input
                    type="text"
                    {...register('address')}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                    placeholder="東京都渋谷区..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700">緊急連絡先</label>
                  <input
                    type="text"
                    {...register('emergencyContact')}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                    placeholder="090-1234-5678（配偶者）"
                  />
                  {errors.emergencyContact && (
                    <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-mono-700">既往歴</label>
                  <textarea
                    {...register('medicalHistory')}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                    placeholder="過去の病歴や手術歴など"
                  />
                  {errors.medicalHistory && (
                    <p className="mt-1 text-sm text-red-600">{errors.medicalHistory.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700">服用中の薬</label>
                  <textarea
                    {...register('currentMedications')}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                    placeholder="現在服用している薬"
                  />
                  {errors.currentMedications && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentMedications.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700">アレルギー</label>
                  <textarea
                    {...register('allergies')}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-mono-400"
                    placeholder="薬や食物のアレルギー"
                  />
                  {errors.allergies && (
                    <p className="mt-1 text-sm text-red-600">{errors.allergies.message}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-6 border-t border-mono-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-mono-600 hover:text-mono-900 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              戻る
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 disabled:opacity-50"
              >
                次へ
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 disabled:opacity-50"
              >
                {isSubmitting ? '登録中...' : '登録'}
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
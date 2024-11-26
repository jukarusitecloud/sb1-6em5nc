import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft, FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTreatmentTemplates } from '../../contexts/TreatmentTemplatesContext';
import { usePatients } from '../../contexts/PatientContext';
import PageTransition from '../PageTransition';
import TemplateSelector from '../PatientChart/TemplateSelector';
import EntryForm from './EntryForm';
import EntryHeader from './EntryHeader';

const medicalRecordSchema = z.object({
  date: z.string().min(1, '施術日は必須です'),
  content: z.string().min(1, '施術内容は必須です').max(5000, '施術内容は5000文字以内で入力してください'),
  therapyMethods: z.array(z.string()),
  chiefComplaints: z.string().optional(),
  observations: z.string().optional(),
  plan: z.string().optional(),
  memoryBarValues: z.record(z.string(), z.number()).optional()
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

export default function MedicalRecordEntry() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { templates } = useTreatmentTemplates();
  const { addTreatmentRecord, getPatient } = usePatients();
  const [showTemplates, setShowTemplates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      therapyMethods: [],
      memoryBarValues: {}
    }
  });

  if (!patientId) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>患者IDが指定されていません</span>
        </div>
      </div>
    );
  }

  const patient = getPatient(patientId);
  if (!patient) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>患者が見つかりません</span>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: MedicalRecordFormData) => {
    try {
      setError(null);

      await addTreatmentRecord(patientId, {
        date: data.date,
        content: data.content,
        therapyMethods: data.therapyMethods,
        memoryBarValues: data.memoryBarValues || {},
        chiefComplaints: data.chiefComplaints,
        observations: data.observations,
        plan: data.plan
      });

      reset();
      navigate(`/patient/${patientId}/chart`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'カルテの保存に失敗しました');
      console.error('Failed to save medical record:', error);
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <EntryHeader onBack={() => navigate(-1)} />
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-mono-200">
            <EntryForm
              register={register}
              errors={errors}
              showTemplates={showTemplates}
              setShowTemplates={setShowTemplates}
            />

            <AnimatePresence>
              {showTemplates && templates.length > 0 && (
                <div className="mb-4 overflow-hidden bg-mono-50 rounded-xl p-4">
                  <TemplateSelector
                    templates={templates}
                    onSelect={(content) => {
                      const currentContent = watch('content') || '';
                      const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
                      const cursorPosition = textarea?.selectionStart ?? currentContent.length;
                      
                      const newContent = 
                        currentContent.slice(0, cursorPosition) + 
                        content + 
                        currentContent.slice(cursorPosition);
                      
                      setValue('content', newContent, { shouldValidate: true });
                      setShowTemplates(false);

                      setTimeout(() => {
                        textarea?.focus();
                        const newPosition = cursorPosition + content.length;
                        textarea?.setSelectionRange(newPosition, newPosition);
                      }, 0);
                    }}
                  />
                </div>
              )}
            </AnimatePresence>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-mono-900 text-white rounded-lg hover:bg-mono-800 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? '保存中...' : 'カルテを保存'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
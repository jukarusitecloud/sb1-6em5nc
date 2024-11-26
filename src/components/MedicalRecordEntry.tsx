import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Calculator, Stethoscope, Save, X } from 'lucide-react';

const medicalRecordSchema = z.object({
  entryDate: z.string().min(1, 'Entry date is required'),
  entryTime: z.string().min(1, 'Entry time is required'),
  entrant: z.string().min(1, 'Entrant name is required'),
  firstVisitDate: z.string().min(1, 'First visit date is required'),
  medicalRecord: z.string()
    .min(10, 'Medical record must be at least 10 characters')
    .max(5000, 'Medical record must not exceed 5000 characters'),
  therapyDevice: z.string().min(1, 'Therapy device is required'),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

const therapyDevices = [
  'Ultrasound Therapy Unit',
  'TENS Unit',
  'Laser Therapy Device',
  'Electrical Stimulation Device',
  'Traction Device',
  'CPM Machine',
  'Cryotherapy Unit',
  'Heat Therapy Unit',
  'Other'
];

export default function MedicalRecordEntry() {
  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      entryDate: new Date().toISOString().split('T')[0],
      entryTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }
  });

  const firstVisitDate = watch('firstVisitDate');
  const entryDate = watch('entryDate');

  const calculateWeeks = () => {
    if (!firstVisitDate || !entryDate) return '';
    const start = new Date(firstVisitDate);
    const end = new Date(entryDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const remainingDays = diffDays % 7;
    return `${weeks} weeks${remainingDays > 0 ? ` and ${remainingDays} days` : ''}`;
  };

  const onSubmit = async (data: MedicalRecordFormData) => {
    try {
      console.log('Medical record data:', {
        ...data,
        weeksElapsed: calculateWeeks()
      });
      // Here you would typically make an API call to save the record
    } catch (error) {
      console.error('Failed to save medical record:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Medical Record Entry</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            form="medical-record-form"
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Record
          </button>
        </div>
      </div>

      <form id="medical-record-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Entry Date
              </label>
              <input
                type="date"
                {...register('entryDate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.entryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.entryDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                Entry Time
              </label>
              <input
                type="time"
                {...register('entryTime')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.entryTime && (
                <p className="mt-1 text-sm text-red-600">{errors.entryTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                Entrant
              </label>
              <input
                type="text"
                {...register('entrant')}
                placeholder="Enter your name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.entrant && (
                <p className="mt-1 text-sm text-red-600">{errors.entrant.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                First Visit Date
              </label>
              <input
                type="date"
                {...register('firstVisitDate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.firstVisitDate && (
                <p className="mt-1 text-sm text-red-600">{errors.firstVisitDate.message}</p>
              )}
            </div>

            {firstVisitDate && entryDate && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calculator className="h-4 w-4" />
                  <span>Treatment Duration: </span>
                  <span className="font-medium">{calculateWeeks()}</span>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-gray-400" />
                Therapy Device
              </label>
              <select
                {...register('therapyDevice')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select therapy device</option>
                {therapyDevices.map((device) => (
                  <option key={device} value={device}>{device}</option>
                ))}
              </select>
              {errors.therapyDevice && (
                <p className="mt-1 text-sm text-red-600">{errors.therapyDevice.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Medical Record Entry
              </label>
              <textarea
                {...register('medicalRecord')}
                rows={8}
                placeholder="Enter detailed medical record notes..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.medicalRecord && (
                <p className="mt-1 text-sm text-red-600">{errors.medicalRecord.message}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
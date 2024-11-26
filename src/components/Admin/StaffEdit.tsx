import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../PageTransition';

const editStaffSchema = z.object({
  fullName: z.string().min(1, '氏名は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  department: z.string().optional(),
  position: z.string().optional(),
  permissions: z.array(z.string())
});

type EditStaffFormData = z.infer<typeof editStaffSchema>;

const STAFF_PERMISSIONS = [
  { id: 'patient:read', name: '患者情報閲覧', description: '患者の基本情報の閲覧' },
  { id: 'patient:write', name: '患者情報編集', description: '患者情報の編集と新規登録' },
  { id: 'chart:read', name: 'カルテ閲覧', description: 'カルテ記録の閲覧' },
  { id: 'chart:write', name: 'カルテ記入', description: '新規カルテの記入' },
  { id: 'chart:edit', name: 'カルテ修正', description: '既存カルテの修正' }
];

export default function StaffEdit() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { staffList, updateStaff } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const staff = staffList.find(s => s.id === staffId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EditStaffFormData>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      fullName: staff?.fullName || '',
      email: staff?.email || '',
      department: staff?.department || '',
      position: staff?.position || '',
      permissions: staff?.permissions || []
    }
  });

  useEffect(() => {
    if (!staff) {
      navigate('/admin/staff');
    }
  }, [staff, navigate]);

  const onSubmit = async (data: EditStaffFormData) => {
    if (!staffId) return;

    try {
      setError(null);
      await updateStaff(staffId, data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/staff');
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'スタッフ情報の更新に失敗しました');
    }
  };

  if (!staff) {
    return null;
  }

  return (
    <PageTransition>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/staff')}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-mono-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-mono-900">スタッフ情報の編集</h1>
            <p className="text-mono-500">スタッフの基本情報と権限を編集できます</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-600">
            <AlertCircle className="h-5 w-5" />
            <span>スタッフ情報を更新しました</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-mono-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-mono-700">
                氏名
              </label>
              <input
                type="text"
                {...register('fullName')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700">
                メールアドレス
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700">
                部署
              </label>
              <input
                type="text"
                {...register('department')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700">
                役職
              </label>
              <input
                type="text"
                {...register('position')}
                className="mt-1 block w-full rounded-lg border-mono-200 shadow-sm focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-medium text-mono-700">権限設定</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STAFF_PERMISSIONS.map(permission => (
                  <label
                    key={permission.id}
                    className="flex items-start gap-3 p-4 bg-mono-50 rounded-lg hover:bg-mono-100 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={permission.id}
                      {...register('permissions')}
                      className="mt-1 rounded border-mono-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-medium text-mono-900">
                        {permission.name}
                      </div>
                      <div className="text-sm text-mono-500">
                        {permission.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/staff')}
                className="px-4 py-2 text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
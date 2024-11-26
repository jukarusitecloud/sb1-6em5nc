import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Building, Briefcase, AlertCircle, Power } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../PageTransition';

export default function StaffManagement() {
  const navigate = useNavigate();
  const { staffList, toggleStaffActive } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [updatingStaffId, setUpdatingStaffId] = useState<string | null>(null);

  const handleToggleActive = async (staffId: string) => {
    try {
      setError(null);
      setUpdatingStaffId(staffId);
      await toggleStaffActive(staffId);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'スタッフの状態更新に失敗しました');
    } finally {
      setUpdatingStaffId(null);
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mono-900">スタッフ一覧</h1>
            <p className="mt-2 text-mono-500">
              スタッフアカウントの有効化・無効化を管理します
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/staff/new')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              新規登録
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((staff, index) => (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border border-mono-200 p-6 ${
                !staff.isActive ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-mono-900">
                    {staff.fullName}
                  </h3>
                  <p className="text-mono-500">{staff.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleActive(staff.id)}
                    disabled={updatingStaffId === staff.id}
                    className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      staff.isActive
                        ? 'bg-green-500 focus:ring-green-500'
                        : 'bg-mono-200 focus:ring-mono-500'
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                        staff.isActive ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                    {updatingStaffId === staff.id && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {staff.department && (
                  <div className="flex items-center gap-2 text-mono-600">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{staff.department}</span>
                  </div>
                )}

                {staff.position && (
                  <div className="flex items-center gap-2 text-mono-600">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">{staff.position}</span>
                  </div>
                )}

                <div className="pt-4 mt-4 border-t border-mono-100">
                  <button
                    onClick={() => navigate(`/admin/staff/edit/${staff.id}`)}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    詳細情報を編集
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
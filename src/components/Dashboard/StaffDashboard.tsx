import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Activity, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../contexts/PatientContext';
import PageTransition from '../PageTransition';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const today = new Date();

  const stats = [
    {
      title: '通院中の患者数',
      value: patients.filter(p => p.status === 'active').length,
      icon: <Users className="h-6 w-6 text-mono-600" />,
      onClick: () => navigate('/active-patients')
    },
    {
      title: '新規患者数（今月）',
      value: patients.filter(p => {
        const firstVisit = new Date(p.firstVisitDate);
        return firstVisit.getMonth() === today.getMonth() &&
               firstVisit.getFullYear() === today.getFullYear();
      }).length,
      icon: <UserPlus className="h-6 w-6 text-mono-600" />,
      onClick: () => navigate('/new-registration')
    }
  ];

  const quickActions = [
    {
      title: '新規患者登録',
      description: '新しい患者様の登録を行います',
      icon: <UserPlus className="h-8 w-8 text-mono-600" />,
      onClick: () => navigate('/new-registration')
    },
    {
      title: '通院患者一覧',
      description: '現在通院中の患者様の一覧を表示します',
      icon: <Users className="h-8 w-8 text-mono-600" />,
      onClick: () => navigate('/active-patients')
    }
  ];

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mono-900">ダッシュボード</h1>
            <p className="text-mono-500 mt-1">
              {format(today, 'yyyy年M月d日（E）', { locale: ja })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={stat.onClick}
              className="bg-white p-6 rounded-xl shadow-sm border border-mono-200 cursor-pointer hover:border-mono-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                {stat.icon}
                <span className="text-2xl font-bold text-mono-900">{stat.value}</span>
              </div>
              <h3 className="text-mono-600 text-sm">{stat.title}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={action.onClick}
              className="bg-white p-6 rounded-xl shadow-sm border border-mono-200 cursor-pointer hover:border-mono-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                {action.icon}
                <div>
                  <h3 className="text-lg font-medium text-mono-900">{action.title}</h3>
                  <p className="text-mono-500 text-sm">{action.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
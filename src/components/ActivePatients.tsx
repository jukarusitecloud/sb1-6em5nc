import React, { useState } from 'react';
import { Search, UserPlus, Calendar, Phone, Mail, Clock, ArrowRight, Filter } from 'lucide-react';
import { usePatients } from '../contexts/PatientContext';
import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivePatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const { patients } = usePatients();
  const navigate = useNavigate();

  const activePatients = patients.filter(p => p.status === 'active');

  const filteredPatients = activePatients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastNameKana.toLowerCase().includes(searchLower) ||
      patient.firstNameKana.toLowerCase().includes(searchLower)
    );
  });

  return (
    <PageTransition>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-mono-900">現在の通院患者</h1>
          <div className="flex gap-4">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
              <input
                type="text"
                placeholder="患者を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-400 w-64"
              />
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/new-registration')}
              className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800"
            >
              <UserPlus className="h-5 w-5" />
              <span>新規登録</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => {
            const weeks = differenceInWeeks(new Date(), new Date(patient.firstVisitDate));
            const days = differenceInDays(new Date(), new Date(patient.firstVisitDate)) % 7;

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-mono-200 hover:border-mono-300 transition-colors cursor-pointer"
                onClick={() => navigate(`/patient/${patient.id}/chart`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-mono-900">
                      {patient.lastName} {patient.firstName}
                    </h3>
                    <p className="text-mono-500 text-sm">
                      {patient.lastNameKana} {patient.firstNameKana}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-mono-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-mono-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-mono-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      通院期間: {weeks}w {days}d
                    </span>
                  </div>

                  {patient.phone && (
                    <div className="flex items-center gap-2 text-mono-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{patient.phone}</span>
                    </div>
                  )}

                  {patient.email && (
                    <div className="flex items-center gap-2 text-mono-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{patient.email}</span>
                    </div>
                  )}
                </div>

                {patient.records && patient.records.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-mono-100">
                    <p className="text-sm text-mono-500">
                      最終来院: {format(new Date(patient.records[patient.records.length - 1].date), 'yyyy年M月d日', { locale: ja })}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12 text-mono-500">
            該当する患者が見つかりません
          </div>
        )}
      </div>
    </PageTransition>
  );
}
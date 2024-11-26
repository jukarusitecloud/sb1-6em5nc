import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';
import { usePatients } from '../../contexts/PatientContext';
import PageTransition from '../PageTransition';
import PatientList from './PatientList';

export default function ChartManagement() {
  const { patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');

  // 1つ以上のカルテ記録がある患者のみをフィルタリング
  const patientsWithRecords = patients.filter(patient => 
    patient.chartEntries && patient.chartEntries.length > 0
  );

  const filteredPatients = patientsWithRecords.filter(patient => {
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
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">カルテ修正</h1>
          <p className="mt-2 text-mono-500">
            患者ごとのカルテ記録を管理します
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
            <input
              type="text"
              placeholder="患者を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-96 border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-400"
            />
          </div>
        </div>

        {filteredPatients.length > 0 ? (
          <PatientList patients={filteredPatients} />
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-8 w-8 text-mono-400 mx-auto mb-3" />
            <p className="text-mono-500">
              {searchTerm ? '該当する患者が見つかりません' : 'カルテ記録のある患者がいません'}
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
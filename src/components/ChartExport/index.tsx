import React, { useState } from 'react';
import { usePatients } from '../../contexts/PatientContext';
import { motion } from 'framer-motion';
import { FileText, Download, Search, AlertCircle } from 'lucide-react';
import { TextExporter } from './TextExporter';
import { CSVExporter } from './CSVExporter';
import { JSONExporter } from './JSONExporter';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import PageTransition from '../PageTransition';
import { saveAs } from 'file-saver';

export default function ChartExport() {
  const { patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastNameKana.toLowerCase().includes(searchLower) ||
      patient.firstNameKana.toLowerCase().includes(searchLower)
    );
  });

  const handleExport = async (patientId: string, exportFormat: 'txt' | 'csv' | 'json') => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      setError('患者データが見つかりません');
      return;
    }

    try {
      setLoading(`${patient.lastName}${patient.firstName}の${exportFormat.toUpperCase()}を出力中...`);
      setError(null);

      const currentDate = format(new Date(), 'yyyyMMdd', { locale: ja });
      const fileName = `診療記録_${patient.lastName}${patient.firstName}_${currentDate}`;

      let blob: Blob;
      switch (exportFormat) {
        case 'txt': {
          const textContent = await TextExporter.generate(patient);
          blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), textContent], { 
            type: 'text/plain;charset=utf-8'
          });
          saveAs(blob, `${fileName}.txt`);
          break;
        }
        case 'csv': {
          const csvContent = await CSVExporter.generate(patient);
          blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { 
            type: 'text/csv;charset=utf-8'
          });
          saveAs(blob, `${fileName}.csv`);
          break;
        }
        case 'json': {
          const jsonContent = await JSONExporter.generate(patient);
          blob = new Blob([jsonContent], { 
            type: 'application/json'
          });
          saveAs(blob, `${fileName}.json`);
          break;
        }
      }
    } catch (error) {
      console.error(`[Export Error] Format: ${exportFormat}:`, error);
      setError(`出力に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mono-900">カルテ出力</h1>
          <p className="mt-2 text-mono-500">
            患者ごとの診療記録をテキスト、CSV、JSONフォーマットで出力できます。
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
            <span>{loading}</span>
          </div>
        )}

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

        <div className="grid gap-6">
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-mono-200 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-mono-900">
                    {patient.lastName} {patient.firstName}
                  </h2>
                  <p className="text-mono-500">
                    {patient.lastNameKana} {patient.firstNameKana}
                  </p>
                  <div className="mt-2 text-sm text-mono-600">
                    <p>
                      初診日: {format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja })}
                    </p>
                    <p>
                      記録件数: {patient.chartEntries?.length || 0}件
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleExport(patient.id, 'txt')}
                    disabled={loading !== null}
                    className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 disabled:opacity-50 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    テキスト
                  </button>
                  <button
                    onClick={() => handleExport(patient.id, 'csv')}
                    disabled={loading !== null}
                    className="flex items-center gap-2 px-4 py-2 border border-mono-200 text-mono-600 rounded-lg hover:bg-mono-50 disabled:opacity-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport(patient.id, 'json')}
                    disabled={loading !== null}
                    className="flex items-center gap-2 px-4 py-2 border border-mono-200 text-mono-600 rounded-lg hover:bg-mono-50 disabled:opacity-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    JSON
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPatients.length === 0 && (
            <div className="text-center py-12 text-mono-500">
              該当する患者が見つかりません
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
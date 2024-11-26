import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Search, Download, Filter, Calendar, Activity, Database } from 'lucide-react';
import PageTransition from '../../PageTransition';
import LogList from './LogList';
import LogTypeFilter from './LogTypeFilter';
import { LogType } from './types';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<LogType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleExport = () => {
    const data = {
      type: selectedType,
      startDate,
      endDate,
      searchTerm
    };
    console.log('Export logs:', data);
    // TODO: Implement log export functionality
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-mono-900">監査ログ</h1>
              <p className="text-mono-500">システムへのアクセスと操作の記録</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-mono-100 text-mono-700 rounded-lg hover:bg-mono-200 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">フィルター</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">エクスポート</span>
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="bg-white rounded-xl shadow-sm border border-mono-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  検索
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="ログを検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  開始日
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  終了日
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <LogTypeFilter
                selectedType={selectedType}
                onTypeChange={setSelectedType}
              />
            </div>
          </div>
        </motion.div>

        <LogList
          searchTerm={searchTerm}
          selectedType={selectedType}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </PageTransition>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { LogType } from './types';
import LogItem from './LogItem';
import { useMockLogs } from './useMockLogs';

interface LogListProps {
  searchTerm: string;
  selectedType: LogType;
  startDate: string;
  endDate: string;
}

export default function LogList({ 
  searchTerm, 
  selectedType,
  startDate,
  endDate 
}: LogListProps) {
  const logs = useMockLogs();

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || log.type === selectedType;
    
    const logDate = new Date(log.timestamp);
    const matchesStartDate = !startDate || logDate >= new Date(startDate);
    const matchesEndDate = !endDate || logDate <= new Date(endDate);

    return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
  });

  if (filteredLogs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-xl shadow-sm border border-mono-200"
      >
        <AlertCircle className="h-8 w-8 text-mono-400 mx-auto mb-3" />
        <p className="text-mono-500">
          該当するログが見つかりません
        </p>
        <p className="text-sm text-mono-400 mt-1">
          検索条件を変更してお試しください
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-mono-500 px-2">
        <span>{filteredLogs.length} 件のログが見つかりました</span>
        <span>
          {format(new Date(filteredLogs[0].timestamp), 'yyyy年M月d日')} から
          {format(new Date(filteredLogs[filteredLogs.length - 1].timestamp), 'yyyy年M月d日')} まで
        </span>
      </div>
      {filteredLogs.map((log, index) => (
        <LogItem
          key={log.id}
          log={log}
          index={index}
        />
      ))}
    </div>
  );
}
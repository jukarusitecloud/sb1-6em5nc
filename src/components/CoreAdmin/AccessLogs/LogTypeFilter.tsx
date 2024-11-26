import React from 'react';
import { LogType } from './types';
import { Filter } from 'lucide-react';

interface LogTypeFilterProps {
  selectedType: LogType;
  onTypeChange: (type: LogType) => void;
}

export default function LogTypeFilter({ selectedType, onTypeChange }: LogTypeFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-mono-700 mb-1">
        ログの種類
      </label>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 h-5 w-5" />
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as LogType)}
          className="pl-10 w-full px-4 py-2 border border-mono-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none bg-white"
        >
          <option value="all">すべてのログ</option>
          <option value="auth">認証ログ</option>
          <option value="system">システムログ</option>
          <option value="data">データログ</option>
          <option value="security">セキュリティログ</option>
        </select>
      </div>
    </div>
  );
}
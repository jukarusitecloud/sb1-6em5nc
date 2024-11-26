import React from 'react';
import { ArrowLeft, Clock, Download } from 'lucide-react';

interface ChartHeaderProps {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  onBack: () => void;
  onToggleHistory: () => void;
  onExport: () => void;
  showHistory: boolean;
}

export default function ChartHeader({
  lastName,
  firstName,
  lastNameKana,
  firstNameKana,
  onBack,
  onToggleHistory,
  onExport,
  showHistory
}: ChartHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-mono-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-mono-900">
            {lastName} {firstName}
          </h1>
          <p className="text-mono-500">
            {lastNameKana} {firstNameKana}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleHistory}
          className="flex items-center gap-2 px-4 py-2 text-mono-600 hover:text-mono-900 hover:bg-mono-100 rounded-lg transition-colors"
        >
          <Clock className="h-5 w-5" />
          <span className="hidden sm:inline">{showHistory ? '新規記録' : '履歴を表示'}</span>
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-mono-800 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span className="hidden sm:inline">カルテを出力</span>
        </button>
      </div>
    </div>
  );
}
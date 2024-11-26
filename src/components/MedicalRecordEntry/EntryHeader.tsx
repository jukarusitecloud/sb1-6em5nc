import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface EntryHeaderProps {
  onBack: () => void;
}

export default function EntryHeader({ onBack }: EntryHeaderProps) {
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
          <h1 className="text-2xl font-bold text-mono-900">診療記録入力</h1>
          <p className="text-mono-500">新しい診療記録を作成します</p>
        </div>
      </div>
    </div>
  );
}
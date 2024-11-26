import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TreatmentRecordDisplayProps } from './types';

export default function TreatmentRecordDisplay({
  date,
  content,
  therapyMethods,
  memoryBarValues,
  firstVisitDate
}: TreatmentRecordDisplayProps) {
  const recordDays = differenceInDays(new Date(date), new Date(firstVisitDate));
  const recordWeeks = Math.floor(recordDays / 7);
  const recordRemDays = recordDays % 7;

  return (
    <div className="border-b border-mono-100 last:border-0 pb-4 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-mono-600">
          {format(new Date(date), 'yyyy年M月d日（E）', { locale: ja })}
          <span className="ml-2">
            ({recordWeeks}w{recordRemDays}d)
          </span>
        </div>
      </div>
      <p className="text-mono-900 whitespace-pre-wrap">{content}</p>
      {therapyMethods.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {therapyMethods.map(method => (
            <span key={method} className="px-2 py-1 bg-mono-100 rounded-full text-xs text-mono-600">
              {method}
            </span>
          ))}
        </div>
      )}
      {Object.entries(memoryBarValues).length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-4">
          {Object.entries(memoryBarValues).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="text-mono-600">{key}:</span>
              <span className="ml-2 text-mono-900">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
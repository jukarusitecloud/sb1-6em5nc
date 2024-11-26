import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Download, Receipt } from 'lucide-react';

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'failed' | 'refunded';
  invoiceUrl?: string;
}

const mockBillingHistory: BillingRecord[] = [
  {
    id: '1',
    date: '2024-03-15',
    amount: 2980,
    status: 'success',
    invoiceUrl: '#'
  },
  {
    id: '2',
    date: '2024-02-15',
    amount: 2980,
    status: 'success',
    invoiceUrl: '#'
  }
];

export default function BillingHistory() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-mono-200 p-6">
      <h2 className="text-xl font-bold text-mono-900 mb-6">
        請求履歴
      </h2>

      <div className="space-y-4">
        {mockBillingHistory.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-mono-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-full">
                <Receipt className="h-5 w-5 text-mono-600" />
              </div>
              <div>
                <p className="font-medium text-mono-900">
                  ¥{record.amount.toLocaleString()}
                </p>
                <p className="text-sm text-mono-500">
                  {format(new Date(record.date), 'yyyy年M月d日', { locale: ja })}
                </p>
              </div>
            </div>

            {record.invoiceUrl && (
              <a
                href={record.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-mono-600 hover:bg-mono-100 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                領収書
              </a>
            )}
          </motion.div>
        ))}

        {mockBillingHistory.length === 0 && (
          <div className="text-center py-8 text-mono-500">
            請求履歴はありません
          </div>
        )}
      </div>
    </div>
  );
}
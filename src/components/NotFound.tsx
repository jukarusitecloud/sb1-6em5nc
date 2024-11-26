import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mono-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <AlertCircle className="h-12 w-12 text-mono-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-mono-900 mb-2">404</h1>
        <p className="text-mono-500">ページが見つかりません</p>
      </motion.div>
    </div>
  );
}
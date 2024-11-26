import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { PlanType, PLANS } from '../../contexts/SubscriptionContext';
import PaymentForm from './PaymentForm';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: PlanType;
  isYearly: boolean;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  planId,
  isYearly
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const plan = PLANS[planId];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-mono-900">
              {plan.name}へのアップグレード
            </h2>
            <p className="text-mono-500 mt-1">
              ¥{(isYearly ? plan.yearlyPrice : plan.price).toLocaleString()}/{isYearly ? '年' : '月'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-mono-600" />
          </button>
        </div>

        <PaymentForm
          planId={planId}
          isYearly={isYearly}
          onSuccess={() => {
            onClose();
          }}
          onCancel={onClose}
        />
      </motion.div>
    </motion.div>
  );
}
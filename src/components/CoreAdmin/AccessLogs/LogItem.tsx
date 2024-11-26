import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MapPin, Monitor, Shield, Settings, Database, User, Clock } from 'lucide-react';
import { AuditLog } from './types';

interface LogItemProps {
  log: AuditLog;
  index: number;
}

export default function LogItem({ log, index }: LogItemProps) {
  const getLogIcon = () => {
    switch (log.type) {
      case 'auth':
        return <Shield className="h-5 w-5 text-blue-600" />;
      case 'system':
        return <Settings className="h-5 w-5 text-green-600" />;
      case 'data':
        return <Database className="h-5 w-5 text-purple-600" />;
      case 'security':
        return <Shield className="h-5 w-5 text-red-600" />;
      default:
        return <Settings className="h-5 w-5 text-mono-600" />;
    }
  };

  const getSeverityStyles = () => {
    switch (log.severity) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white rounded-xl shadow-sm border border-mono-200 p-6 hover:border-purple-200 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-mono-100 rounded-lg group-hover:bg-purple-50 transition-colors">
            {getLogIcon()}
          </div>
          <div>
            <h3 className="font-medium text-mono-900">{log.action}</h3>
            <div className="flex items-center gap-2 text-mono-500 text-sm">
              <Clock className="h-4 w-4" />
              <time dateTime={log.timestamp}>
                {format(new Date(log.timestamp), 'yyyy年M月d日 HH:mm', { locale: ja })}
              </time>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityStyles()}`}>
          {log.severity === 'error' ? '重要' : log.severity === 'warning' ? '警告' : '情報'}
        </span>
      </div>

      <p className="text-sm text-mono-600 mb-4 bg-mono-50 p-3 rounded-lg">
        {log.details}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-mono-600">
          <User className="h-4 w-4" />
          <span>{log.user}</span>
        </div>

        {log.ip && (
          <div className="flex items-center gap-2 text-mono-600">
            <MapPin className="h-4 w-4" />
            <span>
              {log.location ? `${log.location} (${log.ip})` : log.ip}
            </span>
          </div>
        )}

        {log.userAgent && (
          <div className="flex items-center gap-2 text-mono-600 md:col-span-2">
            <Monitor className="h-4 w-4" />
            <span className="truncate" title={log.userAgent}>
              {log.userAgent}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
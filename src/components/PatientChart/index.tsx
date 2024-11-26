import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatients } from '../contexts/PatientContext';
import { useTherapySettings } from '../contexts/TherapySettingsContext';
import { useTreatmentTemplates } from '../contexts/TreatmentTemplatesContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Save, ArrowLeft, Clock, AlertCircle, FileText, ChevronDown, ChevronUp, PenSquare } from 'lucide-react';
import PageTransition from './PageTransition';
import TemplateSelector from './PatientChart/TemplateSelector';
import TreatmentHistory from './PatientChart/TreatmentHistory';

// ... (previous code remains the same until the return statement)

  return (
    <PageTransition>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/active-patients')}
              className="p-2 hover:bg-mono-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-mono-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-mono-900">
                {patient.lastName} {patient.firstName}
              </h1>
              <p className="text-mono-500">
                {patient.lastNameKana} {patient.firstNameKana}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
          >
            {showHistory ? (
              <>
                <PenSquare className="h-6 w-6 transition-transform group-hover:rotate-12" />
                <span className="hidden sm:inline">新規記録を作成</span>
              </>
            ) : (
              <>
                <Clock className="h-6 w-6" />
                <span className="hidden sm:inline">履歴を表示</span>
              </>
            )}
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>
        </div>

        {/* ... (rest of the code remains the same) */}
      </div>
    </PageTransition>
  );
}
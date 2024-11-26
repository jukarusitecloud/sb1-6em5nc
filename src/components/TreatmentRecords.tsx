import React, { useState } from 'react';
import { Search, Calendar, Clock, FileText, Tag, AlertCircle, Stethoscope, Pill, Activity } from 'lucide-react';

const treatments = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    patientImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
    date: "2024-03-15",
    time: "09:30 AM",
    type: "Consultation",
    doctor: "Dr. Michael Brown",
    department: "Endocrinology",
    diagnosis: "Type 2 Diabetes",
    vitals: {
      bloodPressure: "130/85",
      heartRate: "78",
      temperature: "98.6°F",
      oxygenSaturation: "98%"
    },
    medications: [
      { name: "Metformin", dosage: "1000mg", frequency: "Twice daily" },
      { name: "Glipizide", dosage: "5mg", frequency: "Once daily" }
    ],
    notes: "Patient reported improved blood sugar levels. A1C decreased from 7.8 to 7.2. Continuing current medication regimen with dietary modifications.",
    followUp: "2024-03-29",
    priority: "routine"
  },
  {
    id: 2,
    patientName: "Michael Chen",
    patientImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
    date: "2024-03-14",
    time: "02:15 PM",
    type: "Emergency",
    doctor: "Dr. Emily Wilson",
    department: "Cardiology",
    diagnosis: "Acute Myocardial Infarction",
    vitals: {
      bloodPressure: "160/95",
      heartRate: "92",
      temperature: "98.8°F",
      oxygenSaturation: "95%"
    },
    medications: [
      { name: "Aspirin", dosage: "325mg", frequency: "Immediate" },
      { name: "Nitroglycerin", dosage: "0.4mg", frequency: "As needed" }
    ],
    notes: "Patient admitted with severe chest pain. ECG showed ST elevation. Immediate cardiac catheterization performed. Started on dual antiplatelet therapy.",
    followUp: "2024-03-16",
    priority: "high"
  },
  {
    id: 3,
    patientName: "Emily Davis",
    patientImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
    date: "2024-03-12",
    time: "11:00 AM",
    type: "Routine Checkup",
    doctor: "Dr. Sarah Martinez",
    department: "Obstetrics",
    diagnosis: "Routine Prenatal Visit",
    vitals: {
      bloodPressure: "118/75",
      heartRate: "82",
      temperature: "98.4°F",
      oxygenSaturation: "99%"
    },
    medications: [
      { name: "Prenatal Vitamins", dosage: "1 tablet", frequency: "Daily" },
      { name: "Folic Acid", dosage: "400mcg", frequency: "Daily" }
    ],
    notes: "32 weeks pregnant. Fetal heart rate 140 bpm. Normal fundal height. All screening tests normal. Patient reports regular fetal movement.",
    followUp: "2024-03-26",
    priority: "routine"
  }
];

export default function TreatmentRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = 
      treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || treatment.type.toLowerCase() === selectedType.toLowerCase();
    const matchesPriority = selectedPriority === 'all' || treatment.priority === selectedPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Treatment Records</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="emergency">Emergency</option>
            <option value="routine checkup">Routine Checkup</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="routine">Routine</option>
          </select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            New Record
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredTreatments.map((treatment) => (
          <div key={treatment.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <img 
                    src={treatment.patientImage} 
                    alt="" 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{treatment.patientName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Stethoscope className="h-4 w-4" />
                      {treatment.doctor} - {treatment.department}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${treatment.type === 'Emergency' ? 'bg-red-100 text-red-800' :
                      treatment.type === 'Consultation' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'}`}>
                    {treatment.type}
                  </span>
                  {treatment.priority === 'high' && (
                    <span className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">High Priority</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Date: {treatment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Time: {treatment.time}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <h4 className="font-medium text-gray-900">Diagnosis</h4>
                </div>
                <p className="text-sm text-gray-700 ml-6">{treatment.diagnosis}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <h4 className="font-medium text-gray-900">Vitals</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-6">
                  <div className="text-sm">
                    <span className="text-gray-500">BP:</span>
                    <span className="ml-2 text-gray-700">{treatment.vitals.bloodPressure}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">HR:</span>
                    <span className="ml-2 text-gray-700">{treatment.vitals.heartRate}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Temp:</span>
                    <span className="ml-2 text-gray-700">{treatment.vitals.temperature}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">O2:</span>
                    <span className="ml-2 text-gray-700">{treatment.vitals.oxygenSaturation}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="h-4 w-4 text-gray-400" />
                  <h4 className="font-medium text-gray-900">Medications</h4>
                </div>
                <div className="ml-6 space-y-2">
                  {treatment.medications.map((med, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {med.name} - {med.dosage} ({med.frequency})
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <h4 className="font-medium text-gray-900">Treatment Notes</h4>
                </div>
                <p className="text-sm text-gray-700 ml-6">{treatment.notes}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Follow-up: {treatment.followUp}
                </div>
                <div className="flex gap-3">
                  <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Print Record
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    Edit Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
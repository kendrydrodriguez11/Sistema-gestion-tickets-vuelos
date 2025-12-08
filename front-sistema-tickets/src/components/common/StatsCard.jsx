import React from 'react';

export default function StatsCard({ icon: Icon, label, value, bgColor = 'bg-blue-50' }) {
  return (
    <div className={`${bgColor} rounded-xl p-6 text-center`}>
      <div className="flex justify-center mb-3">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
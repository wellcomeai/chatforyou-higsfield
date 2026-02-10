
import React from 'react';

interface NeonSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

export const NeonSelect: React.FC<NeonSelectProps> = ({ label, value, options, onChange }) => (
  <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group">
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-bold text-gray-200">{value}</span>
      <svg className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </button>
);

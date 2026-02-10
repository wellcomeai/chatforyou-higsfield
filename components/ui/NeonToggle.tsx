
import React from 'react';

interface NeonToggleProps {
  label: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
  icon?: React.ReactNode;
}

export const NeonToggle: React.FC<NeonToggleProps> = ({ label, enabled, onChange, icon }) => (
  <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all">
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-bold text-gray-300">{label}</span>
      {icon}
    </div>
    <button 
      onClick={() => onChange(!enabled)}
      className={`w-10 h-5 rounded-full relative flex items-center px-0.5 transition-colors ${enabled ? 'bg-[#DFFF00]' : 'bg-white/10'}`}
    >
      <div className={`w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white/40'}`} />
    </button>
  </div>
);


import React from 'react';
import { useI18n } from '../i18n';
import { ToolDefinition } from '../types';

interface SmartBarProps {
  prompt: string;
  setPrompt: (p: string) => void;
  tool: ToolDefinition;
  steps: number;
  setSteps: (s: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const SmartBar: React.FC<SmartBarProps> = ({
  prompt, setPrompt, tool, steps, setSteps, onGenerate, 
  isGenerating, isRecording, isTranscribing, onStartRecording, onStopRecording
}) => {
  const { t } = useI18n();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-8">
      <div className="bg-[#0f0f0f] border border-white/5 rounded-[24px] p-2 flex flex-col gap-2 shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-2">
          <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
          <div className="flex-1 flex items-center gap-2">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={isTranscribing ? t.common.transcribing : t.workspace.placeholder}
              className={`flex-1 bg-transparent border-none outline-none text-[14px] font-medium transition-colors ${isTranscribing ? 'text-gray-500 italic' : 'text-gray-200'}`}
              onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
              disabled={isTranscribing}
            />
            <button 
              onMouseDown={onStartRecording} onMouseUp={onStopRecording} onMouseLeave={onStopRecording}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              title={t.common.holdToRecord}
            >
              {isTranscribing ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 p-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/5">
              <div className="w-4 h-4 rounded-md bg-[#DFFF00] flex items-center justify-center text-black text-[10px] font-black">G</div>
              <span className="text-[12px] font-bold text-gray-300">{tool.name}</span>
            </button>
            {tool.parameters.map(p => (
              <button key={p.id} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/5">
                <span className="text-[12px] font-bold text-gray-300">{p.defaultValue}</span>
              </button>
            ))}
            <div className="flex items-center bg-white/5 rounded-xl border border-white/5 overflow-hidden">
              <button onClick={() => setSteps(Math.max(1, steps - 1))} className="px-3 py-2 hover:bg-white/5 text-gray-500">—</button>
              <span className="text-[12px] font-bold text-gray-300 min-w-[30px] text-center">{steps}/4</span>
              <button onClick={() => setSteps(Math.min(4, steps + 1))} className="px-3 py-2 hover:bg-white/5 text-gray-500">+</button>
            </div>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/5">
              <span className="text-[12px] font-bold text-gray-300">{t.workspace.draw}</span>
            </button>
          </div>
          <button 
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-[#DFFF00] text-black h-[52px] px-8 rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30"
          >
            {t.workspace.generate} <span className="opacity-60">✦ 2</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartBar;

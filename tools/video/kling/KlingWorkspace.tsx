
import React, { useState } from 'react';
import { ToolDefinition } from '../../../types';
import { ApiService } from '../../../services/apiService';
import { useVoiceInput } from '../../../hooks/useVoiceInput';
import { useI18n } from '../../../i18n';
import { klingTranslations } from './i18n';
import { NeonToggle } from '../../../components/ui/NeonToggle';
import { NeonSelect } from '../../../components/ui/NeonSelect';
import { DbService } from '../../../services/dbService';

interface KlingWorkspaceProps {
  tool: ToolDefinition;
  user: any;
  onUserUpdate: (userData: any) => void;
}

const KlingWorkspace: React.FC<KlingWorkspaceProps> = ({ tool, user, onUserUpdate }) => {
  const { lang, t: globalT } = useI18n();
  const t = klingTranslations[lang];
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [params, setParams] = useState({ duration: '5s', aspect: '16:9' });
  const [error, setError] = useState<string | null>(null);

  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput((text) => {
    setPrompt(prev => prev ? `${prev} ${text}` : text);
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setResultUrl(null);
    setRawResponse(null);

    if (!user) {
      setError(globalT.auth.loginRequired);
      return;
    }

    if (user.credits_balance < 10) {
      setError("Недостаточно кредитов! (Нужно 10)");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await ApiService.generate({ 
        toolId: tool.apiId, 
        prompt, 
        params: { ...params, audio: audioEnabled } 
      }, user.bot_id, user.bot_token);

      if (response.success) {
        setResultUrl(response.url);
        setRawResponse(response.raw);
        
        // 1. Сохраняем в глобальный Showcase
        try {
          await DbService.addShowcaseItem(tool.id, response.url, prompt);
        } catch (dbErr) {
          console.error("Failed to save to showcase:", dbErr);
        }

        // 2. Сохраняем в личную историю с api_task_id
        try {
          await DbService.addGenerationRecord(user.id, tool.id, response.url, prompt, 10, response.raw.task_id);
        } catch (dbErr) {
          console.error("Failed to save to user history:", dbErr);
        }

        const newBalance = await DbService.deductCredits(user.id, 10);
        onUserUpdate({ ...user, credits_balance: newBalance });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Generation error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] pt-[52px] overflow-hidden">
      {/* Control Panel */}
      <div className="w-[340px] border-r border-white/5 bg-[#0a0a0a] flex flex-col h-full overflow-y-auto no-scrollbar">
        <div className="flex border-b border-white/5 px-2">
          {['create', 'edit', 'motion'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 text-[11px] font-bold uppercase tracking-tight transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-gray-500'
              }`}
            >
              {t[tab as keyof typeof t]}
              {activeTab === tab && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white" />}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-500 text-[11px] font-bold text-center">
              {error}
            </div>
          )}

          {/* Preset Info */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#111] group">
            <img src="https://picsum.photos/seed/monk/400/225" className="w-full h-full object-cover opacity-60" alt="Preset" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-[#DFFF00] text-lg font-black uppercase italic tracking-tighter leading-none">GENERAL</h3>
              <p className="text-gray-400 text-[10px] font-bold">{tool.name}</p>
            </div>
          </div>

          {/* Prompt Area */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Prompt</label>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 focus-within:border-white/20 transition-all relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isTranscribing ? globalT.common.transcribing : t.promptPlaceholder}
                className="w-full bg-transparent border-none outline-none text-[13px] text-gray-200 min-h-[100px] resize-none leading-relaxed placeholder:text-gray-600"
              />
              <div className="flex justify-between items-center mt-2">
                <button className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
                  <span className="text-[10px] font-bold text-white uppercase italic">{t.enhance}</span>
                </button>
                <button onMouseDown={startRecording} onMouseUp={stopRecording} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/5 text-gray-400'}`}>
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic / UI Kit Controls */}
          <div className="space-y-1">
            <NeonToggle 
              label={t.audio} 
              enabled={audioEnabled} 
              onChange={setAudioEnabled} 
              icon={<svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>}
            />
            
            <NeonSelect label={t.model} value="Kling 2.6" options={['Kling 2.6']} onChange={() => {}} />

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="flex flex-col p-3 rounded-2xl bg-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t.duration}</span>
                <span className="text-sm font-black">5s</span>
              </div>
              <div className="flex flex-col p-3 rounded-2xl bg-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t.aspectRatio}</span>
                <span className="text-sm font-black">16:9</span>
              </div>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full bg-[#DFFF00] text-black h-[56px] rounded-2xl font-black text-[15px] uppercase hover:opacity-90 active:scale-95 transition-all shadow-[0_10px_30px_rgba(223,255,0,0.15)] disabled:opacity-30">
            {isGenerating ? globalT.common.processing : <>{t.generate} <span className="opacity-60 text-lg">✦ 10</span></>}
          </button>
        </div>
      </div>

      {/* Main Hero Area */}
      <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto">
        <div className="h-[52px] border-b border-white/5 flex items-center justify-start gap-4 px-6 shrink-0 bg-black/50 backdrop-blur-xl">
          <button className="text-[11px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">{globalT.common.history}</button>
          <button className="text-[11px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">{globalT.common.howItWorks}</button>
        </div>

        <div className="flex-1 p-12 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
           {!resultUrl && !isGenerating && (
             <>
               <div className="text-center space-y-4 mb-16 max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                  <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">{t.heroTitle}</h1>
                  <p className="text-gray-500 text-lg font-medium leading-relaxed">{t.heroDesc}</p>
               </div>

               <div className="grid grid-cols-3 gap-8 w-full">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-8 flex flex-col items-center text-center group hover:border-white/10 transition-all relative">
                       <div className="w-full aspect-video rounded-3xl bg-black border border-white/5 mb-8 flex items-center justify-center overflow-hidden">
                          <img src={`https://picsum.photos/seed/kling-step-${step}/400/225`} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt={`Step ${step}`} />
                       </div>
                       <h3 className="text-xl font-black text-white uppercase mb-2 tracking-tight">
                         {t[`step${step}Title` as keyof typeof t]}
                       </h3>
                       <p className="text-gray-500 text-xs font-bold leading-relaxed">
                         {t[`step${step}Desc` as keyof typeof t]}
                       </p>
                    </div>
                  ))}
               </div>
             </>
           )}

           {isGenerating && (
             <div className="flex flex-col items-center gap-8">
               <div className="w-24 h-24 border-4 border-[#DFFF00]/10 border-t-[#DFFF00] rounded-full animate-spin"></div>
               <div className="text-center space-y-2">
                 <p className="text-[#DFFF00] text-xl font-black uppercase italic tracking-widest animate-pulse">{globalT.common.processing}</p>
                 <p className="text-gray-600 text-xs font-bold uppercase tracking-tighter">Please wait while we bake your cinematic video...</p>
               </div>
             </div>
           )}

           {resultUrl && (
             <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] bg-black animate-in fade-in zoom-in duration-500 relative group/result">
                <video src={resultUrl} controls className="w-full h-full object-contain" autoPlay loop />
                
                {rawResponse && (
                  <button 
                    onClick={() => setShowRaw(true)}
                    className="absolute top-4 right-14 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover/result:opacity-100 transition-opacity hover:bg-black/60 text-gray-400 hover:text-white"
                    title="View Raw API Response"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}
             </div>
           )}
        </div>
      </div>

      {showRaw && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowRaw(false)} />
          <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 bg-transparent">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#DFFF00]">API RAW RESPONSE</h3>
              <button onClick={() => setShowRaw(false)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-8 pt-0 no-scrollbar max-h-[70vh]">
              <div className="bg-[#121212]/50 border border-white/5 rounded-2xl p-6">
                <pre className="text-[12px] font-mono text-gray-400 leading-relaxed whitespace-pre-wrap break-all selection:bg-[#DFFF00] selection:text-black">
                  {JSON.stringify(rawResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KlingWorkspace;

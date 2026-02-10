
import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../../../types';
import { ApiService } from '../../../services/apiService';
import { useVoiceInput } from '../../../hooks/useVoiceInput';
import { useI18n } from '../../../i18n';
import SmartBar from '../../../components/SmartBar';
import { bananaTranslations } from './i18n';
import { DbService } from '../../../services/dbService';

interface NanoBananaWorkspaceProps {
  tool: ToolDefinition;
  user: any;
  onUserUpdate: (userData: any) => void;
}

const NanoBananaWorkspace: React.FC<NanoBananaWorkspaceProps> = ({ tool, user, onUserUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [params, setParams] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [steps, setSteps] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { lang, t: globalT } = useI18n();
  const t = bananaTranslations[lang];

  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput((text) => {
    setPrompt(prev => prev ? `${prev} ${text}` : text);
  });

  useEffect(() => {
    const initialParams = tool.parameters.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue }), {});
    setParams(initialParams);
    setResult(null);
    setRawResponse(null);
    setPrompt('');
    setError(null);
  }, [tool]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);

    if (!user) {
      setError(globalT.auth.loginRequired);
      return;
    }

    if (user.credits_balance < 2) {
      setError(globalT.auth.insufficientCredits);
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setRawResponse(null);
    
    try {
      const response = await ApiService.generate({ 
        toolId: tool.apiId, 
        prompt, 
        params: { 
          img_model: params.img_model || 'img-google/flash-25',
          aspect_ratio: params.aspect_ratio || '1:1',
          img_size: '1024x1024'
        } 
      }, user.bot_id, user.bot_token);

      if (response.success) {
        setResult(response.url);
        setRawResponse(response.raw);
        
        // 1. Сохраняем в глобальный Showcase
        try {
          await DbService.addShowcaseItem(tool.id, response.url, prompt);
        } catch (dbErr) {
          console.error("Failed to save to showcase:", dbErr);
        }

        // 2. Сохраняем в личную историю с api_task_id
        try {
          await DbService.addGenerationRecord(user.id, tool.id, response.url, prompt, 2, response.raw.task_id);
        } catch (dbErr) {
          console.error("Failed to save to user history:", dbErr);
        }
        
        const newBalance = await DbService.deductCredits(user.id, 2);
        onUserUpdate({ ...user, credits_balance: newBalance });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Generation error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenOriginal = () => {
    if (result) window.open(result, '_blank');
  };

  const handleDownload = async () => {
    if (!result) return;
    try {
      const response = await fetch(result);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `neuroforge_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const link = document.createElement('a');
      link.href = result;
      link.target = '_blank';
      link.download = `neuroforge_${Date.now()}.jpg`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const shareText = globalT.common.promoText;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NeuroForge AI Generation',
          text: shareText,
          url: result
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(result)}&text=${encodeURIComponent(shareText)}`;
      window.open(tgUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden select-none">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {!result && !isGenerating && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="relative mb-8 w-24 h-24 mx-auto flex items-center justify-center">
               <div className="absolute inset-0 bg-[#DFFF00]/10 blur-3xl rounded-full"></div>
               <svg className="w-20 h-20 text-[#DFFF00] relative" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1"/>
               </svg>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">{tool.name}</h1>
            <p className="text-gray-500 text-sm font-medium tracking-wide italic uppercase">{t.subtitle}</p>
            
            {error && (
              <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-red-500 text-xs font-bold uppercase tracking-widest animate-bounce">
                {error}
              </div>
            )}
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-2 border-[#DFFF00]/20 border-t-[#DFFF00] rounded-full animate-spin"></div>
            <p className="text-[#DFFF00] text-sm font-black uppercase italic tracking-widest animate-pulse">{globalT.common.processing}</p>
          </div>
        )}

        {result && (
          <div className="max-w-4xl w-full aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 relative group/result">
             <img src={result} className="w-full h-full object-contain" alt="Result" />
             
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/result:opacity-100 transition-opacity">
               <button 
                 onClick={handleOpenOriginal}
                 className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/60 transition-all"
                 title={globalT.common.openOriginal}
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </button>
               <button 
                 onClick={handleDownload}
                 className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/60 transition-all"
                 title={globalT.common.download}
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </button>
               <button 
                 onClick={handleShare}
                 className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/60 transition-all"
                 title={globalT.common.share}
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </button>
             </div>

             {rawResponse && (
               <button 
                 onClick={() => setShowRaw(true)}
                 className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover/result:opacity-100 transition-opacity hover:bg-black/60 text-gray-400 hover:text-white"
                 title="View Raw API Response"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </button>
             )}
          </div>
        )}
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

      <SmartBar 
        prompt={prompt} setPrompt={setPrompt} tool={tool} steps={steps} setSteps={setSteps}
        onGenerate={handleGenerate} isGenerating={isGenerating} isRecording={isRecording}
        isTranscribing={isTranscribing} onStartRecording={startRecording} onStopRecording={stopRecording}
      />
    </div>
  );
};

export default NanoBananaWorkspace;

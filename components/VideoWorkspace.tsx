
import React, { useState } from 'react';
import { ToolDefinition } from '../types';
import { ApiService } from '../services/apiService';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useI18n } from '../i18n';

interface VideoWorkspaceProps {
  tool: ToolDefinition;
  // Added user and onUserUpdate props to match other workspace components
  user: any;
  onUserUpdate: (userData: any) => void;
}

const VideoWorkspace: React.FC<VideoWorkspaceProps> = ({ tool, user, onUserUpdate }) => {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [audioEnabled, setAudioEnabled] = useState(true);

  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceInput((text) => {
    setPrompt(prev => prev ? `${prev} ${text}` : text);
  });

  const handleGenerate = async () => {
    // Added user check and passing botId/botToken to ApiService.generate
    if (!prompt.trim() || !user) return;
    setIsGenerating(true);
    try {
      await ApiService.generate({ 
        toolId: tool.apiId, 
        prompt, 
        params: { audio: audioEnabled } 
      }, user.bot_id, user.bot_token);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] pt-[52px] overflow-hidden">
      {/* Sidebar - Control Panel */}
      <div className="w-[340px] border-r border-white/5 bg-[#0a0a0a] flex flex-col h-full overflow-y-auto no-scrollbar">
        {/* Tabs */}
        <div className="flex border-b border-white/5 px-2">
          {['create', 'edit', 'motion'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 text-[11px] font-bold uppercase tracking-tight transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-gray-500'
              }`}
            >
              {t.video[tab as keyof typeof t.video]}
              {activeTab === tab && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white" />}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* Preset Card */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#111] group">
            <img src="https://picsum.photos/seed/monk/400/225" className="w-full h-full object-cover opacity-60" alt="Current Preset" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-[#DFFF00] text-lg font-black uppercase italic tracking-tighter leading-none">GENERAL</h3>
              <p className="text-gray-400 text-[10px] font-bold">Kling 2.6</p>
            </div>
            <button className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1.5 flex items-center gap-1.5 hover:bg-black/60 transition-all">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2"/></svg>
              <span className="text-[10px] font-bold text-white">{t.common.change}</span>
            </button>
          </div>

          {/* Upload Box */}
          <div className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer relative group">
            <span className="absolute top-2 right-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{t.common.optional}</span>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5"/></svg>
            </div>
            <h4 className="text-[12px] font-bold text-gray-200">{t.video.uploadTitle}</h4>
            <p className="text-[10px] text-gray-600 font-medium mt-1">{t.video.uploadDesc}</p>
          </div>

          {/* Prompt Section */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">Prompt</label>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 focus-within:border-white/20 transition-all relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isTranscribing ? t.common.transcribing : t.video.promptPlaceholder}
                className="w-full bg-transparent border-none outline-none text-[13px] text-gray-200 min-h-[100px] resize-none leading-relaxed placeholder:text-gray-600"
              />
              <div className="flex justify-between items-center mt-2">
                <button className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
                  <svg className="w-3.5 h-3.5 text-[#DFFF00]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="text-[10px] font-bold text-white">{t.video.enhance}</span>
                </button>
                <button 
                  onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Toggles and Selects */}
          <div className="space-y-1">
            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-gray-300">{t.video.audio}</span>
                <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
              </div>
              <button 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`w-10 h-5 rounded-full relative flex items-center px-0.5 transition-colors ${audioEnabled ? 'bg-[#DFFF00]' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full transition-transform ${audioEnabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white/40'}`} />
              </button>
            </div>

            {/* Model Select */}
            <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all group">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.video.model}</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-gray-200">Kling 2.6</span>
                <div className="w-4 h-4 rounded-full bg-[#DFFF00]/20 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#DFFF00]" />
                </div>
                <svg className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2"/></svg>
              </div>
            </button>

            {/* Params Row */}
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-start p-3 rounded-2xl hover:bg-white/5 transition-all group">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t.video.duration}</span>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[14px] font-black text-gray-200">5s</span>
                  <svg className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2"/></svg>
                </div>
              </button>
              <button className="flex flex-col items-start p-3 rounded-2xl hover:bg-white/5 transition-all group">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t.video.aspectRatio}</span>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[14px] font-black text-gray-200">16:9</span>
                  <svg className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2"/></svg>
                </div>
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-[#DFFF00] text-black h-[56px] rounded-2xl font-black text-[15px] uppercase flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_10px_30px_rgba(223,255,0,0.15)] disabled:opacity-30"
          >
            {t.video.generate} <span className="opacity-60 text-lg">✦ 10</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#050505]">
        {/* Top Header */}
        <div className="h-[52px] border-b border-white/5 flex items-center justify-between px-6">
          <div className="flex gap-4">
             <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
                <span className="text-[11px] font-bold text-gray-300">{t.common.history}</span>
             </button>
             <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2"/></svg>
                <span className="text-[11px] font-bold text-gray-300">{t.common.howItWorks}</span>
             </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
           <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">{t.video.heroTitle}</h1>
              <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">{t.video.heroDesc}</p>
           </div>

           {/* Steps Grid */}
           <div className="grid grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {/* Step 1 */}
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 flex flex-col items-center text-center group cursor-pointer hover:border-white/10 transition-all relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                 <div className="w-full aspect-video rounded-2xl bg-black border border-white/5 mb-8 flex items-center justify-center overflow-hidden relative">
                    <img src="https://picsum.photos/seed/step1/400/225" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" alt="Step 1" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                       <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5"/></svg>
                       <span className="text-[10px] font-black uppercase text-white tracking-widest">Upload Image</span>
                    </div>
                 </div>
                 <h3 className="text-lg font-black text-white uppercase mb-2 tracking-tight">{t.video.step1Title}</h3>
                 <p className="text-gray-500 text-xs font-bold leading-relaxed">{t.video.step1Desc}</p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 flex flex-col items-center text-center group cursor-pointer hover:border-white/10 transition-all relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                 <div className="w-full aspect-video rounded-2xl bg-black border border-white/5 mb-8 flex items-center justify-center overflow-hidden relative">
                    <img src="https://picsum.photos/seed/step2/400/225" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" alt="Step 2" />
                    <div className="absolute bottom-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                       <svg className="w-8 h-8 text-[#DFFF00]" fill="currentColor" viewBox="0 0 24 24"><path d="M7 11.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zm-3 2a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zm6 2a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2z" /></svg>
                    </div>
                 </div>
                 <h3 className="text-lg font-black text-white uppercase mb-2 tracking-tight">{t.video.step2Title}</h3>
                 <p className="text-gray-500 text-xs font-bold leading-relaxed">{t.video.step2Desc}</p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] p-8 flex flex-col items-center text-center group cursor-pointer hover:border-white/10 transition-all relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                 <div className="w-full aspect-video rounded-2xl bg-black border border-[#DFFF00]/40 mb-8 flex items-center justify-center overflow-hidden relative shadow-[0_0_30px_rgba(223,255,0,0.1)]">
                    <img src="https://picsum.photos/seed/step3/400/225" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" alt="Step 3" />
                 </div>
                 <h3 className="text-lg font-black text-white uppercase mb-2 tracking-tight">{t.video.step3Title}</h3>
                 <p className="text-gray-500 text-xs font-bold leading-relaxed">{t.video.step3Desc}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWorkspace;

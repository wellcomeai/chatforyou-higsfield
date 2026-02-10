
import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import { DbService } from '../services/dbService';

interface ProfileWorkspaceProps {
  user: any;
  onToolSelect: (id: string) => void;
}

const ProfileWorkspace: React.FC<ProfileWorkspaceProps> = ({ user, onToolSelect }) => {
  const { t } = useI18n();
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      DbService.getUserGenerations(user.id)
        .then(data => {
          setGenerations(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black pt-24 px-6 pb-20 select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* User Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-black italic">
                {user.full_name?.charAt(0) || 'U'}
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-black uppercase tracking-tighter">{user.full_name}</h1>
                <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#121212] border border-white/5 px-8 py-4 rounded-3xl text-center min-w-[160px]">
              <div className="text-[#DFFF00] text-2xl font-black italic">✦ {user.credits_balance}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{t.common.creditsBalance}</div>
            </div>
            <button 
              onClick={() => onToolSelect('pricing')}
              className="bg-white text-black px-8 py-4 rounded-3xl font-black text-sm uppercase hover:opacity-90 transition-all"
            >
              {t.common.addCredits}
            </button>
          </div>
        </div>

        {/* Generations Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-tighter">{t.common.myGenerations} <span className="text-gray-600 ml-2">{generations.length}</span></h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-8 h-8 border-2 border-[#DFFF00]/20 border-t-[#DFFF00] rounded-full animate-spin"></div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t.common.loadingHistory}</p>
            </div>
          ) : generations.length === 0 ? (
            <div className="text-center py-24 bg-[#0c0c0c] rounded-[40px] border border-white/5 space-y-4">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                 <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5"/></svg>
               </div>
               <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">{t.common.noGenerations}</p>
               <button 
                 onClick={() => onToolSelect('home')}
                 className="text-[#DFFF00] text-xs font-black uppercase tracking-widest hover:underline"
               >
                 {t.common.startNow}
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {generations.map((gen) => (
                <div key={gen.id} className="group relative aspect-square bg-[#0c0c0c] border border-white/5 rounded-3xl overflow-hidden cursor-pointer shadow-xl animate-in fade-in duration-500">
                  <img src={gen.output_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Result" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <p className="text-[10px] text-white font-bold mb-4 line-clamp-4 italic">"{gen.prompt}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-[#DFFF00] uppercase tracking-widest">{gen.tool_id}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); window.open(gen.output_url, '_blank'); }}
                          className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileWorkspace;

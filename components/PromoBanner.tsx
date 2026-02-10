
import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';

const PromoBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 19, minutes: 54, seconds: 6 });
  const { t } = useI18n();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0c0c0c] rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row gap-8 overflow-hidden relative group">
      <div className="flex-1 space-y-6 z-10">
        <div className="flex items-center gap-2">
           <svg className="w-8 h-8 text-[#DFFF00]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t.home.promoSubtitle}</span>
        </div>
        
        <h2 className="text-5xl font-black leading-tight">
          {t.home.promoTitle1} <br/>
          <span className="text-[#DFFF00]">{t.home.promoTitle2}</span> <br/>
          {t.home.promoTitle3}
        </h2>

        <p className="text-gray-400 text-sm max-w-sm">
          {t.home.promoDesc}
        </p>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 inline-block">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="text-[10px] font-bold uppercase text-gray-400">{t.home.promoOffer}</span>
          </div>
          <div className="flex gap-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="text-3xl font-bold bg-white/5 rounded-xl px-4 py-3 w-16 mb-1">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-[9px] uppercase text-gray-600 font-bold">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-[#DFFF00] text-black font-bold py-4 rounded-xl hover:opacity-90 transition-all text-sm">
          {t.home.promoButton}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden bg-white/5 relative group/img cursor-pointer">
            <img 
              src={`https://picsum.photos/seed/${i + 10}/200/300`} 
              className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" 
              alt="Preview"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent pointer-events-none"></div>
        <button className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 flex items-center gap-2 hover:bg-white/20 text-xs font-semibold">
          {t.home.viewAll} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;

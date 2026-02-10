
import React, { useState, useRef } from 'react';
import { useI18n } from '../i18n';
import { TOOLS } from '../tools/registry';

interface NavbarProps {
  onToolSelect: (toolId: string) => void;
  activeCategory: string;
  onAuthClick: (mode: 'login' | 'register') => void;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToolSelect, activeCategory, onAuthClick, user, onLogout }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const { t, lang, setLang } = useI18n();

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => setActiveDropdown(null), 200);
  };

  const toggleLanguage = () => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  const categories = [
    { id: 'image', label: t.navbar.image, hasDropdown: true },
    { id: 'video', label: t.navbar.video, hasDropdown: true },
    { id: 'music', label: t.navbar.music, hasDropdown: true },
    { id: 'apps', label: t.navbar.apps },
    { id: 'pricing', label: t.navbar.pricing, action: () => onToolSelect('pricing') }
  ];

  const renderDropdownContent = () => {
    if (!activeDropdown) return null;
    const features = TOOLS.filter(t => t.category.toLowerCase() === activeDropdown && !t.isModel);
    const models = TOOLS.filter(t => t.category.toLowerCase() === activeDropdown && t.isModel);

    return (
      <div className="fixed top-[52px] left-4 z-[110] animate-in fade-in slide-in-from-top-1" onMouseEnter={() => handleMouseEnter(activeDropdown)} onMouseLeave={handleMouseLeave}>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex w-[500px] max-h-[600px] overflow-hidden">
          <div className="w-1/2 border-r border-white/5 p-4 overflow-y-auto no-scrollbar">
            <h3 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-wider px-2">{t.common.features}</h3>
            {features.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all" onClick={() => onToolSelect(item.id)}>
                <div className="relative w-10 h-10 shrink-0 rounded-xl bg-[#222] border border-white/5 flex items-center justify-center">
                  {(item.isTop || item.isNew) && <span className="absolute -top-1.5 -left-1 bg-[#DFFF00] text-black text-[7px] font-black px-1 rounded-sm italic">{t.common.top}</span>}
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="1.5"/></svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-gray-200 group-hover:text-white">{item.name}</div>
                  <div className="text-[10px] text-gray-500 truncate leading-tight">{item.description}</div>
                </div>
              </div>
            ))}
            {features.length === 0 && <div className="text-[10px] text-gray-600 p-2">{t.common.noFeatures}</div>}
          </div>
          <div className="w-1/2 p-4 overflow-y-auto no-scrollbar bg-[#161616]">
            <h3 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-wider px-2">{t.common.models}</h3>
            {models.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-all" onClick={() => onToolSelect(item.id)}>
                <div className="relative w-10 h-10 shrink-0 rounded-xl bg-[#222] border border-white/5 flex items-center justify-center">
                  {(item.isBest || item.isTop) && <span className="absolute -top-1.5 -left-1 bg-pink-500 text-white text-[7px] font-black px-1 rounded-sm italic">{t.common.best}</span>}
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="1.5"/></svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-gray-200 group-hover:text-white">{item.name}</div>
                  <div className="text-[10px] text-gray-500 truncate leading-tight">{item.description}</div>
                </div>
              </div>
            ))}
            {models.length === 0 && <div className="text-[10px] text-gray-600 p-2">{t.common.noModels}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[120] bg-black border-b border-white/5 px-4 h-[52px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 italic font-black text-sm cursor-pointer" onClick={() => onToolSelect('home')}>NF</div>
          <div className="flex items-center gap-1">
            {categories.map((cat) => (
              <div key={cat.id} className="relative h-[52px] flex items-center" onMouseEnter={() => cat.hasDropdown && handleMouseEnter(cat.id)} onMouseLeave={handleMouseLeave}>
                <button onClick={cat.action} className={`px-3 py-1.5 text-[12px] font-semibold transition-all hover:bg-white/5 rounded-lg flex items-center gap-1 ${activeCategory === cat.id ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                  {cat.label}
                  {cat.hasDropdown && <svg className={`w-3 h-3 transition-transform ${activeDropdown === cat.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"/></svg>}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-[11px] font-black uppercase italic tracking-tighter"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 0c-.811 1.622-2.314 3.326-4.412 5M12 9a17.95 17.95 0 00-2.583-5M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth="2"/></svg>
            {lang === 'ru' ? 'RU' : 'EN'}
          </button>
          
          {user && (
            <button 
              onClick={() => onToolSelect('profile')}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all ${activeCategory === 'profile' ? 'bg-[#DFFF00] text-black' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/></svg>
              {t.common.myGenerations}
            </button>
          )}

          <div className="h-6 w-[1px] bg-white/10"></div>
          
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onToolSelect('profile')}
                className={`flex items-center gap-3 hover:bg-white/5 p-1 px-2 rounded-xl transition-all ${activeCategory === 'profile' ? 'bg-white/10' : ''}`}
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-white leading-none">{user.full_name}</span>
                  <span className="text-[9px] font-black text-[#DFFF00] uppercase tracking-tighter">✦ {user.credits_balance}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs italic">
                  {user.full_name?.charAt(0)}
                </div>
              </button>
              <button 
                onClick={onLogout}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/20 transition-all group"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2"/></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onAuthClick('login')}
                className="text-[12px] font-bold text-white px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
              >
                {t.navbar.login}
              </button>
              <button 
                onClick={() => onAuthClick('register')}
                className="text-[12px] font-black bg-[#DFFF00] text-black px-4 py-1.5 rounded-lg hover:opacity-90 transition-all"
              >
                {t.navbar.signup}
              </button>
            </div>
          )}
        </div>
      </nav>
      {renderDropdownContent()}
    </>
  );
};

export default Navbar;

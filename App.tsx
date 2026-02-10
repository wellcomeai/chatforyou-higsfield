
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import PromoBanner from './components/PromoBanner';
import ToolWorkspace from './components/ToolWorkspace';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';
import ProfileWorkspace from './components/ProfileWorkspace';
import { TOOLS } from './tools/registry';
import { ToolCategory, ToolDefinition } from './types';
import { I18nContext, translations, Language, useI18n } from './i18n';
import { DbService } from './services/dbService';

const Home: React.FC<{ onToolSelect: (id: string) => void }> = ({ onToolSelect }) => {
  const { t } = useI18n();
  const [showcase, setShowcase] = useState<any[]>([]);

  useEffect(() => {
    // Загружаем последние 12 генераций
    DbService.getLatestShowcaseItems(12).then(items => {
      if (items.length > 0) setShowcase(items);
    });
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 space-y-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aspect-video rounded-3xl overflow-hidden relative group cursor-pointer" onClick={() => onToolSelect('kling-video')}>
           <img src="https://picsum.photos/seed/kling-hero/800/450" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Kling 3.0" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-[#DFFF00] uppercase tracking-widest mb-1">{t.home.unlimited}</span>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">KlingAI 2.6</h3>
              <p className="text-gray-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{t.home.earlyAccess}</p>
           </div>
        </div>
        <div className="aspect-video rounded-3xl overflow-hidden relative group cursor-pointer bg-white flex items-center justify-center p-12">
           <div className="text-center space-y-4">
              <h3 className="text-black text-4xl font-black uppercase tracking-tight leading-none">{t.home.motionGraphics}</h3>
              <div className="flex justify-center gap-4 opacity-40">
                <div className="w-12 h-12 bg-black rounded-full"></div>
                <div className="w-12 h-12 bg-black rounded-lg"></div>
                <div className="w-12 h-12 bg-black rounded-sm rotate-45"></div>
              </div>
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent p-8 flex flex-col justify-end">
              <h3 className="text-black text-xl font-black uppercase tracking-tighter">{t.navbar.vibeMotion}</h3>
              <p className="text-gray-600 text-xs mt-2">{t.home.motionDesc}</p>
           </div>
        </div>
        <div className="aspect-video rounded-3xl overflow-hidden relative group cursor-pointer" onClick={() => onToolSelect('nano-banana')}>
           <img src="https://picsum.photos/seed/banana/800/450" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Nano Banana" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Nano Banana</h3>
              <p className="text-gray-400 text-xs mt-2">{t.home.grokDesc}</p>
           </div>
        </div>
      </div>

      <PromoBanner />

      {/* СЕКЦИЯ С ПОСЛЕДНИМИ ГЕНЕРАЦИЯМИ */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-black uppercase tracking-tighter">
             {t.home.seeAll} <span className="text-[#DFFF00]">Creations</span>
           </h2>
           <div className="flex gap-2">
             <div className="h-0.5 w-12 bg-[#DFFF00]"></div>
             <div className="h-0.5 w-4 bg-white/20"></div>
           </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
           {(showcase.length > 0 ? showcase : Array(6).fill(null)).map((item, idx) => (
              <div key={item?.id || idx} className="space-y-3 cursor-pointer group animate-in fade-in duration-500">
                 <div className="aspect-square rounded-2xl bg-[#121212] border border-white/5 overflow-hidden relative">
                    {item ? (
                      <>
                        <img src={item.output_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Creation" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                           <p className="text-[9px] text-white font-bold line-clamp-3 leading-tight">{item.prompt}</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                      </div>
                    )}
                 </div>
                 {item && (
                   <div className="flex items-center justify-between px-1">
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{item.tool_id}</span>
                      <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round"/></svg>
                   </div>
                 )}
              </div>
           ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="bg-[#0c0c0c] border border-white/5 rounded-[40px] p-12">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div className="space-y-2">
                 <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
                   {t.home.createTitle.split('?')[0]}? <br/> {t.home.createTitle.split('?')[1]}
                 </h2>
                 <p className="text-gray-500 text-lg">{t.home.createSubtitle}</p>
                 <button className="bg-[#DFFF00] text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all mt-6">
                   {t.home.exploreTools} <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                 </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {TOOLS.slice(0, 5).map(tool => (
                   <div key={tool.id} className="min-w-[200px] group cursor-pointer" onClick={() => onToolSelect(tool.id)}>
                      <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                         <img src={tool.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={tool.name} />
                         {tool.isNew && <span className="absolute top-3 left-3 bg-[#DFFF00] text-black text-[8px] font-black px-2 py-0.5 rounded uppercase">{t.home.unlimited}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                         <h4 className="font-bold text-sm">{tool.name}</h4>
                         <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-black uppercase tracking-tighter">{t.home.topChoice}</h2>
           <button className="bg-white/5 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
             {t.home.seeAll} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
           {TOOLS.map(tool => (
              <div key={tool.id} className="space-y-3 cursor-pointer group" onClick={() => onToolSelect(tool.id)}>
                 <div className="aspect-square rounded-2xl bg-[#121212] overflow-hidden">
                    <img src={tool.thumbnail} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" alt={tool.name} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="font-bold text-xs truncate uppercase tracking-wide">{tool.name}</h4>
                    <p className="text-[10px] text-gray-500 truncate">{tool.description}</p>
                 </div>
              </div>
           ))}
        </div>
      </section>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [currentToolId, setCurrentToolId] = useState<string>('home');
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { t } = useI18n();

  const handleToolSelect = (id: string) => {
    setCurrentToolId(id);
    window.scrollTo(0, 0);
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentToolId('home');
  };

  const currentTool = TOOLS.find(t => t.id === currentToolId);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar 
        onToolSelect={handleToolSelect} 
        activeCategory={currentToolId === 'pricing' ? 'pricing' : (currentToolId === 'profile' ? 'profile' : (currentTool ? currentTool.category.toLowerCase() : 'explore'))} 
        onAuthClick={handleAuthClick}
        user={user}
        onLogout={handleLogout}
      />
      
      {currentToolId === 'home' ? (
        <Home onToolSelect={handleToolSelect} />
      ) : currentToolId === 'pricing' ? (
        <Pricing />
      ) : currentToolId === 'profile' ? (
        <ProfileWorkspace user={user} onToolSelect={handleToolSelect} />
      ) : currentTool ? (
        <ToolWorkspace tool={currentTool} user={user} onUserUpdate={setUser} />
      ) : (
        <div className="flex items-center justify-center h-screen text-gray-500">
           {t.workspace.underDevelopment}
        </div>
      )}

      {(currentToolId === 'home' || currentToolId === 'profile') && (
        <footer className="border-t border-white/5 py-12 px-6 bg-[#050505]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-50 grayscale">
               <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
               <span className="font-bold text-xl tracking-tighter">NeuroForge</span>
            </div>
            <div className="flex gap-8 text-xs font-bold text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-white">{t.footer.terms}</a>
              <a href="#" className="hover:text-white">{t.footer.privacy}</a>
              <a href="#" className="hover:text-white">{t.footer.api}</a>
              <a href="#" className="hover:text-white">{t.footer.discord}</a>
            </div>
            <div className="text-[10px] text-gray-700 font-bold uppercase">
              &copy; 2025 NEUROFORGE CREATIVE AI LABS. {t.footer.rights}
            </div>
          </div>
        </footer>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode}
        onSuccess={setUser}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const t = useMemo(() => translations[lang], [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      <AppContent />
    </I18nContext.Provider>
  );
};

export default App;

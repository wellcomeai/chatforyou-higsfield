
import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { DbService } from '../services/dbService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, lang } = useI18n();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        const userId = await DbService.registerUser(email, password, fullName, lang);
        // После регистрации сразу логиним
        const user = await DbService.loginUser(email, password);
        onSuccess(user);
        onClose();
      } else {
        const user = await DbService.loginUser(email, password);
        if (user) {
          onSuccess(user);
          onClose();
        } else {
          setError(t.auth.error);
        }
      }
    } catch (err: any) {
      setError(err.message || t.auth.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-4 italic font-black text-xl">NF</div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {mode === 'login' ? t.auth.loginTitle : t.auth.registerTitle}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">{t.auth.fullName}</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#DFFF00]/50 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">{t.auth.email}</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#DFFF00]/50 outline-none transition-all"
              placeholder="example@mail.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">{t.auth.password}</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[#DFFF00]/50 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-500 text-[11px] font-bold text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#DFFF00] text-black h-[52px] rounded-xl font-black text-sm uppercase mt-4 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? t.auth.loading : (mode === 'login' ? t.auth.loginBtn : t.auth.registerBtn)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[11px] font-bold text-gray-500 hover:text-[#DFFF00] transition-colors uppercase tracking-widest"
          >
            {mode === 'login' ? t.auth.switchRegister : t.auth.switchLogin}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

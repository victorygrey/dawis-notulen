
import React, { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { MOCK_ACCOUNTS } from '../constants';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // 1. Cek dari daftar UserManagement di localStorage
      const dynamicUsersRaw = localStorage.getItem('syncops_user_list');
      let foundUser: User | null = null;

      if (dynamicUsersRaw) {
        const users: User[] = JSON.parse(dynamicUsersRaw);
        const userMatch = users.find(u => u.email === email && u.password === password);
        if (userMatch) {
          foundUser = userMatch;
        }
      }

      // 2. Jika tidak ketemu, cek dari hardcoded MOCK_ACCOUNTS
      if (!foundUser) {
        const account = MOCK_ACCOUNTS.find(acc => acc.email === email && acc.password === password);
        if (account) {
          foundUser = account.user;
        }
      }
      
      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('Email atau password salah. Pastikan kredensial yang dimasukkan sudah benar.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-500/20 mb-6 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
            <ShieldCheck className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">SyncOps</h1>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Integrated Management System</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">Selamat Datang</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Silakan masuk menggunakan akun karyawan Anda.</p>
          </div>
          
          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Perusahaan</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-black font-bold placeholder:text-slate-300"
                  placeholder="nama@syncops.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-tight">Lupa?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-black font-bold placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-xs text-slate-500 font-bold cursor-pointer select-none">Ingat saya di perangkat ini</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform active:scale-[0.98] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Memvalidasi Akses...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400 font-bold">
              Butuh bantuan? <a href="#" className="text-indigo-600 hover:underline">Hubungi Tim IT Support</a>
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black">SyncOps Secure Access v2.5</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

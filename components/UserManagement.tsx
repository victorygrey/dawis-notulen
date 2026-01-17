
import React, { useState, useEffect } from 'react';
import { User, Role, DivisionType } from '../types';
import { DIVISIONS } from '../constants';
import { Plus, Search, X, Save, Edit2, Shield, User as UserIcon, Check, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    email: '',
    password: '',
    role: Role.STAFF,
    divisions: [] as DivisionType[]
  });

  useEffect(() => {
    const saved = localStorage.getItem('syncops_user_list');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      const initialUsers: User[] = [
        { id: 'u1', nik: 'MGR-001', name: 'Ahmad Faisal', role: Role.MANAGER, divisions: [DivisionType.HRD, DivisionType.OPRS], email: 'admin@syncops.com', password: 'password' },
        { id: 'u2', nik: 'STF-001', name: 'Budi Santoso', role: Role.STAFF, divisions: [DivisionType.OPRS], email: 'staff@syncops.com', password: 'password' }
      ];
      setUsers(initialUsers);
      localStorage.setItem('syncops_user_list', JSON.stringify(initialUsers));
    }
  }, []);

  const saveToStorage = (data: User[]) => {
    setUsers(data);
    localStorage.setItem('syncops_user_list', JSON.stringify(data));
  };

  const handleToggleDivision = (div: DivisionType) => {
    const current = formData.divisions;
    if (current.includes(div)) {
      setFormData({ ...formData, divisions: current.filter(d => d !== div) });
    } else {
      setFormData({ ...formData, divisions: [...current, div] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated = users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u);
      saveToStorage(updated);
    } else {
      const newUser: User = {
        ...formData,
        id: Math.random().toString(36).substring(2, 11)
      };
      saveToStorage([newUser, ...users]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', nik: '', email: '', password: '', role: Role.STAFF, divisions: [] });
    setEditingUser(null);
    setShowModal(false);
    setShowPassword(false);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      nik: user.nik || '',
      email: user.email || '',
      password: user.password || '',
      role: user.role,
      divisions: user.divisions
    });
    setShowModal(true);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.nik?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Karyawan</h2>
          <p className="text-slate-500 text-sm font-medium">Kelola akses, kredensial login, dan penempatan divisi staf SyncOps.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Karyawan</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama, NIK, atau email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm text-black font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-6 py-4">Karyawan & Akun</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4 text-center">Role</th>
                <th className="px-6 py-4">Divisi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs border border-indigo-100">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-500">{u.nik || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      u.role === Role.DIRECTOR ? 'bg-purple-100 text-purple-700' :
                      u.role === Role.MANAGER ? 'bg-indigo-100 text-indigo-700' :
                      u.role === Role.SUBADMIN ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {u.divisions.map(div => (
                        <span key={div} className="px-1.5 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-bold rounded border border-slate-100">
                          {div}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEdit(u)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden max-h-[95vh] flex flex-col border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingUser ? 'Ubah Profil Karyawan' : 'Registrasi Karyawan Baru'}</h3>
                <p className="text-xs text-slate-500 font-medium">Lengkapi data diri dan akses login untuk sistem SyncOps.</p>
              </div>
              <button onClick={resetForm} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-black text-sm font-bold"
                      placeholder="Masukkan nama lengkap..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">NIK (Nomor Induk Karyawan)</label>
                  <input 
                    type="text" required
                    value={formData.nik}
                    onChange={e => setFormData({...formData, nik: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-black text-sm font-black font-mono"
                    placeholder="Contoh: OPS-2024-001"
                  />
                </div>
              </div>

              {/* Kredensial Login */}
              <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-indigo-600" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-tight">Kredensial Akses</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Email Perusahaan</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-black text-sm font-bold"
                        placeholder="email@syncops.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type={showPassword ? "text" : "password"} required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-black text-sm font-bold"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase italic">Keamanan: Password disimpan dalam bentuk teks biasa sesuai permintaan.</p>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-4">Level Akses (Role)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[Role.STAFF, Role.MANAGER, Role.SUBADMIN, Role.DIRECTOR].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({...formData, role: r})}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1 ${
                        formData.role === r ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter">{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-4">Penempatan Divisi Kerja</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DIVISIONS.map(div => (
                    <button
                      key={div.id}
                      type="button"
                      onClick={() => handleToggleDivision(div.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                        formData.divisions.includes(div.id) ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 grayscale'
                      }`}
                    >
                      <div className={formData.divisions.includes(div.id) ? 'text-indigo-600' : 'text-slate-300'}>
                        {formData.divisions.includes(div.id) ? <Check size={16} /> : div.icon}
                      </div>
                      <span className="text-[10px] font-black truncate tracking-tight uppercase">{div.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex gap-4 sticky bottom-0 bg-white">
                <button 
                  type="button" onClick={resetForm}
                  className="flex-1 py-4 border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
                >
                  Batalkan
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                >
                  <Save size={18} />
                  {editingUser ? 'Perbarui Karyawan' : 'Daftarkan Karyawan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

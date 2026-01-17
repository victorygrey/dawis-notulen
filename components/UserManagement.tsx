
import React, { useState, useEffect } from 'react';
import { User, Role, DivisionType } from '../types';
import { DIVISIONS } from '../constants';
import { Plus, Search, X, Save, Edit2, Shield, User as UserIcon, Check } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    role: Role.STAFF,
    divisions: [] as DivisionType[]
  });

  useEffect(() => {
    const saved = localStorage.getItem('syncops_user_list');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      const initialUsers: User[] = [
        { id: 'u1', nik: 'MGR-001', name: 'Ahmad Faisal', role: Role.MANAGER, divisions: [DivisionType.HRD, DivisionType.OPRS] },
        { id: 'u2', nik: 'STF-001', name: 'Budi Santoso', role: Role.STAFF, divisions: [DivisionType.OPRS] }
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
    setFormData({ name: '', nik: '', role: Role.STAFF, divisions: [] });
    setEditingUser(null);
    setShowModal(false);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      nik: user.nik || '',
      role: user.role,
      divisions: user.divisions
    });
    setShowModal(true);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.nik?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manajemen Karyawan</h2>
          <p className="text-slate-500">Kelola akses, NIK, dan penempatan divisi staf SyncOps.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg"
        >
          <Plus size={18} />
          <span>Tambah Karyawan</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau NIK..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Karyawan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">NIK</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Penempatan Divisi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-500">{u.nik || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                        <span key={div} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">
                          {div}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEdit(u)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0">
              <h3 className="font-bold text-slate-800">{editingUser ? 'Ubah Data Karyawan' : 'Tambah Karyawan Baru'}</h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm"
                      placeholder="Input nama karyawan..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nomor Induk Karyawan (NIK)</label>
                  <input 
                    type="text" required
                    value={formData.nik}
                    onChange={e => setFormData({...formData, nik: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm font-mono"
                    placeholder="Contoh: OPS-2024-001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Pilih Role Akses</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[Role.STAFF, Role.MANAGER, Role.SUBADMIN, Role.DIRECTOR].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({...formData, role: r})}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                        formData.role === r ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Penempatan Divisi (Bisa pilih banyak)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DIVISIONS.map(div => (
                    <button
                      key={div.id}
                      type="button"
                      onClick={() => handleToggleDivision(div.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-bold transition-all ${
                        formData.divisions.includes(div.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-100 text-slate-500 grayscale'
                      }`}
                    >
                      {formData.divisions.includes(div.id) ? <Check size={14} /> : div.icon}
                      <span className="truncate">{div.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                <button 
                  type="button" onClick={resetForm}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {editingUser ? 'Perbarui Karyawan' : 'Simpan Karyawan'}
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


import React, { useState, useEffect, useRef } from 'react';
import { TaskStatus, DailyActivity, DivisionType, Approval, Role } from '../types';
import { 
  Plus, Search, X, Save, Edit2, 
  Paperclip, Link as LinkIcon, FileText, Image as ImageIcon, 
  ExternalLink, FileSpreadsheet, Send,
  Calendar, Clock, CheckCircle2, AlertCircle, Trash2
} from 'lucide-react';

const TaskTracker: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const initialTaskState = {
    taskName: '',
    startDate: todayStr,
    endDate: todayStr,
    startTime: '08:00',
    endTime: '17:00',
    isRoutine: true,
    progress: 0,
    status: TaskStatus.BELUM,
    externalLink: '',
    evidenceIds: [] as string[]
  };

  const [newTask, setNewTask] = useState(initialTaskState);

  useEffect(() => {
    const saved = localStorage.getItem('syncops_activities');
    if (saved) setActivities(JSON.parse(saved));
  }, []);

  const saveActivities = (data: DailyActivity[]) => {
    setActivities(data);
    localStorage.setItem('syncops_activities', JSON.stringify(data));
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('syncops_user') || '{}');
    const activity: DailyActivity = {
      ...newTask,
      id: Math.random().toString(36).substring(2, 11),
      userId: currentUser.id || 'anon',
      userName: currentUser.name || 'Anonymous',
      divisionId: activeDivision,
      date: todayStr,
      approvalStatus: 'DRAFT'
    };

    saveActivities([activity, ...activities]);
    setShowAddModal(false);
    setNewTask(initialTaskState);
  };

  const handleUpdateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;
    const updatedActivities = activities.map(act => 
      act.id === editingActivity.id ? { ...editingActivity, approvalStatus: 'DRAFT' as const } : act
    );
    saveActivities(updatedActivities);
    setShowEditModal(false);
    setEditingActivity(null);
  };

  const handleRequestApproval = (activity: DailyActivity) => {
    const currentUserRaw = localStorage.getItem('syncops_user');
    if (!currentUserRaw) return;
    const user = JSON.parse(currentUserRaw);

    const newApproval: Approval = {
      id: Math.random().toString(36).substring(2, 11),
      activityId: activity.id,
      title: `Approval: ${activity.taskName}`,
      requesterId: user.id,
      requesterName: user.name,
      requesterRole: user.role,
      division: activity.divisionId,
      status: 'PENDING',
      dateSubmitted: new Date().toLocaleString(),
      history: [
        {
          step: 1,
          approverName: user.name,
          action: 'SUBMITTED',
          note: 'Mengajukan approval aktivitas harian',
          date: new Date().toLocaleString()
        }
      ]
    };

    const updatedActivities = activities.map(a => 
      a.id === activity.id ? { ...a, approvalStatus: 'PENDING' as const } : a
    );
    saveActivities(updatedActivities);

    const existingApprovals = JSON.parse(localStorage.getItem('syncops_approvals') || '[]');
    localStorage.setItem('syncops_approvals', JSON.stringify([newApproval, ...existingApprovals]));
    alert('Permintaan approval telah dikirim!');
  };

  const getStatusColor = (status: TaskStatus) => {
    switch(status) {
      case TaskStatus.SELESAI: return 'text-emerald-600 bg-emerald-50';
      case TaskStatus.PROSES: return 'text-blue-600 bg-blue-50';
      case TaskStatus.PENDING: return 'text-amber-600 bg-amber-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const files = e.target.files;
    if (!files) return;
    
    // Simulasi penambahan ID file (karena tidak ada backend upload asli)
    const newFileIds = Array.from(files).map(f => `${f.name} (${(f.size/1024).toFixed(1)} KB)`);
    
    if (isEdit && editingActivity) {
      setEditingActivity({
        ...editingActivity,
        evidenceIds: [...editingActivity.evidenceIds, ...newFileIds]
      });
    } else {
      setNewTask({
        ...newTask,
        evidenceIds: [...newTask.evidenceIds, ...newFileIds]
      });
    }
  };

  const filteredActivities = activities.filter(a => 
    a.taskName.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeDivision === a.divisionId || activeDivision === DivisionType.IT)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Activity Tracker</h2>
          <p className="text-slate-500 text-sm">Monitor dan laporkan progres kerja divisi <span className="font-bold text-indigo-600">{activeDivision}</span></p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Aktivitas</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari pekerjaan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm text-black font-medium"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <AlertCircle size={14} />
            <span>Klik tombol pesawat untuk kirim approval</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-6 py-4">Periode</th>
                <th className="px-6 py-4">Nama Pekerjaan</th>
                <th className="px-6 py-4">Progres & Status</th>
                <th className="px-6 py-4 text-center">Approval</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.length > 0 ? filteredActivities.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Calendar size={12} className="text-indigo-500" />
                        {item.startDate === item.endDate ? item.startDate : `${item.startDate} s/d ${item.endDate}`}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                        <Clock size={12} />
                        {item.startTime} - {item.endTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 mb-1">{item.taskName}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${item.isRoutine ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                        {item.isRoutine ? 'Routine' : 'Incidental'}
                      </span>
                      {item.externalLink && (
                        <a href={item.externalLink} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-700">
                          <ExternalLink size={12} />
                        </a>
                      )}
                      {item.evidenceIds.length > 0 && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-slate-400">
                          <Paperclip size={10} /> {item.evidenceIds.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4 min-w-[120px]">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${item.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-600">{item.progress}%</span>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                      item.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                      item.approvalStatus === 'PENDING' ? 'bg-blue-100 text-blue-700' :
                      item.approvalStatus === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                      item.approvalStatus === 'REVISION' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {item.approvalStatus || 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {(!item.approvalStatus || item.approvalStatus === 'DRAFT' || item.approvalStatus === 'REVISION') && (
                        <button 
                          onClick={() => handleRequestApproval(item)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Kirim Approval"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => { setEditingActivity(item); setShowEditModal(true); }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <FileText size={48} className="text-slate-300" />
                      <p className="text-sm font-bold text-slate-400">Belum ada aktivitas tercatat.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {showEditModal ? 'Edit Log Aktivitas' : 'Catat Aktivitas Harian'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Lengkapi detail pengerjaan tugas Anda di bawah ini.</p>
              </div>
              <button 
                onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingActivity(null); }} 
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={showEditModal ? handleUpdateActivity : handleAddActivity} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Nama Pekerjaan */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Nama Pekerjaan / Tugas</label>
                <input 
                  type="text" required
                  value={showEditModal ? editingActivity?.taskName : newTask.taskName}
                  onChange={e => showEditModal ? setEditingActivity({...editingActivity!, taskName: e.target.value}) : setNewTask({...newTask, taskName: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm text-black font-bold placeholder:text-slate-300 transition-all"
                  placeholder="Contoh: Pengisian manifes jamaah group Januari"
                />
              </div>

              {/* Grid Tanggal & Waktu */}
              <div className="grid grid-cols-2 gap-6 p-5 bg-slate-50/50 rounded-3xl border border-slate-100">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tgl Mulai</label>
                    <input 
                      type="date" required
                      value={showEditModal ? editingActivity?.startDate : newTask.startDate}
                      onChange={e => showEditModal ? setEditingActivity({...editingActivity!, startDate: e.target.value}) : setNewTask({...newTask, startDate: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-black font-bold focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Mulai</label>
                    <input 
                      type="time" required
                      value={showEditModal ? editingActivity?.startTime : newTask.startTime}
                      onChange={e => showEditModal ? setEditingActivity({...editingActivity!, startTime: e.target.value}) : setNewTask({...newTask, startTime: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-black font-bold focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tgl Selesai</label>
                    <input 
                      type="date" required
                      value={showEditModal ? editingActivity?.endDate : newTask.endDate}
                      onChange={e => showEditModal ? setEditingActivity({...editingActivity!, endDate: e.target.value}) : setNewTask({...newTask, endDate: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-black font-bold focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Selesai</label>
                    <input 
                      type="time" required
                      value={showEditModal ? editingActivity?.endTime : newTask.endTime}
                      onChange={e => showEditModal ? setEditingActivity({...editingActivity!, endTime: e.target.value}) : setNewTask({...newTask, endTime: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-black font-bold focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Status & Routine */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Status Pekerjaan</label>
                  <select 
                    value={showEditModal ? editingActivity?.status : newTask.status}
                    onChange={e => showEditModal ? setEditingActivity({...editingActivity!, status: e.target.value as TaskStatus}) : setNewTask({...newTask, status: e.target.value as TaskStatus})}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-black font-black bg-white"
                  >
                    <option value={TaskStatus.BELUM}>Belum Dimulai</option>
                    <option value={TaskStatus.PROSES}>Progress</option>
                    <option value={TaskStatus.SELESAI}>Selesai</option>
                    <option value={TaskStatus.PENDING}>Pending</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Daily Routine?</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Tugas Rutin Harian</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showEditModal ? editingActivity?.isRoutine : newTask.isRoutine}
                      onChange={e => showEditModal ? setEditingActivity({...editingActivity!, isRoutine: e.target.checked}) : setNewTask({...newTask, isRoutine: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100/50">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[11px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={16} /> Progress Kerja
                  </label>
                  <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-full shadow-lg shadow-indigo-200">{showEditModal ? editingActivity?.progress : newTask.progress}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5"
                  value={showEditModal ? editingActivity?.progress : newTask.progress}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    showEditModal ? setEditingActivity({...editingActivity!, progress: val}) : setNewTask({...newTask, progress: val});
                  }}
                  className="w-full h-2.5 bg-indigo-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-[9px] text-indigo-300 font-black uppercase">Start</span>
                  <span className="text-[9px] text-indigo-300 font-black uppercase">Halfway</span>
                  <span className="text-[9px] text-indigo-300 font-black uppercase">Tuntas</span>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">Bukti Pengerjaan (Evidence)</label>
                
                {/* Upload Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-300 transition-all gap-2"
                  >
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                      <Plus size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">Lampirkan File</span>
                    <span className="text-[8px] text-slate-400">IMG, PDF, DOC, XLS</span>
                  </button>
                  <div className="p-4 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                      <LinkIcon size={12} /> External Link
                    </div>
                    <input 
                      type="url"
                      value={showEditModal ? editingActivity?.externalLink : newTask.externalLink}
                      onChange={e => showEditModal ? setEditingActivity({...editingActivity!, externalLink: e.target.value}) : setNewTask({...newTask, externalLink: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://gdrive.link/..."
                    />
                  </div>
                </div>
                <input 
                  type="file" multiple hidden ref={fileInputRef}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => handleFileUpload(e, showEditModal)}
                />

                {/* File List */}
                <div className="space-y-2">
                  {(showEditModal ? editingActivity?.evidenceIds : newTask.evidenceIds)?.map((fid, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg text-indigo-500 shadow-sm">
                          {fid.includes('.pdf') ? <FileText size={14} /> : fid.includes('.xls') ? <FileSpreadsheet size={14} /> : <ImageIcon size={14} />}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[200px]">{fid}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          if (showEditModal && editingActivity) {
                            setEditingActivity({...editingActivity, evidenceIds: editingActivity.evidenceIds.filter((_, i) => i !== idx)});
                          } else {
                            setNewTask({...newTask, evidenceIds: newTask.evidenceIds.filter((_, i) => i !== idx)});
                          }
                        }}
                        className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  <Save size={18} />
                  <span>{showEditModal ? 'Perbarui Laporan' : 'Simpan Laporan Harian'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTracker;

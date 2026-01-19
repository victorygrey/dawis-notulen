
import React, { useState, useEffect, useRef } from 'react';
import { TaskStatus, DailyActivity, DivisionType, Approval, Role } from '../types';
import { 
  Plus, Search, X, Save, Edit2, 
  Paperclip, Link as LinkIcon, FileText, Image as ImageIcon, 
  ExternalLink, FileSpreadsheet, Send,
  Calendar, Clock, CheckCircle2, AlertCircle, Trash2, MoreVertical,
  CalendarCheck
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
    // Fix: Explicitly type 'f' as 'any' to avoid "property does not exist on type 'unknown'" error during array mapping
    const newFileIds = Array.from(files).map((f: any) => `${f.name} (${(f.size/1024).toFixed(1)} KB)`);
    if (isEdit && editingActivity) {
      setEditingActivity({ ...editingActivity, evidenceIds: [...editingActivity.evidenceIds, ...newFileIds] });
    } else {
      setNewTask({ ...newTask, evidenceIds: [...newTask.evidenceIds, ...newFileIds] });
    }
  };

  const filteredActivities = activities.filter(a => 
    a.taskName.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeDivision === a.divisionId || activeDivision === DivisionType.IT)
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Daily Activity Tracker</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Laporan kerja harian divisi <span className="font-bold text-indigo-600">{activeDivision}</span></p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="hidden md:flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Aktivitas</span>
        </button>
      </div>

      {/* Floating Action Button (FAB) for Mobile */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 z-[45] md:hidden w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
      >
        <Plus size={28} />
      </button>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari aktivitas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 md:py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 bg-white text-sm text-black font-bold placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-6 py-5">Periode & Waktu</th>
                <th className="px-6 py-5">Nama Aktivitas</th>
                <th className="px-6 py-5">Capaian Progres</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.length > 0 ? filteredActivities.map((item) => (
                <tr key={item.id} className="group hover:bg-indigo-50/20 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Calendar size={12} className="text-indigo-500" />
                        {item.startDate}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5 uppercase">
                        <Clock size={12} />
                        {item.startTime} - {item.endTime}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-900 mb-1">{item.taskName}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${item.isRoutine ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.isRoutine ? 'Routine' : 'Incidental'}
                      </span>
                      {item.externalLink && <a href={item.externalLink} target="_blank" className="text-indigo-500"><ExternalLink size={12}/></a>}
                      {item.evidenceIds.length > 0 && <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Paperclip size={10}/> {item.evidenceIds.length}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 w-40">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-indigo-600 transition-all duration-500`} style={{ width: `${item.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-700">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className={`text-[8px] font-black uppercase ${item.approvalStatus === 'APPROVED' ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {item.approvalStatus || 'DRAFT'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(!item.approvalStatus || item.approvalStatus === 'DRAFT' || item.approvalStatus === 'REVISION') && (
                        <button onClick={() => handleRequestApproval(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Send size={16} /></button>
                      )}
                      <button onClick={() => { setEditingActivity(item); setShowEditModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg"><Edit2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic">Belum ada data aktivitas.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="md:hidden divide-y divide-slate-50">
          {filteredActivities.length > 0 ? filteredActivities.map((item) => (
            <div key={item.id} className="p-5 space-y-4 active:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${item.isRoutine ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.isRoutine ? 'Routine' : 'Incidental'}
                    </span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">{item.taskName}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    <span className="flex items-center gap-1"><Calendar size={10} className="text-indigo-500"/> {item.startDate.split('-').slice(1).join('/')}</span>
                    <span className="flex items-center gap-1"><Clock size={10}/> {item.startTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                   {(!item.approvalStatus || item.approvalStatus === 'DRAFT' || item.approvalStatus === 'REVISION') && (
                    <button onClick={() => handleRequestApproval(item)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Send size={16} /></button>
                  )}
                  <button onClick={() => { setEditingActivity(item); setShowEditModal(true); }} className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Edit2 size={16} /></button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${item.progress}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-slate-700">{item.progress}%</span>
                <span className={`text-[9px] font-black uppercase ${item.approvalStatus === 'APPROVED' ? 'text-emerald-500' : 'text-slate-300'}`}>
                  {item.approvalStatus || 'DRAFT'}
                </span>
              </div>
              
              {(item.externalLink || item.evidenceIds.length > 0) && (
                <div className="flex items-center gap-3 pt-1">
                  {item.externalLink && <a href={item.externalLink} target="_blank" className="text-[9px] font-black text-indigo-500 flex items-center gap-1 uppercase tracking-tighter"><ExternalLink size={10}/> Tautan</a>}
                  {item.evidenceIds.length > 0 && <span className="text-[9px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-tighter"><Paperclip size={10}/> {item.evidenceIds.length} Bukti</span>}
                </div>
              )}
            </div>
          )) : (
            <div className="py-20 text-center px-6">
              <FileText size={40} className="mx-auto text-slate-100 mb-3" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Tidak ada aktivitas ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Responsive optimized */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full h-[95vh] md:h-auto md:max-h-[90vh] md:max-w-2xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="px-6 md:px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    {/* Fix: Added CalendarCheck to imports and using it here */}
                    <CalendarCheck size={20} />
                 </div>
                 <div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight leading-none">
                      {showEditModal ? 'Update Laporan' : 'Catat Aktivitas'}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Divisi {activeDivision}</p>
                 </div>
              </div>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingActivity(null); }} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={showEditModal ? handleUpdateActivity : handleAddActivity} className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Aktivitas / Tugas</label>
                <input 
                  type="text" required
                  value={showEditModal ? editingActivity?.taskName : newTask.taskName}
                  onChange={e => showEditModal ? setEditingActivity({...editingActivity!, taskName: e.target.value}) : setNewTask({...newTask, taskName: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm text-black font-bold placeholder:text-slate-300"
                  placeholder="Contoh: Input data paspor jamaah..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mulai</label>
                  <div className="flex gap-2">
                    <input type="date" required value={showEditModal ? editingActivity?.startDate : newTask.startDate} onChange={e => showEditModal ? setEditingActivity({...editingActivity!, startDate: e.target.value}) : setNewTask({...newTask, startDate: e.target.value})} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50/50" />
                    <input type="time" required value={showEditModal ? editingActivity?.startTime : newTask.startTime} onChange={e => showEditModal ? setEditingActivity({...editingActivity!, startTime: e.target.value}) : setNewTask({...newTask, startTime: e.target.value})} className="w-24 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Selesai</label>
                  <div className="flex gap-2">
                    <input type="date" required value={showEditModal ? editingActivity?.endDate : newTask.endDate} onChange={e => showEditModal ? setEditingActivity({...editingActivity!, endDate: e.target.value}) : setNewTask({...newTask, endDate: e.target.value})} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50/50" />
                    <input type="time" required value={showEditModal ? editingActivity?.endTime : newTask.endTime} onChange={e => showEditModal ? setEditingActivity({...editingActivity!, endTime: e.target.value}) : setNewTask({...newTask, endTime: e.target.value})} className="w-24 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50/50" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Status</label>
                  <select 
                    value={showEditModal ? editingActivity?.status : newTask.status}
                    onChange={e => showEditModal ? setEditingActivity({...editingActivity!, status: e.target.value as TaskStatus}) : setNewTask({...newTask, status: e.target.value as TaskStatus})}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-xs font-black text-black bg-white focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value={TaskStatus.BELUM}>Belum Dimulai</option>
                    <option value={TaskStatus.PROSES}>Progress</option>
                    <option value={TaskStatus.SELESAI}>Selesai</option>
                    <option value={TaskStatus.PENDING}>Pending</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-700 uppercase leading-none mb-1">Rutin?</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Harian</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer scale-90">
                    <input type="checkbox" checked={showEditModal ? editingActivity?.isRoutine : newTask.isRoutine} onChange={e => showEditModal ? setEditingActivity({...editingActivity!, isRoutine: e.target.checked}) : setNewTask({...newTask, isRoutine: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.2em] ml-1">Progres Kerja: {showEditModal ? editingActivity?.progress : newTask.progress}%</label>
                  <CheckCircle2 size={16} className="text-indigo-500" />
                </div>
                <input type="range" min="0" max="100" step="5" value={showEditModal ? editingActivity?.progress : newTask.progress} onChange={e => {
                    const val = parseInt(e.target.value);
                    showEditModal ? setEditingActivity({...editingActivity!, progress: val}) : setNewTask({...newTask, progress: val});
                  }}
                  className="w-full h-2 bg-indigo-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block">Bukti Pengerjaan</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-300 transition-all gap-2 group">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Plus size={20} /></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lampirkan File</span>
                  </button>
                  <div className="p-4 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase"><LinkIcon size={12} /> GDrive Link</div>
                    <input type="url" value={showEditModal ? editingActivity?.externalLink : newTask.externalLink} onChange={e => showEditModal ? setEditingActivity({...editingActivity!, externalLink: e.target.value}) : setNewTask({...newTask, externalLink: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:outline-none" placeholder="https://..." />
                  </div>
                </div>
                <input type="file" multiple hidden ref={fileInputRef} accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => handleFileUpload(e, showEditModal)} />
                
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {(showEditModal ? editingActivity?.evidenceIds : newTask.evidenceIds)?.map((fid, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[10px] font-black text-slate-600 truncate flex-1 pr-4">{fid}</span>
                      <button type="button" onClick={() => {
                        const filter = (showEditModal ? editingActivity?.evidenceIds : newTask.evidenceIds)?.filter((_, i) => i !== idx) || [];
                        showEditModal ? setEditingActivity({...editingActivity!, evidenceIds: filter}) : setNewTask({...newTask, evidenceIds: filter});
                      }} className="text-rose-500"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 sticky bottom-0 bg-white border-t border-slate-100 flex gap-3">
                 <button 
                  type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="flex-1 py-4 border border-slate-200 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px]"
                >
                  <Save size={18} className="inline mr-2" />
                  Simpan Aktivitas
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

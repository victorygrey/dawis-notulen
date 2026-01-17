
import React, { useState, useEffect } from 'react';
import { Approval, DivisionType, DailyActivity, Role, User } from '../types';
import { 
  Check, X, Clock, MessageSquare, History, 
  CheckCircle2, User as UserIcon, Inbox, Send, Search,
  Eye, FileText, ExternalLink, Paperclip, Image as ImageIcon, 
  FileSpreadsheet, AlertCircle, Calendar
} from 'lucide-react';

const ApprovalSystem: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'outbox'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewActivity, setPreviewActivity] = useState<DailyActivity | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('syncops_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const loadData = () => {
      const savedApprovals = localStorage.getItem('syncops_approvals');
      const savedActivities = localStorage.getItem('syncops_activities');
      if (savedApprovals) setApprovals(JSON.parse(savedApprovals));
      if (savedActivities) setActivities(JSON.parse(savedActivities));
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED' | 'REVISION', note: string) => {
    if (!user) return;

    const updatedApprovals = approvals.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: action,
          history: [
            ...app.history,
            {
              step: app.history.length + 1,
              approverName: user.name,
              action: action,
              note: note || `Tindakan ${action} dilakukan oleh ${user.role}`,
              date: new Date().toLocaleString()
            }
          ]
        };
      }
      return app;
    });

    const currentApproval = approvals.find(a => a.id === id);
    if (currentApproval) {
      const updatedActivities = activities.map(act => 
        act.id === currentApproval.activityId ? { ...act, approvalStatus: action } : act
      );
      setActivities(updatedActivities);
      localStorage.setItem('syncops_activities', JSON.stringify(updatedActivities));
    }

    setApprovals(updatedApprovals);
    localStorage.setItem('syncops_approvals', JSON.stringify(updatedApprovals));
    setPreviewActivity(null); // Close preview if open
  };

  const inboxApprovals = approvals.filter(app => {
    if (!user) return false;
    if (user.role === Role.DIRECTOR) {
      return (app.requesterRole === Role.MANAGER || app.requesterRole === Role.SUBADMIN) && 
             user.divisions.includes(app.division) && app.status === 'PENDING';
    }
    if (user.role === Role.MANAGER || user.role === Role.SUBADMIN) {
      return app.requesterRole === Role.STAFF && 
             user.divisions.includes(app.division) && app.status === 'PENDING';
    }
    return false;
  });

  const outboxApprovals = approvals.filter(app => user && app.requesterId === user.id);

  const currentDisplayList = (activeTab === 'inbox' ? inboxApprovals : outboxApprovals).filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.requesterName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityForApproval = (activityId: string) => {
    return activities.find(a => a.id === activityId);
  };

  const getFileIcon = (fileName: string) => {
    const low = fileName.toLowerCase();
    if (low.includes('.pdf')) return <FileText size={16} className="text-rose-500" />;
    if (low.includes('.xls') || low.includes('.csv')) return <FileSpreadsheet size={16} className="text-emerald-500" />;
    if (low.includes('.doc')) return <FileText size={16} className="text-blue-500" />;
    return <ImageIcon size={16} className="text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pusat Persetujuan (Approval)</h2>
          <p className="text-slate-500 text-sm font-medium">Validasi dan sahkan laporan kerja divisi <span className="text-indigo-600 font-bold">{activeDivision}</span></p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-tight ${
              activeTab === 'inbox' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Inbox size={14} />
            Kotak Masuk {inboxApprovals.length > 0 && <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[8px] ml-1">{inboxApprovals.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('outbox')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-tight ${
              activeTab === 'outbox' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Send size={14} />
            Pengajuan Saya
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari pengajuan berdasarkan judul atau nama..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm text-black"
        />
      </div>

      <div className="grid grid-cols-1 gap-5">
        {currentDisplayList.length > 0 ? currentDisplayList.map((app) => {
          const act = getActivityForApproval(app.activityId);
          return (
            <div key={app.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm ${
                      app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                      app.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                      app.status === 'REVISION' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {app.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{app.division}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{app.title}</h3>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                    <span className="flex items-center gap-1.5"><UserIcon size={14} className="text-indigo-400"/> {app.requesterName}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-300"/> {app.dateSubmitted}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <button 
                    onClick={() => act && setPreviewActivity(act)}
                    className="flex-1 lg:flex-none px-4 py-2.5 bg-slate-50 text-slate-600 font-black rounded-xl hover:bg-slate-100 transition-all text-xs flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <Eye size={16} />
                    Preview Bukti
                  </button>
                  
                  {activeTab === 'inbox' && (
                    <>
                      <button 
                        onClick={() => {
                          const note = prompt('Berikan catatan revisi:');
                          if(note !== null) handleAction(app.id, 'REVISION', note || 'Butuh perbaikan detail laporan.');
                        }}
                        className="flex-1 lg:flex-none px-4 py-2.5 border border-amber-200 text-amber-700 font-black rounded-xl hover:bg-amber-50 transition-all text-xs uppercase"
                      >
                        Revisi
                      </button>
                      <button 
                        onClick={() => handleAction(app.id, 'APPROVED', 'Laporan valid dan disetujui.')}
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all text-xs uppercase shadow-lg shadow-indigo-500/20"
                      >
                        Setujui
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Data Summary Bar */}
              <div className="px-6 py-4 bg-slate-50/50 flex flex-wrap gap-6 border-b border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Durasi Kerja</span>
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Clock size={12} className="text-indigo-500" />
                    {act?.startTime} - {act?.endTime}
                  </span>
                </div>
                <div className="flex-1 min-w-[140px] flex flex-col">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Progres Capaian</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600" style={{ width: `${act?.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-black text-slate-700">{act?.progress}%</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Lampiran Bukti</span>
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Paperclip size={12} className="text-emerald-500" />
                    {act?.evidenceIds?.length || 0} Item
                  </span>
                </div>
              </div>

              {/* Recent History Inline */}
              <div className="px-6 py-4 bg-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <History size={12} className="text-slate-400" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aktivitas Terakhir</p>
                </div>
                <div className="space-y-2">
                  {app.history.slice(-1).map((h, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px] p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                      <span className={`font-black uppercase tracking-tighter ${
                        h.action === 'APPROVED' ? 'text-emerald-600' : 
                        h.action === 'SUBMITTED' ? 'text-blue-600' : 'text-amber-600'
                      }`}>{h.action}</span>
                      <span className="text-slate-600 font-bold">oleh {h.approverName}:</span>
                      <span className="text-slate-500 italic flex-1 truncate">"{h.note}"</span>
                      <span className="text-slate-400 font-medium text-[10px]">{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="bg-white p-24 text-center rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 size={40} className="text-slate-200" />
             </div>
             <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Semua Beres!</h3>
             <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
               {activeTab === 'inbox' ? 'Tidak ada antrian persetujuan baru.' : 'Belum ada pengajuan yang Anda kirimkan.'}
             </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewActivity && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-10 py-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="space-y-1">
                <span className="px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">Validation View</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{previewActivity.taskName}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-indigo-400"/> {previewActivity.startDate}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-400"/> {previewActivity.startTime} - {previewActivity.endTime}</span>
                </div>
              </div>
              <button 
                onClick={() => setPreviewActivity(null)} 
                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Progres Laporan</span>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-black text-slate-900">{previewActivity.progress}%</span>
                    <CheckCircle2 size={24} className={previewActivity.progress === 100 ? 'text-emerald-500' : 'text-slate-300'} />
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${previewActivity.progress}%` }}></div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Status & Tipe</span>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">Status Kerja</span>
                      <span className="text-xs font-black text-indigo-600 uppercase">{previewActivity.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">Jenis Tugas</span>
                      <span className="text-xs font-black text-slate-700 uppercase">{previewActivity.isRoutine ? 'Rutinitas' : 'Insidentil'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Paperclip size={18} className="text-indigo-500" />
                    Lampiran Bukti (Evidence)
                  </h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">{previewActivity.evidenceIds.length} Files</span>
                </div>
                
                <div className="space-y-3">
                  {previewActivity.evidenceIds.length > 0 ? previewActivity.evidenceIds.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-white transition-colors">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 truncate max-w-[300px]">{file}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Diupload pada {previewActivity.date}</span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  )) : (
                    <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center space-y-2">
                      <AlertCircle size={32} className="mx-auto text-slate-200" />
                      <p className="text-xs font-bold text-slate-400 uppercase">Tidak ada lampiran file</p>
                    </div>
                  )}
                </div>
              </div>

              {/* External Link */}
              {previewActivity.externalLink && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <ExternalLink size={18} className="text-indigo-500" />
                    Tautan Eksternal (Cloud)
                  </h4>
                  <a 
                    href={previewActivity.externalLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between p-5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Send size={18} />
                      </div>
                      <span className="text-sm font-black tracking-tight truncate max-w-[400px]">Buka Tautan Lampiran</span>
                    </div>
                    <ExternalLink size={18} />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            {activeTab === 'inbox' && (
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    const note = prompt('Berikan catatan revisi:');
                    if(note !== null) {
                      const app = approvals.find(a => a.activityId === previewActivity.id);
                      if (app) handleAction(app.id, 'REVISION', note || 'Butuh perbaikan.');
                    }
                  }}
                  className="py-4 bg-white border border-amber-200 text-amber-700 font-black rounded-2xl hover:bg-amber-100 transition-all uppercase text-xs tracking-widest shadow-sm"
                >
                  Minta Revisi
                </button>
                <button 
                  onClick={() => {
                    const app = approvals.find(a => a.activityId === previewActivity.id);
                    if (app) handleAction(app.id, 'APPROVED', 'Laporan valid.');
                  }}
                  className="py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase text-xs tracking-widest shadow-xl shadow-indigo-500/20"
                >
                  Setujui Laporan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalSystem;

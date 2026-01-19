
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
          history: [...app.history, {
            step: app.history.length + 1,
            approverName: user.name,
            action: action,
            note: note || `Tindakan ${action} dilakukan.`,
            date: new Date().toLocaleString()
          }]
        };
      }
      return app;
    });
    const currentApproval = approvals.find(a => a.id === id);
    if (currentApproval) {
      const updatedActivities = activities.map(act => act.id === currentApproval.activityId ? { ...act, approvalStatus: action } : act);
      setActivities(updatedActivities);
      localStorage.setItem('syncops_activities', JSON.stringify(updatedActivities));
    }
    setApprovals(updatedApprovals);
    localStorage.setItem('syncops_approvals', JSON.stringify(updatedApprovals));
    setPreviewActivity(null);
  };

  const inboxApprovals = approvals.filter(app => {
    if (!user) return false;
    if (user.role === Role.DIRECTOR) return (app.requesterRole === Role.MANAGER || app.requesterRole === Role.SUBADMIN) && user.divisions.includes(app.division) && app.status === 'PENDING';
    if (user.role === Role.MANAGER || user.role === Role.SUBADMIN) return app.requesterRole === Role.STAFF && user.divisions.includes(app.division) && app.status === 'PENDING';
    return false;
  });

  const outboxApprovals = approvals.filter(app => user && app.requesterId === user.id);
  const currentDisplayList = (activeTab === 'inbox' ? inboxApprovals : outboxApprovals).filter(app => app.title.toLowerCase().includes(searchQuery.toLowerCase()) || app.requesterName.toLowerCase().includes(searchQuery.toLowerCase()));
  const getActivityForApproval = (activityId: string) => activities.find(a => a.id === activityId);
  const getFileIcon = (fileName: string) => {
    const low = fileName.toLowerCase();
    if (low.includes('.pdf')) return <FileText size={16} className="text-rose-500" />;
    if (low.includes('.xls') || low.includes('.csv')) return <FileSpreadsheet size={16} className="text-emerald-500" />;
    return <ImageIcon size={16} className="text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Approvals</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium tracking-tight">Sahkan laporan kerja divisi <span className="text-indigo-600 font-bold">{activeDivision}</span></p>
        </div>
        
        <div className="flex bg-slate-200/50 p-1.5 rounded-[1.5rem] border border-slate-200">
          <button onClick={() => setActiveTab('inbox')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'inbox' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500'}`}>
            <Inbox size={14} /> Inbox {inboxApprovals.length > 0 && <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">{inboxApprovals.length}</span>}
          </button>
          <button onClick={() => setActiveTab('outbox')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'outbox' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500'}`}>
            <Send size={14} /> Outbox
          </button>
        </div>
      </div>

      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" placeholder="Cari pengajuan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300 shadow-sm" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentDisplayList.length > 0 ? currentDisplayList.map((app) => {
          const act = getActivityForApproval(app.activityId);
          return (
            <div key={app.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
              <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-50">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[8px] font-black rounded-full uppercase tracking-widest ${app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : app.status === 'PENDING' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                      {app.status}
                    </span>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{app.division}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-none">{app.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    <span className="flex items-center gap-1.5"><UserIcon size={14} className="text-indigo-400"/> {app.requesterName}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-300"/> {app.dateSubmitted.split(',')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => act && setPreviewActivity(act)} className="flex-1 md:flex-none px-4 py-2.5 bg-slate-50 text-slate-700 font-black rounded-xl hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest border border-slate-200 flex items-center justify-center gap-2">
                    <Eye size={16} /> Preview
                  </button>
                  {activeTab === 'inbox' && (
                    <button onClick={() => handleAction(app.id, 'APPROVED', 'OK')} className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 text-[10px] uppercase tracking-widest">
                      Approve
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Info Bar */}
              <div className="px-5 py-3.5 bg-slate-50/50 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-500">
                    <Clock size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Durasi</span>
                    <span className="text-[10px] font-black text-slate-700">{act?.startTime} - {act?.endTime}</span>
                  </div>
                </div>
                <div className="flex-1 mx-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Progress</span>
                    <span className="text-[9px] font-black text-slate-700">{act?.progress}%</span>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${act?.progress}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-500">
                    <Paperclip size={14} />
                  </div>
                  <span className="text-[10px] font-black text-slate-700">{act?.evidenceIds?.length || 0}</span>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="bg-white py-24 text-center rounded-[3rem] border-2 border-dashed border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-slate-200" />
             </div>
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Antrian persetujuan kosong.</p>
          </div>
        )}
      </div>

      {/* Responsive Preview Modal */}
      {previewActivity && (
        <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full h-[90vh] md:h-auto md:max-h-[90vh] md:max-w-2xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded-full uppercase tracking-widest">Preview Laporan</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mt-2">{previewActivity.taskName}</h3>
              </div>
              <button onClick={() => setPreviewActivity(null)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Capaian</span>
                  <p className="text-3xl font-black text-slate-900 leading-none">{previewActivity.progress}%</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sifat</span>
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-tight">{previewActivity.isRoutine ? 'Routine' : 'Incidental'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Paperclip size={14} /> Lampiran File</h4>
                <div className="space-y-2">
                  {previewActivity.evidenceIds.length > 0 ? previewActivity.evidenceIds.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-indigo-50 transition-colors">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex flex-col max-w-[150px] md:max-w-[300px]">
                          <span className="text-xs font-black text-slate-800 truncate">{file}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Evidence {idx + 1}</span>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-500" />
                    </div>
                  )) : (
                    <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-[10px] font-black text-slate-300 uppercase tracking-widest">No Attachments</div>
                  )}
                </div>
              </div>

              {previewActivity.externalLink && (
                <div className="space-y-4 pb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><ExternalLink size={14} /> Tautan Cloud</h4>
                  <a href={previewActivity.externalLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                    <span className="text-xs font-black tracking-widest uppercase">Buka GDrive / Link</span>
                    <ExternalLink size={18} />
                  </a>
                </div>
              )}
            </div>

            {activeTab === 'inbox' && (
              <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-3">
                <button 
                  onClick={() => {
                    const note = prompt('Alasan Revisi:');
                    if(note !== null) {
                      const app = approvals.find(a => a.activityId === previewActivity.id);
                      if (app) handleAction(app.id, 'REVISION', note || 'Butuh perbaikan.');
                    }
                  }}
                  className="w-full md:flex-1 py-4 bg-white border border-amber-200 text-amber-700 font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-sm"
                >
                  Minta Revisi
                </button>
                <button 
                  onClick={() => {
                    const app = approvals.find(a => a.activityId === previewActivity.id);
                    if (app) handleAction(app.id, 'APPROVED', 'Laporan valid.');
                  }}
                  className="w-full md:flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 uppercase text-[10px] tracking-widest"
                >
                  Setujui Sekarang
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

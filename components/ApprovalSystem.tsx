import React, { useState, useEffect } from 'react';
import { Approval, DivisionType } from '../types';
import { Check, X, Clock, MessageSquare, History, FileText, CheckCircle2 } from 'lucide-react';

const ApprovalSystem: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('syncops_approvals');
    if (saved) {
      setApprovals(JSON.parse(saved));
    } else {
      const initial: Approval[] = [
        {
          id: 'a1',
          title: 'Pengajuan Pembayaran Vendor Bus - Group B1',
          requesterId: 'u2',
          division: DivisionType.OPRS,
          status: 'PENDING',
          currentStep: 1,
          totalSteps: 3,
          history: [
            {
              step: 1,
              approverName: 'Admin OPRS',
              action: 'SUBMITTED',
              note: 'Dokumen invoice terlampir',
              date: new Date().toLocaleString()
            }
          ]
        },
        {
          id: 'a2',
          title: 'Pengadaan Koper Tambahan 50 Pcs',
          requesterId: 'u3',
          division: DivisionType.LOGISTIK,
          status: 'PENDING',
          currentStep: 1,
          totalSteps: 2,
          history: [
            {
              step: 1,
              approverName: 'Staf Gudang',
              action: 'SUBMITTED',
              note: 'Stok menipis untuk keberangkatan Februari',
              date: new Date().toLocaleString()
            }
          ]
        }
      ];
      setApprovals(initial);
      localStorage.setItem('syncops_approvals', JSON.stringify(initial));
    }
  }, []);

  const updateApproval = (id: string, newStatus: 'APPROVED' | 'REJECTED' | 'REVISION', note: string) => {
    const updated = approvals.map(app => {
      if (app.id === id) {
        const nextStep = newStatus === 'APPROVED' ? Math.min(app.currentStep + 1, app.totalSteps) : app.currentStep;
        const finalStatus = (newStatus === 'APPROVED' && nextStep === app.totalSteps) ? 'APPROVED' : 
                          (newStatus === 'APPROVED' ? 'PENDING' : newStatus);
        
        return {
          ...app,
          status: finalStatus as any,
          currentStep: nextStep,
          history: [
            ...app.history,
            {
              step: app.currentStep,
              approverName: 'You (Current User)',
              action: newStatus,
              note: note,
              date: new Date().toLocaleString()
            }
          ]
        };
      }
      return app;
    });
    setApprovals(updated);
    localStorage.setItem('syncops_approvals', JSON.stringify(updated));
  };

  const filteredApprovals = approvals.filter(a => 
    a.division === activeDivision || activeDivision === DivisionType.IT
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Approval Workflow</h2>
          <p className="text-slate-500">Kelola persetujuan dokumen divisi <span className="font-semibold text-indigo-600">{activeDivision}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredApprovals.length > 0 && filteredApprovals.map((app) => (
          <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                    app.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                    app.status === 'REVISION' ? 'bg-orange-50 text-orange-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {app.status}
                  </span>
                  <span className="text-xs text-slate-400">#REQ-{app.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{app.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><FileText size={14}/> {app.division}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14}/> {app.history[0].date}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 min-w-[150px]">
                <div className="flex gap-1 w-full h-2 bg-slate-100 rounded-full mb-1">
                  {[...Array(app.totalSteps)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${
                      i < app.currentStep ? (app.status === 'REJECTED' ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-slate-200'
                    }`}></div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {app.status === 'APPROVED' ? 'Complete' : `Step ${app.currentStep} of ${app.totalSteps}`}
                </span>
              </div>

              {app.status === 'PENDING' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateApproval(app.id, 'REVISION', 'Butuh perbaikan data')}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors text-xs"
                  >
                    <MessageSquare size={14} /> Revisi
                  </button>
                  <button 
                    onClick={() => updateApproval(app.id, 'REJECTED', 'Ditolak karena alasan operasional')}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition-colors text-xs"
                  >
                    <X size={14} /> Tolak
                  </button>
                  <button 
                    onClick={() => updateApproval(app.id, 'APPROVED', 'Disetujui untuk lanjut ke tahap berikutnya')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg text-xs"
                  >
                    <Check size={14} /> Approve
                  </button>
                </div>
              )}
              
              {app.status === 'APPROVED' && (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg">
                  <CheckCircle2 size={18} /> Approved & Finalized
                </div>
              )}
            </div>

            <div className="bg-slate-50/80 p-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <History size={14} /> Riwayat Persetujuan
              </h4>
              <div className="space-y-4">
                {app.history.map((h, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white ${
                        h.action === 'SUBMITTED' ? 'bg-blue-500' :
                        h.action === 'APPROVED' ? 'bg-emerald-500' :
                        h.action === 'REJECTED' ? 'bg-rose-500' : 'bg-orange-500'
                      }`}>
                        {h.action === 'SUBMITTED' ? <Clock size={14}/> : <Check size={14} />}
                      </div>
                      {i < app.history.length - 1 && <div className="flex-1 w-px bg-slate-200 my-1"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-slate-800">{h.approverName}</p>
                        <span className="text-[10px] text-slate-400 font-medium uppercase">{h.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-100 italic">"{h.note}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {filteredApprovals.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-200 text-slate-400 italic">
            Tidak ada pengajuan persetujuan yang tertunda.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalSystem;
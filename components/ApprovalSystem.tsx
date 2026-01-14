
import React from 'react';
import { Approval, DivisionType } from '../types';
import { Check, X, Clock, MessageSquare, History, FileText } from 'lucide-react';

const ApprovalSystem: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const approvals: Approval[] = [
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
          date: '2023-11-20 09:00'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Approval Workflow</h2>
          <p className="text-slate-500">Monitor and process division-wide approvals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {approvals.map((app) => (
          <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded uppercase">
                    Menunggu Approval
                  </span>
                  <span className="text-xs text-slate-400">#REQ-{app.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{app.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><FileText size={14}/> {app.division}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14}/> {app.history[0].date}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="flex gap-1 w-full h-1.5 bg-slate-100 rounded-full mb-1">
                  {[...Array(app.totalSteps)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full ${i < app.currentStep ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Step {app.currentStep} of {app.totalSteps}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <MessageSquare size={16} />
                  Revisi
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition-colors text-sm">
                  <X size={16} />
                  Reject
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 text-sm">
                  <Check size={16} />
                  Approve
                </button>
              </div>
            </div>

            <div className="bg-slate-50/80 p-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <History size={14} />
                Approval History
              </h4>
              <div className="space-y-4">
                {app.history.map((h, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <Check size={14} />
                      </div>
                      <div className="flex-1 w-px bg-slate-200 my-1"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-slate-800">{h.approverName}</p>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{h.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-100">{h.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalSystem;

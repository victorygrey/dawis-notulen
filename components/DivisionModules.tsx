
import React from 'react';
import { DivisionType } from '../types';
import { Package, ShieldCheck, PlaneTakeoff, Wallet, FileCheck, Users, Link as LinkIcon, AlertCircle } from 'lucide-react';

const DivisionModules: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const renderLogistik = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <Package className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-800">Inventory Tracker</h3>
          <p className="text-sm text-slate-500 mb-4">Stock in/out perlengkapan jamaah (Baju, Tas, Koper).</p>
          <div className="flex items-center justify-between text-xs pt-4 border-t">
            <span className="text-slate-400 uppercase font-bold">In Stock</span>
            <span className="text-indigo-600 font-bold">1,240 Units</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <FileCheck className="text-emerald-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-800">Checklist Mutu</h3>
          <p className="text-sm text-slate-500 mb-4">Quality control for equipment before distribution.</p>
          <div className="flex items-center justify-between text-xs pt-4 border-t">
            <span className="text-slate-400 uppercase font-bold">Checked</span>
            <span className="text-emerald-600 font-bold">98% Pass</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <AlertCircle className="text-rose-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-800">Risk Mitigasi</h3>
          <p className="text-sm text-slate-500 mb-4">Logistics action plan & potential delay tracking.</p>
          <div className="flex items-center justify-between text-xs pt-4 border-t">
            <span className="text-slate-400 uppercase font-bold">Active Risk</span>
            <span className="text-rose-600 font-bold">2 Low</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPDP = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-600" />
            Document Registry (PDP)
          </h3>
          <button className="text-xs font-bold text-indigo-600 uppercase">Manage Links</button>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Document Name</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">Type</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3].map(i => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">Sertifikat Keberangkatan B1</p>
                    <p className="text-[10px] text-slate-400">Diupload 15 Jan 2024</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">Digital Certificate</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">VALID</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600"><LinkIcon size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOPRS = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <PlaneTakeoff size={24} />
          </div>
          <h3 className="font-bold text-slate-800">Group Keberangkatan</h3>
        </div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-600">Group Alpha-0{i}</span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">PASSPORT REQ</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Penerangkatan Januari 2024</h4>
              <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span className="flex items-center gap-1"><Users size={12}/> 45 Jamaah</span>
                <span className="flex items-center gap-1">Status: Visa Process</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Timeline Visa & Tiket</h3>
        <div className="space-y-6">
          <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
              <p className="text-xs font-bold text-slate-800">Issued Tiket</p>
              <p className="text-[10px] text-slate-400">Completed on Dec 12</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm"></div>
              <p className="text-xs font-bold text-slate-800">Submission Visa</p>
              <p className="text-[10px] text-slate-400">In Progress - 45/50</p>
            </div>
            <div className="relative opacity-40">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
              <p className="text-xs font-bold text-slate-800">Booking Hotel</p>
              <p className="text-[10px] text-slate-400">Scheduled for Jan 5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Module Khusus: {activeDivision}</h2>
        <p className="text-slate-500">Fitur spesifik berdasarkan workflow divisi Anda.</p>
      </header>

      {activeDivision === DivisionType.LOGISTIK && renderLogistik()}
      {activeDivision === DivisionType.PDP && renderPDP()}
      {activeDivision === DivisionType.OPRS && renderOPRS()}
      {activeDivision === DivisionType.KEUANGAN && (
        <div className="bg-white p-8 rounded-xl border border-slate-100 text-center space-y-4">
          <Wallet size={48} className="mx-auto text-slate-300" />
          <h3 className="text-xl font-bold text-slate-800">Finance Tracking</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Mini finance tracker for payment requests and progress is currently under maintenance.</p>
        </div>
      )}
      {!([DivisionType.LOGISTIK, DivisionType.PDP, DivisionType.OPRS, DivisionType.KEUANGAN].includes(activeDivision)) && (
        <div className="bg-white p-12 rounded-xl border border-dashed border-slate-200 text-center">
          <p className="text-slate-400 font-medium">No specific module available for this division yet.</p>
        </div>
      )}
    </div>
  );
};

export default DivisionModules;

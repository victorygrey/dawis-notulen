
import React, { useState } from 'react';
import { TaskStatus, DailyActivity, DivisionType } from '../types';
import { Plus, Search, Filter, MoreVertical, Paperclip, Clock, Calendar } from 'lucide-react';

const TaskTracker: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const [activities, setActivities] = useState<DailyActivity[]>([
    {
      id: '1',
      userId: 'u1',
      divisionId: DivisionType.LOGISTIK,
      date: '2023-11-20',
      startTime: '08:00',
      endTime: '10:00',
      taskName: 'Checklist Stok Perlengkapan Umrah',
      isRoutine: true,
      progress: 100,
      status: TaskStatus.SELESAI,
      evidenceIds: ['e1']
    },
    {
      id: '2',
      userId: 'u1',
      divisionId: DivisionType.OPRS,
      date: '2023-11-20',
      startTime: '10:30',
      endTime: '14:00',
      taskName: 'Update Timeline Group Januari',
      isRoutine: false,
      progress: 65,
      status: TaskStatus.PROSES,
      evidenceIds: []
    }
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Daily Activity Tracker</h2>
          <p className="text-slate-500">Log and monitor your daily tasks and productivity.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          <span>Log Activity</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Calendar size={16} />
              Today
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jam / Durasi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pekerjaan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Evidence</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">{item.startTime} - {item.endTime}</span>
                      <span className="text-xs text-slate-400">2 Jam 30 Menit</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.taskName}</p>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">{item.divisionId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.isRoutine ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                      {item.isRoutine ? 'Rutinitas' : 'Non-Rutinitas'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[80px]">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                      item.status === TaskStatus.SELESAI ? 'bg-emerald-50 text-emerald-600' :
                      item.status === TaskStatus.PROSES ? 'bg-blue-50 text-blue-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.status === TaskStatus.SELESAI ? 'bg-emerald-500' :
                        item.status === TaskStatus.PROSES ? 'bg-blue-500' :
                        'bg-slate-400'
                      }`}></div>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Paperclip size={14} />
                      <span className="text-xs font-medium">{item.evidenceIds.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskTracker;

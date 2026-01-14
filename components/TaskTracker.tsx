import React, { useState, useEffect } from 'react';
import { TaskStatus, DailyActivity, DivisionType } from '../types';
import { Plus, Search, X, Save } from 'lucide-react';

const TaskTracker: React.FC<{ activeDivision: DivisionType }> = ({ activeDivision }) => {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newTask, setNewTask] = useState({
    taskName: '',
    startTime: '08:00',
    endTime: '10:00',
    isRoutine: true,
    progress: 0,
    status: TaskStatus.BELUM
  });

  useEffect(() => {
    const saved = localStorage.getItem('syncops_activities');
    if (saved) {
      setActivities(JSON.parse(saved));
    } else {
      const initial = [
        {
          id: '1',
          userId: 'u1',
          divisionId: DivisionType.LOGISTIK,
          date: new Date().toISOString().split('T')[0],
          startTime: '08:00',
          endTime: '10:00',
          taskName: 'Checklist Stok Perlengkapan Umrah',
          isRoutine: true,
          progress: 100,
          status: TaskStatus.SELESAI,
          evidenceIds: ['e1']
        }
      ];
      setActivities(initial);
      localStorage.setItem('syncops_activities', JSON.stringify(initial));
    }
  }, []);

  const saveActivities = (data: DailyActivity[]) => {
    setActivities(data);
    localStorage.setItem('syncops_activities', JSON.stringify(data));
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const activity: DailyActivity = {
      taskName: newTask.taskName,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      isRoutine: newTask.isRoutine,
      progress: newTask.progress,
      status: newTask.status,
      id: Math.random().toString(36).substring(2, 11),
      userId: 'u1',
      divisionId: activeDivision,
      date: new Date().toISOString().split('T')[0],
      evidenceIds: []
    };

    saveActivities([activity, ...activities]);
    setShowModal(false);
    setNewTask({
      taskName: '',
      startTime: '08:00',
      endTime: '10:00',
      isRoutine: true,
      progress: 0,
      status: TaskStatus.BELUM
    });
  };

  const filteredActivities = activities.filter(a => 
    a.taskName.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeDivision === a.divisionId || activeDivision === DivisionType.IT)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Daily Activity Tracker</h2>
          <p className="text-slate-500">Divisi: <span className="font-semibold text-indigo-600">{activeDivision}</span></p>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pekerjaan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.length > 0 ? filteredActivities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{item.startTime} - {item.endTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">{item.taskName}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.divisionId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.isRoutine ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                      {item.isRoutine ? 'Rutinitas' : 'Non-Rutinitas'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[80px]">
                        <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${item.progress}%` }}></div>
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
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        const updated = activities.filter(a => a.id !== item.id);
                        saveActivities(updated);
                      }}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm italic">
                    Belum ada data aktivitas untuk divisi ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">Catat Aktivitas Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddActivity} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Pekerjaan</label>
                <input 
                  type="text" 
                  required
                  value={newTask.taskName}
                  onChange={e => setNewTask({...newTask, taskName: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Contoh: Input data paspor jamaah..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jam Mulai</label>
                  <input 
                    type="time" 
                    value={newTask.startTime}
                    onChange={e => setNewTask({...newTask, startTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jam Selesai</label>
                  <input 
                    type="time" 
                    value={newTask.endTime}
                    onChange={e => setNewTask({...newTask, endTime: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Aktivitas Rutinitas?</span>
                <button 
                  type="button"
                  onClick={() => setNewTask({...newTask, isRoutine: !newTask.isRoutine})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${newTask.isRoutine ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newTask.isRoutine ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Progress (%)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={newTask.progress}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      setNewTask({...newTask, progress: val, status: val === 100 ? TaskStatus.SELESAI : TaskStatus.PROSES});
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select 
                    value={newTask.status}
                    onChange={e => setNewTask({...newTask, status: e.target.value as TaskStatus})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value={TaskStatus.BELUM}>Belum Mulai</option>
                    <option value={TaskStatus.PROSES}>Dalam Proses</option>
                    <option value={TaskStatus.SELESAI}>Selesai</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
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
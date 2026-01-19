
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DivisionType, User, DailyActivity, Approval, Role, TaskStatus } from '../types';
import { Activity, CheckCircle, Clock, AlertCircle, FileText, Calendar } from 'lucide-react';

const chartData = [
  { name: 'Mon', completed: 4, pending: 2 },
  { name: 'Tue', completed: 3, pending: 3 },
  { name: 'Wed', completed: 5, pending: 1 },
  { name: 'Thu', completed: 7, pending: 0 },
  { name: 'Fri', completed: 6, pending: 1 },
  { name: 'Sat', completed: 2, pending: 0 },
  { name: 'Sun', completed: 1, pending: 0 }
];

interface StatCardProps {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, sub, icon, color }) => (
  <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div className="overflow-hidden">
      <p className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">{value}</h3>
      <p className="text-[9px] md:text-xs text-slate-400 mt-2 font-medium truncate">{sub}</p>
    </div>
    <div className={`shrink-0 p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 shadow-inner`}>
      {/* Fixed: Use React.ReactElement<any> to allow 'size' prop in cloneElement */}
      {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    </div>
  </div>
);

const Dashboard: React.FC<{ user: User; activeDivision: DivisionType }> = ({ user, activeDivision }) => {
  const [stats, setStats] = useState({
    completed: 0,
    ongoing: 0,
    pendingApproval: 0,
    issues: 0
  });

  useEffect(() => {
    const activities: DailyActivity[] = JSON.parse(localStorage.getItem('syncops_activities') || '[]');
    const approvals: Approval[] = JSON.parse(localStorage.getItem('syncops_approvals') || '[]');
    const meetings = JSON.parse(localStorage.getItem('syncops_meetings') || '[]');

    const divActivities = activities.filter(a => user.divisions.includes(a.divisionId));
    
    const inboxCount = approvals.filter(app => {
      if (user.role === Role.DIRECTOR) {
        return (app.requesterRole === Role.MANAGER || app.requesterRole === Role.SUBADMIN) && 
               user.divisions.includes(app.division) && app.status === 'PENDING';
      }
      if (user.role === Role.MANAGER || user.role === Role.SUBADMIN) {
        return app.requesterRole === Role.STAFF && 
               user.divisions.includes(app.division) && app.status === 'PENDING';
      }
      return false;
    }).length;

    setStats({
      completed: divActivities.filter(a => a.status === TaskStatus.SELESAI).length,
      ongoing: divActivities.filter(a => a.status === TaskStatus.PROSES).length,
      pendingApproval: inboxCount,
      issues: meetings.filter((m: any) => m.division === activeDivision && m.issues).length
    });
  }, [user, activeDivision]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Halo, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Berikut ringkasan operasional <span className="text-indigo-600 font-bold">{activeDivision}</span> hari ini.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm shadow-sm self-start md:self-center">
          <Calendar size={16} className="text-indigo-500" />
          <span className="font-bold text-slate-700">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Selesai" value={stats.completed} sub="Tugas tuntas" icon={<CheckCircle />} color="bg-emerald-500 text-emerald-600" />
        <StatCard title="Berjalan" value={stats.ongoing} sub="Ongoing task" icon={<Activity />} color="bg-blue-500 text-blue-600" />
        <StatCard title="Approval" value={stats.pendingApproval} sub="Antrian TTD" icon={<Clock />} color="bg-orange-500 text-orange-600" />
        <StatCard title="Isu Rapat" value={stats.issues} sub="Kendala aktif" icon={<AlertCircle />} color="bg-rose-500 text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Performa Mingguan</h3>
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-tighter">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Selesai</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Pending</span>
            </div>
          </div>
          <div className="h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 800, fontSize: '12px' }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="pending" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Aktivitas Terkini</h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group">
                <div className="shrink-0 w-10 h-10 bg-slate-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <FileText size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs md:text-sm font-black text-slate-800 truncate">Update Log: Progres Manifes Jamaah</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Divisi {activeDivision} • {i} jam yang lalu</p>
                </div>
                <div className="shrink-0 px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded uppercase">
                  LOG
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

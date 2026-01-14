
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { DivisionType, Role, User } from '../types';
// Add FileText to imports from lucide-react
import { Activity, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

const data = [
  { name: 'Mon', completed: 4, pending: 2 },
  { name: 'Tue', completed: 3, pending: 3 },
  { name: 'Wed', completed: 5, pending: 1 },
  { name: 'Thu', completed: 7, pending: 0 },
  { name: 'Fri', completed: 6, pending: 1 },
  { name: 'Sat', completed: 2, pending: 0 },
  { name: 'Sun', completed: 1, pending: 0 },
];

const StatCard = ({ title, value, sub, icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC<{ user: User, activeDivision: DivisionType }> = ({ user, activeDivision }) => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back, {user.name}!</h2>
          <p className="text-slate-500">Monitoring operations for <span className="text-indigo-600 font-semibold">{activeDivision}</span></p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm shadow-sm">
          <CalendarCheck size={16} className="text-slate-400" />
          <span className="font-medium text-slate-700">{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Task Completed" value="24" sub="+12% from last week" icon={<CheckCircle size={24} />} color="bg-emerald-500 text-emerald-600" />
        <StatCard title="Ongoing Tasks" value="8" sub="3 tasks near deadline" icon={<Activity size={24} />} color="bg-blue-500 text-blue-600" />
        <StatCard title="Pending Approval" value="12" sub="Requires your action" icon={<Clock size={24} />} color="bg-orange-500 text-orange-600" />
        <StatCard title="Issues/Blockers" value="2" sub="High priority items" icon={<AlertCircle size={24} />} color="bg-rose-500 text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">Weekly Performance</h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Selesai</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-200"></div> Pending</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="pending" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Division Specific Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-6">Recent Division Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">Briefing Harian Logistik</p>
                  <p className="text-xs text-slate-500">Dibuat oleh Budi • 2 jam yang lalu</p>
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                  Logistik
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Local component definition for CalendarCheck
const CalendarCheck = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
);

export default Dashboard;

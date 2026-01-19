
import React from 'react';
import { MENU_ITEMS, DIVISIONS } from '../constants';
import { DivisionType, User, Role } from '../types';
import { ChevronRight, LogOut, X } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  activeDivision: DivisionType;
  setActiveDivision: (div: DivisionType) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activePage, 
  setActivePage, 
  activeDivision, 
  setActiveDivision,
  user,
  onLogout
}) => {
  const visibleMenuItems = MENU_ITEMS.filter(item => {
    if (item.id === 'kpi') {
      const isHRD = user.divisions.includes(DivisionType.HRD);
      const isDirector = user.role === Role.DIRECTOR;
      const isAdministrator = user.role === Role.MANAGER || user.role === Role.SUBADMIN;
      return isHRD || isDirector || isAdministrator;
    }
    if ((item as any).adminOnly) {
      return user.role === Role.MANAGER || user.role === Role.DIRECTOR;
    }
    return true;
  });

  return (
    <div className="w-full bg-slate-900 text-white flex flex-col h-full shadow-2xl">
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
            SO
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-none">SyncOps</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Integrated Tracker</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
          Active Division
        </label>
        <div className="relative">
          <select 
            value={activeDivision}
            onChange={(e) => setActiveDivision(e.target.value as DivisionType)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 appearance-none transition-all cursor-pointer"
          >
            {user.divisions.map(divId => (
              <option key={divId} value={divId}>
                {DIVISIONS.find(d => d.id === divId)?.name || divId}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <ChevronRight size={14} className="rotate-90" />
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {visibleMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group ${
              activePage === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`transition-colors ${activePage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
            </div>
            {activePage === item.id && <ChevronRight size={14} className="opacity-50" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="shrink-0 w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-black border border-slate-600 shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black truncate text-slate-100">{user.name}</p>
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">{user.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="shrink-0 text-slate-500 hover:text-rose-400 transition-all p-2 hover:bg-rose-500/10 rounded-lg"
            title="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


import React from 'react';
import { MENU_ITEMS, DIVISIONS } from '../constants';
import { DivisionType, User, Role } from '../types';
import { ChevronRight, LogOut } from 'lucide-react';

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
  // Filter menu items based on user role and permissions
  const visibleMenuItems = MENU_ITEMS.filter(item => {
    // Check for KPI restriction
    if (item.id === 'kpi') {
      const isHRD = user.divisions.includes(DivisionType.HRD);
      const isDirector = user.role === Role.DIRECTOR;
      const isAdministrator = user.role === Role.MANAGER || user.role === Role.SUBADMIN;
      return isHRD || isDirector || isAdministrator;
    }

    // Check for User Management restriction
    if ((item as any).adminOnly) {
      return user.role === Role.MANAGER || user.role === Role.DIRECTOR;
    }
    return true;
  });

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 shadow-xl transition-all duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
          SO
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">SyncOps</h1>
          <p className="text-xs text-slate-400">Integrated Tracker</p>
        </div>
      </div>

      <div className="p-4 border-b border-slate-800">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
          Active Division
        </label>
        <select 
          value={activeDivision}
          onChange={(e) => setActiveDivision(e.target.value as DivisionType)}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
        >
          {user.divisions.map(divId => (
            <option key={divId} value={divId}>
              {DIVISIONS.find(d => d.id === divId)?.name || divId}
            </option>
          ))}
        </select>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {visibleMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              activePage === item.id 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${activePage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            {activePage === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-500 hover:text-red-400 transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

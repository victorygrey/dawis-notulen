
import React, { useState, useEffect } from 'react';
import { DivisionType, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskTracker from './components/TaskTracker';
import MeetingMinutes from './components/MeetingMinutes';
import ApprovalSystem from './components/ApprovalSystem';
import DivisionModules from './components/DivisionModules';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeDivision, setActiveDivision] = useState<DivisionType | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const initApp = () => {
      try {
        const savedUser = localStorage.getItem('syncops_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.divisions && parsedUser.divisions.length > 0) {
            setUser(parsedUser);
            setActiveDivision(parsedUser.divisions[0]);
          }
        }
      } catch (e) {
        console.warn("Storage cleared due to version mismatch or error");
        localStorage.removeItem('syncops_user');
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (userData.divisions && userData.divisions.length > 0) {
      setActiveDivision(userData.divisions[0]);
    }
    localStorage.setItem('syncops_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveDivision(null);
    localStorage.removeItem('syncops_user');
    setActivePage('dashboard');
    setIsSidebarOpen(false);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Menyiapkan Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const currentDiv = activeDivision || user.divisions[0];

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard user={user} activeDivision={currentDiv} />;
      case 'activities':
        return <TaskTracker activeDivision={currentDiv} />;
      case 'meetings':
        return <MeetingMinutes activeDivision={currentDiv} />;
      case 'approvals':
        return <ApprovalSystem activeDivision={currentDiv} />;
      case 'division_module':
        return <DivisionModules activeDivision={currentDiv} />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard user={user} activeDivision={currentDiv} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with Mobile State */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-[60] w-64`}>
        <Sidebar 
          activePage={activePage} 
          setActivePage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }} 
          activeDivision={currentDiv}
          setActiveDivision={(div) => setActiveDivision(div)}
          user={user}
          onLogout={handleLogout}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Mobile Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 md:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-sm">SO</div>
              <h1 className="font-black text-slate-900 text-base uppercase tracking-tight">SyncOps</h1>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold border border-white shadow-sm overflow-hidden">
             {user.name.charAt(0)}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto pb-10">
            {renderContent()}
          </div>
          
          <footer className="mt-auto py-6 border-t border-slate-200 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} SyncOps - Operational Management System</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;

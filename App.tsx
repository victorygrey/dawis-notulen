
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeDivision, setActiveDivision] = useState<DivisionType | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        activeDivision={currentDiv}
        setActiveDivision={(div) => setActiveDivision(div)}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
        
        <footer className="mt-12 py-6 border-t border-slate-200 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} SyncOps - Operational Management System</p>
        </footer>
      </main>
    </div>
  );
};

export default App;

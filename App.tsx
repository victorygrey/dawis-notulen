
import React, { useState, useEffect } from 'react';
import { DivisionType, Role, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskTracker from './components/TaskTracker';
import MeetingMinutes from './components/MeetingMinutes';
import ApprovalSystem from './components/ApprovalSystem';
import DivisionModules from './components/DivisionModules';
import Login from './components/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeDivision, setActiveDivision] = useState<DivisionType | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Persistence check on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('syncops_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setActiveDivision(parsedUser.divisions[0]);
      } catch (e) {
        localStorage.removeItem('syncops_user');
      }
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setActiveDivision(userData.divisions[0]);
    localStorage.setItem('syncops_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveDivision(null);
    localStorage.removeItem('syncops_user');
    setActivePage('dashboard');
  };

  const renderContent = () => {
    if (!user || !activeDivision) return null;

    switch (activePage) {
      case 'dashboard':
        return <Dashboard user={user} activeDivision={activeDivision} />;
      case 'activities':
        return <TaskTracker activeDivision={activeDivision} />;
      case 'meetings':
        return <MeetingMinutes activeDivision={activeDivision} />;
      case 'approvals':
        return <ApprovalSystem activeDivision={activeDivision} />;
      case 'division_module':
        return <DivisionModules activeDivision={activeDivision} />;
      default:
        return <Dashboard user={user} activeDivision={activeDivision} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        activeDivision={activeDivision!}
        setActiveDivision={(div) => setActiveDivision(div)}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
        
        <footer className="mt-12 py-6 border-t border-slate-200 text-center text-slate-400 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} SyncOps - Advanced Operational Management System.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;

import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  Users,
  Briefcase,
  PlaneTakeoff,
  Wallet,
  Package,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { DivisionType, Role, User } from './types';

export const DIVISIONS = [
  { id: DivisionType.HRD, name: 'Human Resource', icon: <Users size={20} /> },
  { id: DivisionType.PDP, name: 'PDP (Docs & Certs)', icon: <ShieldCheck size={20} /> },
  { id: DivisionType.OPRS, name: 'Operasional', icon: <PlaneTakeoff size={20} /> },
  { id: DivisionType.KEUANGAN, name: 'Keuangan', icon: <Wallet size={20} /> },
  { id: DivisionType.LOGISTIK, name: 'Logistik - PU', icon: <Package size={20} /> },
  { id: DivisionType.IT, name: 'Information Tech', icon: <Cpu size={20} /> }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Ahmad Faisal',
  role: Role.MANAGER,
  divisions: [DivisionType.HRD, DivisionType.OPRS, DivisionType.KEUANGAN]
};

export const MOCK_ACCOUNTS = [
  {
    email: 'admin@syncops.com',
    password: 'password',
    user: {
      id: 'u1',
      name: 'Ahmad Faisal (Manager)',
      role: Role.MANAGER,
      divisions: [DivisionType.HRD, DivisionType.OPRS, DivisionType.KEUANGAN, DivisionType.LOGISTIK]
    }
  },
  {
    email: 'staff@syncops.com',
    password: 'password',
    user: {
      id: 'u2',
      name: 'Budi Santoso',
      role: Role.STAFF,
      divisions: [DivisionType.OPRS]
    }
  },
  {
    email: 'direktur@syncops.com',
    password: 'password',
    user: {
      id: 'u3',
      name: 'Hj. Siti Aminah',
      role: Role.DIRECTOR,
      divisions: [
        DivisionType.HRD,
        DivisionType.PDP,
        DivisionType.OPRS,
        DivisionType.KEUANGAN,
        DivisionType.LOGISTIK,
        DivisionType.IT
      ]
    }
  }
];

export const MENU_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'activities', name: 'Daily Tracker', icon: <CalendarCheck size={20} /> },
  { id: 'meetings', name: 'Meeting Minutes', icon: <FileText size={20} /> },
  { id: 'approvals', name: 'Approvals', icon: <CheckSquare size={20} /> },
  { id: 'kpi', name: 'KPI Analytics', icon: <TrendingUp size={20} /> },
  { id: 'division_module', name: 'Divisi Module', icon: <Briefcase size={20} /> }
];
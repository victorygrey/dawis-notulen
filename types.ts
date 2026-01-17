
export enum Role {
  STAFF = 'STAFF',
  PIC = 'PIC',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR',
  SUBADMIN = 'SUBADMIN'
}

export enum DivisionType {
  HRD = 'HRD',
  PDP = 'PDP',
  OPRS = 'OPERASIONAL',
  KEUANGAN = 'KEUANGAN',
  LOGISTIK = 'LOGISTIK-PU',
  IT = 'IT',
  MARKETING = 'MARKETING',
  DIGITAL_MARKETING = 'DIGITAL MARKETING',
  PRODUKSI = 'PRODUKSI',
  MANAJEMEN = 'MANAJEMEN'
}

export interface User {
  id: string;
  nik?: string;
  name: string;
  role: Role;
  divisions: DivisionType[];
  email?: string;
}

export enum TaskStatus {
  BELUM = 'BELUM DIMULAI',
  PROSES = 'PROGRESS',
  SELESAI = 'SELESAI',
  PENDING = 'PENDING'
}

export interface DailyActivity {
  id: string;
  userId: string;
  userName?: string;
  divisionId: DivisionType;
  date: string; 
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  taskName: string;
  isRoutine: boolean;
  progress: number;
  status: TaskStatus;
  evidenceIds: string[];
  externalLink?: string;
  approvalStatus?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION';
}

export interface MeetingMinute {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
  openingVerse: string;
  purpose: string;
  minutes: string;
  status: 'Proses' | 'Selesai';
  issues: string;
  type: 'Briefing' | 'Evaluasi' | 'Rapat Kerja' | 'Harian';
  division: DivisionType;
}

export interface KPI {
  id: string;
  division: DivisionType;
  picId: string;
  title: string;
  target: number;
  realization: number;
  period: 'WEEKLY' | 'MONTHLY';
}

export interface Approval {
  id: string;
  activityId: string;
  title: string;
  requesterId: string;
  requesterName: string;
  requesterRole: Role;
  division: DivisionType;
  status: 'PENDING' | 'REJECTED' | 'APPROVED' | 'REVISION';
  dateSubmitted: string;
  history: {
    step: number;
    approverName: string;
    action: string;
    note: string;
    date: string;
  }[];
}

export interface Evidence {
  id: string;
  name: string;
  type: 'IMAGE' | 'PDF' | 'EXCEL' | 'DOC' | 'LINK';
  url: string;
  uploadedAt: string;
}

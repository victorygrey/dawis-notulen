
export enum Role {
  STAFF = 'STAFF',
  PIC = 'PIC',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR'
}

export enum DivisionType {
  HRD = 'HRD',
  PDP = 'PDP',
  OPRS = 'OPERASIONAL',
  KEUANGAN = 'KEUANGAN',
  LOGISTIK = 'LOGISTIK-PU',
  IT = 'IT'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  divisions: DivisionType[];
}

export enum TaskStatus {
  BELUM = 'BELUM',
  PROSES = 'PROSES',
  SELESAI = 'SELESAI',
  ON_PROGRESS = 'ON PROGRESS'
}

export interface DailyActivity {
  id: string;
  userId: string;
  divisionId: DivisionType;
  date: string;
  startTime: string;
  endTime: string;
  taskName: string;
  isRoutine: boolean;
  progress: number;
  status: TaskStatus;
  evidenceIds: string[];
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
  title: string;
  requesterId: string;
  division: DivisionType;
  status: 'PENDING' | 'REJECTED' | 'APPROVED' | 'REVISION';
  currentStep: number;
  totalSteps: number;
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
  type: 'IMAGE' | 'PDF' | 'EXCEL' | 'DRIVE' | 'ARCHIVE';
  url: string;
  uploadedAt: string;
}

export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  employeeId: string; // e.g. PE-1042
  branch: string;
  title: string;
  email?: string;
  phone?: string;
  createdAt: string;
  active: boolean;
}

export interface WorkLog {
  id: string;
  employeeId: string; // PE-XXXX
  employeeName: string;
  employeeUsername: string;
  branch: string;
  projectName: string;
  date: string; // YYYY-MM-DD (Locked to today's date)
  timestamp: string; // ISO string
  submittedAtFormatted: string; // e.g. 04:22 PM
  // Work specification values:
  spliceCount: number; // in numbers
  overlashFt: number; // in feet (e.g. 150 FT)
  overpullFt: number; // in feet
  trenchBoreFt: number; // in feet (e.g. 150 FT)
  details: string; // Details of work
  photoUrl: string; // Compulsory site picture of work
  photoName?: string;
  isPageSetOnly?: boolean; // True when employee created only a page set with 0 splice/footage output
  pageSetCount?: number; // Number of page set sheets created
  status: 'submitted' | 'verified';
}

export interface BranchInfo {
  id: string;
  name: string;
  code: string;
  location: string;
}

export interface EmployeeProductivitySummary {
  employeeId: string;
  employeeName: string;
  branch: string;
  title: string;
  totalJobs: number;
  totalSplice: number;
  totalOverlashFt: number;
  totalOverpullFt: number;
  totalTrenchBoreFt: number;
  lastActiveDate: string;
  daysLoggedCount: number;
}

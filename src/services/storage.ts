import { User, WorkLog, BranchInfo, EmployeeProductivitySummary } from '../types';

const USERS_STORAGE_KEY = 'planneng_users_v1';
const WORK_LOGS_STORAGE_KEY = 'planneng_work_logs_v1';
const CURRENT_USER_KEY = 'planneng_current_user_v1';
const BRANCHES_STORAGE_KEY = 'planneng_branches_v1';

export const DEFAULT_BRANCHES: BranchInfo[] = [
  { id: 'b-karachi', name: 'Karachi', code: 'KHI', location: 'Karachi, Sindh' },
  { id: 'b-islamabad', name: 'Islamabad', code: 'ISB', location: 'Islamabad Capital Territory' },
];

export const INITIAL_ADMIN: User = {
  id: 'admin-1',
  username: 'shamir1234',
  password: '1234shamir@',
  name: 'Shamir',
  role: 'admin',
  employeeId: 'ADM-001',
  branch: 'Karachi',
  title: 'Operations Director & Chief Engineer',
  email: 'shamir@planneng.com',
  phone: '+92 300 1234567',
  createdAt: '2026-01-10T08:00:00Z',
  active: true,
};

export const INITIAL_EMPLOYEES: User[] = [
  {
    id: 'emp-1',
    username: 'john.doe',
    password: 'password123',
    name: 'John Doe',
    role: 'employee',
    employeeId: 'PE-1042',
    branch: 'Karachi',
    title: 'Lead Fiber Splicer',
    email: 'j.doe@planneng.com',
    phone: '+92 321 9124411',
    createdAt: '2026-02-15T08:00:00Z',
    active: true,
  },
  {
    id: 'emp-2',
    username: 'sarah.m',
    password: 'password123',
    name: 'Sarah Miller',
    role: 'employee',
    employeeId: 'PE-1088',
    branch: 'Karachi',
    title: 'OSP Aerial Construction Tech',
    email: 's.miller@planneng.com',
    phone: '+92 333 8312994',
    createdAt: '2026-03-01T08:00:00Z',
    active: true,
  },
  {
    id: 'emp-3',
    username: 'david.k',
    password: 'password123',
    name: 'David Kim',
    role: 'employee',
    employeeId: 'PE-1105',
    branch: 'Islamabad',
    title: 'Underground Trench & Bore Specialist',
    email: 'd.kim@planneng.com',
    phone: '+92 345 7441233',
    createdAt: '2026-04-12T08:00:00Z',
    active: true,
  },
  {
    id: 'emp-4',
    username: 'marcus.v',
    password: 'password123',
    name: 'Marcus Vance',
    role: 'employee',
    employeeId: 'PE-1120',
    branch: 'Islamabad',
    title: 'Lineman & Cable Pull Technician',
    email: 'm.vance@planneng.com',
    phone: '+92 300 6098822',
    createdAt: '2026-05-20T08:00:00Z',
    active: true,
  },
];

// Helper to get formatted local date string YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate dates for the past week
function getPastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateInitialLogs(): WorkLog[] {
  return [
    {
      id: 'log-101',
      employeeId: 'PE-1042',
      employeeName: 'John Doe',
      employeeUsername: 'john.doe',
      branch: 'Karachi',
      projectName: 'Clifton - I.I. Chundrigar Metro Fiber Backbone',
      date: getPastDate(5),
      timestamp: `${getPastDate(5)}T16:30:00.000Z`,
      submittedAtFormatted: '04:30 PM',
      spliceCount: 48,
      overlashFt: 250,
      overpullFt: 180,
      trenchBoreFt: 0,
      details: 'Completed 48-count fusion splicing at Node cabinet 14B. Completed overlash on secondary line along Clifton road span. Tested with OTDR, all ports within 0.05dB loss margin.',
      photoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      photoName: 'node_14b_splice_enclosure.jpg',
      status: 'verified',
    },
    {
      id: 'log-102',
      employeeId: 'PE-1042',
      employeeName: 'John Doe',
      employeeUsername: 'john.doe',
      branch: 'Karachi',
      projectName: 'Korangi Industrial Area FTTH Deployment',
      date: getPastDate(3),
      timestamp: `${getPastDate(3)}T17:15:00.000Z`,
      submittedAtFormatted: '05:15 PM',
      spliceCount: 72,
      overlashFt: 120,
      overpullFt: 150,
      trenchBoreFt: 0,
      details: '72 loose-tube ribbon fibers spliced at main distribution splice enclosure (MDU #3). Cleaned and scoped all SC/APC terminations.',
      photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      photoName: 'mdu3_ribbon_tray_verification.jpg',
      status: 'verified',
    },
    {
      id: 'log-103',
      employeeId: 'PE-1042',
      employeeName: 'John Doe',
      employeeUsername: 'john.doe',
      branch: 'Karachi',
      projectName: 'Port Qasim Redundant Loop',
      date: getPastDate(1),
      timestamp: `${getPastDate(1)}T15:45:00.000Z`,
      submittedAtFormatted: '03:45 PM',
      spliceCount: 36,
      overlashFt: 300,
      overpullFt: 220,
      trenchBoreFt: 40,
      details: 'Completed tie-in splice at vault #8. Overlash of 288-ct armored dielectric fiber across rail crossing span. Microtrenching tie-in completed.',
      photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      photoName: 'vault8_armored_cable_tiein.jpg',
      status: 'verified',
    },
    {
      id: 'log-104',
      employeeId: 'PE-1088',
      employeeName: 'Sarah Miller',
      employeeUsername: 'sarah.m',
      branch: 'Karachi',
      projectName: 'Shahrah-e-Faisal High-Speed Fiber Ring Upgrade',
      date: getPastDate(4),
      timestamp: `${getPastDate(4)}T16:50:00.000Z`,
      submittedAtFormatted: '04:50 PM',
      spliceCount: 16,
      overlashFt: 550,
      overpullFt: 400,
      trenchBoreFt: 0,
      details: 'Aerial crew overlash on existing messenger wire along Shahrah-e-Faisal corridor. Pulled 400 FT 144F trunk cable through corner pole riser.',
      photoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      photoName: 'shahrah_aerial_overlash.jpg',
      status: 'verified',
    },
    {
      id: 'log-105',
      employeeId: 'PE-1088',
      employeeName: 'Sarah Miller',
      employeeUsername: 'sarah.m',
      branch: 'Karachi',
      projectName: 'Saddar Business District Optical Link',
      date: getPastDate(2),
      timestamp: `${getPastDate(2)}T17:00:00.000Z`,
      submittedAtFormatted: '05:00 PM',
      spliceCount: 24,
      overlashFt: 420,
      overpullFt: 350,
      trenchBoreFt: 75,
      details: 'Overlashed 420 FT heavy duty fiber. Trench tie-in into demarcation box. 24 strand terminations certified on Fluke Versiv tester.',
      photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      photoName: 'demarc_box_terminations.jpg',
      status: 'verified',
    },
    {
      id: 'log-106',
      employeeId: 'PE-1105',
      employeeName: 'David Kim',
      employeeUsername: 'david.k',
      branch: 'Islamabad',
      projectName: 'Islamabad Blue Area Smart Highway Conduit',
      date: getPastDate(5),
      timestamp: `${getPastDate(5)}T17:30:00.000Z`,
      submittedAtFormatted: '05:30 PM',
      spliceCount: 0,
      overlashFt: 0,
      overpullFt: 150,
      trenchBoreFt: 320,
      details: 'Directional bore 320 FT of 2-inch SDR 11 HDPE conduit under Jinnah Ave ramp. Soil conditions: clay with gravel. Placed tracer wire and pulled initial pilot cable.',
      photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      photoName: 'directional_bore_jinnah_ave.jpg',
      status: 'verified',
    },
    {
      id: 'log-107',
      employeeId: 'PE-1105',
      employeeName: 'David Kim',
      employeeUsername: 'david.k',
      branch: 'Islamabad',
      projectName: 'Islamabad Blue Area Smart Highway Conduit',
      date: getPastDate(3),
      timestamp: `${getPastDate(3)}T16:40:00.000Z`,
      submittedAtFormatted: '04:40 PM',
      spliceCount: 12,
      overlashFt: 0,
      overpullFt: 300,
      trenchBoreFt: 280,
      details: 'Open cut trenching 180 FT and horizontal bore 100 FT around utility crossing. Backfilled with select sand bed and compacted to 95% standard proctor.',
      photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      photoName: 'opencut_trench_sand_bed.jpg',
      status: 'verified',
    },
    {
      id: 'log-108',
      employeeId: 'PE-1120',
      employeeName: 'Marcus Vance',
      employeeUsername: 'marcus.v',
      branch: 'Islamabad',
      projectName: 'F-7 / G-8 Small Cell Optical Feeder Loop',
      date: getPastDate(4),
      timestamp: `${getPastDate(4)}T16:15:00.000Z`,
      submittedAtFormatted: '04:15 PM',
      spliceCount: 32,
      overlashFt: 380,
      overpullFt: 520,
      trenchBoreFt: 0,
      details: 'Lineman crew pulled 520 FT high-tensile dielectric cable across 4 utility spans in Sector F-7. Overlashed to strand with stainless steel lashing wire.',
      photoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      photoName: 'sector_f7_span_lashing.jpg',
      status: 'verified',
    },
    {
      id: 'log-109',
      employeeId: 'PE-1120',
      employeeName: 'Marcus Vance',
      employeeUsername: 'marcus.v',
      branch: 'Islamabad',
      projectName: 'Islamabad Substation SCADA Optical Circuit',
      date: getPastDate(2),
      timestamp: `${getPastDate(2)}T17:05:00.000Z`,
      submittedAtFormatted: '05:05 PM',
      spliceCount: 28,
      overlashFt: 210,
      overpullFt: 340,
      trenchBoreFt: 60,
      details: 'Substation boundary line. Installed caution tags. Completed 28 core optical splices into patch panel.',
      photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      photoName: 'substation_patch_panel_splices.jpg',
      status: 'verified',
    },
  ];
}

class StorageService {
  private users: User[] = [];
  private logs: WorkLog[] = [];
  private branches: BranchInfo[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      // Load users
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        // Ensure admin user exists with requested credentials
        const adminIndex = this.users.findIndex(u => u.username === INITIAL_ADMIN.username);
        if (adminIndex === -1) {
          this.users.unshift(INITIAL_ADMIN);
          this.saveUsers();
        } else {
          // Always ensure password matches user's request
          this.users[adminIndex].password = INITIAL_ADMIN.password;
          this.users[adminIndex].role = 'admin';
          this.saveUsers();
        }
      } else {
        this.users = [INITIAL_ADMIN, ...INITIAL_EMPLOYEES];
        this.saveUsers();
      }

      // Load branches
      const storedBranches = localStorage.getItem(BRANCHES_STORAGE_KEY);
      if (storedBranches) {
        try {
          const parsed: BranchInfo[] = JSON.parse(storedBranches);
          const hasOldBranches = parsed.some(b => 
            ['North Division', 'East District', 'Central Hub', 'South Metro', 'West Coast Operations', 'Corporate HQ'].includes(b.name)
          );
          if (hasOldBranches || parsed.length === 0 || !parsed.some(b => b.name === 'Karachi')) {
            this.branches = [...DEFAULT_BRANCHES];
            this.saveBranches();
          } else {
            this.branches = parsed;
          }
        } catch {
          this.branches = [...DEFAULT_BRANCHES];
          this.saveBranches();
        }
      } else {
        this.branches = [...DEFAULT_BRANCHES];
        this.saveBranches();
      }

      // Migrate existing stored users if they have obsolete branch names
      let usersChanged = false;
      this.users.forEach(u => {
        const branchMatch = this.branches.some(b => b.name.toLowerCase() === (u.branch || '').toLowerCase());
        if (!branchMatch) {
          if (['North Division', 'East District', 'Corporate HQ'].includes(u.branch || '')) {
            u.branch = 'Karachi';
          } else {
            u.branch = 'Islamabad';
          }
          usersChanged = true;
        }
      });
      if (usersChanged) {
        this.saveUsers();
      }

      // Load logs
      const storedLogs = localStorage.getItem(WORK_LOGS_STORAGE_KEY);
      if (storedLogs) {
        try {
          const parsedLogs: WorkLog[] = JSON.parse(storedLogs);
          let logsChanged = false;
          parsedLogs.forEach(l => {
            const branchMatch = this.branches.some(b => b.name.toLowerCase() === (l.branch || '').toLowerCase());
            if (!branchMatch) {
              if (['North Division', 'East District'].includes(l.branch || '')) {
                l.branch = 'Karachi';
              } else {
                l.branch = 'Islamabad';
              }
              logsChanged = true;
            }
          });
          this.logs = parsedLogs;
          if (logsChanged) {
            this.saveLogs();
          }
        } catch {
          this.logs = generateInitialLogs();
          this.saveLogs();
        }
      } else {
        this.logs = generateInitialLogs();
        this.saveLogs();
      }

      // Load current user
      const storedCurrentUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedCurrentUser) {
        this.currentUser = JSON.parse(storedCurrentUser);
      }
    } catch (e) {
      console.error('Failed to initialize local storage data:', e);
      this.users = [INITIAL_ADMIN, ...INITIAL_EMPLOYEES];
      this.branches = [...DEFAULT_BRANCHES];
      this.logs = generateInitialLogs();
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Error saving users to localStorage', e);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(WORK_LOGS_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.error('Error saving logs to localStorage', e);
    }
  }

  private saveBranches() {
    try {
      localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(this.branches));
    } catch (e) {
      console.error('Error saving branches to localStorage', e);
    }
  }

  // Authentication
  public login(username: string, password: string): { success: boolean; user?: User; error?: string } {
    const cleanUser = username.trim().toLowerCase();
    const found = this.users.find(u => u.username.toLowerCase() === cleanUser && u.password === password);
    
    if (!found) {
      return { success: false, error: 'Invalid username or password. Please verify credentials.' };
    }
    if (!found.active) {
      return { success: false, error: 'This account has been deactivated. Please contact your administrator.' };
    }

    this.currentUser = found;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    return { success: true, user: found };
  }

  public logout() {
    this.currentUser = null;
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public getEmployees(): User[] {
    return this.users.filter(u => u.role === 'employee');
  }

  public getAdmins(): User[] {
    return this.users.filter(u => u.role === 'admin');
  }

  public getBranches(): BranchInfo[] {
    return [...this.branches];
  }

  public addBranch(
    branchDataOrName: { name: string; code?: string; location?: string } | string,
    locationArg?: string
  ): { success: boolean; branch?: BranchInfo; error?: string } {
    let name = '';
    let customCode = '';
    let location = '';

    if (typeof branchDataOrName === 'string') {
      name = branchDataOrName.trim();
      location = (locationArg || '').trim();
    } else {
      name = branchDataOrName.name.trim();
      customCode = (branchDataOrName.code || '').trim().toUpperCase();
      location = (branchDataOrName.location || '').trim();
    }

    if (!name) {
      return { success: false, error: 'Branch name is required.' };
    }

    // Check duplicate
    if (this.branches.some(b => b.name.toLowerCase() === name.toLowerCase())) {
      return { success: false, error: `Branch "${name}" already exists.` };
    }

    const code = customCode || name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4) || 'BR';
    const newBranch: BranchInfo = {
      id: `branch-${Date.now()}`,
      name,
      code,
      location: location || `${name}, Regional Office`,
    };

    this.branches.push(newBranch);
    this.saveBranches();
    return { success: true, branch: newBranch };
  }

  public deleteBranch(branchIdOrName: string): { success: boolean; error?: string } {
    if (this.branches.length <= 1) {
      return { success: false, error: 'At least one branch must remain in the system.' };
    }

    const branchIndex = this.branches.findIndex(
      b => b.id === branchIdOrName || b.name.toLowerCase() === branchIdOrName.toLowerCase()
    );

    if (branchIndex === -1) {
      return { success: false, error: 'Branch not found.' };
    }

    const branchName = this.branches[branchIndex].name;

    // Check if any employees are assigned to this branch
    const employeesInBranch = this.users.filter(
      u => u.branch.toLowerCase() === branchName.toLowerCase()
    );
    if (employeesInBranch.length > 0) {
      return {
        success: false,
        error: `Cannot delete "${branchName}" branch because ${employeesInBranch.length} employee(s) are currently assigned to it. Please reassign them first.`,
      };
    }

    this.branches.splice(branchIndex, 1);
    this.saveBranches();
    return { success: true };
  }

  // Employee creation by Admin
  public createEmployee(data: {
    name: string;
    employeeId: string;
    branch: string;
    username: string;
    password: string;
    title: string;
    email?: string;
    phone?: string;
  }): { success: boolean; user?: User; error?: string } {
    const usernameClean = data.username.trim().toLowerCase();
    
    // Check for duplicate username
    if (this.users.some(u => u.username.toLowerCase() === usernameClean)) {
      return { success: false, error: `Username "${data.username}" is already taken.` };
    }

    // Check for duplicate employee ID
    const empIdClean = data.employeeId.trim().toUpperCase();
    if (this.users.some(u => u.employeeId.toUpperCase() === empIdClean)) {
      return { success: false, error: `Employee ID "${data.employeeId}" already exists.` };
    }

    const newUser: User = {
      id: `emp-${Date.now()}`,
      username: data.username.trim(),
      password: data.password,
      name: data.name.trim(),
      role: 'employee',
      employeeId: empIdClean,
      branch: data.branch,
      title: data.title.trim() || 'Field Technician',
      email: data.email?.trim() || `${usernameClean}@planneng.com`,
      phone: data.phone?.trim() || '',
      createdAt: new Date().toISOString(),
      active: true,
    };

    this.users.push(newUser);
    this.saveUsers();
    return { success: true, user: newUser };
  }

  public updateEmployeeStatus(employeeId: string, active: boolean) {
    const emp = this.users.find(u => u.employeeId === employeeId);
    if (emp && emp.role === 'employee') {
      emp.active = active;
      this.saveUsers();
    }
  }

  // Administrator creation by existing Admin
  public createAdmin(data: {
    name: string;
    adminId: string;
    branch?: string;
    username: string;
    password: string;
    title?: string;
    email?: string;
    phone?: string;
  }): { success: boolean; user?: User; error?: string } {
    const usernameClean = data.username.trim().toLowerCase();
    
    // Check for duplicate username
    if (this.users.some(u => u.username.toLowerCase() === usernameClean)) {
      return { success: false, error: `Username "${data.username}" is already taken.` };
    }

    // Check for duplicate admin ID or employee ID
    const adminIdClean = data.adminId.trim().toUpperCase();
    if (this.users.some(u => u.employeeId.toUpperCase() === adminIdClean)) {
      return { success: false, error: `Admin ID "${data.adminId}" already exists.` };
    }

    const newAdmin: User = {
      id: `admin-${Date.now()}`,
      username: data.username.trim(),
      password: data.password,
      name: data.name.trim(),
      role: 'admin',
      employeeId: adminIdClean,
      branch: data.branch || 'Corporate HQ',
      title: data.title?.trim() || 'Operations Administrator',
      email: data.email?.trim() || `${usernameClean}@planneng.com`,
      phone: data.phone?.trim() || '',
      createdAt: new Date().toISOString(),
      active: true,
    };

    this.users.push(newAdmin);
    this.saveUsers();
    return { success: true, user: newAdmin };
  }

  public updateAdminStatus(adminId: string, active: boolean): { success: boolean; error?: string } {
    const admin = this.users.find(u => u.employeeId === adminId && u.role === 'admin');
    if (!admin) {
      return { success: false, error: 'Admin account not found.' };
    }

    // Protect primary admin from deactivation
    if (admin.username === 'shamir1234' && !active) {
      return { success: false, error: 'The primary system administrator (shamir1234) cannot be deactivated.' };
    }

    // Ensure at least one admin remains active
    const activeAdmins = this.users.filter(u => u.role === 'admin' && u.active);
    if (!active && activeAdmins.length <= 1 && activeAdmins[0].id === admin.id) {
      return { success: false, error: 'At least one active administrator must remain in the system.' };
    }

    admin.active = active;
    this.saveUsers();
    return { success: true };
  }

  public deleteAdmin(adminId: string): { success: boolean; error?: string } {
    const adminIndex = this.users.findIndex(u => u.employeeId === adminId && u.role === 'admin');
    if (adminIndex === -1) {
      return { success: false, error: 'Admin not found.' };
    }
    const admin = this.users[adminIndex];
    if (admin.username === 'shamir1234') {
      return { success: false, error: 'Primary administrator (shamir1234) cannot be deleted.' };
    }
    this.users.splice(adminIndex, 1);
    this.saveUsers();
    return { success: true };
  }

  // Work Logs
  public getAllLogs(): WorkLog[] {
    return [...this.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getLogsForEmployee(employeeId: string): WorkLog[] {
    return this.logs
      .filter(l => l.employeeId.toUpperCase() === employeeId.toUpperCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Personal history for the week for employee (only view, cannot be edited)
  public getWeeklyLogsForEmployee(employeeId: string): WorkLog[] {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    return this.logs
      .filter(l => {
        const matchesEmp = l.employeeId.toUpperCase() === employeeId.toUpperCase();
        const logDate = new Date(l.date + 'T23:59:59');
        return matchesEmp && logDate >= oneWeekAgo;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Check if employee has already submitted work for today
  public getTodayLogForEmployee(employeeId: string): WorkLog | undefined {
    const todayStr = getTodayDateString();
    return this.logs.find(
      l => l.employeeId.toUpperCase() === employeeId.toUpperCase() && l.date === todayStr
    );
  }

  // Submit daily work - strictly enforces today's date and non-backdating
  public submitDailyWork(data: {
    employeeId: string;
    employeeName: string;
    employeeUsername: string;
    branch: string;
    projectName: string;
    spliceCount: number;
    overlashFt: number;
    overpullFt: number;
    trenchBoreFt: number;
    details?: string;
    photoUrl: string;
    photoName?: string;
    isPageSetOnly?: boolean;
    pageSetCount?: number;
  }): { success: boolean; log?: WorkLog; error?: string } {
    const todayStr = getTodayDateString();
    const now = new Date();

    if (!data.photoUrl || !data.photoUrl.trim()) {
      return { 
        success: false, 
        error: data.isPageSetOnly 
          ? 'Page Set image is compulsory! Please take a photo or upload an image of the page set drawing.' 
          : 'A picture of work is compulsory. Please take a photo or upload an image of today\'s work.' 
      };
    }

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const submittedAtFormatted = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const isPageSet = !!data.isPageSetOnly;

    const newLog: WorkLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      employeeUsername: data.employeeUsername,
      branch: data.branch,
      projectName: data.projectName.trim(),
      date: todayStr, // STRICTLY LOCKED TO TODAY
      timestamp: now.toISOString(),
      submittedAtFormatted,
      spliceCount: Math.max(0, Number(data.spliceCount) || 0),
      overlashFt: Math.max(0, Number(data.overlashFt) || 0),
      overpullFt: Math.max(0, Number(data.overpullFt) || 0),
      trenchBoreFt: Math.max(0, Number(data.trenchBoreFt) || 0),
      details: (data.details || '').trim(),
      photoUrl: data.photoUrl.trim(),
      photoName: data.photoName || (isPageSet ? 'page_set_drawing.jpg' : 'site_work_photo.jpg'),
      isPageSetOnly: isPageSet,
      pageSetCount: data.pageSetCount || (isPageSet ? 1 : 0),
      status: 'submitted',
    };

    this.logs.unshift(newLog);
    this.saveLogs();

    return { success: true, log: newLog };
  }

  // Admin Productivity Analytics across all logged jobs
  public getProductivitySummaries(): EmployeeProductivitySummary[] {
    const employees = this.getEmployees();
    return employees.map(emp => {
      const empLogs = this.logs.filter(l => l.employeeId.toUpperCase() === emp.employeeId.toUpperCase());
      
      const uniqueDates = new Set(empLogs.map(l => l.date));
      const totalSplice = empLogs.reduce((sum, l) => sum + (l.spliceCount || 0), 0);
      const totalOverlashFt = empLogs.reduce((sum, l) => sum + (l.overlashFt || 0), 0);
      const totalOverpullFt = empLogs.reduce((sum, l) => sum + (l.overpullFt || 0), 0);
      const totalTrenchBoreFt = empLogs.reduce((sum, l) => sum + (l.trenchBoreFt || 0), 0);

      const latestLog = empLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      return {
        employeeId: emp.employeeId,
        employeeName: emp.name,
        branch: emp.branch,
        title: emp.title,
        totalJobs: empLogs.length,
        totalSplice,
        totalOverlashFt,
        totalOverpullFt,
        totalTrenchBoreFt,
        lastActiveDate: latestLog ? latestLog.date : 'No logs yet',
        daysLoggedCount: uniqueDates.size,
      };
    }).sort((a, b) => b.totalJobs - a.totalJobs);
  }

  // Export logs to CSV
  public exportLogsToCSV(filteredLogs?: WorkLog[]): string {
    const logsToExport = filteredLogs || this.logs;
    const headers = [
      'Log ID',
      'Date',
      'Submitted At',
      'Employee ID',
      'Employee Name',
      'Branch',
      'Project Name',
      'Splice Count',
      'Overlash (FT)',
      'Overpull (FT)',
      'Trench & Bore (FT)',
      'Total Footage (FT)',
      'Details of Work',
    ];

    const rows = logsToExport.map(l => [
      `"${l.id}"`,
      `"${l.date}"`,
      `"${l.submittedAtFormatted}"`,
      `"${l.employeeId}"`,
      `"${l.employeeName.replace(/"/g, '""')}"`,
      `"${l.branch.replace(/"/g, '""')}"`,
      `"${l.projectName.replace(/"/g, '""')}"`,
      l.spliceCount,
      l.overlashFt,
      l.overpullFt,
      l.trenchBoreFt,
      l.overlashFt + l.overpullFt + l.trenchBoreFt,
      `"${(l.details || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // Reset to default sample state if needed
  public resetToFactory() {
    this.users = [INITIAL_ADMIN, ...INITIAL_EMPLOYEES];
    this.branches = [...DEFAULT_BRANCHES];
    this.logs = generateInitialLogs();
    this.currentUser = null;
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(BRANCHES_STORAGE_KEY);
    localStorage.removeItem(WORK_LOGS_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    this.init();
  }
}

export const storageService = new StorageService();

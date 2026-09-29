import React, { useState, useEffect } from 'react';
import { User, WorkLog, BranchInfo } from './types';
import { storageService } from './services/storage';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { DailyWorkForm } from './components/employee/DailyWorkForm';
import { WeeklyHistoryView } from './components/employee/WeeklyHistoryView';
import { ProductivityDashboard } from './components/admin/ProductivityDashboard';
import { EmployeeRecordLookup } from './components/admin/EmployeeRecordLookup';
import { EmployeeManagement } from './components/admin/EmployeeManagement';
import { AdminManagement } from './components/admin/AdminManagement';
import { AllLogsView } from './components/admin/AllLogsView';
import { PlannEngLogo } from './components/PlannEngLogo';
import { ShieldCheck, CheckCircle2, Lock, Radio } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);

  // Navigation tab states
  const [activeAdminTab, setActiveAdminTab] = useState<'productivity' | 'lookup' | 'logs' | 'employees' | 'admins'>('productivity');
  const [activeEmployeeTab, setActiveEmployeeTab] = useState<'submit' | 'history'>('submit');

  // Load initial data from storage
  useEffect(() => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    refreshData();
  }, []);

  const refreshData = () => {
    setLogs(storageService.getAllLogs());
    setBranches(storageService.getBranches());
    setEmployees(storageService.getEmployees());
    setAdmins(storageService.getAdmins());
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    refreshData();
    if (user.role === 'admin') {
      setActiveAdminTab('productivity');
    } else {
      setActiveEmployeeTab('submit');
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
  };

  const handleLogSubmitted = (newLog: WorkLog) => {
    refreshData();
  };

  const handleEmployeeCreated = (newEmp: User) => {
    refreshData();
  };

  const handleAdminCreated = (newAdmin: User) => {
    refreshData();
  };

  // Find today's submission for current employee if applicable
  const todayLog = currentUser && currentUser.role === 'employee'
    ? storageService.getTodayLogForEmployee(currentUser.employeeId)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        activeAdminTab={activeAdminTab}
        setActiveAdminTab={setActiveAdminTab}
        activeEmployeeTab={activeEmployeeTab}
        setActiveEmployeeTab={setActiveEmployeeTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!currentUser ? (
          <LoginModal onLoginSuccess={handleLoginSuccess} />
        ) : currentUser.role === 'admin' ? (
          <div>
            {activeAdminTab === 'productivity' && (
              <ProductivityDashboard
                logs={logs}
                employees={employees}
                branches={branches}
                onOpenEmployeeManagement={() => setActiveAdminTab('employees')}
                onOpenEmployeeLookup={(empId) => setActiveAdminTab('lookup')}
              />
            )}

            {activeAdminTab === 'lookup' && (
              <EmployeeRecordLookup
                employees={employees}
                logs={logs}
                branches={branches}
              />
            )}

            {activeAdminTab === 'logs' && (
              <AllLogsView
                logs={logs}
                branches={branches}
                employees={employees}
              />
            )}

            {activeAdminTab === 'employees' && (
              <EmployeeManagement
                employees={employees}
                branches={branches}
                onEmployeeCreated={handleEmployeeCreated}
                onRefreshEmployees={refreshData}
              />
            )}

            {activeAdminTab === 'admins' && (
              <AdminManagement
                admins={admins}
                branches={branches}
                currentAdmin={currentUser}
                onAdminCreated={handleAdminCreated}
                onRefreshAdmins={refreshData}
              />
            )}
          </div>
        ) : (
          <div>
            {activeEmployeeTab === 'submit' && (
              <DailyWorkForm
                currentUser={currentUser}
                branches={branches}
                onLogSubmitted={handleLogSubmitted}
                todayLog={todayLog}
              />
            )}

            {activeEmployeeTab === 'history' && (
              <WeeklyHistoryView
                currentUser={currentUser}
                logs={logs}
              />
            )}
          </div>
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <PlannEngLogo size="md" />
            <span className="text-slate-500 text-xs">Outside Plant (OSP) & Telecommunication Civil Engineering Operations</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Anti-Backdating Active</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>Tamper-Resistant Logging</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="font-mono text-slate-500">v2.4.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

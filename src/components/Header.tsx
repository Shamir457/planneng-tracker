import React from 'react';
import { User } from '../types';
import { PlannEngLogo } from './PlannEngLogo';
import { 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Building2, 
  BarChart3, 
  CalendarDays,
  ListFilter, 
  Camera,
  UserPlus, 
  FileText, 
  History,
  Radio
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  activeAdminTab: 'productivity' | 'lookup' | 'logs' | 'employees' | 'admins';
  setActiveAdminTab: (tab: 'productivity' | 'lookup' | 'logs' | 'employees' | 'admins') => void;
  activeEmployeeTab: 'submit' | 'history';
  setActiveEmployeeTab: (tab: 'submit' | 'history') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  activeAdminTab,
  setActiveAdminTab,
  activeEmployeeTab,
  setActiveEmployeeTab,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 border-b border-slate-800/80">
          
          {/* Official Company Logo - Exact Lockup */}
          <div className="flex items-center space-x-4">
            <PlannEngLogo size="md" />
            <div className="hidden lg:block border-l border-slate-800 pl-4">
              <span className="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Field Operations & Daily Work Logging System</span>
              </span>
            </div>
          </div>

          {/* User Session & Quick Info */}
          {currentUser && (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="text-right hidden md:block">
                <div className="flex items-center justify-end space-x-2">
                  <span className="font-bold text-sm text-slate-100">{currentUser.name}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                    currentUser.role === 'admin' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {currentUser.role === 'admin' ? (
                      <>
                        <ShieldCheck className="w-3 h-3 mr-1 text-amber-400" />
                        Admin
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3 h-3 mr-1 text-emerald-400" />
                        ID: {currentUser.employeeId}
                      </>
                    )}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-end space-x-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  <span>{currentUser.branch}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{currentUser.title}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-rose-950/40 hover:border-rose-800/50 border border-slate-700 rounded-lg transition shadow-sm"
                title="Sign out of PlannEng Portal"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs based on Role */}
        {currentUser && (
          <div className="flex overflow-x-auto py-2.5 space-x-2 text-xs sm:text-sm font-semibold scrollbar-none">
            {currentUser.role === 'admin' ? (
              <>
                <button
                  onClick={() => setActiveAdminTab('productivity')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                    activeAdminTab === 'productivity'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-blue-300" />
                  <span>Employee Productivity Tracker</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('lookup')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                    activeAdminTab === 'lookup'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 text-blue-300" />
                  <span>Specific Employee Records</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('logs')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                    activeAdminTab === 'logs'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ListFilter className="w-4 h-4 text-blue-300" />
                  <span>All Logged Jobs</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('employees')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                    activeAdminTab === 'employees'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-blue-300" />
                  <span>Manage Employee IDs</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('admins')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                    activeAdminTab === 'admins'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Manage Admin IDs</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveEmployeeTab('submit')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                    activeEmployeeTab === 'submit'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-300" />
                  <span>Submit Daily Work (Today Only)</span>
                </button>

                <button
                  onClick={() => setActiveEmployeeTab('history')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                    activeEmployeeTab === 'history'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4 text-blue-300" />
                  <span>My Weekly History (Read-Only)</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

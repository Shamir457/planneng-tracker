import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { User } from '../types';
import { PlannEngLogo } from './PlannEngLogo';
import { 
  ShieldCheck, 
  HardHat, 
  Lock, 
  User as UserIcon, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface LoginModalProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [roleTab, setRoleTab] = useState<'admin' | 'employee'>('employee');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = storageService.login(username, password);
      setIsLoading(false);

      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    }, 250);
  };

  const availableAdmins = storageService.getAdmins().filter(a => a.active);

  const handleQuickAdminSelect = (adminUser: User) => {
    setRoleTab('admin');
    setUsername(adminUser.username);
    setPassword(adminUser.password);
    setError(null);
  };

  const handleQuickEmployeeFill = (empUsername: string) => {
    setRoleTab('employee');
    setUsername(empUsername);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-slate-950/70">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header graphic */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden border-b border-slate-800">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <PlannEngLogo size="lg" />
              <div className="inline-flex items-center space-x-1.5 bg-blue-900/60 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>Field Portal</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Sign In to Your Workspace
              </h1>
              <p className="text-xs text-blue-200/80 mt-1 font-medium">
                Daily Field Work Logging & Production System
              </p>
            </div>
          </div>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/90 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setRoleTab('employee');
                setError(null);
              }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                roleTab === 'employee'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Employee Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab('admin');
                setError(null);
              }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                roleTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Quick Credential Pre-fill Helpers */}
          <div className="mb-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Demo Sign-In:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">1-click fill</span>
            </div>

            {roleTab === 'admin' ? (
              <div className="space-y-1.5">
                {availableAdmins.map((adm) => (
                  <button
                    key={adm.id}
                    type="button"
                    onClick={() => handleQuickAdminSelect(adm)}
                    className="w-full text-left p-2 rounded-lg bg-amber-950/30 hover:bg-amber-900/40 border border-amber-600/30 text-amber-200 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-amber-300 flex items-center space-x-1.5">
                        <span>{adm.name}</span>
                        <span className="text-[10px] bg-amber-600/30 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                          {adm.employeeId}
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-400/80 font-mono">User: {adm.username}</div>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                      Load
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickEmployeeFill('john.doe')}
                  className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-blue-950/40 border border-slate-700/60 hover:border-blue-700/60 text-slate-200 transition flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white">John Doe (PE-1042)</span>
                    <span className="text-slate-400 ml-1.5 font-mono text-[11px]">• Lead Splicer</span>
                  </div>
                  <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded font-mono">
                    john.doe
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickEmployeeFill('david.k')}
                  className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-blue-950/40 border border-slate-700/60 hover:border-blue-700/60 text-slate-200 transition flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white">David Kim (PE-1105)</span>
                    <span className="text-slate-400 ml-1.5 font-mono text-[11px]">• Trench & Bore</span>
                  </div>
                  <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded font-mono">
                    david.k
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-700/60 text-rose-200 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {roleTab === 'admin' ? 'Admin Username' : 'Employee Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={roleTab === 'admin' ? 'shamir1234' : 'e.g. john.doe'}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-white placeholder-slate-600 outline-none transition"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-white placeholder-slate-600 outline-none transition font-mono"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 mt-2 ${
                roleTab === 'admin'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Sign In as {roleTab === 'admin' ? 'Administrator' : 'Field Employee'}
                  </span>
                </>
              )}
            </button>

            {/* Design & Development Credit */}
            <div className="text-center pt-2">
              <p className="text-xs font-medium text-slate-400 tracking-wide">
                Design And Developed By <span className="text-slate-200 font-semibold">Shamir</span>
              </p>
            </div>
          </form>

          {/* System Policy Assurance */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>PlannEng Tamper-Proof 1-Day Log Verification Engine</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Logs are time-stamped synchronously to prevent backdating & ensure accurate billing.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

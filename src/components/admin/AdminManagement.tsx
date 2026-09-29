import React, { useState } from 'react';
import { User, BranchInfo } from '../../types';
import { storageService } from '../../services/storage';
import { 
  ShieldCheck, 
  UserPlus, 
  KeyRound, 
  Building2, 
  Mail, 
  Phone, 
  Briefcase, 
  Search, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  UserCheck, 
  UserX,
  Sparkles,
  Lock,
  Crown
} from 'lucide-react';

interface AdminManagementProps {
  admins: User[];
  branches: BranchInfo[];
  currentAdmin: User | null;
  onAdminCreated: (newAdmin: User) => void;
  onRefreshAdmins: () => void;
}

export const AdminManagement: React.FC<AdminManagementProps> = ({
  admins,
  branches,
  currentAdmin,
  onAdminCreated,
  onRefreshAdmins,
}) => {
  // Suggest next Admin ID (e.g., ADM-002)
  const getNextAdminId = () => {
    const num = admins.length + 1;
    const formatted = num < 10 ? `00${num}` : num < 100 ? `0${num}` : `${num}`;
    return `ADM-${formatted}`;
  };

  // Form State
  const [name, setName] = useState('');
  const [adminId, setAdminId] = useState(getNextAdminId());
  const [branch, setBranch] = useState(branches[0]?.name || 'Karachi');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('admin2026@');
  const [title, setTitle] = useState('Operations Administrator');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Auto-fill username & email as name is typed
  const handleNameChange = (val: string) => {
    setName(val);
    const parts = val.trim().toLowerCase().split(/\s+/);
    if (parts.length >= 2) {
      const generatedUser = `${parts[0]}.${parts[parts.length - 1]}`;
      setUsername(generatedUser);
      setEmail(`${generatedUser}@planneng.com`);
    } else if (parts.length === 1 && parts[0]) {
      setUsername(parts[0]);
      setEmail(`${parts[0]}@planneng.com`);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let gen = '';
    for (let i = 0; i < 10; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(gen);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Full name is required for the new administrator.');
      return;
    }
    if (!adminId.trim()) {
      setErrorMessage('Admin ID is required (e.g. ADM-002).');
      return;
    }
    if (!username.trim()) {
      setErrorMessage('Username is required for admin sign-in.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Password is required.');
      return;
    }

    const res = storageService.createAdmin({
      name: name.trim(),
      adminId: adminId.trim().toUpperCase(),
      branch,
      username: username.trim(),
      password,
      title: title.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    if (res.success && res.user) {
      setSuccessMessage(
        `Admin ID ${res.user.employeeId} (${res.user.name}) created successfully! Credentials: Username: ${res.user.username} | Password: ${password}`
      );
      onAdminCreated(res.user);
      onRefreshAdmins();

      // Reset form with next suggested ID
      setName('');
      setUsername('');
      setPassword('admin2026@');
      setTitle('Operations Administrator');
      setEmail('');
      setPhone('');
      const nextNum = admins.length + 2;
      const formatted = nextNum < 10 ? `00${nextNum}` : nextNum < 100 ? `0${nextNum}` : `${nextNum}`;
      setAdminId(`ADM-${formatted}`);
    } else {
      setErrorMessage(res.error || 'Failed to create new Administrator ID.');
    }
  };

  const handleToggleStatus = (targetAdmin: User) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = storageService.updateAdminStatus(targetAdmin.employeeId, !targetAdmin.active);
    if (res.success) {
      onRefreshAdmins();
      setSuccessMessage(`Admin ID ${targetAdmin.employeeId} status updated to ${!targetAdmin.active ? 'ACTIVE' : 'DEACTIVATED'}.`);
    } else {
      setErrorMessage(res.error || 'Failed to update admin status.');
    }
  };

  const handleDeleteAdmin = (targetAdmin: User) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = storageService.deleteAdmin(targetAdmin.employeeId);
    if (res.success) {
      setDeleteConfirmId(null);
      onRefreshAdmins();
      setSuccessMessage(`Admin account ${targetAdmin.employeeId} (${targetAdmin.name}) removed.`);
    } else {
      setErrorMessage(res.error || 'Failed to delete administrator.');
    }
  };

  const handleCopyCredentials = (adm: User) => {
    const textToCopy = `PlannEng Admin Login:\nAdmin ID: ${adm.employeeId}\nName: ${adm.name}\nUsername: ${adm.username}\nPassword: ${adm.password}\nPortal: Administrator Access`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(adm.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredAdmins = admins.filter(a => {
    const q = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.employeeId.toLowerCase().includes(q) ||
      a.username.toLowerCase().includes(q) ||
      (a.branch && a.branch.toLowerCase().includes(q)) ||
      (a.title && a.title.toLowerCase().includes(q))
    );
  });

  const activeAdminsCount = admins.filter(a => a.active).length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs sm:text-sm tracking-wide uppercase mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Administrative Access Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manage Administrator IDs
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Create, configure, and maintain authorized administrator credentials for the PlannEng system. All admin IDs can log in immediately to review field work logs, manage employees, and monitor productivity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 min-w-[130px]">
              <span className="text-xs text-slate-400 block font-medium">Total Admins</span>
              <span className="text-2xl font-black text-white">{admins.length}</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 min-w-[130px]">
              <span className="text-xs text-emerald-400 block font-medium">Active Authorized</span>
              <span className="text-2xl font-black text-emerald-400">{activeAdminsCount}</span>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl px-4 py-3 min-w-[150px]">
              <span className="text-xs text-amber-300 block font-medium">Current Session</span>
              <span className="text-sm font-bold text-white flex items-center space-x-1.5 mt-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[130px]">{currentAdmin?.name || 'Administrator'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-700/80 text-rose-200 text-sm flex items-start space-x-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700/80 text-emerald-200 text-sm flex items-start space-x-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
        </div>
      )}

      {/* Main Grid: Create Form (Left) & Directory (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CREATE ADMIN ID FORM */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Admin ID</h2>
              <p className="text-xs text-slate-400">Generate immediate administrator sign-in access</p>
            </div>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Alex Henderson"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
                required
              />
            </div>

            {/* Admin ID & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin ID <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="ADM-002"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-amber-400 font-mono font-bold uppercase placeholder-slate-600 outline-none transition"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-mono">
                    Auto
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Assigned Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-200 outline-none transition cursor-pointer"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>{b.name} ({b.code})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Username & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alex.h"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password <span className="text-amber-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Title / Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Administrative Title / Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Regional Field Operations Manager"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.h@planneng.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-500 transition shadow-lg shadow-amber-900/40 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authorize & Create Admin ID</span>
            </button>
          </form>

          {/* Security policy note */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Newly authorized administrators can immediately sign in via the Administrator Login tab with their assigned username & password.
            </p>
          </div>
        </div>

        {/* ADMIN ID DIRECTORY */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Authorized Administrator Accounts</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full font-mono">
                  {filteredAdmins.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">View and manage administrative credentials</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search admin name, ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          {/* List of Admins */}
          <div className="space-y-3.5 overflow-y-auto max-h-[600px] pr-1">
            {filteredAdmins.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80">
                <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No administrators found</p>
                <p className="text-xs text-slate-500 mt-1">Try refining your search term.</p>
              </div>
            ) : (
              filteredAdmins.map((adm) => {
                const isPrimary = adm.username === 'shamir1234';
                const isCurrent = currentAdmin?.username === adm.username;
                const isPasswordRevealed = showPasswordMap[adm.id] || false;

                return (
                  <div
                    key={adm.id}
                    className={`p-4 rounded-xl border transition ${
                      adm.active
                        ? isPrimary
                          ? 'bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 border-amber-700/50 shadow-md shadow-amber-950/30'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Left: Avatar & Info */}
                      <div className="flex items-start space-x-3.5">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                          isPrimary
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                        }`}>
                          {isPrimary ? <Crown className="w-5 h-5 text-amber-400" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm sm:text-base">
                              {adm.name}
                            </span>
                            <span className="bg-amber-950/70 border border-amber-600/40 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                              {adm.employeeId}
                            </span>
                            {isPrimary && (
                              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Primary Admin
                              </span>
                            )}
                            {isCurrent && (
                              <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                You
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center space-x-1">
                              <Briefcase className="w-3 h-3 text-slate-500" />
                              <span>{adm.title || 'Administrator'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              <span>{adm.branch}</span>
                            </span>
                          </div>

                          {/* Credentials Row */}
                          <div className="mt-2.5 p-2 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
                            <div>
                              <span className="text-slate-500 mr-1.5">User:</span>
                              <span className="text-slate-200 font-bold">{adm.username}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-slate-500 mr-1.5">Pass:</span>
                              <span className="text-amber-400 font-bold">
                                {isPasswordRevealed ? adm.password : '••••••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowPasswordMap(prev => ({ ...prev, [adm.id]: !prev[adm.id] }));
                                }}
                                className="text-slate-400 hover:text-white p-0.5"
                                title={isPasswordRevealed ? 'Hide password' : 'Show password'}
                              >
                                {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopyCredentials(adm)}
                              className="ml-auto inline-flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60 transition"
                            >
                              {copiedId === adm.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Logins</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center space-x-2 pt-2 sm:pt-0 self-end sm:self-center border-t sm:border-t-0 border-slate-800 w-full sm:w-auto justify-end">
                        
                        {/* Status Toggle */}
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(adm)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                              adm.active
                                ? 'bg-emerald-950/60 text-emerald-300 hover:bg-rose-950/60 hover:text-rose-300 border border-emerald-800/60 hover:border-rose-800/60'
                                : 'bg-slate-800 text-slate-400 hover:bg-emerald-950/60 hover:text-emerald-300'
                            }`}
                          >
                            {adm.active ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5 text-rose-400" />
                                <span>Deactivated</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Delete Admin (with confirmation) */}
                        {!isPrimary && (
                          deleteConfirmId === adm.id ? (
                            <div className="flex items-center space-x-1 bg-rose-950/80 p-1 rounded-lg border border-rose-800">
                              <button
                                type="button"
                                onClick={() => handleDeleteAdmin(adm)}
                                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 text-slate-300 hover:text-white text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(adm.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                              title="Delete admin account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

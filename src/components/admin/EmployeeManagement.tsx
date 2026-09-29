import React, { useState } from 'react';
import { User, BranchInfo } from '../../types';
import { storageService } from '../../services/storage';
import { BranchManagementModal } from './BranchManagementModal';
import { 
  UserPlus, 
  Users, 
  Building2, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Briefcase, 
  Phone, 
  Mail, 
  Search,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Sparkles,
  Plus,
  Filter
} from 'lucide-react';

interface EmployeeManagementProps {
  employees: User[];
  branches: BranchInfo[];
  onEmployeeCreated: (newEmp: User) => void;
  onRefreshEmployees: () => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees,
  branches,
  onEmployeeCreated,
  onRefreshEmployees,
}) => {
  // Branch filter state
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'all' | string>('all');
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  // New employee form state
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState(`PE-${1125 + employees.length}`);
  const [branch, setBranch] = useState(branches[0]?.name || 'Karachi');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [title, setTitle] = useState('OSP Field Technician');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-generate username and email when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    const parts = val.trim().toLowerCase().split(/\s+/);
    if (parts.length >= 2) {
      const generatedUser = `${parts[0]}.${parts[parts.length - 1][0]}`;
      setUsername(generatedUser);
      setEmail(`${generatedUser}@planneng.com`);
    } else if (parts.length === 1 && parts[0]) {
      setUsername(parts[0]);
      setEmail(`${parts[0]}@planneng.com`);
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Employee name is required.');
      return;
    }
    if (!employeeId.trim()) {
      setErrorMessage('Employee ID is required.');
      return;
    }
    if (!username.trim()) {
      setErrorMessage('Username is required for employee login.');
      return;
    }
    if (!password) {
      setErrorMessage('Initial password is required.');
      return;
    }

    const res = storageService.createEmployee({
      name: name.trim(),
      employeeId: employeeId.trim().toUpperCase(),
      branch,
      username: username.trim(),
      password,
      title: title.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    if (res.success && res.user) {
      setSuccessMessage(`Employee ID ${res.user.employeeId} (${res.user.name}) created successfully! Login credentials: Username: ${res.user.username} | Password: ${password}`);
      onEmployeeCreated(res.user);

      // Reset form with next ID
      setName('');
      setEmployeeId(`PE-${1126 + employees.length}`);
      setUsername('');
      setPassword('password123');
      setTitle('OSP Field Technician');
      setEmail('');
      setPhone('');
    } else {
      setErrorMessage(res.error || 'Failed to create employee ID.');
    }
  };

  const toggleStatus = (empId: string, currentActive: boolean) => {
    storageService.updateEmployeeStatus(empId, !currentActive);
    onRefreshEmployees();
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered employees list based on search term AND selected branch filter
  const filteredEmployees = employees.filter(e => {
    // Branch filter: When Karachi is selected, show only Karachi employees; when Islamabad is selected, show only Islamabad employees
    if (selectedBranchFilter !== 'all' && e.branch.toLowerCase() !== selectedBranchFilter.toLowerCase()) {
      return false;
    }
    const term = searchTerm.toLowerCase();
    return (
      e.name.toLowerCase().includes(term) ||
      e.employeeId.toLowerCase().includes(term) ||
      e.branch.toLowerCase().includes(term) ||
      e.username.toLowerCase().includes(term) ||
      e.title.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">
                Employee ID & Access Management
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                Admin Level
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Issue employee IDs, assign regional branches, and grant secure credentials for field logging.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Active Employees: <strong className="text-white">{employees.filter(e => e.active).length}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => setIsBranchModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>+ Add & Manage Branches</span>
          </button>
        </div>
      </div>

      {/* Branch Selection & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Branch Filter:</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedBranchFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              selectedBranchFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>All Branches</span>
            <span className="text-[10px] opacity-75 font-mono">({employees.length})</span>
          </button>

          {branches.map(b => {
            const count = employees.filter(e => e.branch.toLowerCase() === b.name.toLowerCase()).length;
            const isSelected = selectedBranchFilter.toLowerCase() === b.name.toLowerCase();
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedBranchFilter(b.name);
                  setBranch(b.name); // Automatically preset new employee form to this branch!
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{b.name}</span>
                <span className="text-[10px] opacity-80 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Branch Indicator */}
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>
            Showing <strong className="text-white">{filteredEmployees.length}</strong> employee(s) in{' '}
            <strong className="text-blue-400">{selectedBranchFilter === 'all' ? 'All Branches' : selectedBranchFilter}</strong>
          </span>
        </div>
      </div>

      {/* Grid: Form to Create New Employee ID & Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-5 bg-slate-950 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>Register New Employee ID</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly provisions portal login access for new engineering hires.
            </p>
          </div>

          <form onSubmit={handleCreateEmployee} className="p-5 space-y-4">
            
            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-700 text-rose-200 text-xs rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Employee Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Robert Hughes"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-white placeholder-slate-600 outline-none"
                required
              />
            </div>

            {/* Employee ID & Branch */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Employee ID <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                  placeholder="PE-1135"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-white font-mono placeholder-slate-600 outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Branch <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBranchModalOpen(true)}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    + New
                  </button>
                </div>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-xs text-white outline-none cursor-pointer"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.name} className="bg-slate-900 text-white">
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Job Title / Specialization
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead Splicer, Lineman, Trench Lead"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>

            {/* Login Credentials (Username & Password) */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>Portal Login Credentials</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">For field device</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                    Username <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="robert.h"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg text-xs text-white placeholder-slate-600 outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                    Initial Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg text-xs text-white font-mono placeholder-slate-600 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Optional Contact info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="r.hughes@planneng.com"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Issue Employee ID & Credentials</span>
            </button>

          </form>
        </div>

        {/* Directory Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>PlannEng Employee Directory</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current field technicians & authorized logging personnel.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search directory..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
            {filteredEmployees.map(emp => {
              const isPasswordVisible = !!showPasswordMap[emp.id];

              return (
                <div key={emp.id} className="p-4 hover:bg-slate-800/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Info */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{emp.name}</span>
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-blue-950 text-blue-300 border border-blue-800">
                          {emp.employeeId}
                        </span>
                        {!emp.active && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span className="text-slate-300 font-medium">{emp.title}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{emp.branch}</span>
                        </span>
                      </div>

                      {/* Credentials Display for Admin */}
                      <div className="mt-2 flex items-center space-x-3 text-[11px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800/80 w-fit">
                        <span>User: <strong className="text-slate-200">{emp.username}</strong></span>
                        <span className="text-slate-600">|</span>
                        <span className="flex items-center space-x-1">
                          <span>Pass:</span>
                          <strong className="text-amber-300 font-mono">
                            {isPasswordVisible ? (emp.password || 'password123') : '••••••••'}
                          </strong>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(emp.id)}
                            className="text-slate-500 hover:text-slate-300 ml-1"
                            title="Toggle password reveal"
                          >
                            {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => toggleStatus(emp.employeeId, emp.active)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition border ${
                        emp.active
                          ? 'bg-slate-800 text-slate-300 hover:bg-rose-950 hover:text-rose-300 border-slate-700 hover:border-rose-700'
                          : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border-emerald-700'
                      }`}
                      title={emp.active ? 'Deactivate employee login' : 'Activate employee login'}
                    >
                      {emp.active ? (
                        <>
                          <UserX className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Dynamic Branch Management Modal */}
      <BranchManagementModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        branches={branches}
        employees={employees}
        onBranchesUpdated={onRefreshEmployees}
      />

    </div>
  );
};

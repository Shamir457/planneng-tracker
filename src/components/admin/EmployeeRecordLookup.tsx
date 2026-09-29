import React, { useState } from 'react';
import { User, WorkLog, BranchInfo } from '../../types';
import { storageService } from '../../services/storage';
import { 
  Calendar, 
  Search, 
  User as UserIcon, 
  Building2, 
  Binary, 
  Ruler, 
  Tractor, 
  FileText, 
  ChevronRight, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  Download, 
  Filter, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Layers,
  Lock,
  Briefcase,
  Camera,
  Eye,
  X,
  Maximize2
} from 'lucide-react';
import { PhotoLightboxModal, PhotoLightboxData } from '../PhotoLightboxModal';

interface EmployeeRecordLookupProps {
  employees: User[];
  logs: WorkLog[];
  branches: BranchInfo[];
}

export const EmployeeRecordLookup: React.FC<EmployeeRecordLookupProps> = ({
  employees,
  logs,
  branches,
}) => {
  // Branch filter state (All, Karachi, Islamabad, or dynamic)
  const [selectedBranch, setSelectedBranch] = useState<'all' | string>('all');

  // Currently selected employee (defaults to first employee)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees[0]?.employeeId || ''
  );

  // Filter employees for the selector based on active branch
  const branchFilteredEmployees = selectedBranch === 'all'
    ? employees
    : employees.filter(e => e.branch.toLowerCase() === selectedBranch.toLowerCase());

  const handleBranchChange = (branchName: string) => {
    setSelectedBranch(branchName);
    if (branchName !== 'all') {
      const matching = employees.filter(e => e.branch.toLowerCase() === branchName.toLowerCase());
      if (matching.length > 0) {
        if (!matching.some(e => e.employeeId === selectedEmployeeId)) {
          setSelectedEmployeeId(matching[0].employeeId);
          setActiveLogId(null);
        }
      }
    }
  };

  // View mode: 'specific_day' (view records for one selected day) or 'all_previous' (view all historical records)
  const [viewMode, setViewMode] = useState<'specific_day' | 'all_previous'>('specific_day');

  // Selected date for "one day records" (defaults to today or latest log date)
  const todayStr = new Date().toISOString().split('T')[0];
  const [targetDate, setTargetDate] = useState<string>(todayStr);

  // Optional project/keyword search within this employee's records
  const [searchTerm, setSearchTerm] = useState('');

  // Selected single log for detailed drawer / card focus
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  // High-res photo inspection modal
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  const selectedEmployee = employees.find(
    e => e.employeeId.toUpperCase() === selectedEmployeeId.toUpperCase()
  );

  // All logs belonging to this specific employee
  const employeeAllLogs = logs
    .filter(l => l.employeeId.toUpperCase() === selectedEmployeeId.toUpperCase())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Unique dates on which this employee has logged records (useful for quick date chips)
  const loggedDates = Array.from(new Set(employeeAllLogs.map(l => l.date)));

  // Filter logs according to the selected view mode (specific day vs all previous)
  const displayedLogs = employeeAllLogs.filter(l => {
    // Mode filter:
    if (viewMode === 'specific_day') {
      if (l.date !== targetDate) return false;
    }
    // Search filter:
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchProj = l.projectName.toLowerCase().includes(term);
      const matchDetails = l.details.toLowerCase().includes(term);
      const matchBranch = l.branch.toLowerCase().includes(term);
      if (!matchProj && !matchDetails && !matchBranch) return false;
    }
    return true;
  });

  // Calculate totals for the displayed view
  const totalSplices = displayedLogs.reduce((sum, l) => sum + (l.spliceCount || 0), 0);
  const totalOverlash = displayedLogs.reduce((sum, l) => sum + (l.overlashFt || 0), 0);
  const totalOverpull = displayedLogs.reduce((sum, l) => sum + (l.overpullFt || 0), 0);
  const totalTrenchBore = displayedLogs.reduce((sum, l) => sum + (l.trenchBoreFt || 0), 0);
  const totalFootage = totalOverlash + totalOverpull + totalTrenchBore;

  // Handler to export this employee's displayed records
  const handleExportCSV = () => {
    if (!selectedEmployee) return;
    const csvContent = storageService.exportLogsToCSV(displayedLogs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateLabel = viewMode === 'specific_day' ? targetDate : 'all_previous';
    link.setAttribute('download', `PlannEng_${selectedEmployee.employeeId}_${dateLabel}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick navigation between dates
  const changeDateByDays = (deltaDays: number) => {
    const current = new Date(targetDate + 'T12:00:00');
    current.setDate(current.getDate() + deltaDays);
    const nextDateStr = current.toISOString().split('T')[0];
    setTargetDate(nextDateStr);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Admin Deep Dive
            </span>
            <span className="text-xs text-slate-400 font-mono">Individual Employee History Audit</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center space-x-2">
            <CalendarDays className="w-6 h-6 text-blue-400" />
            <span>Specific Employee Records Inspector</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Examine single-day daily submissions or inspect all previous historical job logs for any specific technician.
          </p>
        </div>

        {displayedLogs.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition shadow-lg shadow-blue-900/30 self-start md:self-center"
          >
            <Download className="w-4 h-4" />
            <span>Export Employee Records CSV</span>
          </button>
        )}
      </div>

      {/* Control Panel: Employee Selector + Mode Toggle (One Day vs Previous) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-5">
        
        {/* Row 1: Select Employee & Mode Switch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Employee Selector (6 cols) */}
          <div className="lg:col-span-6 space-y-2">
            
            {/* Branch selector tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-blue-400" />
                <span>Branch:</span>
              </span>

              <button
                type="button"
                onClick={() => handleBranchChange('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  selectedBranch === 'all'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All ({employees.length})
              </button>

              {branches.map(b => {
                const count = employees.filter(e => e.branch.toLowerCase() === b.name.toLowerCase()).length;
                const isSel = selectedBranch.toLowerCase() === b.name.toLowerCase();
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleBranchChange(b.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      isSel
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="ml-1 text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <select
                value={selectedEmployeeId}
                onChange={(e) => {
                  setSelectedEmployeeId(e.target.value);
                  setActiveLogId(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm font-semibold text-white outline-none"
              >
                {branchFilteredEmployees.length === 0 ? (
                  <option value="" disabled>No employees assigned to {selectedBranch}</option>
                ) : (
                  branchFilteredEmployees.map(emp => (
                    <option key={emp.id} value={emp.employeeId} className="bg-slate-900 text-white">
                      {emp.name} ({emp.employeeId}) — {emp.branch} [{emp.title}]
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Mode Switch: Specific 1 Day vs All Previous Records (6 cols) */}
          <div className="lg:col-span-6">
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Records View Mode</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('specific_day')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  viewMode === 'specific_day'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>One Day Records</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('all_previous')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  viewMode === 'all_previous'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>All Previous History</span>
              </button>
            </div>
          </div>

        </div>

        {/* Row 2: Date Picker (if One Day Mode) & Keyword Search */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {viewMode === 'specific_day' ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1 mr-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Target Date:</span>
              </span>

              {/* Prev Day Button */}
              <button
                type="button"
                onClick={() => changeDateByDays(-1)}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
                title="Previous Day"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              {/* HTML Date Input */}
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-xs font-mono font-bold text-white outline-none cursor-pointer"
              />

              {/* Next Day Button */}
              <button
                type="button"
                onClick={() => changeDateByDays(1)}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
                title="Next Day"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Jump to Today Button */}
              <button
                type="button"
                onClick={() => setTargetDate(todayStr)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                  targetDate === todayStr
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                Today
              </button>

              {/* Quick dates chips if employee has logged dates */}
              {loggedDates.length > 0 && (
                <div className="hidden sm:flex items-center space-x-1 pl-2">
                  <span className="text-[10px] text-slate-500">Logged days:</span>
                  {loggedDates.slice(0, 4).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTargetDate(d)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono transition border ${
                        targetDate === d
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Showing all historic records across all logged work shifts ({employeeAllLogs.length} total jobs).</span>
            </div>
          )}

          {/* Keyword Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in project / notes..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>

        </div>

      </div>

      {/* Selected Employee Profile Header & Summary */}
      {selectedEmployee && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-extrabold text-base">
              {selectedEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-white">{selectedEmployee.name}</h3>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-blue-950 text-blue-300 border border-blue-800">
                  {selectedEmployee.employeeId}
                </span>
                <span className="text-xs text-slate-400">(@{selectedEmployee.username})</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                <span>{selectedEmployee.title}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  <span>{selectedEmployee.branch}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
            <span className="text-slate-400 font-medium">
              {viewMode === 'specific_day' ? `Records for ${targetDate}:` : 'Total Previous Records:'}
            </span>
            <span className="font-extrabold text-white font-mono bg-blue-950 px-2 py-0.5 rounded border border-blue-800 text-blue-300">
              {displayedLogs.length} {displayedLogs.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>
        </div>
      )}

      {/* Aggregate Output Cards for the active inspection window */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        
        {/* Jobs count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <span className="text-xs text-slate-400 font-medium block">Jobs Found</span>
          <div className="mt-1.5 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-white">{displayedLogs.length}</span>
            <span className="text-xs text-slate-500">jobs</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {viewMode === 'specific_day' ? 'Single day' : 'All history'}
          </span>
        </div>

        {/* Splice */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <span className="text-xs text-slate-400 font-medium block flex items-center space-x-1">
            <Binary className="w-3.5 h-3.5 text-amber-400" />
            <span>Splice</span>
          </span>
          <div className="mt-1.5 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-amber-400">{totalSplices}</span>
            <span className="text-xs text-slate-500">numbers</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Fusion splices</span>
        </div>

        {/* Overlash */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <span className="text-xs text-slate-400 font-medium block flex items-center space-x-1">
            <Ruler className="w-3.5 h-3.5 text-blue-400" />
            <span>Overlash</span>
          </span>
          <div className="mt-1.5 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-blue-400">{totalOverlash}</span>
            <span className="text-xs text-blue-400 font-mono font-bold">FT</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Aerial span</span>
        </div>

        {/* Overpull */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <span className="text-xs text-slate-400 font-medium block flex items-center space-x-1">
            <Ruler className="w-3.5 h-3.5 text-indigo-400" />
            <span>Overpull</span>
          </span>
          <div className="mt-1.5 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-indigo-400">{totalOverpull}</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">FT</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Conduit pull</span>
        </div>

        {/* Trench & Bore */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-medium block flex items-center space-x-1">
            <Tractor className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trench & Bore</span>
          </span>
          <div className="mt-1.5 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-400">{totalTrenchBore}</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">FT</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Total: {totalFootage} FT</span>
        </div>

      </div>

      {/* Main Records List */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span className="uppercase tracking-wider">
            {viewMode === 'specific_day' 
              ? `Daily Logged Records for ${targetDate}`
              : `All Historical Logged Records (${displayedLogs.length} total)`}
          </span>
          <span>PlannEng Database Synchronized</span>
        </div>

        {displayedLogs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">
              {viewMode === 'specific_day'
                ? `No work records found for ${selectedEmployee?.name} on ${targetDate}`
                : `No historical work records found for ${selectedEmployee?.name}`}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {viewMode === 'specific_day' ? (
                <>
                  This employee did not log any work on this specific date. Try picking another date using the date selector above, or switch to <button onClick={() => setViewMode('all_previous')} className="text-blue-400 underline font-semibold">All Previous History</button> to view all logged shifts.
                </>
              ) : (
                'No jobs match your search parameters.'
              )}
            </p>
            {viewMode === 'specific_day' && loggedDates.length > 0 && (
              <div className="pt-2">
                <span className="text-xs text-slate-400 mr-2">Available logged dates:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-2">
                  {loggedDates.map(d => (
                    <button
                      key={d}
                      onClick={() => setTargetDate(d)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 text-xs font-mono font-semibold transition"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedLogs.map((log) => {
              const isSelected = activeLogId === log.id;
              const totalLogFootage = log.overlashFt + log.overpullFt + log.trenchBoreFt;

              return (
                <div
                  key={log.id}
                  onClick={() => setActiveLogId(isSelected ? null : log.id)}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-lg transition cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 shadow-blue-950/40 ring-1 ring-blue-500/40'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  
                  {/* Top Bar: Date, Submitted At, Branch, Project Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{log.date}</span>
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Logged at {log.submittedAtFormatted}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-slate-950 border border-slate-800">
                          ID: #{log.id}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mt-1.5 flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{log.projectName}</span>
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-center">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.branch}</span>
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Locked Record</span>
                      </span>
                    </div>
                  </div>

                  {/* Quantities Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-semibold">Splice Count</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-xl font-black text-amber-400">{log.spliceCount}</span>
                        <span className="text-[10px] text-slate-500 font-mono">numbers</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-semibold">Overlash</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-xl font-black text-blue-400">{log.overlashFt}</span>
                        <span className="text-xs text-blue-400 font-mono font-bold">FT</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-semibold">Overpull</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-xl font-black text-indigo-400">{log.overpullFt}</span>
                        <span className="text-xs text-indigo-400 font-mono font-bold">FT</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-semibold">Trench & Bore</span>
                      <div className="flex items-baseline space-x-1 mt-0.5">
                        <span className="text-xl font-black text-emerald-400">{log.trenchBoreFt}</span>
                        <span className="text-xs text-emerald-400 font-mono font-bold">FT</span>
                      </div>
                    </div>
                  </div>

                  {/* Details of Work Box & Compulsory Work Picture */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800/90">
                    <div className="md:col-span-3 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Details of Work Logged by Technician:</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Combined Footage: {totalLogFootage} FT
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {log.details || <span className="text-slate-500 italic">No additional notes provided.</span>}
                      </p>
                    </div>

                    {/* Compulsory Picture of Work */}
                    <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-3 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center space-x-1">
                        <Camera className="w-3 h-3 text-rose-400" />
                        <span>Work Picture Proof:</span>
                      </span>
                      {log.photoUrl ? (
                        <div
                          className="relative group cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLightboxData({
                              url: log.photoUrl,
                              title: `${selectedEmployee?.name} - ${log.projectName} (${log.date})`,
                              log,
                            });
                          }}
                        >
                          <img
                            src={log.photoUrl}
                            alt="Work proof"
                            className="w-full h-28 object-cover rounded-lg border border-slate-700 group-hover:scale-105 transition shadow-sm"
                          />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition text-white text-[11px] font-bold space-x-1">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Enlarge Picture</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 italic py-3">No picture on file.</div>
                      )}

                      {log.photoUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLightboxData({
                              url: log.photoUrl,
                              title: `${selectedEmployee?.name} - ${log.projectName} (${log.date})`,
                              log,
                            });
                          }}
                          className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold mt-2 text-center block"
                        >
                          Inspect High-Res →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer note */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3">
                    <span className="flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Single-day locked entry • Prevents retro-active modification</span>
                    </span>
                    <span className="text-blue-400 font-medium">
                      {isSelected ? 'Click to collapse' : 'Click to inspect'}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* High-Resolution Photo Lightbox Modal */}
      {activeLightboxData && (
        <PhotoLightboxModal
          data={activeLightboxData}
          onClose={() => setActiveLightboxData(null)}
        />
      )}

    </div>
  );
};

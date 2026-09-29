import React, { useState } from 'react';
import { User, WorkLog, BranchInfo } from '../../types';
import { storageService } from '../../services/storage';
import { 
  BarChart3, 
  Binary, 
  Ruler, 
  Tractor, 
  Building2, 
  User as UserIcon, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Briefcase, 
  CheckCircle2, 
  X,
  TrendingUp,
  Award,
  Layers,
  Camera,
  Eye,
  Maximize2
} from 'lucide-react';
import { PhotoLightboxModal, PhotoLightboxData } from '../PhotoLightboxModal';

interface ProductivityDashboardProps {
  logs: WorkLog[];
  employees: User[];
  branches: BranchInfo[];
  onOpenEmployeeManagement: () => void;
  onOpenEmployeeLookup?: (employeeId?: string) => void;
}

export const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({
  logs,
  employees,
  branches,
  onOpenEmployeeManagement,
  onOpenEmployeeLookup,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeModal, setSelectedEmployeeModal] = useState<User | null>(null);
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  // Date filtering logic
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const filteredLogs = logs.filter(log => {
    // Branch filter
    if (selectedBranch !== 'all' && log.branch !== selectedBranch) {
      return false;
    }

    // Date filter
    if (dateFilter === 'today') {
      if (log.date !== todayStr) return false;
    } else if (dateFilter === '7days') {
      const past7 = new Date();
      past7.setDate(past7.getDate() - 7);
      if (new Date(log.date + 'T23:59:59') < past7) return false;
    } else if (dateFilter === '30days') {
      const past30 = new Date();
      past30.setDate(past30.getDate() - 30);
      if (new Date(log.date + 'T23:59:59') < past30) return false;
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = log.employeeName.toLowerCase().includes(term);
      const matchId = log.employeeId.toLowerCase().includes(term);
      const matchProj = log.projectName.toLowerCase().includes(term);
      if (!matchName && !matchId && !matchProj) return false;
    }

    return true;
  });

  // Calculate executive KPI totals across filtered logs
  const totalJobsCount = filteredLogs.length;
  const totalSplices = filteredLogs.reduce((sum, l) => sum + (l.spliceCount || 0), 0);
  const totalOverlashFt = filteredLogs.reduce((sum, l) => sum + (l.overlashFt || 0), 0);
  const totalOverpullFt = filteredLogs.reduce((sum, l) => sum + (l.overpullFt || 0), 0);
  const totalTrenchBoreFt = filteredLogs.reduce((sum, l) => sum + (l.trenchBoreFt || 0), 0);
  const totalCombinedFootage = totalOverlashFt + totalOverpullFt + totalTrenchBoreFt;

  // Compute productivity metrics per employee
  const employeeMetrics = employees.map(emp => {
    const empLogs = filteredLogs.filter(l => l.employeeId.toUpperCase() === emp.employeeId.toUpperCase());
    const splices = empLogs.reduce((sum, l) => sum + (l.spliceCount || 0), 0);
    const overlash = empLogs.reduce((sum, l) => sum + (l.overlashFt || 0), 0);
    const overpull = empLogs.reduce((sum, l) => sum + (l.overpullFt || 0), 0);
    const trenchBore = empLogs.reduce((sum, l) => sum + (l.trenchBoreFt || 0), 0);
    const totalFt = overlash + overpull + trenchBore;

    const latestLog = empLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    return {
      employee: emp,
      jobsCount: empLogs.length,
      splices,
      overlash,
      overpull,
      trenchBore,
      totalFt,
      latestDate: latestLog ? latestLog.date : 'None',
      logs: empLogs,
    };
  }).sort((a, b) => b.totalFt - a.totalFt || b.jobsCount - a.jobsCount);

  // Export to CSV handler
  const handleExportCSV = () => {
    const csvContent = storageService.exportLogsToCSV(filteredLogs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PlannEng_Productivity_Report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              Admin Executive Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">Shamir Operations Console</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Field Productivity Tracker</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time output across all branches, jobs, fiber splices, and installation footage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenEmployeeLookup && (
            <button
              onClick={() => onOpenEmployeeLookup()}
              className="px-4 py-2.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-bold rounded-xl border border-indigo-500/40 flex items-center space-x-2 transition shadow-sm"
            >
              <Calendar className="w-4 h-4 text-indigo-300" />
              <span>Inspect Employee Records</span>
            </button>
          )}

          <button
            onClick={onOpenEmployeeManagement}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-2 transition shadow-sm"
          >
            <UserIcon className="w-4 h-4 text-blue-400" />
            <span>+ New Employee ID</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition shadow-lg shadow-blue-900/30"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Jobs */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Total Jobs</span>
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalJobsCount}</span>
            <span className="text-xs text-slate-500">tickets</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Logged field shifts</div>
        </div>

        {/* Splice Count */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Total Splices</span>
            <Binary className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{totalSplices}</span>
            <span className="text-xs text-slate-500">splices</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Optical terminations</div>
        </div>

        {/* Overlash Feet */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Overlash (FT)</span>
            <Ruler className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-400">{totalOverlashFt}</span>
            <span className="text-xs text-blue-400 font-bold font-mono">FT</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Aerial messenger span</div>
        </div>

        {/* Overpull Feet */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Overpull (FT)</span>
            <Ruler className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400">{totalOverpullFt}</span>
            <span className="text-xs text-indigo-400 font-bold font-mono">FT</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Conduit pulling</div>
        </div>

        {/* Trench & Bore Feet */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Trench & Bore</span>
            <Tractor className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{totalTrenchBoreFt}</span>
            <span className="text-xs text-emerald-400 font-bold font-mono">FT</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Underground civil</div>
        </div>

        {/* Total Linear Footage */}
        <div className="bg-slate-900 border border-blue-900/60 p-4 rounded-xl shadow-md bg-gradient-to-br from-slate-900 to-blue-950/40">
          <div className="text-xs text-blue-300 font-semibold flex items-center justify-between">
            <span>Total Footage</span>
            <Layers className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalCombinedFootage}</span>
            <span className="text-xs text-blue-300 font-bold font-mono">FT</span>
          </div>
          <div className="text-[10px] text-blue-300/80 mt-1 font-medium">Combined linear output</div>
        </div>

      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employee, ID, project..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        {/* Branch & Date Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Branch Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-slate-200 outline-none font-semibold cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Branches ({branches.length})</option>
              {branches.map(b => (
                <option key={b.id} value={b.name} className="bg-slate-900 text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                dateFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                dateFilter === 'today' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                dateFilter === '7days' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateFilter('30days')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                dateFilter === '30days' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>

        </div>

      </div>

      {/* Individual Employee Productivity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Individual Employee Productivity Across All Jobs</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by total footage & completed job volume. Click any employee row to inspect their full activity log.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {employeeMetrics.length} Field Technicians
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee / ID</th>
                <th className="py-3 px-4">Branch & Title</th>
                <th className="py-3 px-4 text-center">Jobs Logged</th>
                <th className="py-3 px-4 text-right">Splice (Qty)</th>
                <th className="py-3 px-4 text-right">Overlash</th>
                <th className="py-3 px-4 text-right">Overpull</th>
                <th className="py-3 px-4 text-right">Trench & Bore</th>
                <th className="py-3 px-4 text-right">Total Footage</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {employeeMetrics.map(({ employee, jobsCount, splices, overlash, overpull, trenchBore, totalFt }) => {
                return (
                  <tr
                    key={employee.id}
                    onClick={() => setSelectedEmployeeModal(employee)}
                    className="hover:bg-slate-800/50 cursor-pointer transition group"
                  >
                    {/* Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                          {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-blue-400 transition">
                            {employee.name}
                          </div>
                          <div className="text-[11px] text-blue-400 font-mono font-semibold">
                            {employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Branch & Title */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 text-xs font-semibold">{employee.branch}</div>
                      <div className="text-[11px] text-slate-400">{employee.title}</div>
                    </td>

                    {/* Jobs Logged */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {jobsCount} jobs
                      </span>
                    </td>

                    {/* Splices */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-amber-400">
                        {splices}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1">splices</span>
                    </td>

                    {/* Overlash */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-blue-400">
                        {overlash}
                      </span>
                      <span className="text-[10px] text-blue-400 font-mono font-bold ml-1">FT</span>
                    </td>

                    {/* Overpull */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-indigo-400">
                        {overpull}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold ml-1">FT</span>
                    </td>

                    {/* Trench & Bore */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-emerald-400">
                        {trenchBore}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold ml-1">FT</span>
                    </td>

                    {/* Total Linear Footage */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-black text-white text-sm">
                        {totalFt.toLocaleString()} <span className="text-xs text-blue-400 font-bold">FT</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployeeModal(employee);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/60 hover:bg-blue-600 rounded-lg border border-blue-800/60 transition inline-flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Employee Drilldown Modal */}
      {selectedEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-base">
                  {selectedEmployeeModal.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{selectedEmployeeModal.name}</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      {selectedEmployeeModal.employeeId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedEmployeeModal.title} • {selectedEmployeeModal.branch}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployeeModal(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Employee's complete job list */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-white uppercase tracking-wider">
                  Logged Jobs History for {selectedEmployeeModal.name}
                </span>
                <span>
                  Total Logs: {logs.filter(l => l.employeeId === selectedEmployeeModal.employeeId).length}
                </span>
              </div>

              {logs.filter(l => l.employeeId === selectedEmployeeModal.employeeId).length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No work reports logged by this employee yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs
                    .filter(l => l.employeeId === selectedEmployeeModal.employeeId)
                    .map(log => (
                      <div
                        key={log.id}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-blue-400 flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{log.date}</span>
                            <span className="text-slate-500 font-normal">at {log.submittedAtFormatted}</span>
                          </span>
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {log.branch}
                          </span>
                        </div>

                        <div className="font-bold text-sm text-white">
                          {log.projectName}
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Splice</span>
                            <span className="font-black text-amber-400">{log.spliceCount}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Overlash</span>
                            <span className="font-black text-blue-400">{log.overlashFt} FT</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Overpull</span>
                            <span className="font-black text-indigo-400">{log.overpullFt} FT</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Trench & Bore</span>
                            <span className="font-black text-emerald-400">{log.trenchBoreFt} FT</span>
                          </div>
                        </div>

                        {/* Details and Site Photo */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40">
                          <p className="text-xs text-slate-300 italic flex-1">
                            {log.details ? `"${log.details}"` : <span className="text-slate-500 not-italic">No additional notes recorded.</span>}
                          </p>

                          {log.photoUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLightboxData({
                                  url: log.photoUrl,
                                  title: `${log.employeeName} - ${log.projectName}`,
                                  log,
                                });
                              }}
                              className="shrink-0 flex items-center space-x-2 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 rounded-lg p-1.5 pr-2.5 transition text-xs font-semibold text-blue-400 group"
                            >
                              <img
                                src={log.photoUrl}
                                alt="Site proof"
                                className="w-8 h-8 object-cover rounded border border-slate-700 group-hover:scale-105 transition"
                              />
                              <div className="text-left">
                                <span className="block text-[10px] text-slate-400">Site Photo</span>
                                <span className="text-[11px] font-bold text-white flex items-center space-x-1">
                                  <Maximize2 className="w-3 h-3 text-blue-400" />
                                  <span>Inspect</span>
                                </span>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedEmployeeModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

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

import React, { useState } from 'react';
import { WorkLog, BranchInfo, User } from '../../types';
import { storageService } from '../../services/storage';
import { 
  ListFilter, 
  Search, 
  Building2, 
  Calendar, 
  Download, 
  Binary, 
  Ruler, 
  Tractor, 
  FileText, 
  CheckCircle2, 
  X,
  ExternalLink,
  ChevronDown,
  Camera,
  Eye,
  Maximize2
} from 'lucide-react';
import { PhotoLightboxModal, PhotoLightboxData } from '../PhotoLightboxModal';

interface AllLogsViewProps {
  logs: WorkLog[];
  branches: BranchInfo[];
  employees: User[];
}

export const AllLogsView: React.FC<AllLogsViewProps> = ({
  logs,
  branches,
  employees,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');
  const [selectedLogDetail, setSelectedLogDetail] = useState<WorkLog | null>(null);
  const [ticketModalTab, setTicketModalTab] = useState<'specs' | 'photo'>('specs');
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  // Available employees for currently selected branch
  const branchEmployees = selectedBranch === 'all'
    ? employees
    : employees.filter(e => e.branch.toLowerCase() === selectedBranch.toLowerCase());

  const handleBranchSelectChange = (newBranch: string) => {
    setSelectedBranch(newBranch);
    if (newBranch !== 'all' && selectedEmployeeId !== 'all') {
      const match = employees.find(e => e.employeeId === selectedEmployeeId);
      if (match && match.branch.toLowerCase() !== newBranch.toLowerCase()) {
        setSelectedEmployeeId('all');
      }
    }
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (selectedBranch !== 'all' && log.branch !== selectedBranch) return false;
    if (selectedEmployeeId !== 'all' && log.employeeId !== selectedEmployeeId) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchProj = log.projectName.toLowerCase().includes(term);
      const matchEmp = log.employeeName.toLowerCase().includes(term);
      const matchId = log.employeeId.toLowerCase().includes(term);
      const matchNotes = log.details.toLowerCase().includes(term);
      const matchDate = log.date.includes(term);
      if (!matchProj && !matchEmp && !matchId && !matchNotes && !matchDate) return false;
    }

    return true;
  });

  const handleExportCSV = () => {
    const csvContent = storageService.exportLogsToCSV(filteredLogs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PlannEng_All_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800 uppercase tracking-wider">
              Field Audit Records
            </span>
            <span className="text-xs text-slate-400 font-mono">Central Database</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center space-x-2">
            <ListFilter className="w-6 h-6 text-blue-400" />
            <span>All Logged Jobs Company-Wide</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-proof real-time daily work logs filed by technicians across all active projects.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition shadow-lg shadow-blue-900/30"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered ({filteredLogs.length}) to CSV</span>
        </button>
      </div>

      {/* Filter controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects, notes, technician..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Branch filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBranch}
              onChange={(e) => handleBranchSelectChange(e.target.value)}
              className="bg-transparent text-slate-200 outline-none font-semibold cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.name} className="bg-slate-900 text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="bg-transparent text-slate-200 outline-none font-semibold cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">
                {selectedBranch === 'all' ? 'All Employees' : `All in ${selectedBranch}`}
              </option>
              {branchEmployees.map(emp => (
                <option key={emp.id} value={emp.employeeId} className="bg-slate-900 text-white">
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Employee / ID</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4 text-right">Splice</th>
                <th className="py-3 px-4 text-right">Overlash</th>
                <th className="py-3 px-4 text-right">Overpull</th>
                <th className="py-3 px-4 text-right">Trench & Bore</th>
                <th className="py-3 px-4 text-right">Total FT</th>
                <th className="py-3 px-4 text-center">Work Photo</th>
                <th className="py-3 px-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-500 text-xs">
                    No logged jobs matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const totalFt = log.overlashFt + log.overpullFt + log.trenchBoreFt;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLogDetail(log)}
                      className="hover:bg-slate-800/50 cursor-pointer transition"
                    >
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span>{log.date}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {log.submittedAtFormatted}
                        </div>
                      </td>

                      {/* Employee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white text-xs">{log.employeeName}</div>
                        <div className="text-[11px] text-blue-400 font-mono font-semibold">
                          {log.employeeId}
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-300">
                        {log.branch}
                      </td>

                      {/* Project Name */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-xs font-semibold text-slate-200">
                        {log.projectName}
                      </td>

                      {/* Splice */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-amber-400">
                          {log.spliceCount}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">spl</span>
                      </td>

                      {/* Overlash */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-400">
                          {log.overlashFt}
                        </span>
                        <span className="text-[10px] text-blue-400 font-mono font-bold ml-1">FT</span>
                      </td>

                      {/* Overpull */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-indigo-400">
                          {log.overpullFt}
                        </span>
                        <span className="text-[10px] text-indigo-400 font-mono font-bold ml-1">FT</span>
                      </td>

                      {/* Trench & Bore */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-400">
                          {log.trenchBoreFt}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold ml-1">FT</span>
                      </td>

                      {/* Total Footage */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-white text-xs">
                        {totalFt} FT
                      </td>

                      {/* Work Photo Thumbnail */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {log.photoUrl ? (
                          <button
                            type="button"
                            onClick={() => setActiveLightboxData({
                              url: log.photoUrl,
                              title: `${log.employeeName} - ${log.projectName}`,
                              log
                            })}
                            className="group relative inline-block rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition shadow-sm"
                            title="Click to inspect high-resolution work photo"
                          >
                            <img
                              src={log.photoUrl}
                              alt="Site work proof"
                              className="w-10 h-10 object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No image</span>
                        )}
                      </td>

                      {/* View button */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLogDetail(log);
                            setTicketModalTab('specs');
                          }}
                          className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-blue-600 rounded border border-slate-700 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block font-bold">
                  Verified Work Ticket #{selectedLogDetail.id}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedLogDetail.projectName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big View Mode Switcher: Specs vs Full High-Res Picture */}
            <div className="px-5 pt-3 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setTicketModalTab('specs')}
                className={`py-2 px-4 text-xs font-bold rounded-t-lg transition flex items-center space-x-2 border-b-2 ${
                  ticketModalTab === 'specs'
                    ? 'border-blue-500 text-white bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ticket Specifications</span>
              </button>

              <button
                type="button"
                onClick={() => setTicketModalTab('photo')}
                className={`py-2 px-4 text-xs font-bold rounded-t-lg transition flex items-center space-x-2 border-b-2 ${
                  ticketModalTab === 'photo'
                    ? 'border-blue-500 text-white bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>Site Work Photo (Big View)</span>
                {selectedLogDetail.photoUrl && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              
              {ticketModalTab === 'specs' ? (
                <>
                  {/* Metadata */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Technician</span>
                      <span className="font-bold text-white text-sm">{selectedLogDetail.employeeName}</span>
                      <div className="text-blue-400 font-mono text-[11px] font-semibold">{selectedLogDetail.employeeId}</div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Date Logged</span>
                      <span className="font-bold text-white text-sm">{selectedLogDetail.date}</span>
                      <div className="text-slate-400 font-mono text-[11px]">{selectedLogDetail.submittedAtFormatted}</div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Branch</span>
                      <span className="font-bold text-white text-sm">{selectedLogDetail.branch}</span>
                      <div className="text-emerald-400 font-semibold text-[11px]">Single-Day Verified</div>
                    </div>
                  </div>

                  {/* Quantities */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Splice Count</span>
                      <span className="text-2xl font-black text-amber-400">{selectedLogDetail.spliceCount}</span>
                      <span className="text-[10px] text-slate-500 ml-1">splices</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Overlash</span>
                      <span className="text-2xl font-black text-blue-400">{selectedLogDetail.overlashFt}</span>
                      <span className="text-xs text-blue-400 font-bold ml-1">FT</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Overpull</span>
                      <span className="text-2xl font-black text-indigo-400">{selectedLogDetail.overpullFt}</span>
                      <span className="text-xs text-indigo-400 font-bold ml-1">FT</span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Trench & Bore</span>
                      <span className="text-2xl font-black text-emerald-400">{selectedLogDetail.trenchBoreFt}</span>
                      <span className="text-xs text-emerald-400 font-bold ml-1">FT</span>
                    </div>
                  </div>

                  {/* Work Details Note & Compulsory Picture of Work */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Details of Work Submitted:
                        </span>
                        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap mt-1">
                          {selectedLogDetail.details || <span className="text-slate-500 italic text-xs">No additional details recorded.</span>}
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                        Audit Status: Anti-backdating locked • Verified Single Day Log
                      </div>
                    </div>

                    {/* Attached Site Photo - Prominent */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                          <Camera className="w-3.5 h-3.5 text-rose-400" />
                          <span>Compulsory Proof Photo:</span>
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">Attached</span>
                      </div>

                      {selectedLogDetail.photoUrl ? (
                        <div 
                          className="relative group cursor-pointer rounded-xl overflow-hidden border border-slate-700 shadow-md"
                          onClick={() => setActiveLightboxData({
                            url: selectedLogDetail.photoUrl,
                            title: `${selectedLogDetail.employeeName} - ${selectedLogDetail.projectName}`,
                            log: selectedLogDetail
                          })}
                        >
                          <img
                            src={selectedLogDetail.photoUrl}
                            alt="Proof of work"
                            className="w-full h-40 object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold space-x-1">
                            <Maximize2 className="w-4 h-4" />
                            <span>Enlarge in Lightbox</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 italic py-8 text-center">No photo on file.</div>
                      )}

                      {selectedLogDetail.photoUrl && (
                        <div className="flex items-center justify-between mt-2.5">
                          <button
                            type="button"
                            onClick={() => setTicketModalTab('photo')}
                            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            View in Big Tab →
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveLightboxData({
                              url: selectedLogDetail.photoUrl,
                              title: `${selectedLogDetail.employeeName} - ${selectedLogDetail.projectName}`,
                              log: selectedLogDetail
                            })}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded"
                          >
                            Full Lightbox
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* High-Res Big Tab View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-white">Full-Size Field Work Site Photo</span>
                      <span className="text-slate-500 font-mono">({selectedLogDetail.photoName || 'site_work_photo.jpg'})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveLightboxData({
                        url: selectedLogDetail.photoUrl,
                        title: `${selectedLogDetail.employeeName} - ${selectedLogDetail.projectName}`,
                        log: selectedLogDetail
                      })}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition flex items-center space-x-1.5 shadow-md shadow-blue-900/30"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Open Fullscreen Inspector</span>
                    </button>
                  </div>

                  {selectedLogDetail.photoUrl ? (
                    <div 
                      className="relative bg-black rounded-2xl border border-slate-800 p-2 sm:p-4 flex items-center justify-center min-h-[420px] max-h-[580px] overflow-hidden group cursor-zoom-in shadow-2xl"
                      onClick={() => setActiveLightboxData({
                        url: selectedLogDetail.photoUrl,
                        title: `${selectedLogDetail.employeeName} - ${selectedLogDetail.projectName}`,
                        log: selectedLogDetail
                      })}
                    >
                      <img
                        src={selectedLogDetail.photoUrl}
                        alt="High-resolution work site proof"
                        className="max-h-[540px] w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-200"
                      />
                      <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>Click to Zoom & Rotate</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-16 text-center text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
                      No photo attached to this job record.
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium">Logged By</span>
                      <span className="font-bold text-white">{selectedLogDetail.employeeName} ({selectedLogDetail.employeeId})</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium">Branch</span>
                      <span className="font-bold text-white">{selectedLogDetail.branch}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium">Date & Time</span>
                      <span className="font-bold text-white">{selectedLogDetail.date} • {selectedLogDetail.submittedAtFormatted}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium">Total Footage</span>
                      <span className="font-bold text-blue-400 font-mono">
                        {selectedLogDetail.overlashFt + selectedLogDetail.overpullFt + selectedLogDetail.trenchBoreFt} FT
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
                Anti-Backdating Verified • PlannEng Engineering. Inc
              </span>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold ml-auto"
              >
                Close Ticket
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

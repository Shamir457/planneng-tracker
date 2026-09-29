import React, { useState } from 'react';
import { User, WorkLog } from '../../types';
import { 
  History, 
  Lock, 
  Calendar, 
  CheckCircle2, 
  Briefcase, 
  Building2, 
  Binary, 
  Ruler, 
  Tractor, 
  FileText, 
  Search,
  ShieldCheck,
  AlertCircle,
  Camera,
  Eye,
  X,
  Maximize2
} from 'lucide-react';
import { PhotoLightboxModal, PhotoLightboxData } from '../PhotoLightboxModal';

interface WeeklyHistoryViewProps {
  currentUser: User;
  logs: WorkLog[];
}

export const WeeklyHistoryView: React.FC<WeeklyHistoryViewProps> = ({
  currentUser,
  logs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  // Filter logs for this employee for the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  oneWeekAgo.setHours(0, 0, 0, 0);

  const weeklyLogs = logs.filter(l => {
    const isThisEmployee = l.employeeId.toUpperCase() === currentUser.employeeId.toUpperCase();
    const logDate = new Date(l.date + 'T23:59:59');
    const withinWeek = logDate >= oneWeekAgo;
    return isThisEmployee && withinWeek;
  });

  // Calculate weekly metrics
  const totalSplices = weeklyLogs.reduce((sum, l) => sum + (l.spliceCount || 0), 0);
  const totalOverlash = weeklyLogs.reduce((sum, l) => sum + (l.overlashFt || 0), 0);
  const totalOverpull = weeklyLogs.reduce((sum, l) => sum + (l.overpullFt || 0), 0);
  const totalTrenchBore = weeklyLogs.reduce((sum, l) => sum + (l.trenchBoreFt || 0), 0);
  const totalFootage = totalOverlash + totalOverpull + totalTrenchBore;

  // Search filter
  const filteredLogs = weeklyLogs.filter(l => 
    l.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.date.includes(searchTerm)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">
                Personal Submission History
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Last 7 Days (Weekly Window)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified submission record for <span className="text-slate-200 font-semibold">{currentUser.name}</span> ({currentUser.employeeId})
            </p>
          </div>
        </div>

        {/* Read-Only Lock Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Read-Only View • Edits Prohibited</span>
        </div>
      </div>

      {/* Weekly Totals KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block">Jobs Logged</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-white">{weeklyLogs.length}</span>
            <span className="text-xs text-slate-500">entries</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block flex items-center space-x-1">
            <Binary className="w-3.5 h-3.5 text-amber-400" />
            <span>Splices</span>
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-amber-400">{totalSplices}</span>
            <span className="text-xs text-slate-500">splices</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block flex items-center space-x-1">
            <Ruler className="w-3.5 h-3.5 text-blue-400" />
            <span>Overlash</span>
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-blue-400">{totalOverlash}</span>
            <span className="text-xs text-blue-400 font-mono font-bold">FT</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block flex items-center space-x-1">
            <Ruler className="w-3.5 h-3.5 text-indigo-400" />
            <span>Overpull</span>
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-indigo-400">{totalOverpull}</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">FT</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-medium block flex items-center space-x-1">
            <Tractor className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trench & Bore</span>
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-black text-emerald-400">{totalTrenchBore}</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">FT</span>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Total linear footage delivered this week: <strong className="text-slate-200">{totalFootage} FT</strong> (Overlash + Overpull + Trench & Bore).
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
          Policy: 1 Day At A Time / Anti-Tamper Enabled
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter your weekly logs by project, branch, or keywords..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No submissions recorded for this period</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm 
              ? 'No jobs match your search filter.' 
              : 'You have not submitted any daily work reports in the past 7 days yet. Use the "Submit Daily Work" tab to log today\'s tasks.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const dateObj = new Date(log.date + 'T12:00:00');
            const dayFormatted = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={log.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition space-y-4"
              >
                {/* Top Row: Date, Project, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-lg border border-blue-800/40">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dayFormatted}</span>
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Logged at {log.submittedAtFormatted}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5 flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>{log.projectName}</span>
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.branch}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Saved</span>
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                {log.isPageSetOnly ? (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/30 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-5 h-5 text-amber-400" />
                      <div>
                        <span className="font-bold text-white text-xs sm:text-sm">Page Set Drawing Created</span>
                        <span className="text-[11px] text-amber-300/80 block">
                          {log.pageSetCount || 1} Sheet(s) • Zero Construction Quantities • Page Set Drawing Attached
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Page Set Only
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Splice
                      </span>
                      <span className="text-lg font-black text-amber-400">{log.spliceCount}</span>
                      <span className="text-[10px] text-slate-500 ml-1">numbers</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Overlash
                      </span>
                      <span className="text-lg font-black text-blue-400">{log.overlashFt}</span>
                      <span className="text-[10px] text-blue-400 font-mono ml-1 font-bold">FT</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Overpull
                      </span>
                      <span className="text-lg font-black text-indigo-400">{log.overpullFt}</span>
                      <span className="text-[10px] text-indigo-400 font-mono ml-1 font-bold">FT</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Trench & Bore
                      </span>
                      <span className="text-lg font-black text-emerald-400">{log.trenchBoreFt}</span>
                      <span className="text-[10px] text-emerald-400 font-mono ml-1 font-bold">FT</span>
                    </div>
                  </div>
                )}

                {/* Details & Proof Photo Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  <div className="md:col-span-3 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Details of Work:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {log.details || <span className="text-slate-500 italic">No additional notes provided.</span>}
                    </p>
                  </div>

                  {/* Compulsory Proof Photo Thumbnail */}
                  <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center space-x-1">
                      <Camera className="w-3 h-3 text-blue-400" />
                      <span>Work Picture:</span>
                    </span>
                    {log.photoUrl ? (
                      <div 
                        className="relative group cursor-pointer" 
                        onClick={() => setActiveLightboxData({
                          url: log.photoUrl,
                          title: `${log.projectName} (${log.date})`,
                          log
                        })}
                      >
                        <img
                          src={log.photoUrl}
                          alt="Work proof"
                          className="w-full h-20 object-cover rounded-lg border border-slate-700 group-hover:opacity-90 transition"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition text-white text-[11px] font-bold space-x-1">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Enlarge</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 italic py-2">No photo attached</div>
                    )}
                  </div>
                </div>

                {/* Immutability Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>PlannEng Immutable Log #{log.id} • Editing disabled</span>
                  </span>
                  <span className="font-mono text-[10px]">
                    Total: {log.overlashFt + log.overpullFt + log.trenchBoreFt} FT
                  </span>
                </div>

              </div>
            );
          })}
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

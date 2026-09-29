import React, { useState, useRef } from 'react';
import { User, WorkLog, BranchInfo } from '../../types';
import { storageService, getTodayDateString } from '../../services/storage';
import { 
  Calendar, 
  Lock, 
  Building2, 
  User as UserIcon, 
  Briefcase, 
  Binary, 
  Ruler, 
  Tractor, 
  FileEdit, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  Check,
  Maximize2,
  FileText
} from 'lucide-react';
import { PhotoLightboxModal, PhotoLightboxData } from '../PhotoLightboxModal';

const PRESET_WORK_PHOTOS = [
  {
    title: 'Engineering Page Set Drawing',
    tag: 'Page Set',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    filename: 'telecom_route_page_set.jpg',
  },
  {
    title: 'CAD Route Schematic Page Set',
    tag: 'Page Set',
    url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    filename: 'cad_fiber_schematic_page_set.jpg',
  },
  {
    title: 'Fiber Splice Enclosure',
    tag: 'Splice',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    filename: 'fusion_splice_tray.jpg',
  },
  {
    title: 'Aerial Span & Overlash',
    tag: 'Overlash',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    filename: 'pole_aerial_overlash.jpg',
  },
  {
    title: 'Directional Bore & Trench',
    tag: 'Trench & Bore',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    filename: 'conduit_directional_bore.jpg',
  },
  {
    title: 'Cable Pulling & Vault Demarc',
    tag: 'Overpull',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    filename: 'vault_pull_demarcation.jpg',
  },
];

interface DailyWorkFormProps {
  currentUser: User;
  branches: BranchInfo[];
  onLogSubmitted: (newLog: WorkLog) => void;
  todayLog?: WorkLog;
}

export const DailyWorkForm: React.FC<DailyWorkFormProps> = ({
  currentUser,
  branches,
  onLogSubmitted,
  todayLog,
}) => {
  // Today's locked date information
  const todayStr = getTodayDateString();
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Form State
  const [selectedBranch, setSelectedBranch] = useState(currentUser.branch || branches[0]?.name || 'Karachi');
  const [projectName, setProjectName] = useState('');
  const [isPageSetOnly, setIsPageSetOnly] = useState(false);
  const [pageSetCount, setPageSetCount] = useState<number | ''>(1);
  const [spliceCount, setSpliceCount] = useState<number | ''>('');
  const [overlashFt, setOverlashFt] = useState<number | ''>('');
  const [overpullFt, setOverpullFt] = useState<number | ''>('');
  const [trenchBoreFt, setTrenchBoreFt] = useState<number | ''>('');
  const [details, setDetails] = useState('');

  // Compulsory Photo State
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allowAdditionalJob, setAllowAdditionalJob] = useState(false);

  // Quick project suggestions
  const suggestedProjects = [
    'Metro Fiber Backbone Loop #4',
    'Downtown Commercial FTTH Overlash',
    'Industrial Park Trench & Directional Bore',
    'OSP Highway Lateral Overpull Span',
    'Substation SCADA Optical Splice Tie-In',
  ];

  const totalFootage = (Number(overlashFt) || 0) + (Number(overpullFt) || 0) + (Number(trenchBoreFt) || 0);

  // Handle local file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
        setPhotoName(file.name);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPhotoDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setPhotoUrl(event.target.result);
          setPhotoName(file.name);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!projectName.trim()) {
      setErrorMessage('Please enter the project name.');
      return;
    }

    const numSplice = Number(spliceCount) || 0;
    const numOverlash = Number(overlashFt) || 0;
    const numOverpull = Number(overpullFt) || 0;
    const numTrench = Number(trenchBoreFt) || 0;

    // If NOT page set only, verify that at least one output quantity is filled
    if (!isPageSetOnly && numSplice === 0 && numOverlash === 0 && numOverpull === 0 && numTrench === 0) {
      setErrorMessage('Please enter at least one quantity for Splice, Overlash (FT), Overpull (FT), or Trench & Bore (FT). If you only created a Page Set without field construction, click "Did Page Set Only?".');
      return;
    }

    // Compulsory picture validation - Page Set drawing or site work picture is strictly required!
    if (!photoUrl || !photoUrl.trim()) {
      setErrorMessage(isPageSetOnly
        ? 'Page Set image is strictly compulsory! Please take a photo with your device camera or upload your page set drawing.'
        : 'A picture of work is compulsory! Please take a photo with your device camera or upload a site image.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = storageService.submitDailyWork({
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        employeeUsername: currentUser.username,
        branch: selectedBranch,
        projectName: projectName.trim(),
        spliceCount: numSplice,
        overlashFt: numOverlash,
        overpullFt: numOverpull,
        trenchBoreFt: numTrench,
        details: isPageSetOnly 
          ? (details.trim() ? `[Page Set: ${pageSetCount || 1} Sheet(s)] ${details.trim()}` : `[Page Set: ${pageSetCount || 1} Sheet(s)] Completed page set engineering design.`)
          : details.trim(),
        photoUrl: photoUrl.trim(),
        photoName: photoName || (isPageSetOnly ? 'page_set_drawing.jpg' : 'field_work_photo.jpg'),
        isPageSetOnly,
        pageSetCount: isPageSetOnly ? Math.max(1, Number(pageSetCount) || 1) : 0,
      });

      setIsSubmitting(false);

      if (result.success && result.log) {
        setSuccessMessage(isPageSetOnly
          ? `Page Set successfully logged for ${formattedToday} at ${result.log.submittedAtFormatted}! Compulsory page set drawing image verified and saved.`
          : `Daily work successfully logged for ${formattedToday} at ${result.log.submittedAtFormatted}! Proof photo and quantities recorded into PlannEng database.`);
        // Reset inputs
        setProjectName('');
        setSpliceCount('');
        setOverlashFt('');
        setOverpullFt('');
        setTrenchBoreFt('');
        setDetails('');
        setPhotoUrl('');
        setPhotoName('');
        setIsPageSetOnly(false);
        setPageSetCount(1);
        setAllowAdditionalJob(false);

        onLogSubmitted(result.log);
      } else {
        setErrorMessage(result.error || 'Failed to submit daily work. Please retry.');
      }
    }, 350);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Date Banner - Anti Backdating Guarantee */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-800/40 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Active Work Date (System Locked)
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Cannot Be Backdated</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {formattedToday}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                ISO Record Date: <span className="text-blue-300">{todayStr}</span> • Daily Single-Day Enforcement
              </p>
            </div>
          </div>

          <div className="sm:text-right bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 w-full sm:w-auto">
            <div className="text-[11px] font-semibold text-slate-400">Authenticated Field Staff</div>
            <div className="text-sm font-bold text-slate-100">{currentUser.name}</div>
            <div className="text-xs text-blue-400 font-mono">ID: {currentUser.employeeId}</div>
          </div>
        </div>
      </div>

      {/* Already Submitted Today Notification */}
      {todayLog && !allowAdditionalJob && (
        <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Today's Daily Work Already Submitted!
                </h3>
                <p className="text-xs text-slate-400">
                  Logged at <span className="text-emerald-400 font-bold">{todayLog.submittedAtFormatted}</span> on {todayLog.date}.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Verified Submission
            </span>
          </div>

          {/* Quick breakdown of today's submission */}
          {todayLog.isPageSetOnly ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-600/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Page Set Created</span>
                  <span className="text-xs text-amber-300">
                    {todayLog.pageSetCount || 1} Sheet(s) • Page Set Image Verified • No Field Output Quantities Required
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Page Set Only
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">Splice Count</span>
                <span className="text-lg font-black text-amber-400">{todayLog.spliceCount}</span>
                <span className="text-[10px] text-slate-500 ml-1">numbers</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">Overlash</span>
                <span className="text-lg font-black text-blue-400">{todayLog.overlashFt}</span>
                <span className="text-[10px] text-slate-500 ml-1">FT</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">Overpull</span>
                <span className="text-lg font-black text-indigo-400">{todayLog.overpullFt}</span>
                <span className="text-[10px] text-slate-500 ml-1">FT</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">Trench & Bore</span>
                <span className="text-lg font-black text-emerald-400">{todayLog.trenchBoreFt}</span>
                <span className="text-[10px] text-slate-500 ml-1">FT</span>
              </div>
            </div>
          )}

          {/* Project Details and Proof Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-slate-300 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-slate-200">Project:</span> {todayLog.projectName} ({todayLog.branch})
                <div className="mt-1 text-slate-400 italic">
                  {todayLog.details ? `"${todayLog.details}"` : 'No additional notes provided.'}
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-500 font-mono">
                Log ID: #{todayLog.id}
              </div>
            </div>

            {/* Attached Photo */}
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 flex items-center space-x-3">
              {todayLog.photoUrl ? (
                <>
                  <img
                    src={todayLog.photoUrl}
                    alt="Proof of work"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-700 shrink-0 cursor-pointer hover:opacity-90 transition"
                    onClick={() => setActiveLightboxData({ 
                      url: todayLog.photoUrl, 
                      title: `${todayLog.projectName} Proof Photo`,
                      log: todayLog
                    })}
                  />
                  <div className="text-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center space-x-1">
                      <Camera className="w-3 h-3 text-emerald-400" />
                      <span>Proof Attached</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveLightboxData({ 
                        url: todayLog.photoUrl, 
                        title: `${todayLog.projectName} Proof Photo`,
                        log: todayLog
                      })}
                      className="text-[11px] text-blue-400 hover:text-blue-300 underline font-semibold mt-0.5 block"
                    >
                      Enlarge Picture
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500 italic">No picture on file.</div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PlannEng rules ensure previous submissions cannot be edited to protect billing integrity.</span>
            </p>
            <button
              type="button"
              onClick={() => setAllowAdditionalJob(true)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              + Log Additional Project Segment for Today
            </button>
          </div>
        </div>
      )}

      {/* Main Submission Form */}
      {(!todayLog || allowAdditionalJob) && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          
          <div className="p-6 border-b border-slate-800 bg-slate-900/90">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileEdit className="w-5 h-5 text-blue-400" />
              <span>Submit Daily Work Form</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your branch, verify employee name, enter project title, and record daily splice count and footage.
            </p>
          </div>

          <div className="p-6 space-y-6">

            {/* Error & Success alerts */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-700 text-rose-200 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div className="font-medium">{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="font-medium">{successMessage}</div>
              </div>
            )}

            {/* Step 1 & Step 2: Branch and Employee Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Branch Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>1. Select Branch <span className="text-rose-400">*</span></span>
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white outline-none transition"
                  required
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.location})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Designated branch depot or field region.
                </span>
              </div>

              {/* Employee Name (Auto populated & verified) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center space-x-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>2. Employee Name <span className="text-emerald-400">(Verified)</span></span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`${currentUser.name} (${currentUser.employeeId})`}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 cursor-not-allowed outline-none select-none"
                  />
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-600/40 rounded-xl text-emerald-400" title="Authenticated Employee ID">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Logged in as {currentUser.title}
                </span>
              </div>

            </div>

            {/* Step 3: Project Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>3. Project Name <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Metro Fiber Expansion Phase 4, Downtown Conduit Trenching..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
                required
              />

              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Quick project suggestions:</span>
                </span>
                {suggestedProjects.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProjectName(p)}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-md border border-slate-700 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Work Specification Values & Page Set Mode */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-blue-400" />
                    <span>4. Work Output Quantities</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isPageSetOnly
                      ? 'Page Set Only mode active: Quantities can be left at 0. Page Set image is compulsory below.'
                      : 'Enter Splice (in numbers), Overlash (FT), Overpull (FT), and Trench & Bore (FT)'}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Page Set Only Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isPageSetOnly;
                      setIsPageSetOnly(next);
                      if (next) {
                        setSpliceCount('');
                        setOverlashFt('');
                        setOverpullFt('');
                        setTrenchBoreFt('');
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 border shadow-sm ${
                      isPageSetOnly
                        ? 'bg-amber-600 text-white border-amber-500 shadow-amber-900/40 ring-2 ring-amber-500/30'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-500/60 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isPageSetOnly ? '✓ Page Set Only Active' : 'Did Page Set Only?'}</span>
                  </button>

                  <div className="text-right pl-2 border-l border-slate-800 hidden sm:block">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Footage</span>
                    <span className="text-sm font-extrabold text-blue-400">{totalFootage} FT</span>
                  </div>
                </div>
              </div>

              {/* Informative banner when Page Set Only is selected */}
              {isPageSetOnly && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 animate-in fade-in duration-200">
                  <div className="flex items-start space-x-2.5">
                    <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Page Set Only Submission:</span> You can submit without filling Splice, Overlash, Overpull, or Trench/Bore quantities.
                      <div className="text-[11px] text-amber-400/80 mt-0.5">
                        <strong className="underline">Strictly Compulsory</strong>: Upload or capture the Page Set drawing/schematic in Step 6 below.
                      </div>
                    </div>
                  </div>

                  {/* Page count input */}
                  <div className="flex items-center space-x-2 shrink-0 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-amber-600/30">
                    <span className="text-[11px] font-semibold text-slate-300">Pages / Sheets:</span>
                    <input
                      type="number"
                      min="1"
                      value={pageSetCount}
                      onChange={(e) => setPageSetCount(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-xs font-mono font-bold text-amber-300 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Splice (in numbers) */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                      <Binary className="w-3.5 h-3.5 text-amber-400" />
                      <span>Splice</span>
                    </label>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      Numbers
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={spliceCount}
                      onChange={(e) => setSpliceCount(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="e.g. 48"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg text-sm text-white font-mono placeholder-slate-700 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                    <span>Quick:</span>
                    <div className="space-x-1">
                      {[12, 24, 48, 72].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setSpliceCount(num)}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-amber-900/50 hover:text-amber-200 rounded text-slate-400 transition"
                        >
                          +{num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Overlash (in feet) */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/40 transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                      <Ruler className="w-3.5 h-3.5 text-blue-400" />
                      <span>Overlash</span>
                    </label>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      FT
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={overlashFt}
                      onChange={(e) => setOverlashFt(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="e.g. 150"
                      className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-white font-mono placeholder-slate-700 outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-blue-400 pointer-events-none">
                      FT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    Aerial cable lashing distance.
                  </span>
                </div>

                {/* Overpull (in feet) */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                      <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Overpull</span>
                    </label>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      FT
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={overpullFt}
                      onChange={(e) => setOverpullFt(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="e.g. 200"
                      className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-white font-mono placeholder-slate-700 outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-indigo-400 pointer-events-none">
                      FT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    Conduit / slack cable pulling.
                  </span>
                </div>

                {/* Trench & Bore (in feet) */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                      <Tractor className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Trench & Bore</span>
                    </label>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      FT
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={trenchBoreFt}
                      onChange={(e) => setTrenchBoreFt(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="e.g. 150"
                      className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg text-sm text-white font-mono placeholder-slate-700 outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-emerald-400 pointer-events-none">
                      FT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    Underground directional or open cut.
                  </span>
                </div>

              </div>
            </div>

            {/* Step 5: Details of Work (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center space-x-1.5">
                <FileEdit className="w-3.5 h-3.5 text-blue-400" />
                <span>5. Details of Work <span className="text-slate-500 font-normal normal-case">(Optional)</span></span>
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Optional details: vault/pedestal #, splice tray designations, fiber buffer tube colors, conduit sizes, equipment used, safety inspections, crew members..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition"
              />
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                <span>Optional technical details or notes regarding today's work.</span>
                <span>{details.length} chars</span>
              </div>
            </div>

            {/* Step 6: Picture of Work (Compulsory) */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border-2 border-dashed border-blue-500/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-rose-400" />
                      <span>{isPageSetOnly ? '6. Page Set Drawing / Schematic Image' : '6. Picture of Work'}</span>
                      <span className="text-rose-400 font-extrabold text-base leading-none">*</span>
                    </label>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                      {isPageSetOnly ? 'Compulsory Page Set Proof' : 'Compulsory Proof of Work'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {isPageSetOnly
                      ? 'PlannEng requires one clear photograph or scan of your completed Page Set drawing / route schematic.'
                      : 'PlannEng requires one site photograph showing the completed work (splice tray, aerial span, or bore line).'}
                  </p>
                </div>

                {photoUrl && (
                  <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-600/40">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Photo Attached</span>
                  </span>
                )}
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* If no photo chosen yet: show upload dropzone & camera trigger */}
              {!photoUrl ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsPhotoDragging(true); }}
                  onDragLeave={() => setIsPhotoDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                    isPhotoDragging
                      ? 'border-blue-400 bg-blue-950/40'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3">
                    <Camera className="w-6 h-6 text-blue-400" />
                  </div>

                  <h5 className="text-sm font-bold text-white">
                    Capture or Upload Today's Work Picture
                  </h5>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Take a picture using your device camera or upload a site inspection photo from your gallery.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-900/30 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo (Camera)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center space-x-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>Choose From Files</span>
                    </button>
                  </div>

                  {/* Quick field preset photos for fast testing */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Or select a field site template picture:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_WORK_PHOTOS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPhotoUrl(preset.url);
                            setPhotoName(preset.filename);
                            setErrorMessage(null);
                          }}
                          className="group p-2 rounded-xl bg-slate-900 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-600/60 transition text-left cursor-pointer flex flex-col items-center"
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-16 object-cover rounded-lg mb-1.5 group-hover:scale-105 transition"
                          />
                          <span className="text-[10px] font-bold text-slate-300 text-center leading-tight line-clamp-1">
                            {preset.title}
                          </span>
                          <span className="text-[9px] text-blue-400 font-mono mt-0.5">
                            {preset.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Photo is selected: Active preview card */
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5 w-full sm:w-auto">
                    <div className="relative group shrink-0">
                      <img
                        src={photoUrl}
                        alt="Work site proof"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-700 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setActiveLightboxData({ 
                          url: photoUrl, 
                          title: photoName || 'Proof of Work',
                          employeeName: currentUser.name,
                          employeeId: currentUser.employeeId,
                          branch: selectedBranch,
                          projectName: projectName || 'Work In Progress',
                        })}
                        className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl text-white transition text-xs font-bold space-x-1"
                        title="Zoom Image"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-emerald-300">Picture Verified & Ready</span>
                      </div>
                      <div className="text-xs font-mono text-white truncate max-w-xs sm:max-w-md font-semibold">
                        {photoName || 'site_work_photo.jpg'}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Will be permanently tied to today's log #{currentUser.employeeId}-{todayStr}.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-stretch sm:self-center justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveLightboxData({ 
                        url: photoUrl, 
                        title: photoName || 'Proof of Work',
                        employeeName: currentUser.name,
                        employeeId: currentUser.employeeId,
                        branch: selectedBranch,
                        projectName: projectName || 'Work In Progress',
                      })}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>View Full</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      Change
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl('');
                        setPhotoName('');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-950/40 rounded-lg border border-slate-700 hover:border-rose-700/50 transition cursor-pointer"
                      title="Remove picture"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submission Policy Notice */}
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200/90 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-blue-300">PlannEng Quality & Compliance Notice:</span> By clicking "Submit Daily Work", your submission including your compulsory work picture will be time-stamped for today ({formattedToday}). Once stored in the database, historical logs cannot be modified or altered by employee accounts.
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-extrabold text-sm sm:text-base tracking-wide transition shadow-xl shadow-blue-900/30 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Daily Work (With Proof Picture)</span>
                </>
              )}
            </button>

          </div>

        </form>
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

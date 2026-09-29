import React, { useState, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Download, 
  Calendar, 
  Building2, 
  User, 
  Binary, 
  Ruler, 
  Tractor, 
  FileText, 
  CheckCircle2,
  Info,
  ShieldCheck,
  Camera
} from 'lucide-react';
import { WorkLog } from '../types';

export interface PhotoLightboxData {
  url: string;
  title: string;
  log?: WorkLog;
  employeeName?: string;
  employeeId?: string;
  projectName?: string;
  date?: string;
  time?: string;
  branch?: string;
  spliceCount?: number;
  overlashFt?: number;
  overpullFt?: number;
  trenchBoreFt?: number;
  details?: string;
}

interface PhotoLightboxModalProps {
  data: PhotoLightboxData | null;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({ data, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [showDetailsPanel, setShowDetailsPanel] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Reset zoom and rotation whenever a new photo opens
  useEffect(() => {
    if (data) {
      setZoomLevel(1);
      setRotation(0);
      setShowDetailsPanel(true);
    }
  }, [data]);

  // Keyboard shortcut support: Esc to close, + to zoom, - to zoom out, r to rotate
  useEffect(() => {
    if (!data) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel(prev => Math.min(3, prev + 0.25));
      } else if (e.key === '-' || e.key === '_') {
        setZoomLevel(prev => Math.max(0.5, prev - 0.25));
      } else if (e.key === 'r' || e.key === 'R') {
        setRotation(prev => (prev + 90) % 360);
      } else if (e.key === '0') {
        setZoomLevel(1);
        setRotation(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, onClose]);

  if (!data) return null;

  // Extract info from log if provided or from individual props
  const employeeName = data.log?.employeeName || data.employeeName || 'Technician';
  const employeeId = data.log?.employeeId || data.employeeId || 'PE-STAFF';
  const projectName = data.log?.projectName || data.projectName || data.title;
  const date = data.log?.date || data.date || 'Today';
  const time = data.log?.submittedAtFormatted || data.time || '';
  const branch = data.log?.branch || data.branch || 'Field Operations';
  const spliceCount = data.log?.spliceCount ?? data.spliceCount ?? 0;
  const overlashFt = data.log?.overlashFt ?? data.overlashFt ?? 0;
  const overpullFt = data.log?.overpullFt ?? data.overpullFt ?? 0;
  const trenchBoreFt = data.log?.trenchBoreFt ?? data.trenchBoreFt ?? 0;
  const totalFt = overlashFt + overpullFt + trenchBoreFt;
  const details = data.log?.details || data.details || '';

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `PlannEng_Site_Photo_${employeeId}_${date}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(data.url, '_blank');
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(3, Number((prev + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.5, Number((prev - 0.25).toFixed(2))));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md transition-all animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-slate-700/80 rounded-2xl w-[98vw] max-w-7xl h-[94vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Field Photo Inspection
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-semibold text-slate-300 truncate font-mono">
                  {employeeId} ({employeeName})
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                {projectName}
              </h3>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 space-x-1 text-slate-300">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition disabled:opacity-40"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2 py-1 text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Reset zoom to 100%"
              >
                {Math.round(zoomLevel * 100)}%
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition disabled:opacity-40"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-px h-4 bg-slate-800 my-auto" />

              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Rotate 90° (R)"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Info Panel */}
            <button
              type="button"
              onClick={() => setShowDetailsPanel(prev => !prev)}
              className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center space-x-1.5 ${
                showDetailsPanel 
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Ticket Details Panel"
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">Job Details</span>
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
              title="Download High-Res Photo"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:border-rose-800 border border-slate-700 text-slate-300 hover:text-rose-300 transition"
              title="Close Viewer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area: Large Image Viewport + Optional Details Panel */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-black">
          
          {/* Main Visual Canvas: Huge & Clearly Rendered */}
          <div className="flex-1 relative flex items-center justify-center overflow-auto p-4 sm:p-6 bg-slate-950/90 select-none">
            
            {/* Visual Viewport with Interactive Scaling and Rotation */}
            <div 
              className="relative max-w-full max-h-full transition-transform duration-200 ease-out flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={data.url}
                alt={projectName}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-slate-800/80 cursor-zoom-in"
                onClick={handleZoomIn}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating Zoom & Controls HUD on Mobile */}
            <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-xl p-1.5 space-x-2 text-white shadow-xl z-20">
              <button onClick={handleZoomOut} className="p-1 hover:text-blue-400">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold px-1">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:text-blue-400">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={handleRotate} className="p-1 hover:text-blue-400">
                <RotateCw className="w-4 h-4" />
              </button>
              <button onClick={handleResetZoom} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                Reset
              </button>
            </div>

            {/* Verification Stamp Overlay */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none hidden sm:flex items-center space-x-2 bg-slate-950/80 border border-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-slate-300 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PlannEng Compulsory Proof of Work</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-emerald-400 font-bold">Tamper Verified</span>
            </div>

          </div>

          {/* Collapsible Inspector Drawer: Complete Job Metrics & Notes */}
          {showDetailsPanel && (
            <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 overflow-y-auto shrink-0 flex flex-col justify-between text-xs space-y-4">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Job Specification Data</span>
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    Live Record
                  </span>
                </div>

                {/* Technician Profile Card */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{employeeName}</div>
                      <div className="text-xs text-blue-400 font-mono font-semibold">{employeeId}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block font-medium">Branch</span>
                      <span className="text-slate-300 font-semibold">{branch}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-medium">Date & Time</span>
                      <span className="text-slate-300 font-semibold">{date} {time ? `• ${time}` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Verified Quantities */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Reported Quantities
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Binary className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-medium">Splice Count</span>
                      </div>
                      <div className="mt-1 font-mono font-black text-lg text-amber-400">
                        {spliceCount} <span className="text-[10px] text-slate-500 font-normal">splices</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Ruler className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-medium">Overlash</span>
                      </div>
                      <div className="mt-1 font-mono font-black text-lg text-blue-400">
                        {overlashFt} <span className="text-[10px] text-blue-400 font-bold">FT</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-medium">Overpull</span>
                      </div>
                      <div className="mt-1 font-mono font-black text-lg text-indigo-400">
                        {overpullFt} <span className="text-[10px] text-indigo-400 font-bold">FT</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Tractor className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-medium">Trench & Bore</span>
                      </div>
                      <div className="mt-1 font-mono font-black text-lg text-emerald-400">
                        {trenchBoreFt} <span className="text-[10px] text-emerald-400 font-bold">FT</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 p-2.5 bg-blue-950/40 rounded-xl border border-blue-900/50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-blue-300">Total Installed Footage:</span>
                    <span className="font-mono font-black text-sm text-white">{totalFt.toLocaleString()} FT</span>
                  </div>
                </div>

                {/* Technician Work Notes */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Technician Work Notes
                  </span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                    {details ? (
                      <p className="whitespace-pre-wrap">{details}</p>
                    ) : (
                      <p className="text-slate-500 italic">No additional field notes attached to this entry.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center justify-center space-x-1.5 shadow-md shadow-blue-900/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold transition"
                >
                  Close
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Status Ribbon */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300">High-Resolution Field Audit View</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-500">Shortcuts: [+] Zoom In, [-] Zoom Out, [R] Rotate, [Esc] Close</span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400 font-mono text-[10px]">
            <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            <span>Rotation: {rotation}°</span>
            <span>Status: Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
};

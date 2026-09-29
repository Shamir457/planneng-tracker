import React, { useState } from 'react';
import { BranchInfo, User } from '../../types';
import { storageService } from '../../services/storage';
import { 
  Building2, 
  Plus, 
  Trash2, 
  X, 
  MapPin, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Check, 
  ShieldCheck,
  Globe
} from 'lucide-react';

interface BranchManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: BranchInfo[];
  employees: User[];
  onBranchesUpdated: () => void;
}

export const BranchManagementModal: React.FC<BranchManagementModalProps> = ({
  isOpen,
  onClose,
  branches,
  employees,
  onBranchesUpdated,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto-generate 3-letter uppercase code from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!code || code.length <= 4) {
      const generated = val.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
      setCode(generated);
    }
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Branch name is required.');
      return;
    }

    const res = storageService.addBranch({
      name: name.trim(),
      code: code.trim().toUpperCase() || undefined,
      location: location.trim() || undefined,
    });

    if (res.success && res.branch) {
      setSuccessMessage(`Branch "${res.branch.name}" (${res.branch.code}) successfully created!`);
      setName('');
      setCode('');
      setLocation('');
      onBranchesUpdated();
    } else {
      setErrorMessage(res.error || 'Failed to add branch.');
    }
  };

  const handleDeleteBranch = (branchId: string, branchName: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = storageService.deleteBranch(branchId);
    if (res.success) {
      setSuccessMessage(`Branch "${branchName}" removed successfully.`);
      setConfirmDeleteId(null);
      onBranchesUpdated();
    } else {
      setErrorMessage(res.error || 'Failed to delete branch.');
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Manage Branches</span>
                <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  {branches.length} Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure regional branch divisions for employee assignments and work logging
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs sm:text-sm flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs sm:text-sm flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Add Branch Form */}
          <div className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Add New Branch</span>
            </h3>

            <form onSubmit={handleAddBranch} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Branch Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Branch Name <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Lahore, Rawalpindi, Peshawar"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-white placeholder-slate-600 outline-none transition"
                    required
                  />
                </div>

                {/* Branch Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Code (Short)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. LHR"
                    maxLength={5}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-blue-400 font-mono font-bold uppercase placeholder-slate-600 outline-none transition"
                  />
                </div>
              </div>

              {/* Location / Territory */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Location / Region Description
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Gulberg, Lahore, Punjab"
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg text-sm text-white placeholder-slate-600 outline-none transition"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-bold transition shadow-md shadow-blue-900/40 flex items-center space-x-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Branch</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Current Branches Directory */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Current Configured Branches</span>
            </h3>

            <div className="space-y-2.5">
              {branches.map((b) => {
                const empCount = employees.filter(
                  e => e.branch.toLowerCase() === b.name.toLowerCase()
                ).length;
                const isKarachiOrIslamabad = ['karachi', 'islamabad'].includes(b.name.toLowerCase());

                return (
                  <div
                    key={b.id}
                    className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
                        {b.code || b.name.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{b.name}</span>
                          <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {b.code}
                          </span>
                          {isKarachiOrIslamabad && (
                            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{b.location}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center space-x-1 text-slate-300">
                            <Users className="w-3 h-3 text-blue-400" />
                            <span>{empCount} {empCount === 1 ? 'Employee' : 'Employees'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete action */}
                    <div>
                      {confirmDeleteId === b.id ? (
                        <div className="flex items-center space-x-1 bg-rose-950/80 p-1 rounded-lg border border-rose-800">
                          <button
                            type="button"
                            onClick={() => handleDeleteBranch(b.id, b.name)}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 text-slate-300 hover:text-white text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (empCount > 0) {
                              setErrorMessage(`Cannot delete "${b.name}" branch because ${empCount} employee(s) are assigned to it. Reassign employees first.`);
                            } else if (branches.length <= 1) {
                              setErrorMessage('At least one branch must remain in the system.');
                            } else {
                              setConfirmDeleteId(b.id);
                            }
                          }}
                          disabled={branches.length <= 1}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                          title={empCount > 0 ? `${empCount} employees assigned` : 'Delete branch'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All branch changes immediately sync across employee forms and filters.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

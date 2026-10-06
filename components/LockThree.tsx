"use client";

import React, { useState, useEffect } from 'react';
import { SecurityCore, type SecurityStatus } from './SecurityCore';

interface MalwareFile {
  id: string;
  name: string;
  type: string;
  size: string;
  source: string;
  downloadedAt: string;
  signature: string;
  origin: string;
  description: string;
  isMalicious: boolean;
}

interface LockThreeProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onSuccess: () => void;
  currentLock: number;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  onStatusChange?: (status: SecurityStatus) => void;
}

const MALWARE_FILES: MalwareFile[] = [
  {
    id: '1',
    name: 'Resume.pdf',
    type: 'PDF Document',
    size: '1.8 MB',
    source: 'VBIT Career Portal',
    downloadedAt: 'Today — 09:14 AM',
    signature: 'Verified',
    origin: 'Internal Portal',
    description: 'Student resume downloaded from the official college career portal.',
    isMalicious: false,
  },
  {
    id: '2',
    name: 'Campus_Event_Photos.jpg',
    type: 'JPEG Image',
    size: '4.2 MB',
    source: 'VBIT Events Portal',
    downloadedAt: 'Today — 10:32 AM',
    signature: 'Not Applicable',
    origin: 'Internal Portal',
    description: 'Event photograph downloaded from the official college events portal.',
    isMalicious: false,
  },
  {
    id: '3',
    name: 'Internship_Offer.pdf.exe',
    type: 'Windows Executable',
    size: '620 KB',
    source: 'VBIT Placement Office',
    downloadedAt: 'Today — 11:08 AM',
    signature: 'Verified',
    origin: 'Internal Portal',
    description: 'The filename appears unusual. The file claims to be an internship offer, but its actual executable type should be investigated.',
    isMalicious: false,
  },
  {
    id: '4',
    name: 'Salary_Update.exe',
    type: 'Windows Executable',
    size: '86 KB',
    source: 'Unknown Sender',
    downloadedAt: 'Today — 11:47 AM',
    signature: 'Not Verified',
    origin: 'External Message',
    description: 'File received outside the organization\'s normal document system.',
    isMalicious: true,
  },
];

export const LockThree: React.FC<LockThreeProps> = ({
  score,
  setScore,
  onSuccess,
  currentLock,
  setTimerActive,
  onStatusChange,
}) => {
  const [view, setView] = useState<'briefing' | 'investigation'>('briefing');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [scanStep, setScanStep] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [localStatus, setLocalStatus] = useState<SecurityStatus>('idle');

  const handleStartInvestigation = () => {
    setView('investigation');
    setTimerActive(true);
    setLocalStatus('analyzing');
    onStatusChange?.('analyzing');
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFileId(fileId);
    setError('');
    setIsScanning(true);
    setLocalStatus('processing');
    onStatusChange?.('processing');

    // Forensic sequence simulation without revealing whether file is malware
    setScanStep('FILE SELECTED');
    const timer1 = setTimeout(() => {
      setScanStep('ANALYZING STRUCTURE');
    }, 200);

    const timer2 = setTimeout(() => {
      setScanStep('SOURCE VALIDATION');
    }, 450);

    const timer3 = setTimeout(() => {
      setScanStep('SIGNATURE CHECK');
    }, 700);

    const timer4 = setTimeout(() => {
      setScanStep('RESULT READY');
      setIsScanning(false);
      setLocalStatus('analyzing');
      onStatusChange?.('analyzing');
    }, 950);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleQuarantine = () => {
    const file = MALWARE_FILES.find((f) => f.id === selectedFileId);
    if (!file) return;

    if (file.isMalicious) {
      setLocalStatus('success');
      onStatusChange?.('success');
      onSuccess();
    } else {
      setError(`FALSE POSITIVE: ${file.name} originated from ${file.source} (${file.signature === 'Verified' ? 'cryptographically verified' : 'non-critical asset'}).`);
      setScore((prev) => Math.max(0, prev - 10));
      setLocalStatus('error');
      onStatusChange?.('error');

      setTimeout(() => {
        setLocalStatus('analyzing');
        onStatusChange?.('analyzing');
      }, 3000);
    }
  };

  if (view === 'briefing') {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl text-center space-y-6 w-full relative overflow-hidden border border-white/10">
          <div className="flex justify-center mb-2">
            <SecurityCore status="idle" size="lg" withRings={true} />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] uppercase tracking-widest">
              Lock 3 / Sector 03
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              The Malware Trap
            </h2>
          </div>

          <div className="space-y-2 text-gray-300 font-mono text-sm leading-relaxed max-w-md mx-auto">
            <p>"An unknown file has appeared on the host system."</p>
            <p>"Four payloads were downloaded recently. One of them harbors an active trojan."</p>
            <p className="text-cyan-400 font-bold uppercase tracking-wider text-xs pt-2">
              Analyze forensic telemetry and quarantine the malicious artifact.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleStartInvestigation}
              className="py-4 px-10 cyber-btn-primary rounded-full text-sm font-black tracking-widest shadow-xl cursor-pointer"
            >
              Start Investigation
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedFile = MALWARE_FILES.find((f) => f.id === selectedFileId);

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between px-2 font-mono text-xs text-gray-400">
        <span className="flex items-center gap-2 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          FORENSIC SANDBOX & QUARANTINE STATION
        </span>
        <span className="hidden sm:inline">ISOLATION READY</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* File Artifacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3.5">
          {MALWARE_FILES.map((file) => {
            const isSelected = selectedFileId === file.id;
            return (
              <div
                key={file.id}
                onClick={() => handleSelectFile(file.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectFile(file.id);
                  }
                }}
                className={`
                  cursor-pointer p-4 rounded-xl border transition-all duration-300 glass-panel text-left flex flex-col justify-between
                  ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'border-white/10 glass-panel-hover'
                  }
                  focus:outline-none focus:ring-2 focus:ring-cyan-400
                `}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl p-1.5 rounded-lg bg-black/40 border border-white/5">
                      {file.type.includes('Executable') ? '⚙' : '📄'}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">
                      {file.size}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm truncate mb-1" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-gray-400 font-mono text-[11px] mb-3">{file.type}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-500 truncate mr-2">{file.source}</span>
                  <span
                    className={`px-2 py-0.5 rounded uppercase tracking-wider font-bold shrink-0 ${
                      isSelected
                        ? 'bg-cyan-400 text-black'
                        : 'text-cyan-400 border border-cyan-400/30'
                    }`}
                  >
                    {isSelected ? 'LOADED' : 'INSPECT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Forensic Inspection Terminal */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col min-h-[440px] relative overflow-hidden">
          {selectedFile ? (
            <>
              {/* Terminal Title */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <h2 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    DEEP FORENSIC REPORT
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedFileId(null)}
                  className="text-gray-400 hover:text-white text-xl w-7 h-7 flex items-center justify-center rounded hover:bg-white/10"
                  aria-label="Close report"
                >
                  &times;
                </button>
              </div>

              {/* Scanning status pill during inspect */}
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center justify-between font-mono text-xs">
                <span className="text-gray-400 uppercase text-[10px]">ANALYZER STATUS:</span>
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  {isScanning && <span className="animate-spin text-[10px]">⚙</span>}
                  {scanStep || 'RESULT READY'}
                </span>
              </div>

              {/* Telemetry metadata rows */}
              <div className="space-y-3 font-mono text-xs flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-y-2.5 p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-gray-500 uppercase text-[10px]">Filename:</span>
                  <span className="text-white text-right truncate pl-2 font-bold">{selectedFile.name}</span>

                  <span className="text-gray-500 uppercase text-[10px]">MIME Type:</span>
                  <span className="text-white text-right">{selectedFile.type}</span>

                  <span className="text-gray-500 uppercase text-[10px]">File Size:</span>
                  <span className="text-white text-right">{selectedFile.size}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Source Node:</span>
                  <span className="text-white text-right truncate pl-2">{selectedFile.source}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Download Stamp:</span>
                  <span className="text-white text-right">{selectedFile.downloadedAt}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Signature Status:</span>
                  <span
                    className={`text-right font-bold ${
                      selectedFile.signature === 'Verified' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {selectedFile.signature}
                  </span>

                  <span className="text-gray-500 uppercase text-[10px]">Network Origin:</span>
                  <span className="text-white text-right">{selectedFile.origin}</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-gray-500 uppercase text-[10px] block">Forensic Notes:</span>
                  <p className="text-gray-300 font-sans text-xs italic leading-relaxed">
                    "{selectedFile.description}"
                  </p>
                </div>
              </div>

              {/* Quarantine Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex gap-3 mt-auto">
                <button
                  onClick={() => setSelectedFileId(null)}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleQuarantine}
                  disabled={isScanning}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all font-mono text-xs uppercase tracking-widest font-black shadow-[0_0_20px_rgba(225,29,72,0.4)] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>☣</span>
                  <span>QUARANTINE FILE</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-60">
              <SecurityCore status={localStatus} size="md" />
              <p className="text-gray-400 font-mono text-xs uppercase tracking-wider">
                Select an artifact to launch forensic bytecode analysis
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="w-full p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 font-mono text-xs uppercase animate-shake text-center">
          {error}
        </div>
      )}
    </div>
  );
};

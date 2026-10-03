"use client";

import React, { useState, useEffect } from 'react';

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

export const LockThree = ({ score, setScore, onSuccess, currentLock, setTimerActive }: LockThreeProps) => {
  const [view, setView] = useState<'briefing' | 'investigation'>('briefing');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleStartInvestigation = () => {
    setView('investigation');
    setTimerActive(true);
  };

  const handleQuarantine = () => {
    const file = MALWARE_FILES.find(f => f.id === selectedFileId);
    if (!file) return;

    if (file.isMalicious) {
      onSuccess();
    } else {
      setError(`WRONG CHOICE: This file was ${file.signature === 'Verified' ? 'verified' : 'non-critical'} and came from ${file.source}.`);
      setScore(prev => Math.max(0, prev - 10));
    }
  };

  if (view === 'briefing') {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="glass-panel p-8 rounded-2xl text-center space-y-6">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Lock 3 — The Malware Trap
          </h2>
          <div className="space-y-4 text-gray-300 font-mono text-sm leading-relaxed">
            <p>"An unknown file has appeared on the system."</p>
            <p>"Four files were downloaded recently."</p>
            <p>"One of them contains a serious security risk."</p>
            <p className="text-cyan-400 font-bold uppercase tracking-widest">
              Inspect the evidence and identify the dangerous file before it is opened.
            </p>
          </div>
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 uppercase mb-4 font-mono">Mission Status: System Under Investigation</p>
            <button
              onClick={handleStartInvestigation}
              className="px-10 py-4 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest text-lg"
            >
              Start Investigation
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedFile = MALWARE_FILES.find(f => f.id === selectedFileId);

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* File Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MALWARE_FILES.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                setSelectedFileId(file.id);
                setError('');
              }}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 glass-panel hover:border-cyan-400 hover:scale-[1.02] active:scale-[0.98] ${
                selectedFileId === file.id ? 'border-cyan-400 ring-2 ring-cyan-400/20' : 'border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-white font-bold truncate mb-1">{file.name}</h3>
              <p className="text-gray-400 font-mono text-xs mb-4">{file.type} • {file.size}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase font-mono truncate mr-2">{file.source}</span>
                <span className="text-xs font-mono text-cyan-400 border border-cyan-400/30 px-2 py-1 rounded hover:bg-cyan-400/10 transition-colors shrink-0">
                  INSPECT
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Inspection Panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-6 min-h-[400px] flex flex-col">
          {selectedFile ? (
            <>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="text-xl font-mono text-cyan-400 uppercase">File Analysis</h2>
                <button onClick={() => setSelectedFileId(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="grid grid-cols-2 gap-y-3">
                  <span className="text-gray-500 uppercase text-xs">Filename:</span>
                  <span className="text-white text-right truncate pl-2">{selectedFile.name}</span>
                  <span className="text-gray-500 uppercase text-xs">Type:</span>
                  <span className="text-white text-right">{selectedFile.type}</span>
                  <span className="text-gray-500 uppercase text-xs">Size:</span>
                  <span className="text-white text-right">{selectedFile.size}</span>
                  <span className="text-gray-500 uppercase text-xs">Source:</span>
                  <span className="text-white text-right truncate pl-2">{selectedFile.source}</span>
                  <span className="text-gray-500 uppercase text-xs">Downloaded:</span>
                  <span className="text-white text-right">{selectedFile.downloadedAt}</span>
                  <span className="text-gray-500 uppercase text-xs">Signature:</span>
                  <span className="text-white text-right">{selectedFile.signature}</span>
                  <span className="text-gray-500 uppercase text-xs">Origin:</span>
                  <span className="text-white text-right">{selectedFile.origin}</span>
                </div>

                <div className="pt-4">
                  <span className="text-gray-500 uppercase text-xs block mb-1">File Description:</span>
                  <p className="text-gray-300 italic leading-relaxed">
                    "{selectedFile.description}"
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6 flex gap-4">
                <button
                  onClick={() => setSelectedFileId(null)}
                  className="flex-1 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-colors font-mono text-sm"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleQuarantine}
                  className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors font-mono text-sm font-bold uppercase tracking-widest"
                >
                  Quarantine File
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-400 font-mono text-sm uppercase">Select a file to begin analysis</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full border-red-500/50 text-red-400 font-mono text-xs uppercase animate-bounce z-50">
          {error}
        </div>
      )}
    </div>
  );
};

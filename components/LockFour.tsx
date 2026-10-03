"use client";

import React, { useState } from 'react';

interface NetworkRequest {
  id: number;
  sourceIp: string;
  device: string;
  destination: string;
  port: number;
  protocol: string;
  request: string;
  time: string;
  origin: string;
  isMalicious: boolean;
}

const NETWORK_TRAFFIC: NetworkRequest[] = [
  {
    id: 1,
    sourceIp: "10.0.2.15",
    device: "Office-Laptop-01",
    destination: "Web Server",
    port: 443,
    protocol: "HTTPS",
    request: "GET /portal",
    time: "09:14:02",
    origin: "Internal Network",
    isMalicious: false,
  },
  {
    id: 2,
    sourceIp: "10.0.2.21",
    device: "Office-Laptop-02",
    destination: "Mail Server",
    port: 587,
    protocol: "TCP",
    request: "SMTP submission",
    time: "09:14:18",
    origin: "Internal Network",
    isMalicious: false,
  },
  {
    id: 3,
    sourceIp: "10.0.2.34",
    device: "Office-Printer",
    destination: "Print Server",
    port: 9100,
    protocol: "TCP",
    request: "Print job",
    time: "09:14:31",
    origin: "Internal Network",
    isMalicious: false,
  },
  {
    id: 4,
    sourceIp: "185.72.44.19",
    device: "Unknown Device",
    destination: "Admin Server",
    port: 22,
    protocol: "TCP",
    request: "SSH connection attempt",
    time: "09:14:43",
    origin: "External Network",
    isMalicious: true,
  },
  {
    id: 5,
    sourceIp: "10.0.2.40",
    device: "Backup-Server",
    destination: "Backup Server",
    port: 443,
    protocol: "HTTPS",
    request: "Backup synchronization",
    time: "09:15:02",
    origin: "Internal Network",
    isMalicious: false,
  },
];

interface LockFourProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onSuccess: () => void;
  currentLock: number;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LockFour = ({ score, setScore, onSuccess, currentLock, setTimerActive }: LockFourProps) => {
  const [view, setView] = useState<'briefing' | 'analysis'>('briefing');
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [error, setError] = useState('');

  const handleStartAnalysis = () => {
    setView('analysis');
    setTimerActive(true);
  };

  const handleBlockConnection = () => {
    const request = NETWORK_TRAFFIC.find(r => r.id === selectedRequestId);
    if (!request) return;

    if (request.isMalicious) {
      setIsBlocking(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError("WRONG CONNECTION: This connection originates from an internal device and matches the expected service for this system.");
      setScore(prev => Math.max(0, prev - 10));
      setTimeout(() => setError(''), 4000);
    }
  };

  if (view === 'briefing') {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="glass-panel p-8 rounded-2xl text-center space-y-6">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Lock 4 — The Firewall
          </h2>
          <div className="space-y-4 text-gray-300 font-mono text-sm leading-relaxed">
            <p>"One connection doesn't belong."</p>
            <p>"Inspect the traffic and block it."</p>
          </div>
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleStartAnalysis}
              className="px-10 py-4 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest text-lg"
            >
              Start Firewall Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedRequest = NETWORK_TRAFFIC.find(r => r.id === selectedRequestId);

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Traffic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NETWORK_TRAFFIC.map((req) => (
            <div
              key={req.id}
              onClick={() => {
                setSelectedRequestId(req.id);
                setError('');
              }}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 glass-panel hover:border-cyan-400 hover:scale-[1.02] active:scale-[0.98] ${
                selectedRequestId === req.id ? 'border-cyan-400 ring-2 ring-cyan-400/20' : 'border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  Network Request {String(req.id).padStart(2, '0')}
                </span>
              </div>
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[10px] font-mono uppercase opacity-60">
                  <span>Source</span>
                  <span className="text-white">{req.sourceIp}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase opacity-60">
                  <span>Device</span>
                  <span className="text-white truncate ml-2">{req.device}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase opacity-60">
                  <span>Destination</span>
                  <span className="text-white">{req.destination}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase opacity-60">
                  <span>Port</span>
                  <span className="text-white">{req.port}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase opacity-60">
                  <span>Protocol</span>
                  <span className="text-white">{req.protocol}</span>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg border border-white/20 text-white font-mono text-xs hover:bg-white/10 transition-colors uppercase tracking-widest">
                Inspect Traffic
              </button>
            </div>
          ))}
        </div>

        {/* Inspection Panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-6 min-h-[500px] flex flex-col relative overflow-hidden">
          {isBlocking ? (
            <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
              <div className="text-cyan-400 font-mono text-xl uppercase tracking-widest animate-pulse">
                Incoming Connection
              </div>
              <div className="text-white text-2xl">↓</div>
              <div className="px-6 py-2 bg-red-600 text-white font-black rounded-md uppercase tracking-tighter text-2xl">
                Firewall
              </div>
              <div className="text-white text-2xl">↓</div>
              <div className="text-red-500 font-mono text-2xl font-black uppercase animate-bounce">
                Blocked
              </div>
            </div>
          ) : null}

          {selectedRequest ? (
            <>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="text-xl font-mono text-cyan-400 uppercase">Traffic Analysis</h2>
                <button onClick={() => setSelectedRequestId(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="grid grid-cols-2 gap-y-3">
                  <span className="text-gray-500 uppercase text-xs">Source IP:</span>
                  <span className="text-white text-right">{selectedRequest.sourceIp}</span>
                  <span className="text-gray-500 uppercase text-xs">Device:</span>
                  <span className="text-white text-right truncate pl-2">{selectedRequest.device}</span>
                  <span className="text-gray-500 uppercase text-xs">Destination:</span>
                  <span className="text-white text-right">{selectedRequest.destination}</span>
                  <span className="text-gray-500 uppercase text-xs">Port:</span>
                  <span className="text-white text-right">{selectedRequest.port}</span>
                  <span className="text-gray-500 uppercase text-xs">Protocol:</span>
                  <span className="text-white text-right">{selectedRequest.protocol}</span>
                  <span className="text-gray-500 uppercase text-xs">Request:</span>
                  <span className="text-white text-right">{selectedRequest.request}</span>
                  <span className="text-gray-500 uppercase text-xs">Time:</span>
                  <span className="text-white text-right">{selectedRequest.time}</span>
                  <span className="text-gray-500 uppercase text-xs">Network Origin:</span>
                  <span className="text-white text-right">{selectedRequest.origin}</span>
                </div>
              </div>

              <div className="mt-auto pt-6 flex gap-4">
                <button
                  onClick={() => setSelectedRequestId(null)}
                  className="flex-1 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-colors font-mono text-sm"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleBlockConnection}
                  className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors font-mono text-sm font-bold uppercase tracking-widest"
                >
                  Block Connection
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="text-xs font-mono text-gray-500 uppercase mb-4">
                INTERNET → FIREWALL → INTERNAL
              </div>
              <span className="text-5xl">📡</span>
              <p className="text-gray-400 font-mono text-sm uppercase">Select a request to begin analysis</p>
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

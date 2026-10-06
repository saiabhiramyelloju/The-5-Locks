"use client";

import React, { useState } from 'react';
import { ThreeNetworkTopology } from './ThreeNetworkTopology';
import { SecurityCore, type SecurityStatus } from './SecurityCore';

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
  onStatusChange?: (status: SecurityStatus) => void;
}

export const LockFour: React.FC<LockFourProps> = ({
  score,
  setScore,
  onSuccess,
  currentLock,
  setTimerActive,
  onStatusChange,
}) => {
  const [view, setView] = useState<'briefing' | 'analysis'>('briefing');
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [error, setError] = useState('');
  const [localStatus, setLocalStatus] = useState<SecurityStatus>('idle');

  const handleStartAnalysis = () => {
    setView('analysis');
    setTimerActive(true);
    setLocalStatus('monitoring');
    onStatusChange?.('monitoring');
  };

  const handleBlockConnection = () => {
    const request = NETWORK_TRAFFIC.find((r) => r.id === selectedRequestId);
    if (!request) return;

    if (request.isMalicious) {
      setIsBlocking(true);
      setLocalStatus('processing');
      onStatusChange?.('processing');

      setTimeout(() => {
        setLocalStatus('success');
        onStatusChange?.('success');
        onSuccess();
      }, 2000);
    } else {
      setError("WRONG CONNECTION: This connection originates from an internal device and matches the expected service for this system.");
      setScore((prev) => Math.max(0, prev - 10));
      setLocalStatus('error');
      onStatusChange?.('error');

      setTimeout(() => {
        setError('');
        setLocalStatus('monitoring');
        onStatusChange?.('monitoring');
      }, 3500);
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
            <div className="inline-block px-3 py-1 rounded-full bg-teal-950/50 border border-teal-400/40 text-teal-300 font-mono text-[10px] uppercase tracking-widest">
              Lock 4 / Sector 04
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
              The Firewall
            </h2>
          </div>

          <div className="space-y-2 text-gray-300 font-mono text-sm leading-relaxed max-w-md mx-auto">
            <p>"An anomalous connection has bypassed standard ingress filters."</p>
            <p>"Inspect the live network operations stream and deploy the firewall block rule before exfiltration begins."</p>
            <p className="text-teal-400 font-bold uppercase tracking-wider text-xs pt-2">
              Timer: 02:00 Allocation
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleStartAnalysis}
              className="py-4 px-10 cyber-btn-primary rounded-full text-sm font-black tracking-widest shadow-xl cursor-pointer"
            >
              Start Firewall Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedRequest = NETWORK_TRAFFIC.find((r) => r.id === selectedRequestId);

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-5xl">
      {/* 3D Network Operations Center Topology Visual */}
      <ThreeNetworkTopology
        isBlocking={isBlocking}
        selectedRequestId={selectedRequestId}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Network Packets Stream Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
          {NETWORK_TRAFFIC.map((req) => {
            const isSelected = selectedRequestId === req.id;
            return (
              <div
                key={req.id}
                onClick={() => {
                  setSelectedRequestId(req.id);
                  setError('');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRequestId(req.id);
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
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                      STREAM #{String(req.id).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500">{req.time}</span>
                  </div>

                  <div className="space-y-1 mb-3 font-mono text-[11px]">
                    <div className="flex justify-between text-gray-400">
                      <span className="text-gray-500">SRC:</span>
                      <span className="text-white font-medium">{req.sourceIp}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span className="text-gray-500">DST:</span>
                      <span className="text-white truncate ml-2 font-medium">{req.destination}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span className="text-gray-500">PORT:</span>
                      <span className="text-cyan-300">{req.port} ({req.protocol})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-500 truncate mr-2">{req.device}</span>
                  <span
                    className={`px-2.5 py-1 rounded uppercase tracking-wider font-bold shrink-0 ${
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

        {/* Traffic Inspection & Firewall Intercept Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col min-h-[460px] relative overflow-hidden">
          {/* Blocking Sequence Overlay */}
          {isBlocking && (
            <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in duration-300">
              <SecurityCore status="processing" size="lg" withRings={true} />
              <div className="text-cyan-300 font-mono text-sm uppercase tracking-widest">
                INCOMING PACKET INTERCEPTED
              </div>
              <div className="px-6 py-2 bg-rose-600 text-white font-black rounded-lg uppercase tracking-widest text-xl shadow-[0_0_30px_rgba(225,29,72,0.6)]">
                FIREWALL BLOCK RULE ACTIVE
              </div>
              <div className="text-emerald-400 font-mono text-sm uppercase animate-pulse">
                ✓ UNAUTHORIZED FLOW TERMINATED
              </div>
            </div>
          )}

          {selectedRequest ? (
            <>
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <h2 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    TRAFFIC PACKET INSPECTION
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedRequestId(null)}
                  className="text-gray-400 hover:text-white text-xl w-7 h-7 flex items-center justify-center rounded hover:bg-white/10"
                  aria-label="Close packet inspector"
                >
                  &times;
                </button>
              </div>

              {/* Packet Details */}
              <div className="space-y-3 font-mono text-xs flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-y-2.5 p-3.5 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-gray-500 uppercase text-[10px]">Source IP:</span>
                  <span className="text-white text-right font-bold">{selectedRequest.sourceIp}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Reported Device:</span>
                  <span className="text-white text-right truncate pl-2">{selectedRequest.device}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Destination:</span>
                  <span className="text-white text-right font-bold">{selectedRequest.destination}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Target Port:</span>
                  <span className="text-cyan-300 text-right font-bold">{selectedRequest.port}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Protocol:</span>
                  <span className="text-white text-right">{selectedRequest.protocol}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Request String:</span>
                  <span className="text-white text-right truncate pl-2">{selectedRequest.request}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Timestamp:</span>
                  <span className="text-white text-right">{selectedRequest.time}</span>

                  <span className="text-gray-500 uppercase text-[10px]">Network Zone:</span>
                  <span className="text-white text-right">{selectedRequest.origin}</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-400">
                  Verify internal network origin versus external untrusted ingress, and ensure the port matches the intended service profile.
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-3 mt-auto">
                <button
                  onClick={() => setSelectedRequestId(null)}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleBlockConnection}
                  disabled={isBlocking}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all font-mono text-xs uppercase tracking-widest font-black shadow-[0_0_20px_rgba(225,29,72,0.4)] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🛡</span>
                  <span>BLOCK CONNECTION</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-60">
              <SecurityCore status={localStatus} size="md" />
              <p className="text-gray-400 font-mono text-xs uppercase tracking-wider">
                Select an active traffic flow to inspect telemetry
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

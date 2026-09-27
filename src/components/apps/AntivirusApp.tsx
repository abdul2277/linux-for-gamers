import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Play, 
  Square, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Database, 
  Box, 
  FolderCheck, 
  Sliders, 
  FileText, 
  Activity, 
  Search, 
  Check, 
  RotateCcw,
  Zap,
  HardDrive,
  Cpu
} from 'lucide-react';
import { AntivirusThreat, AntivirusStatus } from '../../types/distro';
import { INITIAL_ANTIVIRUS_STATUS, INITIAL_ANTIVIRUS_THREATS } from '../../data/securityAndNewAppsDefaults';

export const AntivirusApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'quarantine' | 'containers' | 'settings' | 'logs'>('scanner');
  const [status, setStatus] = useState<AntivirusStatus>(INITIAL_ANTIVIRUS_STATUS);
  const [threats, setThreats] = useState<AntivirusThreat[]>(INITIAL_ANTIVIRUS_THREATS);

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'quick' | 'full' | 'container' | 'custom'>('quick');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanningFile, setCurrentScanningFile] = useState('/home/devforge/.config');
  const [scannedFilesCount, setScannedFilesCount] = useState(0);
  const [threatsFoundInScan, setThreatsFoundInScan] = useState<AntivirusThreat[]>([]);
  const [scanCompletedResult, setScanCompletedResult] = useState<{ files: number; threats: number; duration: number } | null>(null);

  // Definition update state
  const [isUpdatingDefs, setIsUpdatingDefs] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Security Logs
  const [logs, setLogs] = useState<Array<{ timestamp: string; event: string; level: 'info' | 'warn' | 'threat' }>>([
    { timestamp: '10:14:22', event: 'Real-Time Guard: Intercepted Win.Trojan.AgentTesla-9921 in /home/devforge/Downloads', level: 'threat' },
    { timestamp: '09:30:00', event: 'freshclam: Definitions updated to Daily-2026.09.27-v34 (8,924,102 signatures)', level: 'info' },
    { timestamp: '08:15:10', event: 'ClamAV clamd daemon started with on-access fanotify kernel watch', level: 'info' },
    { timestamp: 'Yesterday', event: 'Scheduled Container Scan: 4 Docker images inspected, 1 coin-miner signature removed', level: 'warn' }
  ]);

  // Simulation of Antivirus Scanner loop
  useEffect(() => {
    if (!isScanning) return;

    const filePaths = [
      '/usr/bin/docker',
      '/usr/local/bin/mold',
      '/home/devforge/.vscode-server/extensions',
      '/var/lib/docker/overlay2/merged/bin/sh',
      '/home/devforge/projects/app/node_modules/.bin',
      '/home/devforge/Downloads/archive-test.tar.gz',
      '/tmp/pip-install-cache/setup.py',
      '/etc/systemd/system/clamav-daemon.service',
      '/home/devforge/.cargo/bin/cargo-watch',
      '/usr/lib/x86_64-linux-gnu/libvulkan.so.1',
      '/var/log/syslog',
      '/home/devforge/.ssh/authorized_keys'
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setScanProgress(Math.min(100, current));
      setScannedFilesCount(prev => prev + 18);
      setCurrentScanningFile(filePaths[Math.floor(Math.random() * filePaths.length)]);

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanCompletedResult({
          files: scannedFilesCount + 250,
          threats: 0,
          duration: 4.8
        });
        setLogs(prev => [
          { timestamp: new Date().toLocaleTimeString(), event: `Scan complete: ${scannedFilesCount + 250} files scanned. System clean.`, level: 'info' },
          ...prev
        ]);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isScanning, scannedFilesCount]);

  const handleStartScan = (type: 'quick' | 'full' | 'container' | 'custom') => {
    setScanType(type);
    setScanProgress(0);
    setScannedFilesCount(0);
    setScanCompletedResult(null);
    setIsScanning(true);
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleUpdateDefinitions = () => {
    setIsUpdatingDefs(true);
    setUpdateMessage(null);
    setTimeout(() => {
      setIsUpdatingDefs(false);
      setStatus(prev => ({
        ...prev,
        signaturesCount: prev.signaturesCount + 1420,
        definitionsVersion: 'Daily-2026.09.27-v35 (Latest)'
      }));
      setUpdateMessage('Database updated! 1,420 new malware signatures added.');
      setTimeout(() => setUpdateMessage(null), 3500);
    }, 1200);
  };

  const handleRestoreThreat = (id: string) => {
    setThreats(prev => prev.filter(t => t.id !== id));
    setLogs(prev => [
      { timestamp: new Date().toLocaleTimeString(), event: `Quarantine: Threat ${id} restored by user`, level: 'warn' },
      ...prev
    ]);
  };

  const handleDeleteThreat = (id: string) => {
    setThreats(prev => prev.filter(t => t.id !== id));
    setLogs(prev => [
      { timestamp: new Date().toLocaleTimeString(), event: `Quarantine: File permanently shredded (${id})`, level: 'info' },
      ...prev
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Top Header & Security Shield Banner */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white shadow-md ${
              status.realTimeProtection 
                ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600' 
                : 'bg-gradient-to-tr from-amber-600 to-red-600'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm">
                  DevForge Shield — ClamAV Enterprise Antivirus
                </h3>
                <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[9px] font-mono">
                  fanotify on-access · Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time filesystem surveillance, container image CVE audit, and heuristic malware elimination.
              </p>
            </div>
          </div>

          {/* Quick Engine Status Badges */}
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <button
              onClick={() => setStatus(prev => ({ ...prev, realTimeProtection: !prev.realTimeProtection }))}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md border transition-colors cursor-pointer ${
                status.realTimeProtection
                  ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300 font-bold'
                  : 'bg-red-950/70 border-red-700 text-red-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{status.realTimeProtection ? 'Guard: Protected' : 'Guard: Paused'}</span>
            </button>

            <button
              onClick={handleUpdateDefinitions}
              disabled={isUpdatingDefs}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-md transition-colors cursor-pointer"
              title="Run freshclam virus definitions update"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isUpdatingDefs ? 'animate-spin' : ''}`} />
              <span>{isUpdatingDefs ? 'Updating...' : 'freshclam Update'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 pt-1 border-t border-slate-800/80 select-none overflow-x-auto">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Malware Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('quarantine')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              activeTab === 'quarantine'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Quarantine Vault ({threats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('containers')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              activeTab === 'containers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Docker &amp; Binary Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Security Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Engine Configuration</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {updateMessage && (
          <div className="p-3 bg-cyan-950/80 border border-cyan-700 text-cyan-300 rounded-xl flex items-center gap-2 text-[11px] font-mono">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{updateMessage}</span>
          </div>
        )}

        {/* ========================================================
            SCANNER TAB
            ======================================================== */}
        {activeTab === 'scanner' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Real-time Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Protection State</div>
                  <div className="text-xs font-bold text-slate-100 font-sans">
                    {status.realTimeProtection ? 'Fully Active' : 'Suspended'}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Virus Signatures</div>
                  <div className="text-xs font-bold text-cyan-300 font-mono">
                    {status.signaturesCount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-purple-950 text-purple-400 border border-purple-800 rounded-lg">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Total Inspected</div>
                  <div className="text-xs font-bold text-slate-200 font-mono">
                    {status.filesScannedTotal.toLocaleString()} files
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-rose-950 text-rose-400 border border-rose-800 rounded-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Threats Blocked</div>
                  <div className="text-xs font-bold text-rose-400 font-mono">
                    {status.threatsBlockedTotal} neutralized
                  </div>
                </div>
              </div>
            </div>

            {/* Live Scan Viewport & Scan Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">System Virus &amp; Rootkit Inspection</h4>
                  <p className="text-[11px] text-slate-400">
                    Engineered for Linux developers: Scans Docker containers, build artifacts, git repositories, and wine prefixes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isScanning ? (
                    <button
                      onClick={handleStopScan}
                      className="px-4 py-2 bg-red-950 border border-red-800 text-red-300 hover:bg-red-900 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop Scan</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartScan('quick')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Quick Scan</span>
                      </button>

                      <button
                        onClick={() => handleStartScan('full')}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Full Scan
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* In-Progress Scan Meter */}
              {isScanning && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span className="font-bold text-slate-200">
                        Scanning {scanType.toUpperCase()} Targets...
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm tabular-nums">
                      {scanProgress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-150"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="truncate max-w-md">
                      <span className="text-slate-500">Inspecting: </span>
                      <span className="text-cyan-300">{currentScanningFile}</span>
                    </div>
                    <span>{scannedFilesCount} objects</span>
                  </div>
                </div>
              )}

              {/* Scan Completed Summary */}
              {scanCompletedResult && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h5 className="font-bold text-emerald-200 text-xs">Scan Completed — No Active Threats Detected</h5>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <div className="text-slate-500">Files Scanned:</div>
                      <div className="text-slate-200 font-bold">{scanCompletedResult.files}</div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <div className="text-slate-500">Scan Duration:</div>
                      <div className="text-cyan-300 font-bold">{scanCompletedResult.duration}s</div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <div className="text-slate-500">System Integrity:</div>
                      <div className="text-emerald-400 font-bold">100% Clean</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scan Targets Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div
                  onClick={() => handleStartScan('quick')}
                  className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono text-slate-500">~15 sec</span>
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs mt-2">Developer Quick Scan</h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Scans `/home/devforge`, Downloads folder, running processes, and temporary build caches.
                  </p>
                </div>

                <div
                  onClick={() => handleStartScan('container')}
                  className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <Box className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono text-slate-500">Docker &amp; K8s</span>
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs mt-2">Container CVE Audit</h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Inspects local Docker daemon images, overlay2 layers, and npm/pip packages for supply-chain vulnerabilities.
                  </p>
                </div>

                <div
                  onClick={() => handleStartScan('full')}
                  className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <HardDrive className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono text-slate-500">~2 min</span>
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs mt-2">Deep Rootfs Scan</h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Thorough byte-level inspection across all mounted disks, Wine/Proton prefixes, and kernel modules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            QUARANTINE VAULT TAB
            ======================================================== */}
        {activeTab === 'quarantine' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-100 text-xs">Quarantine Security Vault</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Isolated threats are encrypted with AES-256 and removed from execution paths.
                </p>
              </div>

              <div className="text-[10px] font-mono text-rose-400 bg-rose-950 px-2.5 py-1 rounded border border-rose-800">
                {threats.length} Isolated Items
              </div>
            </div>

            {threats.length > 0 ? (
              <div className="space-y-2.5">
                {threats.map(threat => (
                  <div
                    key={threat.id}
                    className="p-3.5 bg-slate-900 border border-rose-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span className="font-bold text-slate-100 text-xs font-mono">{threat.threatName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                          {threat.threatType} · {threat.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        <span>Original Path: </span>
                        <span className="text-slate-300">{threat.path}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Isolated at {threat.detectedAt} · Size: {threat.sizeKB} KB
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRestoreThreat(threat.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded text-[11px] transition-colors cursor-pointer"
                        title="Restore file from quarantine"
                      >
                        Restore
                      </button>

                      <button
                        onClick={() => handleDeleteThreat(threat.id)}
                        className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                        title="Permanently shred file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Shred</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h5 className="font-bold text-slate-200 text-sm">Quarantine Vault is Empty</h5>
                <p className="text-xs text-slate-400">All system directories are verified safe and clean.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            CONTAINER & DOCKER AUDIT TAB
            ======================================================== */}
        {activeTab === 'containers' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-100 text-xs">Docker &amp; Container Image Vulnerability Scanner</h4>
                  <p className="text-[11px] text-slate-400">
                    Integrated Trivy / ClamAV layer inspector scanning local Docker images and Helm artifacts before deployment.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-[10px] font-mono">
                  CVE Feed: Up to Date
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'alpine:latest', status: 'Clean', cves: '0 CVEs', size: '7.8 MB', score: 'A+' },
                { name: 'node:20-slim', status: 'Clean', cves: '0 CVEs', size: '184 MB', score: 'A+' },
                { name: 'redis:7-alpine', status: 'Clean', cves: '0 CVEs', size: '32 MB', score: 'A' },
                { name: 'python:3.11-slim', status: '1 Low Warning (libssl3)', cves: '1 Low', size: '128 MB', score: 'B' }
              ].map(img => (
                <div
                  key={img.name}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Box className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="font-bold text-slate-100 text-xs font-mono">{img.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Size: {img.size} · Security Rating: {img.score}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-mono">
                      {img.status}
                    </span>
                    <button
                      onClick={() => handleStartScan('container')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors cursor-pointer"
                    >
                      Rescan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            SECURITY LOGS TAB
            ======================================================== */}
        {activeTab === 'logs' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-slate-100 text-xs">ClamAV Daemon &amp; Shield Audit Trail</h4>

              <div className="space-y-2 font-mono text-[11px]">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3"
                  >
                    <span className="text-slate-500 shrink-0 text-[10px]">{log.timestamp}</span>
                    <span className={
                      log.level === 'threat' ? 'text-rose-400 font-bold' : log.level === 'warn' ? 'text-amber-300' : 'text-slate-300'
                    }>
                      {log.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SETTINGS TAB
            ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-4 max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="font-bold text-slate-100 text-xs border-b border-slate-800 pb-2">
              ClamAV Daemon Configuration (`/etc/clamav/clamd.conf`)
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200 text-xs">On-Access Linux Kernel Fanotify Watch</div>
                  <div className="text-[10px] text-slate-400">Scans files on open, exec, and close syscalls</div>
                </div>
                <input
                  type="checkbox"
                  checked={status.onAccessWatch}
                  onChange={(e) => setStatus({ ...status, onAccessWatch: e.target.checked })}
                  className="accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200 text-xs">Docker Tmpfs Container Layer Scanning</div>
                  <div className="text-[10px] text-slate-400">Scans files written to overlayfs mountpoints in real-time</div>
                </div>
                <input
                  type="checkbox"
                  checked={status.dockerContainerScanActive}
                  onChange={(e) => setStatus({ ...status, dockerContainerScanActive: e.target.checked })}
                  className="accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Heuristic Engine Sensitivity</span>
                  <span className="text-cyan-400 font-mono capitalize">{status.heuristicLevel}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {(['low', 'standard', 'enhanced', 'paranoid'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setStatus({ ...status, heuristicLevel: lvl })}
                      className={`py-1 rounded text-[10px] font-mono capitalize border cursor-pointer ${
                        status.heuristicLevel === lvl
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

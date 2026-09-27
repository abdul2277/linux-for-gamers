import React, { useState, useEffect } from 'react';
import { useDistro } from '../../context/DistroContext';
import { 
  Terminal, 
  Cpu, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  Cloud, 
  CloudRain, 
  Box, 
  Layers, 
  Search, 
  Sliders, 
  CheckCircle2, 
  Activity,
  Gamepad2,
  Flame,
  ShieldCheck
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    activeWorkspace, 
    setActiveWorkspace, 
    setIsLauncherOpen, 
    setIsPaletteOpen, 
    telemetry, 
    toggleDockerDaemon, 
    toggleK8sCluster, 
    toggleOfflineMode,
    cloudSyncStatus,
    triggerCloudSync,
    openApp,
    gamingSettings,
    toggleGameMode
  } = useDistro();

  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const workspaces = [
    { id: 1, label: '1: Code' },
    { id: 2, label: '2: Containers' },
    { id: 3, label: '3: DevStore' },
    { id: 4, label: '4: Terminal' },
    { id: 5, label: '5: Config' }
  ];

  return (
    <header className="h-10 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 flex items-center justify-between z-40 select-none text-xs text-slate-300">
      {/* Zone 1: Brand & Workspaces */}
      <div className="flex items-center gap-3">
        {/* Distro Brand Wordmark */}
        <button 
          onClick={() => setIsLauncherOpen(true)}
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-800/80 text-slate-100 font-semibold tracking-wide transition-colors group cursor-pointer"
          title="App Launcher (Alt+Space)"
        >
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[11px] font-mono font-bold shadow-sm">
            DF
          </div>
          <span className="hidden sm:inline font-mono">DevForge</span>
        </button>

        <span className="text-slate-700" aria-hidden="true">|</span>

        {/* Workspace Switcher */}
        <nav aria-label="Workspaces" className="flex items-center gap-1">
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => setActiveWorkspace(ws.id)}
              className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors whitespace-nowrap cursor-pointer ${
                activeWorkspace === ws.id 
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              {ws.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Zone 2: Fast Command Palette Trigger */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-md transition-colors text-[11px] cursor-pointer"
          title="Command Palette (Ctrl+Shift+P)"
        >
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span>Quick actions &amp; build tools</span>
          <kbd className="px-1.5 py-0.5 text-[9px] bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">Ctrl+Shift+P</kbd>
        </button>
      </div>

      {/* Zone 3: Telemetry & System Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Telemetry: CPU & RAM */}
        <div 
          onClick={() => openApp('system-monitor')}
          className="hidden md:flex items-center gap-3 px-2 py-0.5 rounded hover:bg-slate-900 text-slate-400 font-mono text-[11px] cursor-pointer"
          title="Click to open System Monitor"
        >
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span className="tabular-nums text-slate-300">{telemetry.cpuUsagePercent.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-slate-500" />
            <span className="tabular-nums text-emerald-400">{telemetry.ramUsedMB} MB</span>
          </div>
        </div>

        <span className="hidden md:inline text-slate-800" aria-hidden="true">|</span>

        {/* Docker Daemon Status Toggle */}
        <button
          onClick={toggleDockerDaemon}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            telemetry.dockerDaemonRunning 
              ? 'text-blue-400 hover:bg-blue-950/40' 
              : 'text-slate-500 hover:bg-slate-900 line-through'
          }`}
          title={telemetry.dockerDaemonRunning ? "Docker Engine: Active (Click to toggle)" : "Docker Engine: Stopped"}
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">docker</span>
          <span className={`w-1.5 h-1.5 rounded-full ${telemetry.dockerDaemonRunning ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`} />
        </button>

        {/* Kubernetes Cluster Status Toggle */}
        <button
          onClick={toggleK8sCluster}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            telemetry.k8sClusterRunning 
              ? 'text-indigo-400 hover:bg-indigo-950/40' 
              : 'text-slate-500 hover:bg-slate-900 line-through'
          }`}
          title={telemetry.k8sClusterRunning ? "K3s Cluster: Running 5 pods" : "K3s Cluster: Paused"}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">k3s</span>
          <span className={`w-1.5 h-1.5 rounded-full ${telemetry.k8sClusterRunning ? 'bg-indigo-500' : 'bg-slate-600'}`} />
        </button>

        {/* GameMode / GameDeck Status */}
        <button
          onClick={toggleGameMode}
          onDoubleClick={() => openApp('gamedeck')}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
            gamingSettings.gameModeDaemonActive 
              ? 'text-cyan-400 hover:bg-cyan-950/40' 
              : 'text-slate-500 hover:bg-slate-900 line-through'
          }`}
          title={gamingSettings.gameModeDaemonActive ? "GameMode: Performance Governor Active (Click toggle, Double-click GameDeck)" : "GameMode: Idle"}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">gamemode</span>
          <span className={`w-1.5 h-1.5 rounded-full ${gamingSettings.gameModeDaemonActive ? 'bg-cyan-400' : 'bg-slate-600'}`} />
        </button>

        {/* Antivirus Protection Shield Status */}
        <button
          onClick={() => openApp('antivirus')}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-900 text-emerald-400 font-mono text-[11px] transition-colors cursor-pointer"
          title="DevForge ClamAV Shield: Real-Time Protection Active (Click to open)"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline text-[10px] text-emerald-300">shield</span>
        </button>

        {/* Cloud Sync Status */}
        <button
          onClick={triggerCloudSync}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-900 text-slate-300 font-mono text-[11px] transition-colors cursor-pointer"
          title={`Cloud Sync: ${cloudSyncStatus} (Click to sync now)`}
        >
          <Cloud className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'text-amber-400 animate-spin' : 'text-blue-400'}`} />
          <span className="hidden xl:inline text-[10px]">sync</span>
        </button>

        {/* Offline / Online Network Toggle */}
        <button
          onClick={toggleOfflineMode}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
            telemetry.isOffline 
              ? 'bg-amber-950/50 text-amber-300 border border-amber-800/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
          title={telemetry.isOffline ? "Offline Mode Active (Cached packages & local registry)" : "Online (Connected to mirrors)"}
        >
          {telemetry.isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono text-[10px]">Offline</span>
            </>
          ) : (
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </button>

        {/* Settings Shortcut */}
        <button
          onClick={() => openApp('settings')}
          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          title="Distro Customizer & Settings"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Clock */}
        <div className="font-mono text-slate-300 font-medium tabular-nums pl-1 text-[11px]">
          {timeStr || '13:00'}
        </div>
      </div>
    </header>
  );
};

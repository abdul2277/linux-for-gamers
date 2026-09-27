import React, { useState } from 'react';
import { useDistro } from '../../context/DistroContext';
import { 
  Cloud, 
  RefreshCw, 
  Laptop, 
  Monitor, 
  Server, 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  Check, 
  Copy, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

export const CloudSyncApp: React.FC = () => {
  const { 
    syncedDevices, 
    cloudSyncStatus, 
    lastSyncedTimestamp, 
    triggerCloudSync, 
    exportConfigJson, 
    importConfigJson, 
    telemetry, 
    toggleOfflineMode 
  } = useDistro();

  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    const json = exportConfigJson();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const json = exportConfigJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devforge-settings-vault.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyImport = () => {
    if (!importText.trim()) return;
    const success = importConfigJson(importText);
    if (success) {
      setImportMessage('✓ Configuration snapshot restored successfully!');
      setTimeout(() => {
        setShowImportModal(false);
        setImportMessage(null);
        setImportText('');
      }, 1200);
    } else {
      setImportMessage('❌ Invalid JSON syntax. Please check the config file.');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Header */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 space-y-2 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-slate-100 font-sans">Cloud Sync &amp; Device Mesh</h2>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              cloudSyncStatus === 'synced' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-amber-950/60 text-amber-400'
            }`}>
              {cloudSyncStatus === 'synced' ? 'Synced (Encrypted)' : cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Offline'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerCloudSync}
              disabled={telemetry.isOffline || cloudSyncStatus === 'syncing'}
              className="flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Seamlessly synchronize keybindings, shell dotfiles, active packages, and VS Code extensions across multiple dev machines with offline vault fallback.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Offline Mode Card */}
        <div className={`p-4 rounded-lg border transition-all ${
          telemetry.isOffline 
            ? 'bg-amber-950/20 border-amber-800/50' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg border ${
                telemetry.isOffline ? 'bg-amber-900/40 border-amber-700/60 text-amber-400' : 'bg-slate-800 border-slate-700 text-emerald-400'
              }`}>
                {telemetry.isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <span>Continuous Offline Productivity</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {telemetry.isOffline ? '· Airplane Mode Simulation' : '· Online Mirror Sync'}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {telemetry.isOffline
                    ? 'Working completely offline. All packages, Docker cache, and dotfiles are served from the local disk cache without network latency.'
                    : 'System is connected to DevForge high-speed upstream mirrors and DevMesh cloud sync.'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleOfflineMode}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                telemetry.isOffline
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {telemetry.isOffline ? 'Disable Offline Mode' : 'Simulate Offline Mode'}
            </button>
          </div>
        </div>

        {/* Synced Devices Mesh */}
        <div className="space-y-2 select-none">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Device Mesh (Connected Machines)</span>
            <span className="text-[10px] text-slate-500 font-mono">Last Synced: {lastSyncedTimestamp}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {syncedDevices.map(device => (
              <div
                key={device.id}
                className={`p-3 rounded-lg border ${
                  device.isCurrent
                    ? 'bg-teal-950/20 border-teal-500/40'
                    : 'bg-slate-900 border-slate-800'
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {device.type === 'desktop' && <Monitor className="w-4 h-4 text-teal-400" />}
                    {device.type === 'laptop' && <Laptop className="w-4 h-4 text-blue-400" />}
                    {device.type === 'cloud-vps' && <Server className="w-4 h-4 text-indigo-400" />}
                    <span className="font-semibold text-slate-200 text-xs">{device.name}</span>
                  </div>
                  {device.isCurrent && (
                    <span className="px-1.5 py-0.5 bg-teal-900/60 border border-teal-700 text-teal-300 rounded text-[9px] font-mono">
                      THIS MACHINE
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                  <div>OS: {device.os}</div>
                  <div>Synced: {device.lastSync}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Synchronized Elements Checklist */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Synced Workstation Items
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {[
              { label: 'VS Code Extensions & Themes', status: '7 extensions active' },
              { label: 'Custom Keyboard Shortcuts', status: 'Alt+C, Alt+D, Alt+Enter, Ctrl+Shift+P' },
              { label: 'Shell Dotfiles & Starship Prompt', status: '~/.config/starship.toml' },
              { label: 'Installed DevStore Toolchains', status: '18 packages registered' },
              { label: 'Docker Compose Project Files', status: 'docker-compose.yml synced' },
              { label: 'Low-Latency Linker Flags', status: 'Mold default linker configured' }
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="font-medium text-slate-200">{item.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Snapshot Backup & Restore */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-200 text-xs">Settings Snapshot Vault</h3>
              <p className="text-[11px] text-slate-400">Export or restore complete workstation configuration as JSON.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export File</span>
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-medium transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restore Snapshot</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restore Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Restore Configuration Snapshot</span>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Paste your DevForge settings JSON below to apply packages, themes, and keybindings:
            </p>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste JSON settings here..."
              rows={8}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500 resize-none"
            />
            {importMessage && (
              <div className="text-[11px] font-mono text-teal-400">{importMessage}</div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyImport}
                className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-medium"
              >
                Apply Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

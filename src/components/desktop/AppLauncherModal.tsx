import React, { useState, useEffect, useRef } from 'react';
import { useDistro } from '../../context/DistroContext';
import { AppId } from '../../types/distro';
import { 
  Search, 
  Code, 
  Box, 
  Package, 
  Terminal, 
  Wrench, 
  Cloud, 
  Sliders, 
  Zap, 
  Activity, 
  ShoppingBag,
  Gamepad2,
  ShieldCheck,
  MessageSquare,
  X 
} from 'lucide-react';

interface LauncherApp {
  id: AppId;
  name: string;
  category: string;
  description: string;
  shortcut: string;
  icon: React.ReactNode;
}

export const AppLauncherModal: React.FC = () => {
  const { isLauncherOpen, setIsLauncherOpen, openApp } = useDistro();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const apps: LauncherApp[] = [
    {
      id: 'vscode',
      name: 'VS Code Web Studio',
      category: 'Development',
      description: 'Integrated code editor with pre-loaded Dockerfile, k8s configs, and build runner',
      shortcut: 'Alt+C',
      icon: <Code className="w-5 h-5 text-blue-400" />
    },
    {
      id: 'docker-k8s',
      name: 'Docker & Kubernetes Dashboard',
      category: 'Containers',
      description: 'Supervise local Docker containers, k3s pods, service ports, and deployment scaling',
      shortcut: 'Alt+D',
      icon: <Box className="w-5 h-5 text-sky-400" />
    },
    {
      id: 'devstore',
      name: 'DevStore Package Hub',
      category: 'Packages',
      description: 'One-click toolchains: Rust, Bun, Python/uv, Go, Docker, Helm, Postgres, Redis',
      shortcut: 'Alt+S',
      icon: <Package className="w-5 h-5 text-purple-400" />
    },
    {
      id: 'open-store',
      name: 'Open Source App Center',
      category: 'FOSS Store',
      description: 'Browse, install and sandbox verified Flathub, AUR and AppImage open source apps',
      shortcut: 'Alt+F',
      icon: <ShoppingBag className="w-5 h-5 text-pink-400" />
    },
    {
      id: 'antivirus',
      name: 'DevForge ClamAV Antivirus Suite',
      category: 'Security',
      description: 'Enterprise Linux on-access shield, container CVE vulnerability scanner, and quarantine manager',
      shortcut: 'Security',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'appgallery',
      name: 'HUAWEI AppGallery',
      category: 'App Stores',
      description: 'Verified Android & HarmonyOS apps running inside accelerated Waydroid LXC sandbox',
      shortcut: 'Waydroid',
      icon: <ShoppingBag className="w-5 h-5 text-red-500" />
    },
    {
      id: 'discord',
      name: 'Discord (Linux Edition)',
      category: 'Communication',
      description: 'Voice & text messaging connected to low-latency PipeWire ProAudio and Krisp noise filter',
      shortcut: 'Chat',
      icon: <MessageSquare className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'gamedeck',
      name: 'DevForge GameDeck & Proton Hub',
      category: 'Gaming',
      description: 'Linux gaming center with GameMode tuning, Proton GE runner manager, and MangoHud',
      shortcut: 'Alt+G',
      icon: <Gamepad2 className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'terminal',
      name: 'DevForge Terminal (zsh)',
      category: 'CLI',
      description: 'Ultra-fast developer shell with starship prompt, docker aliases, and mold linker',
      shortcut: 'Alt+Enter',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'autoconfig',
      name: 'Environment Automation Scripts',
      category: 'Productivity',
      description: 'Generate high-performance dotfiles, cloud-init scripts, and development stack presets',
      shortcut: 'Presets',
      icon: <Wrench className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'build-optimizer',
      name: 'Mold & BuildKit Optimizer',
      category: 'Performance',
      description: 'Benchmarking & configuration for high-speed multi-core linkers and BuildKit caching',
      shortcut: 'Fast Link',
      icon: <Zap className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'cloudsync',
      name: 'Cloud Sync & Device Mesh',
      category: 'System',
      description: 'Sync workstation settings across multiple machines with offline vault fallback',
      shortcut: 'Mesh',
      icon: <Cloud className="w-5 h-5 text-teal-400" />
    },
    {
      id: 'system-monitor',
      name: 'Resource Telemetry Monitor',
      category: 'System',
      description: 'Live CPU, RAM footprint (284MB idle), disk I/O, and process inspector',
      shortcut: 'Telemetry',
      icon: <Activity className="w-5 h-5 text-rose-400" />
    },
    {
      id: 'settings',
      name: 'Distro Customizer & Keybindings',
      category: 'Settings',
      description: 'Configure desktop themes, custom keyboard shortcuts, kernel boot parameters, and ISO build',
      shortcut: 'Config',
      icon: <Sliders className="w-5 h-5 text-slate-300" />
    }
  ];

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(query.toLowerCase()) ||
    app.description.toLowerCase().includes(query.toLowerCase()) ||
    app.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isLauncherOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isLauncherOpen]);

  const handleLaunch = (appId: AppId) => {
    openApp(appId);
    setIsLauncherOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredApps.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredApps.length) % (filteredApps.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredApps[selectedIndex]) {
        handleLaunch(filteredApps[selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      setIsLauncherOpen(false);
    }
  };

  if (!isLauncherOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 select-none"
      onClick={() => setIsLauncherOpen(false)}
    >
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl shadow-black/80 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Launch application, developer tool, or setting..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredApps.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No developer tools found matching "{query}".
            </div>
          ) : (
            filteredApps.map((app, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={app.id}
                  onClick={() => handleLaunch(app.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                      {app.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">{app.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">· {app.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{app.description}</p>
                    </div>
                  </div>

                  <kbd className="px-2 py-1 text-[10px] bg-slate-800/80 border border-slate-700/60 rounded text-slate-400 font-mono shrink-0">
                    {app.shortcut}
                  </kbd>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with <kbd className="px-1 bg-slate-800 rounded font-mono text-[10px]">↑</kbd> <kbd className="px-1 bg-slate-800 rounded font-mono text-[10px]">↓</kbd> · Launch with <kbd className="px-1 bg-slate-800 rounded font-mono text-[10px]">Enter</kbd></span>
          <span className="font-mono text-[10px]">DevForge 2026.1</span>
        </div>
      </div>
    </div>
  );
};

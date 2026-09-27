import React, { useState, useEffect, useRef } from 'react';
import { useDistro } from '../../context/DistroContext';
import { 
  Zap, 
  Wifi, 
  WifiOff, 
  Layers, 
  Cloud, 
  Box, 
  Code, 
  Package, 
  Terminal, 
  Download, 
  Palette,
  ShoppingBag,
  Gamepad2,
  Flame,
  Activity,
  Sliders,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface PaletteCommand {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const { 
    isPaletteOpen, 
    setIsPaletteOpen, 
    openApp, 
    runBuild, 
    toggleOfflineMode, 
    telemetry, 
    triggerCloudSync, 
    scaleDeployment,
    toggleDockerDaemon,
    setTheme,
    toggleGameMode,
    toggleMangoHud
  } = useDistro();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: PaletteCommand[] = [
    {
      id: 'cmd-build',
      title: 'DevForge: Run Mold Fast Build & Link',
      category: 'Build',
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      action: () => {
        openApp('vscode');
        runBuild();
      }
    },
    {
      id: 'cmd-antivirus',
      title: 'Security: Open DevForge ClamAV Antivirus Suite',
      category: 'Security',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      action: () => openApp('antivirus')
    },
    {
      id: 'cmd-appgallery',
      title: 'Store: Open HUAWEI AppGallery & Waydroid Hub',
      category: 'Software Store',
      icon: <ShoppingBag className="w-4 h-4 text-red-500" />,
      action: () => openApp('appgallery')
    },
    {
      id: 'cmd-discord',
      title: 'Comms: Open Discord Linux Desktop Client',
      category: 'Communication',
      icon: <MessageSquare className="w-4 h-4 text-indigo-400" />,
      action: () => openApp('discord')
    },
    {
      id: 'cmd-gamedeck',
      title: 'Gaming: Open DevForge GameDeck & Proton Hub',
      category: 'Gaming',
      icon: <Gamepad2 className="w-4 h-4 text-cyan-400" />,
      action: () => openApp('gamedeck')
    },
    {
      id: 'cmd-workshop',
      title: 'Gaming: Browse Community Game Mods & Workshop',
      category: 'Gaming',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      action: () => openApp('gamedeck')
    },
    {
      id: 'cmd-gamepad-deadzone',
      title: 'Gamepad: Calibrate Joystick Deadzones & Sensitivity Curves',
      category: 'Gaming',
      icon: <Sliders className="w-4 h-4 text-cyan-400" />,
      action: () => openApp('gamedeck')
    },
    {
      id: 'cmd-openstore',
      title: 'Store: Open Flathub Open Source App Center',
      category: 'Software Store',
      icon: <ShoppingBag className="w-4 h-4 text-pink-400" />,
      action: () => openApp('open-store')
    },
    {
      id: 'cmd-gamemode',
      title: 'Gaming: Toggle GameMode Daemon (Performance CPU Governor)',
      category: 'Gaming',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      action: () => toggleGameMode()
    },
    {
      id: 'cmd-mangohud',
      title: 'Gaming: Toggle MangoHud FPS & Hardware Telemetry Overlay',
      category: 'Gaming',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      action: () => toggleMangoHud()
    },
    {
      id: 'cmd-offline',
      title: telemetry.isOffline ? 'DevForge: Disable Offline Mode (Connect to Mirrored Upstream)' : 'DevForge: Enable Offline Mode (Use Cached Repositories)',
      category: 'Network',
      icon: telemetry.isOffline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />,
      action: () => toggleOfflineMode()
    },
    {
      id: 'cmd-k8s-scale',
      title: 'Kubernetes: Scale "api-gateway" Pods (+1 Replica)',
      category: 'Kubernetes',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      action: () => {
        scaleDeployment('api-gateway', 1);
        openApp('docker-k8s');
      }
    },
    {
      id: 'cmd-cloud-sync',
      title: 'Cloud Vault: Sync Workstation Dotfiles & Keybindings Now',
      category: 'Sync',
      icon: <Cloud className="w-4 h-4 text-teal-400" />,
      action: () => triggerCloudSync()
    },
    {
      id: 'cmd-docker-restart',
      title: 'Docker: Toggle Container Engine Daemon State',
      category: 'Containers',
      icon: <Box className="w-4 h-4 text-blue-400" />,
      action: () => toggleDockerDaemon()
    },
    {
      id: 'cmd-vscode',
      title: 'View: Open VS Code Web Studio Workspace',
      category: 'Navigation',
      icon: <Code className="w-4 h-4 text-blue-400" />,
      action: () => openApp('vscode')
    },
    {
      id: 'cmd-devstore',
      title: 'View: Open DevStore Package Hub',
      category: 'Navigation',
      icon: <Package className="w-4 h-4 text-purple-400" />,
      action: () => openApp('devstore')
    },
    {
      id: 'cmd-terminal',
      title: 'View: Open DevForge Terminal (zsh)',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => openApp('terminal')
    },
    {
      id: 'cmd-theme-tokyo',
      title: 'Theme: Switch Distro Theme to Tokyo Night',
      category: 'Preferences',
      icon: <Palette className="w-4 h-4 text-indigo-300" />,
      action: () => setTheme('tokyo')
    },
    {
      id: 'cmd-theme-obsidian',
      title: 'Theme: Switch Distro Theme to Obsidian Dark',
      category: 'Preferences',
      icon: <Palette className="w-4 h-4 text-slate-300" />,
      action: () => setTheme('obsidian')
    }
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isPaletteOpen]);

  const handleExecute = (cmd: PaletteCommand) => {
    cmd.action();
    setIsPaletteOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleExecute(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsPaletteOpen(false);
    }
  };

  if (!isPaletteOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 select-none"
      onClick={() => setIsPaletteOpen(false)}
    >
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl shadow-black/80 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/70">
          <span className="text-blue-400 font-mono text-sm">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a developer command..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filteredCommands.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No matching commands.
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleExecute(cmd)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                    isSelected ? 'bg-blue-600/20 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {cmd.icon}
                    <span className="font-medium">{cmd.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{cmd.category}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * DevForge Linux OS — Developer-Optimized Workstation & Container Distro
 */

import React from 'react';
import { DistroProvider, useDistro } from './context/DistroContext';
import { TopBar } from './components/desktop/TopBar';
import { Dock } from './components/desktop/Dock';
import { WindowFrame } from './components/desktop/WindowFrame';
import { AppLauncherModal } from './components/desktop/AppLauncherModal';
import { CommandPalette } from './components/desktop/CommandPalette';

import { VSCodeApp } from './components/apps/VSCodeApp';
import { DockerK8sApp } from './components/apps/DockerK8sApp';
import { DevStoreApp } from './components/apps/DevStoreApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { AutoConfigApp } from './components/apps/AutoConfigApp';
import { CloudSyncApp } from './components/apps/CloudSyncApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { SystemMonitorApp } from './components/apps/SystemMonitorApp';
import { BuildOptimizerApp } from './components/apps/BuildOptimizerApp';
import { OpenSourceStoreApp } from './components/apps/OpenSourceStoreApp';
import { GameDeckApp } from './components/apps/GameDeckApp';
import { AntivirusApp } from './components/apps/AntivirusApp';
import { HuaweiAppGalleryApp } from './components/apps/HuaweiAppGalleryApp';
import { DiscordApp } from './components/apps/DiscordApp';

import { 
  Code, 
  Box, 
  Package, 
  Terminal, 
  Wrench, 
  Cloud, 
  Sliders, 
  Zap, 
  Activity, 
  Layers,
  ShoppingBag,
  Gamepad2,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

const DesktopContent: React.FC = () => {
  const { windows, activeWorkspace, openApp, theme } = useDistro();

  // Desktop theme background mapping
  const themeBgMap = {
    'obsidian': 'bg-[#0b0f19]',
    'tokyo': 'bg-[#131520]',
    'nord': 'bg-[#232731]',
    'cyber-slate': 'bg-[#070b12]',
    'gruvbox': 'bg-[#18191a]'
  };

  const desktopIcons = [
    { appId: 'vscode' as const, label: 'VS Code Studio', icon: <Code className="w-6 h-6 text-blue-400" /> },
    { appId: 'docker-k8s' as const, label: 'Docker & K8s', icon: <Box className="w-6 h-6 text-sky-400" /> },
    { appId: 'antivirus' as const, label: 'ClamAV Shield', icon: <ShieldCheck className="w-6 h-6 text-emerald-400" /> },
    { appId: 'appgallery' as const, label: 'AppGallery', icon: <ShoppingBag className="w-6 h-6 text-red-500" /> },
    { appId: 'discord' as const, label: 'Discord', icon: <MessageSquare className="w-6 h-6 text-indigo-400" /> },
    { appId: 'gamedeck' as const, label: 'GameDeck & Proton', icon: <Gamepad2 className="w-6 h-6 text-cyan-400" /> },
    { appId: 'open-store' as const, label: 'Flathub OSS Store', icon: <ShoppingBag className="w-6 h-6 text-pink-400" /> },
    { appId: 'devstore' as const, label: 'DevStore Hub', icon: <Package className="w-6 h-6 text-purple-400" /> },
    { appId: 'terminal' as const, label: 'DevForge Terminal', icon: <Terminal className="w-6 h-6 text-emerald-400" /> },
    { appId: 'autoconfig' as const, label: 'AutoConfig Scripts', icon: <Wrench className="w-6 h-6 text-amber-400" /> },
    { appId: 'build-optimizer' as const, label: 'Build Optimizer', icon: <Zap className="w-6 h-6 text-cyan-400" /> },
    { appId: 'cloudsync' as const, label: 'Cloud Sync Vault', icon: <Cloud className="w-6 h-6 text-teal-400" /> },
    { appId: 'settings' as const, label: 'Distro Settings', icon: <Sliders className="w-6 h-6 text-slate-300" /> }
  ];

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'vscode':
        return <VSCodeApp />;
      case 'docker-k8s':
        return <DockerK8sApp />;
      case 'devstore':
        return <DevStoreApp />;
      case 'open-store':
        return <OpenSourceStoreApp />;
      case 'gamedeck':
        return <GameDeckApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'autoconfig':
        return <AutoConfigApp />;
      case 'cloudsync':
        return <CloudSyncApp />;
      case 'settings':
        return <SettingsApp />;
      case 'system-monitor':
        return <SystemMonitorApp />;
      case 'build-optimizer':
        return <BuildOptimizerApp />;
      case 'antivirus':
        return <AntivirusApp />;
      case 'appgallery':
        return <HuaweiAppGalleryApp />;
      case 'discord':
        return <DiscordApp />;
      default:
        return <div className="p-4 text-slate-400">Application not found</div>;
    }
  };

  return (
    <div className={`relative h-screen w-screen overflow-hidden ${themeBgMap[theme]} text-slate-100 flex flex-col font-sans select-none`}>
      {/* Subtle Desktop Wallpaper Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* Distro Top Bar */}
      <TopBar />

      {/* Desktop Canvas Area */}
      <main className="relative flex-1 overflow-hidden">
        {/* Desktop Quick Shortcuts on Left */}
        <div className="absolute top-4 left-4 grid grid-cols-1 gap-3 z-0">
          {desktopIcons.map(item => (
            <button
              key={item.appId}
              onDoubleClick={() => openApp(item.appId)}
              onClick={() => openApp(item.appId)}
              className="flex flex-col items-center justify-center w-20 p-2 rounded-lg hover:bg-slate-800/40 text-slate-300 hover:text-white transition-all cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 group-hover:border-slate-700 shadow-md">
                {item.icon}
              </div>
              <span className="text-[11px] font-medium mt-1 text-center text-slate-300 group-hover:text-white line-clamp-1 shadow-sm font-sans">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Windows rendering for active workspace */}
        {windows
          .filter(win => win.workspaceId === activeWorkspace)
          .map(win => (
            <WindowFrame key={win.id} window={win}>
              {renderAppContent(win.appId)}
            </WindowFrame>
          ))}
      </main>

      {/* Desktop Dock */}
      <Dock />

      {/* App Launcher Modal (Alt+Space) */}
      <AppLauncherModal />

      {/* Command Palette (Ctrl+Shift+P) */}
      <CommandPalette />
    </div>
  );
};

export default function App() {
  return (
    <DistroProvider>
      <DesktopContent />
    </DistroProvider>
  );
}

import React from 'react';
import { useDistro } from '../../context/DistroContext';
import { AppId } from '../../types/distro';
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
  ShoppingBag,
  Gamepad2,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface DockItem {
  appId: AppId;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

export const Dock: React.FC = () => {
  const { openApp, windows, activeWindowId } = useDistro();

  const dockItems: DockItem[] = [
    {
      appId: 'vscode',
      label: 'VS Code Studio',
      shortcut: 'Alt+C',
      icon: <Code className="w-5 h-5 text-blue-400" />
    },
    {
      appId: 'docker-k8s',
      label: 'Docker & Kubernetes',
      shortcut: 'Alt+D',
      icon: <Box className="w-5 h-5 text-sky-400" />
    },
    {
      appId: 'antivirus',
      label: 'ClamAV Shield',
      shortcut: 'Security',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      appId: 'appgallery',
      label: 'HUAWEI AppGallery',
      shortcut: 'Waydroid',
      icon: <ShoppingBag className="w-5 h-5 text-red-500" />
    },
    {
      appId: 'discord',
      label: 'Discord Comms',
      shortcut: 'Chat',
      icon: <MessageSquare className="w-5 h-5 text-indigo-400" />
    },
    {
      appId: 'gamedeck',
      label: 'GameDeck & Proton',
      shortcut: 'Alt+G',
      icon: <Gamepad2 className="w-5 h-5 text-cyan-400" />
    },
    {
      appId: 'open-store',
      label: 'Flathub OSS Store',
      shortcut: 'Alt+F',
      icon: <ShoppingBag className="w-5 h-5 text-pink-400" />
    },
    {
      appId: 'devstore',
      label: 'DevStore Packages',
      shortcut: 'Alt+S',
      icon: <Package className="w-5 h-5 text-purple-400" />
    },
    {
      appId: 'terminal',
      label: 'DevForge Terminal',
      shortcut: 'Alt+Enter',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />
    },
    {
      appId: 'build-optimizer',
      label: 'Mold Fast Linker',
      shortcut: 'Fast Link',
      icon: <Zap className="w-5 h-5 text-cyan-400" />
    },
    {
      appId: 'settings',
      label: 'Distro Customizer',
      shortcut: 'Config',
      icon: <Sliders className="w-5 h-5 text-slate-300" />
    }
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 select-none">
      <nav 
        aria-label="Application Dock"
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/60 transition-all"
      >
        {dockItems.map(item => {
          const isRunning = windows.some(w => w.appId === item.appId);
          const isFocused = windows.some(w => w.appId === item.appId && w.id === activeWindowId);

          return (
            <button
              key={item.appId}
              onClick={() => openApp(item.appId)}
              className={`group relative flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-all duration-150 cursor-pointer ${
                isFocused 
                  ? 'bg-slate-800 text-white shadow-inner' 
                  : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
              }`}
              title={`${item.label} (${item.shortcut})`}
            >
              {item.icon}

              {/* Running indicator dot */}
              {isRunning && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isFocused ? 'bg-blue-400 w-2.5' : 'bg-slate-400'}`} />
              )}

              {/* Tooltip on hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-slate-700/80 text-slate-200 text-[11px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap shadow-lg flex items-center gap-1.5 font-sans">
                <span>{item.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">[{item.shortcut}]</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

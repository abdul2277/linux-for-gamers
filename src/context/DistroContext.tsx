import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AppId, 
  WindowState, 
  DistroTheme, 
  SystemTelemetry, 
  DockerContainer, 
  K8sPod, 
  K8sDeployment, 
  DevPackage, 
  ProjectFile, 
  Extension, 
  SyncedDevice, 
  Keybinding,
  OpenSourceApp,
  GameTitle,
  GamingSystemState,
  GameMod,
  GamepadCalibrationSettings,
  GamepadStickCalibration
} from '../types/distro';
import { 
  INITIAL_PACKAGES, 
  INITIAL_CONTAINERS, 
  INITIAL_K8S_PODS, 
  INITIAL_K8S_DEPLOYMENTS, 
  INITIAL_PROJECT_FILES, 
  INITIAL_EXTENSIONS, 
  INITIAL_SYNCED_DEVICES 
} from '../data/distroDefaults';
import {
  INITIAL_OPEN_SOURCE_APPS,
  INITIAL_GAMES,
  INITIAL_GAMING_STATE,
  INITIAL_GAME_MODS,
  DEFAULT_GAMEPAD_CALIBRATION
} from '../data/gamingAndStoreDefaults';

interface DistroContextType {
  // Window & Workspace
  windows: WindowState[];
  activeWindowId: string | null;
  activeWorkspace: number;
  setActiveWorkspace: (ws: number) => void;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  bringToFront: (id: string) => void;

  // System & Telemetry
  telemetry: SystemTelemetry;
  toggleDockerDaemon: () => void;
  toggleK8sCluster: () => void;
  toggleOfflineMode: () => void;

  // Docker
  containers: DockerContainer[];
  startContainer: (id: string) => void;
  stopContainer: (id: string) => void;
  pauseContainer: (id: string) => void;
  deleteContainer: (id: string) => void;
  createContainer: (name: string, image: string, port: string) => void;

  // Kubernetes
  pods: K8sPod[];
  deployments: K8sDeployment[];
  scaleDeployment: (name: string, delta: number) => void;
  restartDeployment: (name: string) => void;
  deletePod: (name: string) => void;

  // Packages & DevStore
  packages: DevPackage[];
  installPackage: (id: string) => void;
  uninstallPackage: (id: string) => void;

  // Open Source Software Store (Flathub & AUR)
  openSourceApps: OpenSourceApp[];
  installOpenApp: (id: string) => void;
  uninstallOpenApp: (id: string) => void;

  // Gaming Hub & Proton / GameMode
  games: GameTitle[];
  activeRunningGame: GameTitle | null;
  launchGame: (id: string) => void;
  stopGame: (id: string) => void;
  gamingSettings: GamingSystemState;
  toggleGameMode: () => void;
  toggleMangoHud: () => void;
  toggleProAudio: () => void;
  toggleVkBasalt: () => void;
  setProtonVersion: (ver: string) => void;

  // Workshop Community Game Mods
  gameMods: GameMod[];
  installGameMod: (modId: string) => void;
  uninstallGameMod: (modId: string) => void;
  toggleGameModEnabled: (modId: string) => void;
  reorderGameMod: (modId: string, direction: 'up' | 'down') => void;
  addCustomGameMod: (mod: Omit<GameMod, 'id' | 'installed' | 'enabled' | 'loadOrder'>) => void;

  // Gamepad Calibration & Sensitivity Curves
  updateGamepadCalibration: (settings: Partial<GamepadCalibrationSettings>) => void;
  updateStickCalibration: (stick: 'leftStick' | 'rightStick', settings: Partial<GamepadStickCalibration>) => void;
  resetGamepadCalibration: () => void;
  applyGamepadPreset: (presetName: string) => void;

  // VS Code Studio
  projectFiles: ProjectFile[];
  activeFile: ProjectFile;
  openFileTabs: string[];
  selectFile: (path: string) => void;
  closeFileTab: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  addProjectFile: (name: string, language: string, content: string) => void;
  runBuild: () => Promise<{ durationMs: number; output: string; speedup: string }>;
  isBuilding: boolean;
  buildResult: { durationMs: number; output: string; speedup: string } | null;
  clearBuildResult: () => void;

  // Extensions
  extensions: Extension[];
  toggleExtension: (id: string) => void;

  // Cloud Sync
  syncedDevices: SyncedDevice[];
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncedTimestamp: string;
  triggerCloudSync: () => void;
  exportConfigJson: () => string;
  importConfigJson: (json: string) => boolean;

  // UI & Modals
  theme: DistroTheme;
  setTheme: (t: DistroTheme) => void;
  isLauncherOpen: boolean;
  setIsLauncherOpen: (open: boolean) => void;
  isPaletteOpen: boolean;
  setIsPaletteOpen: (open: boolean) => void;

  // Terminal & Command execution
  terminalHistory: Array<{ command: string; output: string; timestamp: string }>;
  executeTerminalCommand: (cmd: string) => string;
  clearTerminal: () => void;

  // Keybindings
  keybindings: Keybinding[];
  updateKeybinding: (id: string, newKeys: string) => void;
}

const DistroContext = createContext<DistroContextType | undefined>(undefined);

const APP_METADATA: Record<AppId, { title: string; icon: string; defaultWidth: number; defaultHeight: number }> = {
  'vscode': { title: 'VS Code Web Studio', icon: 'Code', defaultWidth: 920, defaultHeight: 640 },
  'docker-k8s': { title: 'Docker & Kubernetes Dashboard', icon: 'Box', defaultWidth: 880, defaultHeight: 600 },
  'devstore': { title: 'DevStore Package Hub', icon: 'Package', defaultWidth: 840, defaultHeight: 580 },
  'open-store': { title: 'Open Source App Center (Flathub & AUR)', icon: 'ShoppingBag', defaultWidth: 880, defaultHeight: 600 },
  'gamedeck': { title: 'DevForge GameDeck & Proton Hub', icon: 'Gamepad2', defaultWidth: 920, defaultHeight: 620 },
  'terminal': { title: 'DevForge Terminal (zsh)', icon: 'Terminal', defaultWidth: 740, defaultHeight: 480 },
  'autoconfig': { title: 'Environment Automation Scripts', icon: 'Wrench', defaultWidth: 820, defaultHeight: 560 },
  'cloudsync': { title: 'Cloud Sync & Device Mesh', icon: 'Cloud', defaultWidth: 780, defaultHeight: 540 },
  'settings': { title: 'System & Distro Customizer', icon: 'Sliders', defaultWidth: 760, defaultHeight: 540 },
  'system-monitor': { title: 'System Resource Monitor', icon: 'Activity', defaultWidth: 720, defaultHeight: 500 },
  'build-optimizer': { title: 'Mold & BuildKit Optimizer', icon: 'Zap', defaultWidth: 740, defaultHeight: 520 },
  'antivirus': { title: 'DevForge ClamAV Antivirus & Security Suite', icon: 'Shield', defaultWidth: 880, defaultHeight: 600 },
  'appgallery': { title: 'HUAWEI AppGallery (HMS & Waydroid)', icon: 'ShoppingBag', defaultWidth: 920, defaultHeight: 620 },
  'discord': { title: 'Discord (Linux Edition)', icon: 'MessageSquare', defaultWidth: 940, defaultHeight: 620 }
};

export const DistroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Workspaces: 1: Code, 2: Containers, 3: DevStore, 4: Terminal, 5: Config
  const [activeWorkspace, setActiveWorkspace] = useState<number>(1);
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'win-vscode',
      appId: 'vscode',
      title: 'VS Code Web Studio',
      icon: 'Code',
      x: 32,
      y: 44,
      width: 900,
      height: 600,
      zIndex: 10,
      isMinimized: false,
      isMaximized: false,
      workspaceId: 1
    }
  ]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('win-vscode');
  const [highestZIndex, setHighestZIndex] = useState<number>(11);

  // Distro System Telemetry
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    cpuUsagePercent: 0.6,
    cpuTempC: 38,
    ramUsedMB: 284,
    ramTotalMB: 16384,
    diskUsedGB: 18.4,
    diskTotalGB: 512,
    ioRateKBps: 24,
    kernelVersion: '6.12.8-devforge-rt',
    uptimeSeconds: 14820,
    isOffline: false,
    dockerDaemonRunning: true,
    k8sClusterRunning: true,
    activeBuildSpeedMultiplier: 4.2
  });

  // Docker & K8s
  const [containers, setContainers] = useState<DockerContainer[]>(INITIAL_CONTAINERS);
  const [pods, setPods] = useState<K8sPod[]>(INITIAL_K8S_PODS);
  const [deployments, setDeployments] = useState<K8sDeployment[]>(INITIAL_K8S_DEPLOYMENTS);

  // Packages & DevStore
  const [packages, setPackages] = useState<DevPackage[]>(INITIAL_PACKAGES);

  // Open Source Software Store
  const [openSourceApps, setOpenSourceApps] = useState<OpenSourceApp[]>(INITIAL_OPEN_SOURCE_APPS);

  // Gaming Hub & Proton GameDeck
  const [games, setGames] = useState<GameTitle[]>(INITIAL_GAMES);
  const [activeRunningGame, setActiveRunningGame] = useState<GameTitle | null>(null);
  const [gamingSettings, setGamingSettings] = useState<GamingSystemState>(INITIAL_GAMING_STATE);
  const [gameMods, setGameMods] = useState<GameMod[]>(INITIAL_GAME_MODS);

  // Code Studio Files
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(INITIAL_PROJECT_FILES);
  const [activeFile, setActiveFile] = useState<ProjectFile>(INITIAL_PROJECT_FILES[0]);
  const [openFileTabs, setOpenFileTabs] = useState<string[]>([
    'docker-compose.yml',
    'Dockerfile',
    'src/server.ts'
  ]);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [buildResult, setBuildResult] = useState<{ durationMs: number; output: string; speedup: string } | null>(null);

  // Extensions
  const [extensions, setExtensions] = useState<Extension[]>(INITIAL_EXTENSIONS);

  // Cloud Sync
  const [syncedDevices, setSyncedDevices] = useState<SyncedDevice[]>(INITIAL_SYNCED_DEVICES);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncedTimestamp, setLastSyncedTimestamp] = useState<string>('Just now');

  // Themes & UI Modals
  const [theme, setTheme] = useState<DistroTheme>('obsidian');
  const [isLauncherOpen, setIsLauncherOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);

  // Terminal History
  const [terminalHistory, setTerminalHistory] = useState<Array<{ command: string; output: string; timestamp: string }>>([
    {
      command: 'devforge --status',
      output: 'DevForge OS 2026.1 (Kernel 6.12.8-rt)\n✓ Docker Daemon: Active [socket: /var/run/docker.sock]\n✓ K3s Cluster: Active [ready: 5 pods, 1 node]\n✓ Mold Linker: v2.34 (Default system linker enabled)\n✓ Idle Memory: 284MB RAM',
      timestamp: '13:00:10'
    }
  ]);

  // Telemetry real-time gentle fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => {
        const deltaCpu = (Math.random() - 0.48) * 0.4;
        const newCpu = Math.max(0.3, Math.min(8.5, +(prev.cpuUsagePercent + deltaCpu).toFixed(1)));
        const deltaRam = Math.floor((Math.random() - 0.5) * 4);
        const newRam = Math.max(260, Math.min(340, prev.ramUsedMB + deltaRam));
        return {
          ...prev,
          cpuUsagePercent: newCpu,
          ramUsedMB: newRam,
          ioRateKBps: Math.floor(Math.random() * 80) + 10,
          uptimeSeconds: prev.uptimeSeconds + 2
        };
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Window Management functions
  const openApp = (appId: AppId) => {
    // Check if app window already exists in any workspace
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      // If it's in another workspace, switch or bring it to current workspace
      setWindows(prev => prev.map(w => {
        if (w.id === existing.id) {
          return {
            ...w,
            workspaceId: activeWorkspace,
            isMinimized: false,
            zIndex: highestZIndex + 1
          };
        }
        return w;
      }));
      setHighestZIndex(prev => prev + 1);
      setActiveWindowId(existing.id);
      return;
    }

    const meta = APP_METADATA[appId] || { title: appId, icon: 'Terminal', defaultWidth: 800, defaultHeight: 520 };
    const newZ = highestZIndex + 1;
    const offset = (windows.length % 5) * 24;

    const newWindow: WindowState = {
      id: `win-${appId}-${Date.now()}`,
      appId,
      title: meta.title,
      icon: meta.icon,
      x: Math.max(20, Math.min(120 + offset, window.innerWidth - meta.defaultWidth - 40)),
      y: Math.max(40, 50 + offset),
      width: meta.defaultWidth,
      height: meta.defaultHeight,
      zIndex: newZ,
      isMinimized: false,
      isMaximized: false,
      workspaceId: activeWorkspace
    };

    setWindows(prev => [...prev, newWindow]);
    setHighestZIndex(newZ);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: string) => {
    const newZ = highestZIndex + 1;
    setHighestZIndex(newZ);
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w));
  };

  const bringToFront = (id: string) => {
    focusWindow(id);
  };

  // System Toggles
  const toggleDockerDaemon = () => {
    setTelemetry(prev => ({
      ...prev,
      dockerDaemonRunning: !prev.dockerDaemonRunning
    }));
  };

  const toggleK8sCluster = () => {
    setTelemetry(prev => ({
      ...prev,
      k8sClusterRunning: !prev.k8sClusterRunning
    }));
  };

  const toggleOfflineMode = () => {
    setTelemetry(prev => {
      const nextOffline = !prev.isOffline;
      setCloudSyncStatus(nextOffline ? 'offline' : 'synced');
      return {
        ...prev,
        isOffline: nextOffline
      };
    });
  };

  // Docker Container Operations
  const startContainer = (id: string) => {
    setContainers(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'running',
          logs: [...c.logs, `[${new Date().toLocaleTimeString()}] [CONTAINER] Started via DevForge container supervisor`]
        };
      }
      return c;
    }));
  };

  const stopContainer = (id: string) => {
    setContainers(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'stopped',
          logs: [...c.logs, `[${new Date().toLocaleTimeString()}] [CONTAINER] Gracefully stopped (SIGTERM)`]
        };
      }
      return c;
    }));
  };

  const pauseContainer = (id: string) => {
    setContainers(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'paused' ? 'running' : 'paused',
          logs: [...c.logs, `[${new Date().toLocaleTimeString()}] [CONTAINER] State changed to ${c.status === 'paused' ? 'running' : 'paused'}`]
        };
      }
      return c;
    }));
  };

  const deleteContainer = (id: string) => {
    setContainers(prev => prev.filter(c => c.id !== id));
  };

  const createContainer = (name: string, image: string, port: string) => {
    const newContainer: DockerContainer = {
      id: `c-${Math.random().toString(36).substring(2, 8)}`,
      name: name.trim() || 'custom-container',
      image: image.trim() || 'alpine:latest',
      command: '/bin/sh',
      status: 'running',
      ports: port ? [port] : [],
      cpuUsage: 0.4,
      memUsageMB: 22,
      created: 'Just now',
      logs: [
        `[${new Date().toLocaleTimeString()}] Pulled ${image} from local zero-latency cache`,
        `[${new Date().toLocaleTimeString()}] Container launched with tmpfs rootfs optimization`
      ]
    };
    setContainers(prev => [newContainer, ...prev]);
  };

  // Kubernetes Operations
  const scaleDeployment = (name: string, delta: number) => {
    setDeployments(prev => prev.map(d => {
      if (d.name === name) {
        const nextDesired = Math.max(1, Math.min(10, d.desired + delta));
        return {
          ...d,
          desired: nextDesired,
          replicas: nextDesired
        };
      }
      return d;
    }));

    // Adjust pods
    if (delta > 0) {
      const newPod: K8sPod = {
        name: `${name}-${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`,
        namespace: 'production',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '10s',
        node: 'devforge-node-01',
        cpuReq: '50m',
        memReq: '64Mi'
      };
      setPods(prev => [newPod, ...prev]);
    } else if (delta < 0) {
      setPods(prev => {
        const matching = prev.filter(p => p.name.startsWith(name));
        if (matching.length > 1) {
          const toRemove = matching[matching.length - 1];
          return prev.filter(p => p.name !== toRemove.name);
        }
        return prev;
      });
    }
  };

  const restartDeployment = (name: string) => {
    setDeployments(prev => prev.map(d => d.name === name ? { ...d } : d));
    // Trigger simulated rolling restart
    setPods(prev => prev.map(p => {
      if (p.name.startsWith(name)) {
        return { ...p, restarts: p.restarts + 1, age: '10s' };
      }
      return p;
    }));
  };

  const deletePod = (name: string) => {
    setPods(prev => prev.filter(p => p.name !== name));
  };

  // DevStore Operations
  const installPackage = (id: string) => {
    setPackages(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, installed: true };
      }
      return p;
    }));
  };

  const uninstallPackage = (id: string) => {
    setPackages(prev => prev.map(p => {
      if (p.id === id && !p.isCore) {
        return { ...p, installed: false };
      }
      return p;
    }));
  };

  // Open Source Software Store Operations
  const installOpenApp = (id: string) => {
    setOpenSourceApps(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, installed: true };
      }
      return app;
    }));
  };

  const uninstallOpenApp = (id: string) => {
    setOpenSourceApps(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, installed: false };
      }
      return app;
    }));
  };

  // Gaming Hub & Proton GameDeck Operations
  const launchGame = (id: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === id) {
        const running = { ...g, status: 'running' as const };
        setActiveRunningGame(running);
        return running;
      }
      return { ...g, status: 'ready' as const };
    }));
  };

  const stopGame = (id: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, status: 'ready' as const };
      }
      return g;
    }));
    setActiveRunningGame(null);
  };

  const toggleGameMode = () => {
    setGamingSettings(prev => ({
      ...prev,
      gameModeDaemonActive: !prev.gameModeDaemonActive
    }));
  };

  const toggleMangoHud = () => {
    setGamingSettings(prev => ({
      ...prev,
      mangoHudOverlayActive: !prev.mangoHudOverlayActive
    }));
  };

  const toggleProAudio = () => {
    setGamingSettings(prev => ({
      ...prev,
      pipeWireProAudio: !prev.pipeWireProAudio
    }));
  };

  const toggleVkBasalt = () => {
    setGamingSettings(prev => ({
      ...prev,
      vkBasaltSharpening: !prev.vkBasaltSharpening
    }));
  };

  const setProtonVersion = (ver: string) => {
    setGamingSettings(prev => ({
      ...prev,
      selectedProtonVersion: ver
    }));
  };

  // Workshop Mod Operations
  const installGameMod = (modId: string) => {
    setGameMods(prev => prev.map(m => m.id === modId ? { ...m, installed: true, enabled: true } : m));
  };

  const uninstallGameMod = (modId: string) => {
    setGameMods(prev => prev.map(m => m.id === modId ? { ...m, installed: false, enabled: false } : m));
  };

  const toggleGameModEnabled = (modId: string) => {
    setGameMods(prev => prev.map(m => m.id === modId ? { ...m, enabled: !m.enabled } : m));
  };

  const reorderGameMod = (modId: string, direction: 'up' | 'down') => {
    setGameMods(prev => {
      const target = prev.find(m => m.id === modId);
      if (!target) return prev;
      const gameModsForThis = prev.filter(m => m.gameId === target.gameId).sort((a, b) => a.loadOrder - b.loadOrder);
      const idx = gameModsForThis.findIndex(m => m.id === modId);
      if (idx < 0) return prev;

      if (direction === 'up' && idx > 0) {
        const prevItem = gameModsForThis[idx - 1];
        const tempOrder = target.loadOrder;
        target.loadOrder = prevItem.loadOrder;
        prevItem.loadOrder = tempOrder;
      } else if (direction === 'down' && idx < gameModsForThis.length - 1) {
        const nextItem = gameModsForThis[idx + 1];
        const tempOrder = target.loadOrder;
        target.loadOrder = nextItem.loadOrder;
        nextItem.loadOrder = tempOrder;
      }
      return [...prev];
    });
  };

  const addCustomGameMod = (mod: Omit<GameMod, 'id' | 'installed' | 'enabled' | 'loadOrder'>) => {
    const newMod: GameMod = {
      ...mod,
      id: `mod-custom-${Date.now().toString(36)}`,
      installed: true,
      enabled: true,
      loadOrder: gameMods.filter(m => m.gameId === mod.gameId).length + 1
    };
    setGameMods(prev => [newMod, ...prev]);
  };

  // Gamepad Calibration Operations
  const updateGamepadCalibration = (settings: Partial<GamepadCalibrationSettings>) => {
    setGamingSettings(prev => ({
      ...prev,
      calibration: {
        ...prev.calibration,
        ...settings
      }
    }));
  };

  const updateStickCalibration = (stick: 'leftStick' | 'rightStick', settings: Partial<GamepadStickCalibration>) => {
    setGamingSettings(prev => ({
      ...prev,
      calibration: {
        ...prev.calibration,
        [stick]: {
          ...prev.calibration[stick],
          ...settings
        }
      }
    }));
  };

  const resetGamepadCalibration = () => {
    setGamingSettings(prev => ({
      ...prev,
      calibration: DEFAULT_GAMEPAD_CALIBRATION
    }));
  };

  const applyGamepadPreset = (presetName: string) => {
    if (presetName === 'FPS Precision Aim (S-Curve)') {
      setGamingSettings(prev => ({
        ...prev,
        calibration: {
          ...prev.calibration,
          presetName,
          leftStick: { innerDeadzone: 8, outerDeadzone: 96, curveType: 'precision', exponent: 1.4, sensX: 100, sensY: 100, antiDeadzone: 0 },
          rightStick: { innerDeadzone: 6, outerDeadzone: 98, curveType: 'precision', exponent: 1.6, sensX: 110, sensY: 95, antiDeadzone: 0 }
        }
      }));
    } else if (presetName === 'Linear 1:1 Direct') {
      setGamingSettings(prev => ({
        ...prev,
        calibration: {
          ...prev.calibration,
          presetName,
          leftStick: { innerDeadzone: 5, outerDeadzone: 98, curveType: 'linear', exponent: 1.0, sensX: 100, sensY: 100, antiDeadzone: 0 },
          rightStick: { innerDeadzone: 5, outerDeadzone: 98, curveType: 'linear', exponent: 1.0, sensX: 100, sensY: 100, antiDeadzone: 0 }
        }
      }));
    } else if (presetName === 'Smooth Ease-In (Racing/Flight)') {
      setGamingSettings(prev => ({
        ...prev,
        calibration: {
          ...prev.calibration,
          presetName,
          leftStick: { innerDeadzone: 10, outerDeadzone: 94, curveType: 'smooth', exponent: 1.8, sensX: 90, sensY: 90, antiDeadzone: 2 },
          rightStick: { innerDeadzone: 8, outerDeadzone: 95, curveType: 'smooth', exponent: 1.5, sensX: 90, sensY: 90, antiDeadzone: 0 }
        }
      }));
    } else if (presetName === 'Aggressive Twitch Snap (Fighting/Arena)') {
      setGamingSettings(prev => ({
        ...prev,
        calibration: {
          ...prev.calibration,
          presetName,
          leftStick: { innerDeadzone: 4, outerDeadzone: 92, curveType: 'aggressive', exponent: 0.7, sensX: 125, sensY: 125, antiDeadzone: 5 },
          rightStick: { innerDeadzone: 4, outerDeadzone: 92, curveType: 'aggressive', exponent: 0.7, sensX: 130, sensY: 130, antiDeadzone: 5 }
        }
      }));
    } else if (presetName === 'Zero Deadzone (Hall Effect)') {
      setGamingSettings(prev => ({
        ...prev,
        calibration: {
          ...prev.calibration,
          presetName,
          leftStick: { innerDeadzone: 1, outerDeadzone: 100, curveType: 'precision', exponent: 1.2, sensX: 100, sensY: 100, antiDeadzone: 0 },
          rightStick: { innerDeadzone: 1, outerDeadzone: 100, curveType: 'precision', exponent: 1.3, sensX: 105, sensY: 100, antiDeadzone: 0 }
        }
      }));
    }
  };

  // VS Code Operations
  const selectFile = (path: string) => {
    const file = projectFiles.find(f => f.path === path);
    if (file) {
      setActiveFile(file);
      if (!openFileTabs.includes(path)) {
        setOpenFileTabs(prev => [...prev, path]);
      }
    }
  };

  const closeFileTab = (path: string) => {
    const nextTabs = openFileTabs.filter(p => p !== path);
    setOpenFileTabs(nextTabs);
    if (activeFile.path === path && nextTabs.length > 0) {
      const nextFile = projectFiles.find(f => f.path === nextTabs[nextTabs.length - 1]);
      if (nextFile) setActiveFile(nextFile);
    }
  };

  const updateFileContent = (path: string, content: string) => {
    setProjectFiles(prev => prev.map(f => {
      if (f.path === path) {
        return { ...f, content, modified: true };
      }
      return f;
    }));
    if (activeFile.path === path) {
      setActiveFile(prev => ({ ...prev, content, modified: true }));
    }
  };

  const addProjectFile = (name: string, language: string, content: string) => {
    const newFile: ProjectFile = {
      path: name,
      name,
      language,
      content,
      modified: false
    };
    setProjectFiles(prev => [...prev, newFile]);
    setOpenFileTabs(prev => [...prev, name]);
    setActiveFile(newFile);
  };

  const runBuild = async (): Promise<{ durationMs: number; output: string; speedup: string }> => {
    setIsBuilding(true);
    await new Promise(res => setTimeout(res, 950));
    const result = {
      durationMs: 742,
      output: `[DevForge BuildKit Engine v0.16]
=> [internal] load local build definition from Dockerfile
=> [internal] load .dockerignore
=> [base 1/2] FROM docker.io/oven/bun:1.2-alpine (CACHED: 0.02s)
=> [deps 1/2] COPY package.json bun.lock* ./ (0.04s)
=> [deps 2/2] RUN --mount=type=cache,target=/root/.bun/install/cache bun install (CACHED: 0.08s)
=> [builder 1/2] RUN bun run build (0.32s)
=> Linking with mold 2.34 (16 threads, zero reloc waste): 0.08s
=> Container image built: devforge/api-gateway:latest (size: 38.4MB)
✓ Build finished in 0.742s (Standard Ubuntu took 3.28s)`,
      speedup: '4.4x faster'
    };
    setBuildResult(result);
    setIsBuilding(false);
    return result;
  };

  const clearBuildResult = () => {
    setBuildResult(null);
  };

  // Extensions
  const toggleExtension = (id: string) => {
    setExtensions(prev => prev.map(ext => ext.id === id ? { ...ext, installed: !ext.installed } : ext));
  };

  // Cloud Sync
  const triggerCloudSync = () => {
    setCloudSyncStatus('syncing');
    setTimeout(() => {
      setCloudSyncStatus('synced');
      setLastSyncedTimestamp('Just now');
      setSyncedDevices(prev => prev.map(d => ({ ...d, lastSync: 'Just now' })));
    }, 1200);
  };

  const exportConfigJson = () => {
    const config = {
      distro: 'DevForge Linux',
      version: '2026.1',
      theme,
      installedPackages: packages.filter(p => p.installed).map(p => p.id),
      installedExtensions: extensions.filter(e => e.installed).map(e => e.id),
      dockerContainers: containers.map(c => ({ name: c.name, image: c.image })),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(config, null, 2);
  };

  const importConfigJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.installedPackages && Array.isArray(parsed.installedPackages)) {
        setPackages(prev => prev.map(p => ({
          ...p,
          installed: parsed.installedPackages.includes(p.id) || p.isCore
        })));
      }
      if (parsed.theme) {
        setTheme(parsed.theme);
      }
      triggerCloudSync();
      return true;
    } catch {
      return false;
    }
  };

  // Terminal Command Executor
  const executeTerminalCommand = (rawCmd: string): string => {
    const cmd = rawCmd.trim();
    const parts = cmd.split(' ');
    const main = parts[0];
    let output = '';

    if (!cmd) return '';

    switch (main) {
      case 'help':
        output = `DevForge Linux 2026.1 Shell Commands:
  docker [ps|run|stop|build]     Container management
  kubectl [get|scale|apply|logs] Kubernetes orchestration
  devforge pkg [list|install]    Package store CLI
  devforge build                 Trigger fast Mold + BuildKit compilation
  devforge sync                  Synchronize workstation dotfiles & settings
  mold --version                 Inspect high-speed linker
  systemctl status               System daemon states
  clear                          Clear terminal screen`;
        break;

      case 'docker':
        if (parts[1] === 'ps') {
          output = `CONTAINER ID   IMAGE                               STATUS          PORTS                    NAMES
8f921a42b10c   devforge/api-gateway:latest         Up 2 hours      0.0.0.0:8080->8080/tcp   api-gateway
3b44e051c221   redis:7.4-alpine                    Up 4 hours      0.0.0.0:6379->6379/tcp   redis-cache
e710bc981240   postgres:17-alpine                  Up 4 hours      0.0.0.0:5432->5432/tcp   postgres-db
912a7f51198c   devforge/worker-rust:mold-optimized Up 1 hour       -                        worker-queue-rust`;
        } else if (parts[1] === 'info') {
          output = `Client: DevForge Docker Engine v27.2.1
Storage Driver: overlay2 (optimized with tmpfs metadata cache)
Logging Driver: json-file
Cgroup Driver: systemd
Plugins: Buildx v0.16, Compose v2.29
Default Linker Acceleration: Mold 2.34 Enabled`;
        } else if (parts[1] === 'build') {
          output = `=> [DevForge BuildKit Engine] Fast build initiated
=> CACHED [base 1/2] FROM oven/bun:1.2-alpine
=> CACHED [deps 2/2] RUN --mount=type=cache
=> Linked with mold in 0.08s
Successfully built devforge/api-gateway:latest (4.2x speedup)`;
        } else {
          output = `Usage: docker [ps | info | build | run | compose]`;
        }
        break;

      case 'kubectl':
      case 'k':
        if (parts[1] === 'get' && (parts[2] === 'pods' || parts[2] === 'po')) {
          output = `NAME                                    READY   STATUS    RESTARTS   AGE
api-gateway-7b94d9f64c-8kz2p            1/1     Running   0          3h
api-gateway-7b94d9f64c-qm89x            1/1     Running   0          3h
worker-processor-58dcf48f8b-t9vlw       1/1     Running   0          2h
coredns-6f6b679f8f-6s2d1                1/1     Running   0          5h
traefik-ingress-controller-4bc9         1/1     Running   0          5h`;
        } else if (parts[1] === 'get' && (parts[2] === 'nodes' || parts[2] === 'no')) {
          output = `NAME               STATUS   ROLES                  AGE   VERSION
devforge-node-01   Ready    control-plane,master   5h    v1.31.2+k3s1`;
        } else if (parts[1] === 'get' && (parts[2] === 'svc' || parts[2] === 'services')) {
          output = `NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes            ClusterIP   10.43.0.1       <none>        443/TCP          5h
api-gateway-service   ClusterIP   10.43.148.210   <none>        80/TCP,8080/TCP  3h`;
        } else {
          output = `k3s cluster active. Commands: kubectl get [pods|nodes|services]`;
        }
        break;

      case 'devforge':
        if (parts[1] === 'pkg') {
          output = `DevStore CLI: 21 packages available, 18 installed.
Run 'devforge pkg install <package-name>' or launch DevStore GUI.`;
        } else if (parts[1] === 'sync') {
          output = `Syncing dotfiles and configs to Cloud Vault...
✓ Authenticated with DevMesh
✓ Pushed VS Code settings
✓ Pushed Keybindings and Zsh aliases
Status: ALL MACHINES IN SYNC (3 connected nodes)`;
        } else if (parts[1] === 'build') {
          output = `Running DevForge parallel multi-core build with Mold linker...
Finished build in 0.74s (4.4x faster than standard GNU linker)`;
        } else {
          output = `DevForge Developer OS Toolchain v2026.1
Usage: devforge [pkg | sync | build | status | config]`;
        }
        break;

      case 'mold':
        output = `mold 2.34.0 (compatible with GNU ld and LLVM lld)
Supported targets: elf_x86_64, elf_aarch64
Parallel linker threads: 16 (Hardware acceleration enabled)
Average link reduction: 82% less time than ld.gold`;
        break;

      case 'flatpak':
        if (parts[1] === 'list') {
          output = `Name                  Application ID                        Version      Branch  Installation
Lutris                net.lutris.Lutris                     0.5.17       stable  system
Heroic Games Launcher com.heroicgameslauncher.hgl           2.14.1       stable  system
Godot Engine          org.godotengine.Godot                 4.3.stable   stable  system
OBS Studio            com.obsproject.Studio                 30.2.3       stable  system
RetroArch             org.libretro.RetroArch                1.19.1       stable  system
SuperTuxKart          net.supertuxkart.SuperTuxKart         1.4          stable  system
Steam (Proton)        com.valvesoftware.Steam               1.0.0.79     stable  system
Bottles               io.github.bottlesdevs.Bottles         51.13        stable  system
Flatseal              com.github.tchx84.Flatseal            2.2.1        stable  system
Mission Center        io.missioncenter.MissionCenter        0.6.2        stable  system`;
        } else if (parts[1] === 'remotes') {
          output = `Name    Title   URL                                     Options
flathub Flathub https://dl.flathub.org/repo/            system,default
devforge DevForge Mirror https://pkgs.devforge.internal/ system`;
        } else {
          output = `Flatpak 1.15.8 (DevForge Sandboxed App Manager)
Commands: flatpak [list | install | update | remotes | run <app-id>]`;
        }
        break;

      case 'gamemode':
      case 'gamemoded':
        output = `GameMode Daemon v1.8.2: ACTIVE [governor=performance, nice=-10, ioprio=0]
Vulkan layer: VK_LAYER_FERAL_gamemode enabled
Shader pre-caching: Direct NVMe /tmpfs cache enabled
Split-lock mitigate: 0 (Disabled to eliminate gaming frame micro-stutter)`;
        break;

      case 'mangohud':
        output = `MangoHud v0.7.2: Vulkan & OpenGL telemetry overlay active
Config: /home/devforge/.config/MangoHud/MangoHud.conf
Displaying: FPS, Frame-time graph, CPU temp, GPU clocks, VRAM, RAM`;
        break;

      case 'proton':
        output = `DevForge Proton Runner Manager:
Default: GE-Proton9-20 (DevForge Custom Build with FSR3 upscaling & Anti-Cheat sync)
Installed runners:
  - GE-Proton9-20 [Active]
  - Proton Experimental [Valve bleeding-edge]
  - Proton 9.0-3
  - Wine Staging 9.18 (vkd3d-proton 2.13)`;
        break;

      case 'workshop':
      case 'mods':
        output = `DevForge Workshop Mod Manager:
Active Games with mods: Cyber Defender, SuperTuxKart, Cyberpunk 2077, OpenMW, Hades II
Total mods discovered: ${gameMods.length} | Installed: ${gameMods.filter(m => m.installed).length} | Enabled: ${gameMods.filter(m => m.enabled).length}
Run 'gamedeck' or open GameDeck -> Workshop to browse, search and install community mods.`;
        break;

      case 'gamepad':
      case 'joystick':
      case 'evdev':
        output = `evdev Gamepad Hardware Calibrator:
Device: ${gamingSettings.activeGamepad}
Polling: 1000 Hz USB-C raw event stream
Left Stick: Deadzone ${gamingSettings.calibration.leftStick.innerDeadzone}% - ${gamingSettings.calibration.leftStick.outerDeadzone}%, Curve: ${gamingSettings.calibration.leftStick.curveType} (exp=${gamingSettings.calibration.leftStick.exponent})
Right Stick: Deadzone ${gamingSettings.calibration.rightStick.innerDeadzone}% - ${gamingSettings.calibration.rightStick.outerDeadzone}%, Curve: ${gamingSettings.calibration.rightStick.curveType} (exp=${gamingSettings.calibration.rightStick.exponent})
Preset: ${gamingSettings.calibration.presetName} · Haptic: ${gamingSettings.calibration.hapticIntensity}%`;
        break;

      case 'clamscan':
      case 'clamav':
      case 'antivirus':
        output = `ClamAV Enterprise Scanner v1.4.1:
clamd daemon: ACTIVE (fanotify kernel on-access monitoring)
Definitions: Daily-2026.09.27-v34 (8,924,102 signatures)
Scanning /home/devforge... Clean! 0 active infections.
Quarantine: 3 isolated payloads in /var/lib/clamav/quarantine
Run 'antivirus' to open the GUI security suite.`;
        break;

      case 'freshclam':
        output = `ClamAV Database Updater (freshclam) 1.4.1:
Connecting to database.clamav.net... OK
daily.cvd is up to date (version: 2026.09.27-v34, sigs: 8924102, f-level: 90, builder: raynman)
main.cvd is up to date (version: 62, sigs: 6647490, f-level: 90, builder: sigmgr)
bytecode.cvd is up to date (version: 335, sigs: 86, f-level: 90, builder: nneul)`;
        break;

      case 'appgallery':
      case 'waydroid':
        output = `HUAWEI AppGallery & Waydroid Container Manager:
LXC Subsystem: RUNNING (Android 13, Wayland VirGL EGL 144Hz)
HMS Core: 6.12.0.301 MicroG Bridge Active
Installed Android Apps: Telegram, Petal Maps, TikTok
Run 'appgallery' to open GUI store.`;
        break;

      case 'discord':
        output = `Discord Linux Edition (v0.0.64):
Audio Backend: PipeWire ProAudio (48kHz, 64-sample buffer, 1.2ms latency)
Krisp Noise Suppression: ENABLED
Connected Servers: DevForge Official, Rust & Systems Dev, Linux Gaming Guild
Running in background. Open with 'discord' app window.`;
        break;

      case 'uname':
        output = `Linux devforge-workstation 6.12.8-devforge-rt #1 SMP PREEMPT_RT x86_64 GNU/Linux`;
        break;

      case 'top':
      case 'htop':
        output = `Tasks: 84 total, 1 running, 83 sleeping
%Cpu(s): 0.6 us, 0.2 sy, 0.0 ni, 99.2 id
MiB Mem :  16384.0 total,  14210.0 free,    284.0 used,   1890.0 buff/cache
PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  1 root      20   0   24180   4100   3200 S   0.0   0.0   0:01.12 systemd
412 devforge  20   0  184200  48200  28100 S   0.4   0.3   0:04.80 bun-api
580 devforge  20   0  112400  28100  18400 S   0.2   0.2   0:02.10 k3s-server`;
        break;

      default:
        output = `bash: ${cmd}: command executed successfully (exit code 0)`;
        break;
    }

    setTerminalHistory(prev => [
      ...prev,
      {
        command: rawCmd,
        output,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    return output;
  };

  const clearTerminal = () => {
    setTerminalHistory([]);
  };

  // Keyboard shortcut definitions
  const [keybindings, setKeybindings] = useState<Keybinding[]>([
    {
      id: 'kb-terminal',
      name: 'Launch Terminal',
      keys: 'Alt+Enter',
      category: 'Launcher',
      action: () => openApp('terminal'),
      description: 'Quickly toggle terminal window'
    },
    {
      id: 'kb-launcher',
      name: 'Spotlight App Launcher',
      keys: 'Alt+Space',
      category: 'Launcher',
      action: () => setIsLauncherOpen(prev => !prev),
      description: 'Quick app runner & search'
    },
    {
      id: 'kb-palette',
      name: 'Command Palette',
      keys: 'Ctrl+Shift+P',
      category: 'Launcher',
      action: () => setIsPaletteOpen(prev => !prev),
      description: 'Run developer actions and system commands'
    },
    {
      id: 'kb-vscode',
      name: 'Open VS Code Studio',
      keys: 'Alt+C',
      category: 'Developer',
      action: () => openApp('vscode'),
      description: 'Focus or open code editor'
    },
    {
      id: 'kb-docker',
      name: 'Open Docker & K8s Dashboard',
      keys: 'Alt+D',
      category: 'Developer',
      action: () => openApp('docker-k8s'),
      description: 'Container engine & pods manager'
    },
    {
      id: 'kb-devstore',
      name: 'Open DevStore',
      keys: 'Alt+S',
      category: 'Developer',
      action: () => openApp('devstore'),
      description: 'Package store and runtime manager'
    },
    {
      id: 'kb-openstore',
      name: 'Open Source App Center',
      keys: 'Alt+F',
      category: 'Developer',
      action: () => openApp('open-store'),
      description: 'Flathub & Open Source application store'
    },
    {
      id: 'kb-gamedeck',
      name: 'DevForge GameDeck & Proton Hub',
      keys: 'Alt+G',
      category: 'Developer',
      action: () => openApp('gamedeck'),
      description: 'Linux gaming center, GameMode, and Proton manager'
    },
    {
      id: 'kb-build',
      name: 'Run Mold Fast Build',
      keys: 'Alt+B',
      category: 'Developer',
      action: () => {
        openApp('vscode');
        runBuild();
      },
      description: 'Trigger fast compilation'
    },
    {
      id: 'kb-ws1',
      name: 'Switch to Workspace 1 (Code)',
      keys: 'Alt+1',
      category: 'Workspace',
      action: () => setActiveWorkspace(1),
      description: 'Go to workspace 1'
    },
    {
      id: 'kb-ws2',
      name: 'Switch to Workspace 2 (Containers)',
      keys: 'Alt+2',
      category: 'Workspace',
      action: () => setActiveWorkspace(2),
      description: 'Go to workspace 2'
    },
    {
      id: 'kb-ws3',
      name: 'Switch to Workspace 3 (DevStore)',
      keys: 'Alt+3',
      category: 'Workspace',
      action: () => setActiveWorkspace(3),
      description: 'Go to workspace 3'
    },
    {
      id: 'kb-ws4',
      name: 'Switch to Workspace 4 (Terminal)',
      keys: 'Alt+4',
      category: 'Workspace',
      action: () => setActiveWorkspace(4),
      description: 'Go to workspace 4'
    },
    {
      id: 'kb-ws5',
      name: 'Switch to Workspace 5 (Config)',
      keys: 'Alt+5',
      category: 'Workspace',
      action: () => setActiveWorkspace(5),
      description: 'Go to workspace 5'
    }
  ]);

  const updateKeybinding = (id: string, newKeys: string) => {
    setKeybindings(prev => prev.map(kb => kb.id === id ? { ...kb, keys: newKeys } : kb));
  };

  // Global browser keyboard listener for customizable shortcuts!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Alt+Space for launcher
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        setIsLauncherOpen(prev => !prev);
        return;
      }

      // Check Ctrl+Shift+P for Command Palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
        return;
      }

      // Check Alt+Enter for terminal
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        openApp('terminal');
        return;
      }

      // Check Alt+C for code
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        openApp('vscode');
        return;
      }

      // Check Alt+D for Docker
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        openApp('docker-k8s');
        return;
      }

      // Check Alt+S for DevStore
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        openApp('devstore');
        return;
      }

      // Check Alt+F for Open Source App Center
      if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        openApp('open-store');
        return;
      }

      // Check Alt+G for GameDeck
      if (e.altKey && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        openApp('gamedeck');
        return;
      }

      // Check Alt+1..5 for workspaces
      if (e.altKey && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        setActiveWorkspace(parseInt(e.key, 10));
        return;
      }

      // Escape closes modals
      if (e.key === 'Escape') {
        setIsLauncherOpen(false);
        setIsPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWorkspace, highestZIndex]);

  return (
    <DistroContext.Provider
      value={{
        windows,
        activeWindowId,
        activeWorkspace,
        setActiveWorkspace,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        bringToFront,

        telemetry,
        toggleDockerDaemon,
        toggleK8sCluster,
        toggleOfflineMode,

        containers,
        startContainer,
        stopContainer,
        pauseContainer,
        deleteContainer,
        createContainer,

        pods,
        deployments,
        scaleDeployment,
        restartDeployment,
        deletePod,

        packages,
        installPackage,
        uninstallPackage,

        openSourceApps,
        installOpenApp,
        uninstallOpenApp,

        games,
        activeRunningGame,
        launchGame,
        stopGame,
        gamingSettings,
        toggleGameMode,
        toggleMangoHud,
        toggleProAudio,
        toggleVkBasalt,
        setProtonVersion,

        gameMods,
        installGameMod,
        uninstallGameMod,
        toggleGameModEnabled,
        reorderGameMod,
        addCustomGameMod,

        updateGamepadCalibration,
        updateStickCalibration,
        resetGamepadCalibration,
        applyGamepadPreset,

        projectFiles,
        activeFile,
        openFileTabs,
        selectFile,
        closeFileTab,
        updateFileContent,
        addProjectFile,
        runBuild,
        isBuilding,
        buildResult,
        clearBuildResult,

        extensions,
        toggleExtension,

        syncedDevices,
        cloudSyncStatus,
        lastSyncedTimestamp,
        triggerCloudSync,
        exportConfigJson,
        importConfigJson,

        theme,
        setTheme,
        isLauncherOpen,
        setIsLauncherOpen,
        isPaletteOpen,
        setIsPaletteOpen,

        terminalHistory,
        executeTerminalCommand,
        clearTerminal,

        keybindings,
        updateKeybinding
      }}
    >
      {children}
    </DistroContext.Provider>
  );
};

export const useDistro = () => {
  const context = useContext(DistroContext);
  if (!context) {
    throw new Error('useDistro must be used within a DistroProvider');
  }
  return context;
};

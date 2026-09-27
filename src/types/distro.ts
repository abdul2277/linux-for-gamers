/**
 * Type definitions for DevForge Linux OS
 */

export type AppId = 
  | 'vscode'
  | 'docker-k8s'
  | 'devstore'
  | 'open-store'
  | 'gamedeck'
  | 'terminal'
  | 'autoconfig'
  | 'cloudsync'
  | 'settings'
  | 'system-monitor'
  | 'build-optimizer'
  | 'antivirus'
  | 'appgallery'
  | 'discord';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  workspaceId: number;
}

export type DistroTheme = 'obsidian' | 'tokyo' | 'nord' | 'cyber-slate' | 'gruvbox';

export interface SystemTelemetry {
  cpuUsagePercent: number;
  cpuTempC: number;
  ramUsedMB: number;
  ramTotalMB: number;
  diskUsedGB: number;
  diskTotalGB: number;
  ioRateKBps: number;
  kernelVersion: string;
  uptimeSeconds: number;
  isOffline: boolean;
  dockerDaemonRunning: boolean;
  k8sClusterRunning: boolean;
  activeBuildSpeedMultiplier: number;
}

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  command: string;
  status: 'running' | 'paused' | 'stopped';
  ports: string[];
  cpuUsage: number;
  memUsageMB: number;
  created: string;
  logs: string[];
}

export interface K8sPod {
  name: string;
  namespace: string;
  ready: string;
  status: 'Running' | 'Pending' | 'Terminating' | 'CrashLoopBackOff';
  restarts: number;
  age: string;
  node: string;
  cpuReq: string;
  memReq: string;
}

export interface K8sDeployment {
  name: string;
  namespace: string;
  replicas: number;
  desired: number;
  image: string;
  servicePort: number;
  strategy: 'RollingUpdate' | 'Recreate';
}

export type PackageCategory = 
  | 'languages'
  | 'containers'
  | 'devops'
  | 'databases'
  | 'toolchains'
  | 'cli-tools';

export interface DevPackage {
  id: string;
  name: string;
  category: PackageCategory;
  version: string;
  description: string;
  sizeMB: number;
  installed: boolean;
  isCore: boolean;
  buildAccelerationBenefit?: string;
  dependencies: string[];
  command: string;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: string;
  content: string;
  modified?: boolean;
}

export interface DevStackPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  packages: string[];
  features: string[];
  buildSpeedup: string;
  defaultFiles: ProjectFile[];
}

export interface SyncedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'cloud-vps';
  os: string;
  lastSync: string;
  isCurrent: boolean;
  status: 'online' | 'synced' | 'pending';
}

export interface Keybinding {
  id: string;
  name: string;
  keys: string;
  category: 'Window' | 'Launcher' | 'Workspace' | 'Developer';
  action: () => void;
  description: string;
}

export interface Extension {
  id: string;
  name: string;
  publisher: string;
  version: string;
  description: string;
  downloads: string;
  installed: boolean;
  category: 'Language' | 'Docker/K8s' | 'Theme' | 'Formatter' | 'Tool';
}

export type OpenStoreCategory = 
  | 'All' 
  | 'Gaming' 
  | 'Development' 
  | 'Graphics & Media' 
  | 'Productivity' 
  | 'Utilities';

export interface OpenSourceApp {
  id: string;
  name: string;
  summary: string;
  description: string;
  category: OpenStoreCategory;
  source: 'Flathub' | 'AUR' | 'AppImage' | 'F-Droid Mirror';
  version: string;
  license: string;
  installed: boolean;
  sizeMB: number;
  developer: string;
  rating: number;
  downloadCount: string;
  iconBg: string;
  verifiedFOSS: boolean;
  flatpakPermissions?: string[];
}

export interface GameTitle {
  id: string;
  name: string;
  runner: 'Native Linux' | 'GE-Proton 9.20' | 'Proton Experimental' | 'Wine Staging' | 'RetroArch' | 'Godot 4.3';
  platform: 'Open Source' | 'Steam' | 'Heroic (GOG/Epic)' | 'Lutris' | 'Emulation';
  category: 'Action' | 'Strategy' | 'Racing' | 'RPG' | 'Engine Dev' | 'Arcade';
  status: 'ready' | 'running' | 'installing';
  fpsTarget: number;
  currentFps?: number;
  gameModeActive: boolean;
  mangoHudActive: boolean;
  playTimeHours: number;
  sizeGB: number;
  bannerColor: string;
  isInteractiveMiniGame?: boolean;
}

export interface GameMod {
  id: string;
  gameId: string;
  gameName: string;
  title: string;
  author: string;
  version: string;
  rating: number;
  reviewsCount: number;
  downloads: string;
  sizeMB: number;
  category: 'Graphics' | 'Gameplay' | 'Total Conversion' | 'Audio' | 'UI' | 'Maps' | 'Performance';
  summary: string;
  description: string;
  installed: boolean;
  enabled: boolean;
  loadOrder: number;
  tags: string[];
  accentColor: string;
  compatibility: 'Verified (Proton 9+)' | 'Native' | 'Flawless';
  inGameEffectKey?: 'neonLaser' | 'rapidFire' | 'speedBoost' | 'scanlines';
}

export type GamepadCurveType = 'linear' | 'precision' | 'smooth' | 'aggressive' | 'custom';

export interface GamepadStickCalibration {
  innerDeadzone: number; // 0 - 30%
  outerDeadzone: number; // 70 - 100%
  curveType: GamepadCurveType;
  exponent: number; // 0.5 - 3.0
  sensX: number; // 50 - 200%
  sensY: number; // 50 - 200%
  antiDeadzone: number; // 0 - 25%
}

export interface GamepadCalibrationSettings {
  leftStick: GamepadStickCalibration;
  rightStick: GamepadStickCalibration;
  triggerDeadzoneL2: number; // 0 - 30%
  triggerDeadzoneR2: number; // 0 - 30%
  hapticIntensity: number; // 0 - 100%
  presetName: string;
}

export interface GamingSystemState {
  gameModeDaemonActive: boolean;
  mangoHudOverlayActive: boolean;
  selectedProtonVersion: string;
  activeGamepad: string;
  vkBasaltSharpening: boolean;
  pipeWireProAudio: boolean;
  shaderCachePrewarmed: boolean;
  calibration: GamepadCalibrationSettings;
}

// Antivirus Security Suite Types
export interface AntivirusThreat {
  id: string;
  filename: string;
  path: string;
  threatName: string;
  threatType: 'Trojan' | 'Ransomware' | 'Cryptominer' | 'Backdoor' | 'Malicious Script' | 'Rootkit';
  severity: 'critical' | 'high' | 'medium';
  detectedAt: string;
  status: 'quarantined' | 'cleaned' | 'whitelisted';
  sizeKB: number;
}

export interface AntivirusStatus {
  realTimeProtection: boolean;
  clamDaemonActive: boolean;
  onAccessWatch: boolean;
  heuristicLevel: 'low' | 'standard' | 'enhanced' | 'paranoid';
  definitionsVersion: string;
  signaturesCount: number;
  lastScanTimestamp: string;
  filesScannedTotal: number;
  threatsBlockedTotal: number;
  dockerContainerScanActive: boolean;
}

// Huawei AppGallery Types
export interface AppGalleryApp {
  id: string;
  name: string;
  packageName: string;
  developer: string;
  category: 'Top Apps' | 'Games' | 'Social' | 'Productivity' | 'Entertainment' | 'Tools';
  rating: number;
  reviewsCount: string;
  downloads: string;
  sizeMB: number;
  version: string;
  iconBg: string;
  installed: boolean;
  summary: string;
  description: string;
  verifiedHms: boolean;
  isAndroidApk: boolean;
  waydroidCompatible: boolean;
  permissions: string[];
}

// Discord Types
export interface DiscordMessage {
  id: string;
  author: string;
  avatarBg: string;
  roleColor?: string;
  isBot?: boolean;
  timestamp: string;
  content: string;
  codeBlock?: { language: string; code: string };
  reactions?: Array<{ emoji: string; count: number; active: boolean }>;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  unread?: boolean;
  topic?: string;
}

export interface DiscordServer {
  id: string;
  name: string;
  shortName: string;
  iconBg: string;
  unreadCount?: number;
  channels: DiscordChannel[];
}


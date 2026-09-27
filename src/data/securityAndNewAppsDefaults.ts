import { 
  AntivirusThreat, 
  AntivirusStatus, 
  AppGalleryApp, 
  DiscordServer, 
  DiscordMessage 
} from '../types/distro';

export const INITIAL_ANTIVIRUS_STATUS: AntivirusStatus = {
  realTimeProtection: true,
  clamDaemonActive: true,
  onAccessWatch: true,
  heuristicLevel: 'enhanced',
  definitionsVersion: 'Daily-2026.09.27-v34',
  signaturesCount: 8924102,
  lastScanTimestamp: 'Today, 11:42 AM',
  filesScannedTotal: 184520,
  threatsBlockedTotal: 3,
  dockerContainerScanActive: true
};

export const INITIAL_ANTIVIRUS_THREATS: AntivirusThreat[] = [
  {
    id: 'threat-1',
    filename: 'invoice_sept2026_spec.pdf.exe',
    path: '/home/devforge/Downloads/invoice_sept2026_spec.pdf.exe',
    threatName: 'Win.Trojan.AgentTesla-9921',
    threatType: 'Trojan',
    severity: 'critical',
    detectedAt: 'Today, 10:14 AM',
    status: 'quarantined',
    sizeKB: 412
  },
  {
    id: 'threat-2',
    filename: '.sys-worker-cache',
    path: '/tmp/.sys-worker-cache',
    threatName: 'Linux.Miner.XMRig-StealthHook',
    threatType: 'Cryptominer',
    severity: 'high',
    detectedAt: 'Yesterday, 4:28 PM',
    status: 'quarantined',
    sizeKB: 1840
  },
  {
    id: 'threat-3',
    filename: 'event-stream-malicious.tgz',
    path: '/home/devforge/.npm/_cacache/content-v2/sha512/evil-payload.tgz',
    threatName: 'JS.SupplyChain.DataExfil-2026',
    threatType: 'Malicious Script',
    severity: 'high',
    detectedAt: 'Sep 25, 2026',
    status: 'quarantined',
    sizeKB: 88
  }
];

export const INITIAL_APPGALLERY_APPS: AppGalleryApp[] = [
  {
    id: 'com.zhiliaoapp.musically',
    name: 'TikTok',
    packageName: 'com.zhiliaoapp.musically',
    developer: 'TikTok Pte. Ltd.',
    category: 'Top Apps',
    rating: 4.8,
    reviewsCount: '89.4M',
    downloads: '2.1B',
    sizeMB: 114,
    version: '34.2.1',
    iconBg: 'from-black via-neutral-900 to-slate-900',
    installed: false,
    summary: 'Global short-form video platform with hardware-accelerated video decoding on Linux Waydroid.',
    description: 'Explore trending videos, creative tools, and live streams. Optimized for Linux Waydroid containerization with full audio, multi-touch input, and camera passthrough.',
    verifiedHms: true,
    isAndroidApk: true,
    waydroidCompatible: true,
    permissions: ['Microphone', 'Camera', 'Storage', 'Network']
  },
  {
    id: 'org.telegram.messenger',
    name: 'Telegram Messenger',
    packageName: 'org.telegram.messenger.web',
    developer: 'Telegram FZ-LLC',
    category: 'Social',
    rating: 4.9,
    reviewsCount: '45.1M',
    downloads: '980M',
    sizeMB: 72,
    version: '11.1.2',
    iconBg: 'from-sky-500 to-blue-600',
    installed: true,
    summary: 'Fast, secure and cloud-synced messaging app with instant secret chats and massive channels.',
    description: 'Pure instant messaging — simple, fast, secure, and synced across all your devices. Features unlimited cloud storage for documents, videos, and music.',
    verifiedHms: true,
    isAndroidApk: true,
    waydroidCompatible: true,
    permissions: ['Notifications', 'Contacts', 'Storage']
  },
  {
    id: 'cn.wps.moffice_eng',
    name: 'WPS Office Suite',
    packageName: 'cn.wps.moffice_eng',
    developer: 'Kingsoft Office Software',
    category: 'Productivity',
    rating: 4.8,
    reviewsCount: '21.5M',
    downloads: '640M',
    sizeMB: 98,
    version: '18.4.0',
    iconBg: 'from-orange-500 to-red-600',
    installed: false,
    summary: 'All-in-one complete office suite: Writer, Spreadsheet, Presentation, and PDF Editor.',
    description: 'Integrates all office word processor functions: Word, PDF, Excel, PowerPoint, Forms, as well as Cloud Storage, Template Gallery, and Online Editing & Sharing.',
    verifiedHms: true,
    isAndroidApk: true,
    waydroidCompatible: true,
    permissions: ['Documents', 'Storage', 'Print']
  },
  {
    id: 'com.huawei.maps.app',
    name: 'Petal Maps',
    packageName: 'com.huawei.maps.app',
    developer: 'Huawei Technologies Co., Ltd.',
    category: 'Tools',
    rating: 4.6,
    reviewsCount: '8.2M',
    downloads: '420M',
    sizeMB: 84,
    version: '4.2.0',
    iconBg: 'from-emerald-500 to-teal-700',
    installed: true,
    summary: 'Next-gen navigation and global mapping service with 3D lane guidance and offline maps.',
    description: 'Petal Maps offers location-based services, real-time traffic updates, lane-level navigation, and head-up display mode with zero telemetry tracking.',
    verifiedHms: true,
    isAndroidApk: true,
    waydroidCompatible: true,
    permissions: ['Location (GPS)', 'Network', 'Display over other apps']
  },
  {
    id: 'com.tencent.ig',
    name: 'PUBG MOBILE',
    packageName: 'com.tencent.ig',
    developer: 'Level Infinite / LightSpeed',
    category: 'Games',
    rating: 4.7,
    reviewsCount: '62.8M',
    downloads: '890M',
    sizeMB: 780,
    version: '3.4.0',
    iconBg: 'from-amber-600 to-yellow-800',
    installed: false,
    summary: 'Intense 100-player Battle Royale with Vulkan Android rendering and custom keymapping.',
    description: 'Classic battlegrounds with realistic ballistics, squad voice chat, dynamic weather, and anti-cheat compatibility through Waydroid Vulkan translator.',
    verifiedHms: true,
    isAndroidApk: true,
    waydroidCompatible: true,
    permissions: ['Audio Record', 'Storage', 'Graphics Acceleration']
  },
  {
    id: 'com.miHoYo.GenshinImpact',
    name: 'Genshin Impact',
    packageName: 'com.miHoYo.GenshinImpact',
    developer: 'COGNOSPHERE PTE. LTD.',
    category: 'Games',
    rating: 4.9,
    reviewsCount: '34.2M',
    downloads: '310M',
    sizeMB: 340,
    version: '5.1.0',
    iconBg: 'from-indigo-600 via-purple-700 to-pink-800',
    installed: false,
    summary: 'Open-world action RPG featuring elemental combat and massive exploration across Teyvat.',
    description: 'Step into Teyvat, a vast world teeming with life and flowing with elemental energy. Features cross-platform cloud saves and full controller support.',
    verifiedHms: true,
    isAndroidApk: true,
    waydroidCompatible: true,
    permissions: ['Network', 'Storage', 'Game Controller']
  },
  {
    id: 'tv.danmaku.bili',
    name: 'Bilibili',
    packageName: 'tv.danmaku.bili',
    developer: 'Shanghai Hode Information Tech',
    category: 'Entertainment',
    rating: 4.8,
    reviewsCount: '19.4M',
    downloads: '520M',
    sizeMB: 122,
    version: '7.82.0',
    iconBg: 'from-pink-500 to-rose-600',
    installed: false,
    summary: 'Leading animation, comic, and gaming cultural video community with live bullet-chat.',
    description: 'High-definition 4K 60FPS streaming, anime simulcasts, creative creators, and rich cultural video community.',
    verifiedHms: true,
    isAndroidApk: true,
    waydroidCompatible: true,
    permissions: ['Audio/Video', 'Network', 'PiP Window']
  },
  {
    id: 'com.lemon.lvoverseas',
    name: 'CapCut Video Editor',
    packageName: 'com.lemon.lvoverseas',
    developer: 'Bytedance Pte. Ltd.',
    category: 'Entertainment',
    rating: 4.8,
    reviewsCount: '28.1M',
    downloads: '750M',
    sizeMB: 135,
    version: '12.6.0',
    iconBg: 'from-neutral-800 via-neutral-900 to-black',
    installed: false,
    summary: 'Intuitive video editing app with smart AI cutout, auto captions, and trending music filters.',
    description: 'Easy-to-use video editor with keyframe animation, smooth slow-motion, chrome key, and video stabilization for creators.',
    verifiedHms: true,
    isAndroidApk: true,
    waydroidCompatible: true,
    permissions: ['Storage Media', 'Hardware Encoder']
  }
];

export const INITIAL_DISCORD_SERVERS: DiscordServer[] = [
  {
    id: 'srv-devforge',
    name: 'DevForge Linux Official',
    shortName: 'DF',
    iconBg: 'bg-cyan-600',
    unreadCount: 3,
    channels: [
      { id: 'ch-announcements', name: 'announcements', type: 'text', unread: true, topic: 'Official DevForge distro releases, kernel 6.12 updates, and security advisories' },
      { id: 'ch-dev-chat', name: 'dev-chat', type: 'text', topic: 'General software engineering, Rust, Bun, Python and systems programming' },
      { id: 'ch-containers', name: 'container-ops', type: 'text', topic: 'Docker, Kubernetes K3s, Podman, and microservices clustering' },
      { id: 'ch-linux-gaming', name: 'linux-gaming', type: 'text', topic: 'Proton GE, Vulkan drivers, MangoHud telemetry, and performance tuning' },
      { id: 'ch-game-mods', name: 'workshop-mods', type: 'text', topic: 'Community game mods, custom shaders, and texture overhaul sharing' },
      { id: 'ch-voice-lounge', name: 'Voice Lounge (PipeWire ProAudio)', type: 'voice' },
      { id: 'ch-squad-comms', name: 'Squad Comms (1000Hz Low Latency)', type: 'voice' }
    ]
  },
  {
    id: 'srv-rust',
    name: 'Rust & Systems Programming',
    shortName: 'RS',
    iconBg: 'bg-amber-600',
    channels: [
      { id: 'ch-rust-general', name: 'rust-general', type: 'text', topic: 'Borrow checker wizardry and zero-cost abstractions' },
      { id: 'ch-mold-linker', name: 'mold-benchmarks', type: 'text', topic: 'Sub-second compilation speed with Mold linker' }
    ]
  },
  {
    id: 'srv-gaming',
    name: 'Linux Gaming Guild',
    shortName: 'LG',
    iconBg: 'bg-purple-600',
    channels: [
      { id: 'ch-game-showcase', name: 'game-showcase', type: 'text', topic: 'Cyber Defender 2026 scores and Steam Deck benchmarks' },
      { id: 'ch-emulation', name: 'retro-emulators', type: 'text', topic: 'Waydroid Android emulation and RetroArch shaders' }
    ]
  }
];

export const INITIAL_DISCORD_MESSAGES: Record<string, DiscordMessage[]> = {
  'ch-announcements': [
    {
      id: 'msg-1',
      author: 'DevForge Core Team',
      avatarBg: 'bg-gradient-to-tr from-cyan-600 to-blue-600',
      roleColor: 'text-cyan-400',
      isBot: true,
      timestamp: 'Today at 10:00 AM',
      content: '🚀 **DevForge Linux Update v2026.09.27 Released!**\n\nIncluded in this milestone:\n- **ClamAV Enterprise Security Suite**: Real-time on-access filesystem scanning and Docker container image vulnerability scanner.\n- **Huawei AppGallery Hub**: Direct access to verified Android/HarmonyOS applications running inside accelerated Waydroid LXC sandbox.\n- **Discord Desktop Edition**: Connected directly to PipeWire ProAudio for 12ms crystal-clear voice comms.\n- **GameDeck Workshop**: Search, install, and hot-load community mods directly into game prefixes.\n- **evdev Gamepad Calibrator**: Deadzones and custom sensitivity curves with live SVG graph transfer visualization.',
      reactions: [
        { emoji: '🔥', count: 48, active: true },
        { emoji: '⚡', count: 32, active: true },
        { emoji: '🐧', count: 64, active: false }
      ]
    }
  ],
  'ch-dev-chat': [
    {
      id: 'msg-2',
      author: 'Linus_Fan99',
      avatarBg: 'bg-indigo-600',
      roleColor: 'text-indigo-300',
      timestamp: 'Today at 11:15 AM',
      content: 'Just ran a 100k lines of Rust build using Mold linker on DevForge. Re-linking took **0.24 seconds** instead of 3.8s on GNU ld! Fast build times are no joke here.',
      reactions: [{ emoji: '🚀', count: 12, active: true }]
    },
    {
      id: 'msg-3',
      author: 'DevForge Engineer',
      avatarBg: 'bg-cyan-600',
      roleColor: 'text-cyan-400',
      timestamp: 'Today at 11:22 AM',
      content: 'Glad you like it! We pre-configured `/usr/bin/mold -run` into cargo config and Docker BuildKit tmpfs caching by default.',
      codeBlock: {
        language: 'toml',
        code: '[target.x86_64-unknown-linux-gnu]\nlinker = "clang"\nrustflags = ["-C", "link-arg=-fuse-ld=/usr/bin/mold"]'
      },
      reactions: [{ emoji: '❤️', count: 8, active: false }]
    }
  ],
  'ch-linux-gaming': [
    {
      id: 'msg-4',
      author: 'VulkanRacer',
      avatarBg: 'bg-emerald-600',
      roleColor: 'text-emerald-300',
      timestamp: 'Today at 12:05 PM',
      content: 'The new **evdev Gamepad Deadzone & Sensitivity Curve panel** in GameDeck fixed my DualSense analog stick drift completely. Set inner deadzone to 8% and S-curve exponent to 1.5x — micro-aiming feels like native mouse precision now!',
      reactions: [{ emoji: '🎯', count: 15, active: true }]
    },
    {
      id: 'msg-5',
      author: 'ShaderMaster',
      avatarBg: 'bg-purple-600',
      roleColor: 'text-purple-300',
      timestamp: 'Today at 12:30 PM',
      content: 'Also check out the **Neon Synthwave & Bloom Shaders** mod in the Community Workshop for *Cyber Defender 2026*. The laser bloom and CRT scanline emulation looks stunning on OLED screens.',
      reactions: [{ emoji: '✨', count: 19, active: true }]
    }
  ]
};

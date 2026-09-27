import React, { useState, useEffect, useRef } from 'react';
import { useDistro } from '../../context/DistroContext';
import { GameTitle, GameMod, GamepadCurveType, GamepadStickCalibration } from '../../types/distro';
import { 
  Gamepad2, 
  Play, 
  Square, 
  Flame, 
  Activity, 
  Cpu, 
  Zap, 
  Sliders, 
  RefreshCw, 
  Check, 
  Shield, 
  Layers, 
  Volume2, 
  Crosshair, 
  Sparkles, 
  Search, 
  Download, 
  Trash2, 
  Plus, 
  MoveUp, 
  MoveDown, 
  Package, 
  FolderOpen, 
  Star, 
  RotateCcw, 
  Tag, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  SlidersHorizontal,
  Wrench
} from 'lucide-react';

export const GameDeckApp: React.FC = () => {
  const { 
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
    applyGamepadPreset
  } = useDistro();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'library' | 'workshop' | 'benchmark' | 'proton-runners' | 'gamepad'>('library');
  const [selectedGameId, setSelectedGameId] = useState<string>(games[0]?.id || 'game-cyber-defender');

  // Workshop Browser State
  const [workshopView, setWorkshopView] = useState<'browse' | 'installed' | 'create'>('browse');
  const [workshopGameFilter, setWorkshopGameFilter] = useState<string>('all');
  const [workshopCategoryFilter, setWorkshopCategoryFilter] = useState<string>('All');
  const [workshopSearch, setWorkshopSearch] = useState<string>('');
  const [workshopSort, setWorkshopSort] = useState<'popular' | 'rating' | 'downloads'>('popular');
  const [installingModId, setInstallingModId] = useState<string | null>(null);
  const [inspectingMod, setInspectingMod] = useState<GameMod | null>(null);
  const [newModForm, setNewModForm] = useState({
    title: '',
    gameId: games[0]?.id || 'game-cyber-defender',
    author: 'devforge',
    category: 'Gameplay' as GameMod['category'],
    summary: '',
    description: '',
    tags: 'Custom, Community, Linux'
  });

  // Gamepad Settings State
  const [activeStickTab, setActiveStickTab] = useState<'leftStick' | 'rightStick' | 'triggers'>('leftStick');
  const [virtualStickPos, setVirtualStickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingStick, setIsDraggingStick] = useState(false);
  const [isHapticPulsing, setIsHapticPulsing] = useState(false);
  const stickPadRef = useRef<HTMLDivElement | null>(null);

  // Interactive Mini-Game / Benchmark Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [score, setScore] = useState(0);
  const [liveFps, setLiveFps] = useState(144);
  const [frameTimeMs, setFrameTimeMs] = useState(6.9);
  const gameStateRef = useRef({
    playerX: 250,
    playerSpeed: 7,
    lasers: [] as Array<{ x: number; y: number; vy: number; color?: string; width?: number }>,
    enemies: [] as Array<{ x: number; y: number; vx: number; hp: number }>,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }>,
    keys: { left: false, right: false, space: false },
    score: 0,
    lastFrameTime: performance.now(),
    frameCount: 0,
    lastFireTime: 0
  });

  const selectedGame = games.find(g => g.id === selectedGameId);

  // Filtered Game Mods for Active Benchmark Game
  const activeCyberDefenderMods = gameMods.filter(m => m.gameId === 'game-cyber-defender' && m.installed && m.enabled);
  const isNeonLaserActive = activeCyberDefenderMods.some(m => m.inGameEffectKey === 'neonLaser');
  const isRapidFireActive = activeCyberDefenderMods.some(m => m.inGameEffectKey === 'rapidFire');
  const isSpeedBoostActive = activeCyberDefenderMods.some(m => m.inGameEffectKey === 'speedBoost');
  const isScanlinesActive = activeCyberDefenderMods.some(m => m.inGameEffectKey === 'scanlines');

  // Proton Runner versions available
  const protonRunners = [
    {
      id: 'GE-Proton9-20 (DevForge Custom Build)',
      name: 'GE-Proton 9.20 (DevForge Optimized)',
      features: 'FSR 3.1 frame-gen, VKD3D 2.14, Anti-cheat sync, DXVK 2.4.1',
      recommended: true
    },
    {
      id: 'Proton Experimental',
      name: 'Valve Proton Experimental',
      features: 'Latest Valve bleeding-edge fixes and day-one AAA game patches',
      recommended: false
    },
    {
      id: 'Proton 9.0-3',
      name: 'Proton 9.0-3 Stable',
      features: 'Tested baseline runner for standard Steam Deck verified catalog',
      recommended: false
    },
    {
      id: 'Wine Staging 9.18-esync',
      name: 'Wine Staging 9.18 (Esync/Fsync)',
      features: 'Ideal for standalone GOG/Epic games and Bottles containers',
      recommended: false
    }
  ];

  // Helper to handle mod installation with visual feedback
  const handleInstallMod = (modId: string) => {
    setInstallingModId(modId);
    setTimeout(() => {
      installGameMod(modId);
      setInstallingModId(null);
    }, 450);
  };

  // Helper to handle creating custom mod
  const handleCreateCustomMod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModForm.title.trim()) return;

    const targetGame = games.find(g => g.id === newModForm.gameId);
    addCustomGameMod({
      gameId: newModForm.gameId,
      gameName: targetGame?.name || 'Custom Game',
      title: newModForm.title,
      author: newModForm.author || 'devforge',
      version: '1.0.0',
      rating: 5.0,
      reviewsCount: 1,
      downloads: '1',
      sizeMB: Math.floor(Math.random() * 40) + 5,
      category: newModForm.category,
      summary: newModForm.summary || 'Custom community mod created in DevForge workshop.',
      description: newModForm.description || 'Custom user mod loaded into runtime prefix.',
      tags: newModForm.tags.split(',').map(t => t.trim()),
      accentColor: 'from-cyan-500 to-indigo-600',
      compatibility: 'Native'
    });

    setNewModForm({
      title: '',
      gameId: games[0]?.id || 'game-cyber-defender',
      author: 'devforge',
      category: 'Gameplay',
      summary: '',
      description: '',
      tags: 'Custom, Community, Linux'
    });
    setWorkshopView('installed');
  };

  // Gamepad Deadzone & Response Curve Math Functions
  const currentCalibrationStick: GamepadStickCalibration = 
    activeStickTab === 'rightStick' 
      ? gamingSettings.calibration.rightStick 
      : gamingSettings.calibration.leftStick;

  const calculateCurvedOutput = (
    rawX: number, 
    rawY: number, 
    calibration: GamepadStickCalibration
  ) => {
    const rawMag = Math.sqrt(rawX * rawX + rawY * rawY);
    if (rawMag === 0) return { outX: 0, outY: 0, outMag: 0, isDeadzone: true };

    const inDead = calibration.innerDeadzone / 100;
    const outDead = calibration.outerDeadzone / 100;
    const antiDead = calibration.antiDeadzone / 100;
    const exp = calibration.exponent;
    const sensX = calibration.sensX / 100;
    const sensY = calibration.sensY / 100;

    // Check inner deadzone
    if (rawMag <= inDead) {
      return { outX: 0, outY: 0, outMag: 0, isDeadzone: true };
    }

    // Normalized ratio between inner and outer deadzone [0, 1]
    const clampedMag = Math.min(rawMag, outDead);
    const range = Math.max(0.001, outDead - inDead);
    const normT = Math.max(0, Math.min(1, (clampedMag - inDead) / range));

    // Calculate curve transfer
    let curvedT = normT;
    if (calibration.curveType === 'linear') {
      curvedT = normT;
    } else if (calibration.curveType === 'precision') {
      // Gentle near center, accelerating toward outer rim
      curvedT = Math.pow(normT, exp);
    } else if (calibration.curveType === 'smooth') {
      // Ease in-out
      curvedT = normT * normT * (3 - 2 * normT);
    } else if (calibration.curveType === 'aggressive') {
      // High snap at low deflection
      curvedT = Math.pow(normT, 0.6);
    } else {
      curvedT = Math.pow(normT, exp);
    }

    // Apply anti-deadzone
    const finalMag = antiDead + (1 - antiDead) * curvedT;
    const dirX = rawX / rawMag;
    const dirY = rawY / rawMag;

    const outX = Math.max(-1, Math.min(1, dirX * finalMag * sensX));
    const outY = Math.max(-1, Math.min(1, dirY * finalMag * sensY));

    return {
      outX,
      outY,
      outMag: Math.min(1, finalMag),
      isDeadzone: false
    };
  };

  const virtualLiveOutput = calculateCurvedOutput(
    virtualStickPos.x, 
    virtualStickPos.y, 
    currentCalibrationStick
  );

  // SVG Response Curve Graph Data Generator
  const generateCurvePath = (calibration: GamepadStickCalibration) => {
    const points: Array<[number, number]> = [];
    const inDead = calibration.innerDeadzone;
    const outDead = calibration.outerDeadzone;
    const antiDead = calibration.antiDeadzone;
    const exp = calibration.exponent;

    for (let input = 0; input <= 100; input += 2) {
      if (input <= inDead) {
        points.push([input, 0]);
      } else if (input >= outDead) {
        points.push([input, 100]);
      } else {
        const norm = (input - inDead) / (outDead - inDead);
        let curved = norm;
        if (calibration.curveType === 'linear') {
          curved = norm;
        } else if (calibration.curveType === 'precision') {
          curved = Math.pow(norm, exp);
        } else if (calibration.curveType === 'smooth') {
          curved = norm * norm * (3 - 2 * norm);
        } else if (calibration.curveType === 'aggressive') {
          curved = Math.pow(norm, 0.6);
        } else {
          curved = Math.pow(norm, exp);
        }
        const out = antiDead + (100 - antiDead) * curved;
        points.push([input, Math.min(100, Math.max(0, out))]);
      }
    }

    // Map 0-100 to SVG viewbox (0,0 is top-left, so y is inverted)
    // Box: 0, 0 to 200, 120
    const svgPoints = points.map(([x, y]) => {
      const sx = (x / 100) * 200;
      const sy = 120 - (y / 100) * 110 - 5;
      return `${sx.toFixed(1)},${sy.toFixed(1)}`;
    });

    return `M ${svgPoints.join(' L ')}`;
  };

  // Handle Dragging Stick on Tester Pad
  const handleStickPadPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingStick && e.buttons !== 1) return;
    const pad = stickPadRef.current;
    if (!pad) return;

    const rect = pad.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    const rawDx = (e.clientX - centerX) / radius;
    const rawDy = (e.clientY - centerY) / radius;
    const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);

    if (dist <= 1) {
      setVirtualStickPos({ x: rawDx, y: rawDy });
    } else {
      setVirtualStickPos({ x: rawDx / dist, y: rawDy / dist });
    }
  };

  // Keyboard navigation for virtual stick tester
  useEffect(() => {
    if (activeTab !== 'gamepad') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        let dx = virtualStickPos.x;
        let dy = virtualStickPos.y;

        if (e.code === 'KeyA' || e.code === 'ArrowLeft') dx = -0.75;
        if (e.code === 'KeyD' || e.code === 'ArrowRight') dx = 0.75;
        if (e.code === 'KeyW' || e.code === 'ArrowUp') dy = -0.75;
        if (e.code === 'KeyS' || e.code === 'ArrowDown') dy = 0.75;

        setVirtualStickPos({ x: dx, y: dy });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        setVirtualStickPos({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTab, virtualStickPos]);

  // Handle Haptic Pulse Simulation
  const handleTriggerHapticPulse = () => {
    setIsHapticPulsing(true);
    setTimeout(() => {
      setIsHapticPulsing(false);
    }, 600);
  };

  // Canvas Mini-Game Loop with Interactive Workshop Mods
  useEffect(() => {
    if (!isPlayingDemo) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let enemySpawnCounter = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code) || e.key === 'ArrowLeft') {
        gameStateRef.current.keys.left = true;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code) || e.key === 'ArrowRight') {
        gameStateRef.current.keys.right = true;
      }
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        const now = performance.now();
        const minInterval = isRapidFireActive ? 90 : 180;

        if (now - gameStateRef.current.lastFireTime > minInterval) {
          gameStateRef.current.lastFireTime = now;

          if (isRapidFireActive) {
            // Twin Overclocked Cannons
            gameStateRef.current.lasers.push({
              x: gameStateRef.current.playerX + 8,
              y: canvas.height - 40,
              vy: -11,
              color: isNeonLaserActive ? '#ec4899' : '#38bdf8',
              width: 3
            });
            gameStateRef.current.lasers.push({
              x: gameStateRef.current.playerX + 24,
              y: canvas.height - 40,
              vy: -11,
              color: isNeonLaserActive ? '#f43f5e' : '#38bdf8',
              width: 3
            });
          } else {
            // Standard Single Beam
            gameStateRef.current.lasers.push({
              x: gameStateRef.current.playerX + 16,
              y: canvas.height - 40,
              vy: -9,
              color: isNeonLaserActive ? '#ec4899' : '#38bdf8',
              width: isNeonLaserActive ? 5 : 4
            });
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'a'].includes(e.code) || e.key === 'ArrowLeft') {
        gameStateRef.current.keys.left = false;
      }
      if (['ArrowRight', 'KeyD', 'd'].includes(e.code) || e.key === 'ArrowRight') {
        gameStateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = (now: number) => {
      const state = gameStateRef.current;
      const delta = now - state.lastFrameTime;
      state.frameCount++;

      if (delta >= 500) {
        const calculatedFps = Math.round((state.frameCount * 1000) / delta);
        setLiveFps(calculatedFps);
        setFrameTimeMs(+(1000 / calculatedFps).toFixed(2));
        state.frameCount = 0;
        state.lastFrameTime = now;
      }

      // Clear Canvas
      ctx.fillStyle = isNeonLaserActive ? '#090514' : '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = isNeonLaserActive ? 'rgba(236, 72, 153, 0.4)' : 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 22; i++) {
        const sx = (i * 37 + (now * 0.05)) % canvas.width;
        const sy = (i * 53 + (now * 0.15)) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Update Player speed based on SpeedBoost mod
      state.playerSpeed = isSpeedBoostActive ? 10.5 : 7.0;

      // Update Player position
      if (state.keys.left) state.playerX = Math.max(10, state.playerX - state.playerSpeed);
      if (state.keys.right) state.playerX = Math.min(canvas.width - 42, state.playerX + state.playerSpeed);

      // If speedboost is active, spawn ion exhaust trails
      if (isSpeedBoostActive && Math.random() < 0.8) {
        state.particles.push({
          x: state.playerX + 16 + (Math.random() - 0.5) * 6,
          y: canvas.height - 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 3 + Math.random() * 2,
          life: 14,
          color: isNeonLaserActive ? '#ec4899' : '#06b6d4'
        });
      }

      // Draw Player Ship (Vulkan/Cyber theme with mod accents)
      ctx.fillStyle = isNeonLaserActive ? '#f43f5e' : '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(state.playerX + 16, canvas.height - 45);
      ctx.lineTo(state.playerX + 32, canvas.height - 15);
      ctx.lineTo(state.playerX, canvas.height - 15);
      ctx.closePath();
      ctx.fill();

      // Cockpit / Engine accent
      ctx.fillStyle = isNeonLaserActive ? '#38bdf8' : '#e0e7ff';
      ctx.fillRect(state.playerX + 14, canvas.height - 32, 4, 8);

      // Thruster flame
      ctx.fillStyle = isNeonLaserActive ? '#fbbf24' : '#f59e0b';
      ctx.fillRect(state.playerX + 12, canvas.height - 14, 8, 6 + Math.sin(now * 0.03) * 3);

      // Update & Draw Lasers
      state.lasers = state.lasers.filter(l => {
        l.y += l.vy;
        ctx.fillStyle = l.color || '#38bdf8';
        if (isNeonLaserActive) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = l.color || '#ec4899';
        }
        ctx.fillRect(l.x - (l.width ? l.width / 2 : 2), l.y, l.width || 4, isRapidFireActive ? 10 : 14);
        ctx.shadowBlur = 0;
        return l.y > 0;
      });

      // Spawn Enemies
      enemySpawnCounter++;
      if (enemySpawnCounter % 40 === 0) {
        state.enemies.push({
          x: Math.random() * (canvas.width - 50) + 10,
          y: -20,
          vx: (Math.random() - 0.5) * 1.5,
          hp: 1
        });
      }

      // Update & Draw Enemies
      state.enemies = state.enemies.filter(enemy => {
        enemy.y += 2.2;
        enemy.x += enemy.vx;

        ctx.fillStyle = '#ec4899';
        ctx.fillRect(enemy.x, enemy.y, 22, 16);

        // Check laser collision
        for (let i = state.lasers.length - 1; i >= 0; i--) {
          const laser = state.lasers[i];
          if (
            laser.x >= enemy.x &&
            laser.x <= enemy.x + 22 &&
            laser.y >= enemy.y &&
            laser.y <= enemy.y + 16
          ) {
            // Hit!
            state.lasers.splice(i, 1);
            state.score += 100;
            setScore(state.score);

            // Spawn particles
            const particleCount = isNeonLaserActive ? 14 : 8;
            for (let p = 0; p < particleCount; p++) {
              state.particles.push({
                x: enemy.x + 11,
                y: enemy.y + 8,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: isNeonLaserActive ? (Math.random() > 0.5 ? '#ec4899' : '#06b6d4') : '#ec4899'
              });
            }
            return false;
          }
        }

        return enemy.y < canvas.height;
      });

      // Update & Draw Particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
        return p.life > 0;
      });

      // Retro CRT Scanlines Effect (if mod enabled)
      if (isScanlinesActive) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        for (let y = 0; y < canvas.height; y += 3) {
          ctx.fillRect(0, y, canvas.width, 1.2);
        }
      }

      // MangoHud Simulation Overlay (if enabled)
      if (gamingSettings.mangoHudOverlayActive) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fillRect(10, 10, 220, 106);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(10, 10, 220, 106);

        ctx.font = '10px monospace';
        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`MANGOHUD v0.7.2 · VULKAN`, 16, 25);

        ctx.fillStyle = '#22c55e';
        ctx.fillText(`FPS: ${liveFps} FPS  (${frameTimeMs} ms)`, 16, 42);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`GPU: 64% · 68°C · 2450 MHz`, 16, 58);

        ctx.fillStyle = '#a855f7';
        ctx.fillText(`CPU: 32% · 54°C · Feral GameMode`, 16, 74);

        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`VRAM: 3.4 / 16 GB · ProAudio: 1.2ms`, 16, 90);

        // Mod Status in HUD
        if (activeCyberDefenderMods.length > 0) {
          ctx.fillStyle = '#f43f5e';
          ctx.fillText(`WORKSHOP MODS: ${activeCyberDefenderMods.length} ACTIVE`, 16, 106);
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlayingDemo, gamingSettings.mangoHudOverlayActive, isNeonLaserActive, isRapidFireActive, isSpeedBoostActive, isScanlinesActive]);

  const handleTogglePlayBenchmark = () => {
    if (!isPlayingDemo) {
      launchGame('game-cyber-defender');
      setIsPlayingDemo(true);
      gameStateRef.current.score = 0;
      setScore(0);
    } else {
      stopGame('game-cyber-defender');
      setIsPlayingDemo(false);
    }
  };

  // Workshop Filtering
  const filteredWorkshopMods = gameMods.filter(mod => {
    const matchesGame = workshopGameFilter === 'all' || mod.gameId === workshopGameFilter;
    const matchesCategory = workshopCategoryFilter === 'All' || mod.category === workshopCategoryFilter;
    const query = workshopSearch.toLowerCase().trim();
    const matchesSearch = !query || 
      mod.title.toLowerCase().includes(query) ||
      mod.author.toLowerCase().includes(query) ||
      mod.summary.toLowerCase().includes(query) ||
      mod.tags.some(t => t.toLowerCase().includes(query));

    return matchesGame && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (workshopSort === 'rating') return b.rating - a.rating;
    if (workshopSort === 'downloads') return parseInt(b.downloads) - parseInt(a.downloads);
    return b.reviewsCount - a.reviewsCount;
  });

  const installedModsList = gameMods
    .filter(m => m.installed)
    .sort((a, b) => a.loadOrder - b.loadOrder);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Top Banner & Telemetry Bar */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 rounded-xl text-white shadow-md">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-100 text-sm tracking-wide">
                  DevForge GameDeck &amp; Workshop Hub
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Proton 9.20 · GameMode 1.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Low-latency Linux gaming engine, Feral GameMode, Community Workshop mods &amp; evdev gamepad calibration
              </p>
            </div>
          </div>

          {/* Quick Hardware Toggles */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <button
              onClick={toggleGameMode}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                gamingSettings.gameModeDaemonActive
                  ? 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title="Feral GameMode Daemon (CPU governor: performance, scheduler priority)"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>GameMode</span>
            </button>

            <button
              onClick={toggleMangoHud}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                gamingSettings.mangoHudOverlayActive
                  ? 'bg-cyan-950/70 border-cyan-600/60 text-cyan-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title="MangoHud Vulkan/OpenGL Overlay"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>MangoHud</span>
            </button>

            <button
              onClick={toggleProAudio}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                gamingSettings.pipeWireProAudio
                  ? 'bg-blue-950/60 border-blue-600/60 text-blue-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title="PipeWire Pro-Audio Mode (Ultra-low latency buffer)"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              <span>ProAudio (1.2ms)</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 select-none overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              Games Library ({games.length})
            </button>

            <button
              onClick={() => setActiveTab('workshop')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === 'workshop'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Workshop Mods</span>
              <span className="ml-1 px-1.5 py-0.2 bg-purple-950 text-purple-300 rounded-full text-[9px] font-mono border border-purple-800">
                {gameMods.filter(m => m.installed).length} active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === 'benchmark'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Playable Benchmark</span>
            </button>

            <button
              onClick={() => setActiveTab('proton-runners')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === 'proton-runners'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              Proton &amp; Wine Layer
            </button>

            <button
              onClick={() => setActiveTab('gamepad')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === 'gamepad'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gamepad &amp; Deadzones</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Active Gamepad:</span>
            <span className="text-slate-200 font-semibold">{gamingSettings.activeGamepad}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ========================================================
            LIBRARY TAB
            ======================================================== */}
        {activeTab === 'library' && (
          <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
            {/* Games Grid */}
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {games.map(game => {
                  const isSelected = selectedGameId === game.id;
                  const isRunning = activeRunningGame?.id === game.id;
                  const installedModCount = gameMods.filter(m => m.gameId === game.id && m.installed).length;

                  return (
                    <div
                      key={game.id}
                      onClick={() => setSelectedGameId(game.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-slate-900 shadow-md ring-1 ring-cyan-500/30'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Game Header */}
                        <div className="flex items-start justify-between">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-cyan-300">
                            {game.runner}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {game.platform}
                          </span>
                        </div>

                        {/* Title */}
                        <div>
                          <h4 className="font-bold text-slate-100 text-xs font-sans line-clamp-1">
                            {game.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                            <span>{game.category}</span>
                            <span>· {game.playTimeHours} hrs</span>
                            <span>· {game.sizeGB} GB</span>
                          </div>
                        </div>

                        {/* Workshop Mod Count Pill */}
                        <div className="flex items-center justify-between pt-1">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 ${
                            installedModCount > 0 
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80' 
                              : 'bg-slate-950 text-slate-500 border border-slate-800'
                          }`}>
                            <Layers className="w-2.5 h-2.5 text-purple-400" />
                            <span>{installedModCount} mods installed</span>
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWorkshopGameFilter(game.id);
                              setActiveTab('workshop');
                              setWorkshopView('browse');
                            }}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline font-mono"
                          >
                            Browse Mods →
                          </button>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                          <Zap className="w-3 h-3" />
                          <span>Target: {game.fpsTarget} FPS</span>
                        </div>

                        <div>
                          {isRunning ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                stopGame(game.id);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 bg-red-950/80 text-red-400 border border-red-800 rounded text-[11px] font-medium hover:bg-red-900 transition-colors"
                            >
                              <Square className="w-3 h-3" />
                              <span>Stop</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (game.isInteractiveMiniGame) {
                                  setActiveTab('benchmark');
                                  handleTogglePlayBenchmark();
                                } else {
                                  launchGame(game.id);
                                }
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-medium transition-colors"
                            >
                              <Play className="w-3 h-3" />
                              <span>Launch</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Game Profile Drawer */}
            {selectedGame && (
              <div className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3 shrink-0">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-semibold text-slate-200 text-xs">Game Profile &amp; Proton Setup</span>
                  <span className="font-mono text-[10px] text-cyan-400">{selectedGame.platform}</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between font-mono text-slate-400">
                    <span>Selected Runner:</span>
                    <span className="text-slate-200 font-semibold">{selectedGame.runner}</span>
                  </div>
                  <div className="flex justify-between font-mono text-slate-400">
                    <span>Graphics API:</span>
                    <span className="text-cyan-300">Vulkan 1.3 / DXVK 2.4</span>
                  </div>
                  <div className="flex justify-between font-mono text-slate-400">
                    <span>Shader Pre-caching:</span>
                    <span className="text-emerald-400 font-semibold">Enabled (Zero-Stutter)</span>
                  </div>
                  <div className="flex justify-between font-mono text-slate-400">
                    <span>Audio Engine:</span>
                    <span className="text-slate-300">PipeWire Pro-Audio (48kHz/64)</span>
                  </div>
                  <div className="flex justify-between font-mono text-slate-400">
                    <span>Workshop Mods:</span>
                    <span className="text-purple-400 font-semibold">
                      {gameMods.filter(m => m.gameId === selectedGame.id && m.installed).length} installed
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] space-y-1.5 font-mono">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Launch Environment Options:</div>
                  <div className="text-slate-300 truncate">
                    MANGOHUD=1 GAMEMODERUN=1 %command%
                  </div>
                </div>

                <button
                  onClick={() => {
                    setWorkshopGameFilter(selectedGame.id);
                    setActiveTab('workshop');
                    setWorkshopView('browse');
                  }}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Open Workshop for {selectedGame.name.split(' ')[0]}</span>
                </button>

                <div className="pt-2 mt-auto">
                  {selectedGame.isInteractiveMiniGame ? (
                    <button
                      onClick={() => {
                        setActiveTab('benchmark');
                        handleTogglePlayBenchmark();
                      }}
                      className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Start Playable Benchmark</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => launchGame(selectedGame.id)}
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>Launch with {selectedGame.runner}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            WORKSHOP BROWSER TAB
            ======================================================== */}
        {activeTab === 'workshop' && (
          <div className="space-y-4">
            {/* Workshop Header & Sub-Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100 text-sm">DevForge Community Workshop</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                    Mod Manager &amp; Prefix Hooks
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Search, install, and manage community modifications, graphics enhancements, and total conversions for your Linux games library.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWorkshopView('browse')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    workshopView === 'browse'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Browse Mods ({gameMods.length})</span>
                </button>

                <button
                  onClick={() => setWorkshopView('installed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    workshopView === 'installed'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-purple-400" />
                  <span>Installed &amp; Load Order ({installedModsList.length})</span>
                </button>

                <button
                  onClick={() => setWorkshopView('create')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    workshopView === 'create'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Mod</span>
                </button>
              </div>
            </div>

            {/* BROWSE VIEW */}
            {workshopView === 'browse' && (
              <div className="space-y-3.5">
                {/* Filters Bar */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search mods by name, author, feature or tag..."
                        value={workshopSearch}
                        onChange={(e) => setWorkshopSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Filter by Game Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 shrink-0 font-mono">Title:</span>
                      <select
                        value={workshopGameFilter}
                        onChange={(e) => setWorkshopGameFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="all">All Library Titles ({games.length})</option>
                        {games.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({gameMods.filter(m => m.gameId === g.id).length})
                          </option>
                        ))}
                      </select>

                      {/* Sort Selector */}
                      <select
                        value={workshopSort}
                        onChange={(e) => setWorkshopSort(e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        <option value="downloads">Most Downloads</option>
                      </select>
                    </div>
                  </div>

                  {/* Categories Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 mr-1">CATEGORY:</span>
                    {['All', 'Graphics', 'Gameplay', 'Total Conversion', 'Audio', 'UI', 'Maps', 'Performance'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setWorkshopCategoryFilter(cat)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer shrink-0 ${
                          workshopCategoryFilter === cat
                            ? 'bg-purple-900/80 text-purple-200 border border-purple-600'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredWorkshopMods.map(mod => {
                    const isInstalling = installingModId === mod.id;

                    return (
                      <div
                        key={mod.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-all group"
                      >
                        <div className="space-y-2.5">
                          {/* Mod Header */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-950/70 text-purple-300 border border-purple-800/70">
                              {mod.category}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono truncate max-w-[140px]" title={mod.gameName}>
                              {mod.gameName}
                            </span>
                          </div>

                          {/* Title & Author */}
                          <div>
                            <h4 className="font-bold text-slate-100 text-xs line-clamp-1 group-hover:text-purple-300 transition-colors">
                              {mod.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                              <span>by {mod.author}</span>
                              <span>· v{mod.version}</span>
                              <span>· {mod.sizeMB} MB</span>
                            </div>
                          </div>

                          {/* Summary */}
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {mod.summary}
                          </p>

                          {/* Live In-Game Effect Notification */}
                          {mod.inGameEffectKey && (
                            <div className="px-2 py-1 bg-cyan-950/60 border border-cyan-800/60 rounded flex items-center gap-1.5 text-[10px] text-cyan-300 font-mono">
                              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span>Live Benchmark Effect: Active when installed</span>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {mod.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-950 text-slate-400 border border-slate-800">
                                #{tag}
                              </span>
                            ))}
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 ml-auto">
                              {mod.compatibility}
                            </span>
                          </div>
                        </div>

                        {/* Mod Footer & Action */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{mod.rating}</span>
                            </span>
                            <span>({mod.reviewsCount})</span>
                            <span>· {mod.downloads} dl</span>
                          </div>

                          <div>
                            {mod.installed ? (
                              <div className="flex items-center gap-1.5">
                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-medium">
                                  <Check className="w-3 h-3" />
                                  <span>Installed</span>
                                </span>
                                <button
                                  onClick={() => uninstallGameMod(mod.id)}
                                  className="p-1 hover:bg-red-950 text-slate-500 hover:text-red-400 rounded transition-colors"
                                  title="Uninstall Mod"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleInstallMod(mod.id)}
                                disabled={isInstalling}
                                className={`flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                                  isInstalling ? 'opacity-70 cursor-wait' : ''
                                }`}
                              >
                                {isInstalling ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    <span>Installing...</span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-3 h-3" />
                                    <span>Install Mod</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredWorkshopMods.length === 0 && (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <p className="text-sm font-semibold text-slate-300">No community mods found</p>
                    <p className="text-xs text-slate-500">
                      Try adjusting your search query, selecting another library title, or clearing category filters.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* INSTALLED MODS & LOAD ORDER VIEW */}
            {workshopView === 'installed' && (
              <div className="space-y-4 max-w-4xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-100 text-xs">
                        Installed Community Mods &amp; Load Order Resolution
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Mods execute in sequential order. Mods lower in the order override conflicting textures, scripts, and shaders from earlier mods.
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                      Prefix Sync: /home/devforge/.local/share/workshop (Active)
                    </div>
                  </div>
                </div>

                {installedModsList.length > 0 ? (
                  <div className="space-y-2">
                    {installedModsList.map((mod, index) => (
                      <div
                        key={mod.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                          mod.enabled 
                            ? 'bg-slate-900 border-purple-900/60' 
                            : 'bg-slate-900/50 border-slate-800 opacity-60'
                        }`}
                      >
                        {/* Order & Drag Handles */}
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-mono text-[10px] text-cyan-300 font-bold">
                            #{index + 1}
                          </span>

                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => reorderGameMod(mod.id, 'up')}
                              disabled={index === 0}
                              className="p-0.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                              title="Move up in load order"
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => reorderGameMod(mod.id, 'down')}
                              disabled={index === installedModsList.length - 1}
                              className="p-0.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded cursor-pointer"
                              title="Move down in load order"
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Mod Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-xs truncate">{mod.title}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                              {mod.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({mod.gameName})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {mod.summary}
                          </p>
                        </div>

                        {/* Status & Controls */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right font-mono text-[10px]">
                            <div className="text-slate-400">{mod.sizeMB} MB</div>
                            <div className={mod.enabled ? 'text-emerald-400' : 'text-slate-500'}>
                              {mod.enabled ? 'Active Hook' : 'Disabled'}
                            </div>
                          </div>

                          {/* Toggle switch */}
                          <button
                            onClick={() => toggleGameModEnabled(mod.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                              mod.enabled
                                ? 'bg-purple-950 border-purple-700 text-purple-300'
                                : 'bg-slate-950 border-slate-800 text-slate-500'
                            }`}
                          >
                            {mod.enabled ? 'Enabled' : 'Disabled'}
                          </button>

                          <button
                            onClick={() => uninstallGameMod(mod.id)}
                            className="p-1.5 hover:bg-red-950 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                            title="Uninstall from game"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <Package className="w-8 h-8 text-slate-600 mx-auto" />
                    <div>
                      <h5 className="font-bold text-slate-300 text-sm">No mods installed currently</h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Browse the community workshop to install mods, shaders, and balance overhauls for titles in your library.
                      </p>
                    </div>
                    <button
                      onClick={() => setWorkshopView('browse')}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Browse Workshop Catalog
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CREATE / LOCAL MOD FORM */}
            {workshopView === 'create' && (
              <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Register Custom Community Mod (.zip / folder)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Link local mods, custom engine hooks, or community patches into your game prefix.
                  </p>
                </div>

                <form onSubmit={handleCreateCustomMod} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Game</label>
                    <select
                      value={newModForm.gameId}
                      onChange={(e) => setNewModForm({ ...newModForm, gameId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      {games.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Mod Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ultra Reshade &amp; Ray-Traced Shaders"
                      value={newModForm.title}
                      onChange={(e) => setNewModForm({ ...newModForm, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Category</label>
                      <select
                        value={newModForm.category}
                        onChange={(e) => setNewModForm({ ...newModForm, category: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        {['Graphics', 'Gameplay', 'Total Conversion', 'Audio', 'UI', 'Maps', 'Performance'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Author Name</label>
                      <input
                        type="text"
                        placeholder="Author or handle"
                        value={newModForm.author}
                        onChange={(e) => setNewModForm({ ...newModForm, author: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Short Summary</label>
                    <input
                      type="text"
                      placeholder="High-level description of what this mod alters..."
                      value={newModForm.summary}
                      onChange={(e) => setNewModForm({ ...newModForm, summary: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Vulkan, Shaders, 4K, Gameplay"
                      value={newModForm.tags}
                      onChange={(e) => setNewModForm({ ...newModForm, tags: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setWorkshopView('browse')}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Save &amp; Hook into Game
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            GAMEPAD & DEADZONES TAB (NEW SENSITIVITY PANEL)
            ======================================================== */}
        {activeTab === 'gamepad' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Top Gamepad Hardware Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-950 border border-cyan-800 rounded-xl text-cyan-400">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100 text-sm">
                        {gamingSettings.activeGamepad}
                      </h4>
                      <span className="px-2 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[9px] font-mono">
                        evdev / hid-playstation · 1000Hz Polling
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Low-latency kernel game controller input with configurable deadzones, response curves, and precision aim scaling.
                    </p>
                  </div>
                </div>

                {/* Preset Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Profile:</span>
                  <select
                    value={gamingSettings.calibration.presetName}
                    onChange={(e) => applyGamepadPreset(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="FPS Precision Aim (S-Curve)">FPS Precision Aim (S-Curve)</option>
                    <option value="Linear 1:1 Direct">Linear 1:1 Direct</option>
                    <option value="Smooth Ease-In (Racing/Flight)">Smooth Ease-In (Racing/Flight)</option>
                    <option value="Aggressive Twitch Snap (Fighting/Arena)">Aggressive Twitch Snap (Fighting)</option>
                    <option value="Zero Deadzone (Hall Effect)">Zero Deadzone (Hall Effect)</option>
                  </select>
                </div>
              </div>

              {/* Stick Selector Tabs */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveStickTab('leftStick')}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      activeStickTab === 'leftStick'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Left Analog Stick (Movement / Steering)
                  </button>

                  <button
                    onClick={() => setActiveStickTab('rightStick')}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      activeStickTab === 'rightStick'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Right Analog Stick (Aim / Camera)
                  </button>

                  <button
                    onClick={() => setActiveStickTab('triggers')}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      activeStickTab === 'triggers'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Triggers &amp; Haptics
                  </button>
                </div>

                <button
                  onClick={resetGamepadCalibration}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 font-mono transition-colors cursor-pointer"
                  title="Reset to factory calibration"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Calibration</span>
                </button>
              </div>
            </div>

            {/* STICK DEADZONE & CURVE CALIBRATION PANEL */}
            {activeStickTab !== 'triggers' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Sliders & Configuration Settings (Left 7 cols) */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <h5 className="font-bold text-slate-100 text-xs">
                        {activeStickTab === 'leftStick' ? 'Left Stick' : 'Right Stick'} Precision Tuning
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">
                      Curve: {currentCalibrationStick.curveType.toUpperCase()} (exp={currentCalibrationStick.exponent})
                    </span>
                  </div>

                  {/* Curve Type Presets Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400">Sensitivity Curve Profile:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {(['linear', 'precision', 'smooth', 'aggressive', 'custom'] as GamepadCurveType[]).map(curve => (
                        <button
                          key={curve}
                          onClick={() => updateStickCalibration(activeStickTab, { 
                            curveType: curve,
                            exponent: curve === 'linear' ? 1.0 : curve === 'precision' ? 1.5 : curve === 'smooth' ? 1.8 : 0.7
                          })}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-mono capitalize transition-all cursor-pointer border ${
                            currentCalibrationStick.curveType === curve
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-600 font-bold'
                              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                          }`}
                        >
                          {curve}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inner Deadzone Slider */}
                  <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-300">Inner Deadzone (Stick Drift Filter):</span>
                      <span className="text-cyan-400 font-bold">{currentCalibrationStick.innerDeadzone}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      step={1}
                      value={currentCalibrationStick.innerDeadzone}
                      onChange={(e) => updateStickCalibration(activeStickTab, { innerDeadzone: parseInt(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>0% (Raw Hall Effect)</span>
                      <span>8% (Recommended)</span>
                      <span>30% (High Drift)</span>
                    </div>
                  </div>

                  {/* Outer Deadzone Slider */}
                  <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-300">Outer Deadzone (Saturation Ceiling):</span>
                      <span className="text-cyan-400 font-bold">{currentCalibrationStick.outerDeadzone}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={100}
                      step={1}
                      value={currentCalibrationStick.outerDeadzone}
                      onChange={(e) => updateStickCalibration(activeStickTab, { outerDeadzone: parseInt(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>70% (Fast Reach)</span>
                      <span>96% (Recommended)</span>
                      <span>100% (Full Mechanical)</span>
                    </div>
                  </div>

                  {/* Sensitivity Exponent & Scaling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Curve Exponent */}
                    <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-300">Curve Exponent:</span>
                        <span className="text-purple-400 font-bold">{currentCalibrationStick.exponent.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={2.5}
                        step={0.05}
                        value={currentCalibrationStick.exponent}
                        onChange={(e) => updateStickCalibration(activeStickTab, { 
                          exponent: parseFloat(e.target.value),
                          curveType: 'custom'
                        })}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    {/* Anti-Deadzone */}
                    <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-300">Anti-Deadzone:</span>
                        <span className="text-amber-400 font-bold">{currentCalibrationStick.antiDeadzone}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        step={1}
                        value={currentCalibrationStick.antiDeadzone}
                        onChange={(e) => updateStickCalibration(activeStickTab, { antiDeadzone: parseInt(e.target.value) })}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Axis Sensitivity (X & Y) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-300">X-Axis Sensitivity:</span>
                        <span className="text-cyan-400 font-bold">{currentCalibrationStick.sensX}%</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={180}
                        step={5}
                        value={currentCalibrationStick.sensX}
                        onChange={(e) => updateStickCalibration(activeStickTab, { sensX: parseInt(e.target.value) })}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-300">Y-Axis Sensitivity:</span>
                        <span className="text-cyan-400 font-bold">{currentCalibrationStick.sensY}%</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={180}
                        step={5}
                        value={currentCalibrationStick.sensY}
                        onChange={(e) => updateStickCalibration(activeStickTab, { sensY: parseInt(e.target.value) })}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Visualizer & Interactive Stick Tester (Right 5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* SVG Sensitivity Curve Plot */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-xs">Response Curve Transfer Function</span>
                      <span className="text-[10px] font-mono text-cyan-400">Input → Output</span>
                    </div>

                    <div className="bg-black/80 rounded-lg p-2 border border-slate-800/80 relative">
                      <svg viewBox="0 0 200 120" className="w-full h-32 overflow-visible">
                        {/* Grid lines */}
                        <line x1="0" y1="115" x2="200" y2="115" stroke="#1e293b" strokeWidth="1" />
                        <line x1="0" y1="60" x2="200" y2="60" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="0" y1="5" x2="200" y2="5" stroke="#1e293b" strokeWidth="1" />
                        <line x1="100" y1="5" x2="100" y2="115" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

                        {/* Deadzone Shaded Region */}
                        <rect
                          x="0"
                          y="5"
                          width={(currentCalibrationStick.innerDeadzone / 100) * 200}
                          height="110"
                          fill="rgba(244, 63, 94, 0.15)"
                        />

                        {/* Outer Saturation Shaded Region */}
                        <rect
                          x={(currentCalibrationStick.outerDeadzone / 100) * 200}
                          y="5"
                          width={200 - (currentCalibrationStick.outerDeadzone / 100) * 200}
                          height="110"
                          fill="rgba(6, 182, 212, 0.15)"
                        />

                        {/* Linear 1:1 Reference Line */}
                        <line x1="0" y1="115" x2="200" y2="5" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />

                        {/* Calibrated Transfer Path */}
                        <path
                          d={generateCurvePath(currentCalibrationStick)}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Live Tracking Dot based on current stick deflection */}
                        {(() => {
                          const rawMag = Math.sqrt(virtualStickPos.x * virtualStickPos.x + virtualStickPos.y * virtualStickPos.y);
                          const sx = Math.min(200, rawMag * 200);
                          const sy = 115 - virtualLiveOutput.outMag * 110;
                          return (
                            <circle
                              cx={sx}
                              cy={sy}
                              r="5"
                              fill="#f43f5e"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                          );
                        })()}
                      </svg>

                      {/* Legend */}
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1">
                        <span className="text-red-400">■ Inner Deadzone</span>
                        <span className="text-cyan-400">― Transfer Curve</span>
                        <span className="text-blue-400">■ Outer Saturation</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Stick Deflection Pad */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-xs">Live Joystick Calibrator</span>
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${
                        virtualLiveOutput.isDeadzone
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}>
                        {virtualLiveOutput.isDeadzone ? 'Drift Filtered (0%)' : `Output: ${(virtualLiveOutput.outMag * 100).toFixed(0)}%`}
                      </span>
                    </div>

                    <div className="flex items-center justify-center py-2">
                      <div
                        ref={stickPadRef}
                        onPointerDown={(e) => {
                          setIsDraggingStick(true);
                          handleStickPadPointerMove(e);
                        }}
                        onPointerMove={handleStickPadPointerMove}
                        onPointerUp={() => {
                          setIsDraggingStick(false);
                          setVirtualStickPos({ x: 0, y: 0 });
                        }}
                        className="relative w-40 h-40 rounded-full bg-black/90 border-2 border-slate-700 flex items-center justify-center cursor-crosshair select-none touch-none shadow-inner"
                      >
                        {/* Outer Deadzone Circle */}
                        <div
                          className="absolute rounded-full border border-cyan-500/40 pointer-events-none"
                          style={{
                            width: `${currentCalibrationStick.outerDeadzone}%`,
                            height: `${currentCalibrationStick.outerDeadzone}%`
                          }}
                        />

                        {/* Inner Deadzone Circle */}
                        <div
                          className="absolute rounded-full border border-dashed border-rose-500/80 bg-rose-500/10 pointer-events-none"
                          style={{
                            width: `${Math.max(8, currentCalibrationStick.innerDeadzone * 2)}%`,
                            height: `${Math.max(8, currentCalibrationStick.innerDeadzone * 2)}%`
                          }}
                        />

                        {/* Center Crosshairs */}
                        <div className="absolute w-full h-px bg-slate-800 pointer-events-none" />
                        <div className="absolute h-full w-px bg-slate-800 pointer-events-none" />

                        {/* Analog Thumbstick Knob */}
                        <div
                          className="absolute w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 border-2 border-white shadow-lg pointer-events-none flex items-center justify-center transition-transform duration-75"
                          style={{
                            transform: `translate(${virtualStickPos.x * 60}px, ${virtualStickPos.y * 60}px)`
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white/80" />
                        </div>
                      </div>
                    </div>

                    {/* Quick Deflection Test Buttons */}
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                      <button
                        onClick={() => setVirtualStickPos({ x: 0, y: 0 })}
                        className="py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 cursor-pointer"
                      >
                        Center (0%)
                      </button>
                      <button
                        onClick={() => setVirtualStickPos({ x: 0.08, y: 0 })}
                        className="py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 cursor-pointer"
                      >
                        Aim (8%)
                      </button>
                      <button
                        onClick={() => setVirtualStickPos({ x: 0.5, y: -0.5 })}
                        className="py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 cursor-pointer"
                      >
                        Half (50%)
                      </button>
                      <button
                        onClick={() => setVirtualStickPos({ x: 1, y: 0 })}
                        className="py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 cursor-pointer"
                      >
                        Full (100%)
                      </button>
                    </div>

                    {/* Numeric Telemetry */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-500">Raw Input (evdev):</div>
                        <div className="text-slate-200">
                          X: {virtualStickPos.x.toFixed(2)} | Y: {virtualStickPos.y.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-500">Curved Output:</div>
                        <div className="text-cyan-400 font-bold">
                          X: {virtualLiveOutput.outX.toFixed(2)} | Y: {virtualLiveOutput.outY.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRIGGERS & HAPTICS TAB */}
            {activeStickTab === 'triggers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Triggers Deadzones */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h5 className="font-bold text-slate-100 text-xs">Analog Trigger Deadzones (L2 / R2)</h5>

                  {/* L2 Slider */}
                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-300">Left Trigger (L2) Deadzone:</span>
                      <span className="text-cyan-400 font-bold">{gamingSettings.calibration.triggerDeadzoneL2}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      step={1}
                      value={gamingSettings.calibration.triggerDeadzoneL2}
                      onChange={(e) => updateGamepadCalibration({ triggerDeadzoneL2: parseInt(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500" 
                        style={{ width: `${gamingSettings.calibration.triggerDeadzoneL2 * 3.3}%` }} 
                      />
                    </div>
                  </div>

                  {/* R2 Slider */}
                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-300">Right Trigger (R2) Deadzone:</span>
                      <span className="text-cyan-400 font-bold">{gamingSettings.calibration.triggerDeadzoneR2}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      step={1}
                      value={gamingSettings.calibration.triggerDeadzoneR2}
                      onChange={(e) => updateGamepadCalibration({ triggerDeadzoneR2: parseInt(e.target.value) })}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500" 
                        style={{ width: `${gamingSettings.calibration.triggerDeadzoneR2 * 3.3}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Haptic Feedback */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                  <h5 className="font-bold text-slate-100 text-xs">Haptic Feedback &amp; Adaptive Rumble</h5>

                  <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-300">Haptic Actuator Intensity:</span>
                      <span className="text-purple-400 font-bold">{gamingSettings.calibration.hapticIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={gamingSettings.calibration.hapticIntensity}
                      onChange={(e) => updateGamepadCalibration({ hapticIntensity: parseInt(e.target.value) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  {/* Test Pulse Button */}
                  <button
                    onClick={handleTriggerHapticPulse}
                    className={`w-full py-3 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      isHapticPulsing
                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg animate-pulse ring-4 ring-purple-500/30'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <Activity className={`w-4 h-4 ${isHapticPulsing ? 'animate-bounce text-white' : 'text-purple-400'}`} />
                    <span>{isHapticPulsing ? 'Testing evdev Force Feedback Pulse...' : 'Test Haptic Vibration Pulse'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            PLAYABLE BENCHMARK TAB
            ======================================================== */}
        {activeTab === 'benchmark' && (
          <div className="flex flex-col items-center space-y-4 max-w-3xl mx-auto">
            <div className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">
                  Cyber Defender 2026 (Live Vulkan Canvas Benchmark)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Controls: <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-300 font-mono text-[10px]">A</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-300 font-mono text-[10px]">D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-300 font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-300 font-mono text-[10px]">→</kbd> to move · <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-300 font-mono text-[10px]">Space</kbd> to fire laser
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="font-mono text-right text-xs">
                  <div className="text-slate-400 text-[10px]">Score:</div>
                  <div className="font-bold text-cyan-400 tabular-nums text-sm">{score}</div>
                </div>

                <button
                  onClick={handleTogglePlayBenchmark}
                  className={`px-4 py-2 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isPlayingDemo
                      ? 'bg-red-950 border border-red-800 text-red-300 hover:bg-red-900'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                  }`}
                >
                  {isPlayingDemo ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop Benchmark</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Benchmark</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Active Workshop Mods Notification for Benchmark */}
            {activeCyberDefenderMods.length > 0 && (
              <div className="w-full flex items-center gap-2 p-2.5 bg-purple-950/60 border border-purple-800/80 rounded-xl text-[11px] font-mono text-purple-300">
                <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-bold">Active Community Workshop Mods ({activeCyberDefenderMods.length}):</span>
                <span className="text-slate-300 truncate">
                  {activeCyberDefenderMods.map(m => m.title).join(', ')}
                </span>
              </div>
            )}

            {/* Canvas Viewport */}
            <div className="relative border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-black">
              <canvas
                ref={canvasRef}
                width={640}
                height={380}
                className="w-full max-w-[640px] h-[380px] block cursor-crosshair"
              />

              {!isPlayingDemo && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="p-3 bg-cyan-950/80 border border-cyan-700/60 rounded-full text-cyan-400">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Click Start Benchmark to Test Hardware Pipeline</h4>
                    <p className="text-xs text-slate-400 max-w-md mt-1">
                      Runs interactive high-frequency rendering loop. Demonstrates real-time MangoHud telemetry, zero frame drops, Linux GameMode CPU affinity, and community workshop mod effects.
                    </p>
                  </div>
                  <button
                    onClick={handleTogglePlayBenchmark}
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium text-xs shadow-lg transition-colors cursor-pointer"
                  >
                    Start Game Loop (144 FPS Target)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            PROTON RUNNERS TAB
            ======================================================== */}
        {activeTab === 'proton-runners' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-slate-100 text-sm mb-1">Proton &amp; Wine Compatibility Runners</h3>
              <p className="text-slate-400 text-[11px]">
                DevForge Linux ships with customized GE-Proton runners featuring FSR 3 frame generation, Anti-Cheat bridge libraries, and direct DXVK Vulkan mapping.
              </p>
            </div>

            <div className="space-y-2.5">
              {protonRunners.map(runner => {
                const isSelected = gamingSettings.selectedProtonVersion === runner.id;
                return (
                  <div
                    key={runner.id}
                    onClick={() => setProtonVersion(runner.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-slate-900 shadow-md ring-1 ring-cyan-500/30'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-xs font-sans">{runner.name}</span>
                        {runner.recommended && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{runner.features}</p>
                    </div>

                    <div>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono font-medium">
                          <Check className="w-4 h-4" />
                          <span>Active Runner</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setProtonVersion(runner.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

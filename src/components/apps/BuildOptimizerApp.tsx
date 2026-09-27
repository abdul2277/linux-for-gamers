import React, { useState } from 'react';
import { useDistro } from '../../context/DistroContext';
import { Zap, Play, CheckCircle2, TrendingUp, Cpu, Flame, Layers } from 'lucide-react';

export const BuildOptimizerApp: React.FC = () => {
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkCompleted, setBenchmarkCompleted] = useState(false);

  const runBenchmark = () => {
    setBenchmarking(true);
    setBenchmarkCompleted(false);
    setTimeout(() => {
      setBenchmarking(false);
      setBenchmarkCompleted(true);
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Header */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 space-y-2 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 font-sans">Mold &amp; BuildKit Fast Build Optimizer</h2>
          </div>

          <button
            onClick={runBenchmark}
            disabled={benchmarking}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${benchmarking ? 'animate-spin' : ''}`} />
            <span>{benchmarking ? 'Running Live Benchmark...' : 'Run Compilation Benchmark'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          DevForge eliminates build bottlenecks using Mold multi-threaded linkers, ramdisk tmpfs layers, and BuildKit concurrency.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Benchmark Results Comparison */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Compilation Benchmark: 120k LOC Rust / C++ Microservice with 14 Docker Layers
            </span>
            <span className="font-mono text-cyan-400 font-semibold text-[11px]">
              {benchmarkCompleted ? '4.8x Average Acceleration' : 'Pre-calibrated Results'}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {/* DevForge Linux Result */}
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="font-semibold text-cyan-300">DevForge Linux (Mold + BuildKit Cache)</span>
                <span className="text-emerald-400 font-bold tabular-nums">0.74 seconds</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`bg-cyan-500 h-full rounded-full transition-all duration-1000 ${
                    benchmarking ? 'w-1/12 animate-pulse' : 'w-[12%]'
                  }`} 
                />
              </div>
            </div>

            {/* Standard Ubuntu / Debian */}
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-400">Standard Distro (Ubuntu 24.04 / GNU ld.bfd)</span>
                <span className="text-slate-400 tabular-nums">3.82 seconds</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`bg-slate-700 h-full rounded-full transition-all duration-1000 ${
                    benchmarking ? 'w-1/2' : 'w-[62%]'
                  }`} 
                />
              </div>
            </div>

            {/* Cold Docker Build without Tmpfs */}
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-500">Uncached Docker Build (Cold Pull)</span>
                <span className="text-slate-500 tabular-nums">16.4 seconds</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-slate-850 h-full rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Zap className="w-4 h-4" />
              <span>Mold Linker 2.34 (Zero Link Delay)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Drop-in replacement for ld.bfd that takes advantage of all CPU cores simultaneously. Linking 20MB binaries takes under 80 milliseconds.
            </p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Layers className="w-4 h-4" />
              <span>BuildKit Cache-Mount Acceleration</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Shares compiler caches (cargo, bun, pip) across container rebuilds via tmpfs mounts. Eliminates redundant package fetches on git branch switch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

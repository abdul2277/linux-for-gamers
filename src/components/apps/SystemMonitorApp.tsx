import React from 'react';
import { useDistro } from '../../context/DistroContext';
import { Activity, Cpu, HardDrive, Server, Zap } from 'lucide-react';

export const SystemMonitorApp: React.FC = () => {
  const { telemetry } = useDistro();

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Header */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 space-y-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-100 font-sans">System Resource Monitor</h2>
          <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 bg-emerald-950/60 rounded">
            Ultra-Lightweight Idle (~284MB RAM)
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          DevForge Linux kernel 6.12 PREEMPT_RT telemetry with near-zero background footprint.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px]">CPU Utilization</span>
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              {telemetry.cpuUsagePercent.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">16 cores pinned · 38°C</div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px]">RAM Footprint</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {telemetry.ramUsedMB} MB
            </div>
            <div className="text-[10px] text-slate-500 font-mono">of 16,384 MB (98.2% Free)</div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px]">Disk Usage</span>
              <HardDrive className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              {telemetry.diskUsedGB} GB
            </div>
            <div className="text-[10px] text-slate-500 font-mono">of 512 GB NVMe PCIe 4.0</div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px]">Build Speedup</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              4.2x Faster
            </div>
            <div className="text-[10px] text-slate-500 font-mono">vs standard GNU linker</div>
          </div>
        </div>

        {/* Process Breakdown Table */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Core Daemons
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="py-2 px-3">PID</th>
                  <th className="py-2 px-3">Process / Service</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3 text-right">CPU</th>
                  <th className="py-2 px-3 text-right">RAM</th>
                  <th className="py-2 px-3 text-center">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { pid: 1, name: 'systemd (init-minimal)', role: 'Core init system', cpu: '0.0%', ram: '4.1 MB', state: 'Active' },
                  { pid: 218, name: 'dockerd --features buildkit', role: 'Container engine', cpu: '0.1%', ram: '48.2 MB', state: 'Active' },
                  { pid: 340, name: 'k3s server --disable traefik', role: 'Lightweight K8s', cpu: '0.2%', ram: '112.4 MB', state: 'Active' },
                  { pid: 412, name: 'mold --daemon', role: 'Linker cache worker', cpu: '0.0%', ram: '8.4 MB', state: 'Idle' },
                  { pid: 510, name: 'devforge-mesh-sync', role: 'Encrypted cloud vault', cpu: '0.0%', ram: '14.2 MB', state: 'Sleeping' },
                  { pid: 618, name: 'sway / wayland-compositor', role: 'Lightweight desktop', cpu: '0.1%', ram: '28.6 MB', state: 'Active' }
                ].map(p => (
                  <tr key={p.pid} className="hover:bg-slate-850">
                    <td className="py-2 px-3 text-slate-500">{p.pid}</td>
                    <td className="py-2 px-3 font-semibold text-slate-200">{p.name}</td>
                    <td className="py-2 px-3 text-slate-400 text-[10px]">{p.role}</td>
                    <td className="py-2 px-3 text-right text-slate-300 tabular-nums">{p.cpu}</td>
                    <td className="py-2 px-3 text-right text-emerald-400 tabular-nums">{p.ram}</td>
                    <td className="py-2 px-3 text-center text-emerald-400 text-[10px]">{p.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

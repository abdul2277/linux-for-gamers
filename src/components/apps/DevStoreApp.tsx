import React, { useState } from 'react';
import { useDistro } from '../../context/DistroContext';
import { PackageCategory } from '../../types/distro';
import { 
  Package, 
  Search, 
  Check, 
  Download, 
  Trash2, 
  Zap, 
  Terminal, 
  HardDrive, 
  Layers, 
  Cpu, 
  WifiOff 
} from 'lucide-react';

export const DevStoreApp: React.FC = () => {
  const { packages, installPackage, uninstallPackage, telemetry, executeTerminalCommand, openApp } = useDistro();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | 'all'>('all');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const categories: Array<{ id: PackageCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Packages' },
    { id: 'languages', label: 'Languages & Runtimes' },
    { id: 'containers', label: 'Containers & K8s' },
    { id: 'toolchains', label: 'Toolchains & Linkers' },
    { id: 'devops', label: 'DevOps & Cloud' },
    { id: 'databases', label: 'Databases & Caches' },
    { id: 'cli-tools', label: 'CLI Tools' }
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchesCat = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(search.toLowerCase()) ||
                          pkg.id.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleInstall = (id: string) => {
    setInstallingId(id);
    setTimeout(() => {
      installPackage(id);
      setInstallingId(null);
    }, 700);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden">
      {/* DevStore Header */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 font-sans">DevStore Package Hub</h2>
              <span className="text-[10px] text-slate-400 font-mono">· {packages.filter(p => p.installed).length} installed</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic, zero-overhead developer runtimes with mold linker acceleration.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter packages..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>
        </div>

        {/* Offline indicator bar */}
        {telemetry.isOffline && (
          <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded flex items-center gap-2 text-[11px] text-amber-300">
            <WifiOff className="w-3.5 h-3.5" />
            <span>
              <strong>Offline Mode Active:</strong> Installing from local zero-latency package cache (/var/cache/devforge/pkgs). No internet required.
            </span>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white font-medium shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Package Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPackages.map(pkg => {
            const isInstalling = installingId === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                  pkg.installed 
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700' 
                    : 'bg-slate-950 border-slate-850 hover:border-purple-900/60'
                }`}
              >
                <div className="space-y-2">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-xs font-sans">{pkg.name}</span>
                        {pkg.isCore && (
                          <span className="text-[9px] font-mono text-blue-400 uppercase">Core</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">v{pkg.version} · {pkg.sizeMB} MB</div>
                    </div>

                    <div className="shrink-0">
                      {pkg.installed ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <Check className="w-3 h-3" />
                          <span>Installed</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Available</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Performance acceleration callout */}
                  {pkg.buildAccelerationBenefit && (
                    <div className="p-1.5 bg-blue-950/30 border border-blue-900/40 rounded flex items-center gap-1.5 text-[10px] text-blue-300">
                      <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{pkg.buildAccelerationBenefit}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-[150px]">
                    $ {pkg.command}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {pkg.installed ? (
                      !pkg.isCore && (
                        <button
                          onClick={() => uninstallPackage(pkg.id)}
                          className="px-2 py-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded text-[10px] transition-colors cursor-pointer"
                          title="Uninstall"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleInstall(pkg.id)}
                        disabled={isInstalling}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Download className={`w-3 h-3 ${isInstalling ? 'animate-bounce' : ''}`} />
                        <span>{isInstalling ? 'Installing...' : 'Install'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

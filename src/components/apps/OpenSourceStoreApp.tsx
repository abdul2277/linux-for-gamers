import React, { useState } from 'react';
import { useDistro } from '../../context/DistroContext';
import { OpenStoreCategory, OpenSourceApp } from '../../types/distro';
import { 
  ShoppingBag, 
  Search, 
  Check, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  Gamepad2, 
  Code, 
  Palette, 
  Layers, 
  Cpu, 
  Terminal, 
  Info, 
  X, 
  Filter, 
  Flame 
} from 'lucide-react';

export const OpenSourceStoreApp: React.FC = () => {
  const { openSourceApps, installOpenApp, uninstallOpenApp, openApp, executeTerminalCommand } = useDistro();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OpenStoreCategory>('All');
  const [selectedSource, setSelectedSource] = useState<'All' | 'Flathub' | 'AUR' | 'AppImage'>('All');
  const [selectedAppDetail, setSelectedAppDetail] = useState<OpenSourceApp | null>(null);
  const [installingId, setInstallingId] = useState<string | null>(null);

  const categories: Array<{ id: OpenStoreCategory; label: string; icon: React.ReactNode }> = [
    { id: 'All', label: 'All Open Source', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'Gaming', label: 'Gaming & Emulation', icon: <Gamepad2 className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'Development', label: 'Developer Tools', icon: <Code className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'Graphics & Media', label: 'Graphics & Media', icon: <Palette className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'Productivity', label: 'Productivity', icon: <Layers className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'Utilities', label: 'System & Utilities', icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" /> }
  ];

  const filteredApps = openSourceApps.filter(app => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSource = selectedSource === 'All' || app.source.includes(selectedSource);
    const matchesSearch = 
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.summary.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.developer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSource && matchesSearch;
  });

  const handleInstall = (id: string, name: string) => {
    setInstallingId(id);
    setTimeout(() => {
      installOpenApp(id);
      setInstallingId(null);
      executeTerminalCommand(`flatpak install -y flathub ${id}`);
    }, 800);
  };

  const handleUninstall = (id: string) => {
    uninstallOpenApp(id);
    executeTerminalCommand(`flatpak uninstall -y ${id}`);
  };

  const featuredApps = openSourceApps.filter(a => 
    a.id === 'net.lutris.Lutris' || 
    a.id === 'org.godotengine.Godot' || 
    a.id === 'com.heroicgameslauncher.hgl' || 
    a.id === 'org.blender.Blender'
  );

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Header bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100 font-sans">Open Source App Center</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60">
                  Flathub Verified
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  · {openSourceApps.filter(a => a.installed).length} installed
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sandboxed, verified FOSS applications, gaming engines, and creator tools.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Flathub & AUR..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
              />
            </div>

            <button
              onClick={() => openApp('gamedeck')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg text-xs transition-colors cursor-pointer shrink-0 font-medium"
              title="Open DevForge GameDeck"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>GameDeck Hub</span>
            </button>
          </div>
        </div>

        {/* Categories and Source Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto select-none py-0.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white font-medium shadow-sm'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Source Filter (Flathub / AUR / AppImage) */}
          <div className="flex items-center gap-1 text-[11px] font-mono select-none">
            <span className="text-slate-500 text-[10px] mr-1">Remote:</span>
            {(['All', 'Flathub', 'AUR', 'AppImage'] as const).map(src => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  selectedSource === src
                    ? 'bg-slate-800 text-purple-300 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Apps Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Featured Hero Showcase (shown when 'All' category and no search) */}
        {selectedCategory === 'All' && !search && selectedSource === 'All' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured Open Source Gaming &amp; Creator Platforms</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppDetail(app)}
                  className="p-3 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white font-bold font-mono text-sm shadow-md`}>
                        {app.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-purple-300">
                        {app.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-100 text-xs group-hover:text-purple-300 transition-colors">
                        {app.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {app.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-mono">{app.rating}</span>
                    </div>
                    <span className="font-mono text-emerald-400">{app.installed ? 'Installed' : `${app.sizeMB} MB`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Filtered Apps Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>{selectedCategory} Applications ({filteredApps.length})</span>
            <span className="text-[10px] font-mono text-slate-500">Repository: dl.flathub.org</span>
          </div>

          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No open source applications found matching "{search}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredApps.map(app => {
                const isInstalling = installingId === app.id;
                return (
                  <div
                    key={app.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      app.installed 
                        ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-950 border-slate-850 hover:border-purple-900/60'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* App Card Header */}
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white font-bold font-mono text-base shrink-0 shadow-md`}>
                          {app.name.substring(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-slate-100 text-xs truncate font-sans">
                              {app.name}
                            </h3>
                            {app.verifiedFOSS && (
                              <span title="Verified Free & Open Source Software">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {app.developer} · v{app.version}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                            <span className="flex items-center gap-0.5 text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{app.rating}</span>
                            </span>
                            <span>· {app.downloadCount} dl</span>
                            <span>· {app.license}</span>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                        {app.summary}
                      </p>

                      {/* Sandboxed permissions preview */}
                      {app.flatpakPermissions && app.flatpakPermissions.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {app.flatpakPermissions.slice(0, 3).map((perm, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[9px] font-mono text-slate-400 rounded"
                            >
                              {perm}
                            </span>
                          ))}
                          {app.flatpakPermissions.length > 3 && (
                            <span className="text-[9px] text-slate-500 font-mono self-center">
                              +{app.flatpakPermissions.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedAppDetail(app)}
                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-purple-300 font-mono cursor-pointer transition-colors"
                      >
                        <Info className="w-3 h-3" />
                        <span>Inspect sandbox</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {app.installed ? (
                          <div className="flex items-center gap-1">
                            <span className="flex items-center gap-1 px-2 py-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 rounded text-[10px] font-mono font-medium">
                              <Check className="w-3 h-3" />
                              <span>Installed</span>
                            </span>
                            <button
                              onClick={() => handleUninstall(app.id)}
                              className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                              title="Uninstall Flatpak package"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleInstall(app.id, app.name)}
                            disabled={isInstalling}
                            className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Download className={`w-3.5 h-3.5 ${isInstalling ? 'animate-bounce' : ''}`} />
                            <span>{isInstalling ? 'Installing...' : `Install (${app.sizeMB} MB)`}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* App Detail & Sandbox Permissions Modal */}
      {selectedAppDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedAppDetail.iconBg} flex items-center justify-center text-white font-bold font-mono text-lg shadow-md`}>
                  {selectedAppDetail.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-sm font-sans">{selectedAppDetail.name}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-950 text-purple-300">
                      {selectedAppDetail.source}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedAppDetail.id} · License: {selectedAppDetail.license}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAppDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <div className="text-[11px] text-slate-300 leading-relaxed space-y-2">
              <p>{selectedAppDetail.description}</p>
            </div>

            {/* Flatpak Sandbox Security Permissions (Flatseal style) */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-200">
                  Flatpak Sandbox Isolation (Flatseal Enforced)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Zero Privilege Escalation</span>
              </div>

              <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {selectedAppDetail.flatpakPermissions?.map((perm, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300">{perm}</span>
                    <span className="text-emerald-400 text-[10px]">ALLOWED (ISOLATED)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Command execution snippet */}
            <div className="p-2.5 bg-black rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
              <span>$ flatpak run {selectedAppDetail.id}</span>
              <span className="text-[10px] text-slate-500">CLI runner</span>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono">Size on Disk: {selectedAppDetail.sizeMB} MB</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedAppDetail(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Close
                </button>
                {selectedAppDetail.installed ? (
                  <button
                    onClick={() => {
                      handleUninstall(selectedAppDetail.id);
                      setSelectedAppDetail(null);
                    }}
                    className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded text-xs"
                  >
                    Uninstall
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleInstall(selectedAppDetail.id, selectedAppDetail.name);
                      setSelectedAppDetail(null);
                    }}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium"
                  >
                    Install Flatpak
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Download, 
  Check, 
  Trash2, 
  Star, 
  ShieldCheck, 
  Smartphone, 
  Layers, 
  Cpu, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Info,
  Sliders,
  Play
} from 'lucide-react';
import { AppGalleryApp } from '../../types/distro';
import { INITIAL_APPGALLERY_APPS } from '../../data/securityAndNewAppsDefaults';

export const HuaweiAppGalleryApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'installed' | 'hms-bridge'>('discover');
  const [apps, setApps] = useState<AppGalleryApp[]>(INITIAL_APPGALLERY_APPS);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [installingAppId, setInstallingAppId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppGalleryApp | null>(null);

  const handleInstallApp = (appId: string) => {
    setInstallingAppId(appId);
    setTimeout(() => {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, installed: true } : a));
      setInstallingAppId(null);
    }, 600);
  };

  const handleUninstallApp = (appId: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, installed: false } : a));
  };

  const filteredApps = apps.filter(app => {
    const matchesCat = categoryFilter === 'All' || app.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      app.name.toLowerCase().includes(q) || 
      app.developer.toLowerCase().includes(q) ||
      app.summary.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const installedApps = apps.filter(a => a.installed);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Huawei AppGallery Header */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 rounded-xl text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm tracking-wide">
                  HUAWEI AppGallery
                </h3>
                <span className="px-2 py-0.2 bg-red-950 text-red-300 border border-red-800 rounded text-[9px] font-mono">
                  Waydroid Linux Bridge · HMS Core 6.12
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Global Android &amp; HarmonyOS application hub running inside hardware-accelerated Linux container sandbox.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Waydroid LXC: Online</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 select-none">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === 'discover'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Discover &amp; Top Charts ({apps.length})
            </button>

            <button
              onClick={() => setActiveTab('installed')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === 'installed'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Installed Apps ({installedApps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hms-bridge')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === 'hms-bridge'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>HMS Core &amp; LXC Runtime</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>4-Layer Security Detection Verified</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* DISCOVER TAB */}
        {activeTab === 'discover' && (
          <div className="space-y-4">
            {/* Featured App Banner */}
            <div className="relative p-5 bg-gradient-to-r from-red-950 via-slate-900 to-black border border-red-900/60 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative z-10 max-w-lg space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600 text-white font-bold">
                  FEATURED ECOSYSTEM
                </span>
                <h4 className="text-base font-bold text-white font-sans">
                  TikTok, Telegram &amp; Mobile Workflows on DevForge
                </h4>
                <p className="text-xs text-slate-300">
                  Run high-performance mobile applications with Wayland graphics acceleration, PipeWire pro-audio synchronization, and multi-touch translation.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search AppGallery for Android &amp; Harmony applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1 overflow-x-auto pt-1">
                {['All', 'Top Apps', 'Games', 'Social', 'Productivity', 'Entertainment', 'Tools'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-red-900/80 text-red-200 border border-red-600'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredApps.map(app => {
                const isInstalling = installingAppId === app.id;

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0`}>
                          {app.name.substring(0, 2).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-100 text-xs truncate group-hover:text-red-400 transition-colors">
                              {app.name}
                            </h4>
                            {app.verifiedHms && (
                              <span title="Verified by Huawei Security Audit">
                                <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {app.developer}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[9px] font-mono text-slate-500">
                            <span className="flex items-center text-amber-400">
                              <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                              {app.rating}
                            </span>
                            <span>· {app.downloads} dl</span>
                            <span>· {app.sizeMB} MB</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {app.summary}
                      </p>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
                        <span className="px-1.5 py-0.2 bg-slate-950 border border-slate-800 rounded text-slate-400">
                          {app.category}
                        </span>
                        <span className="text-emerald-400">Waydroid Native Vulkan</span>
                      </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">v{app.version}</span>

                      <div>
                        {app.installed ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-mono font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Installed</span>
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUninstallApp(app.id);
                              }}
                              className="p-1 hover:bg-red-950 text-slate-500 hover:text-red-400 rounded"
                              title="Uninstall"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInstallApp(app.id);
                            }}
                            disabled={isInstalling}
                            className={`px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                              isInstalling ? 'opacity-70 cursor-wait' : ''
                            }`}
                          >
                            {isInstalling ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Installing APK...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3 h-3" />
                                <span>Install</span>
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
          </div>
        )}

        {/* INSTALLED APPS TAB */}
        {activeTab === 'installed' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-100 text-xs">Installed Waydroid Android Applications</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sandboxed inside LXC container with direct Wayland windowing and audio bridge.
                </p>
              </div>

              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                LXC Storage: 1.2 GB Used
              </div>
            </div>

            <div className="space-y-2">
              {installedApps.map(app => (
                <div
                  key={app.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-white font-bold text-xs`}>
                      {app.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-xs">{app.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {app.packageName} · {app.sizeMB} MB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Launching ${app.name} in Waydroid Android Subsystem container...`)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Launch in Waydroid</span>
                    </button>

                    <button
                      onClick={() => handleUninstallApp(app.id)}
                      className="p-1.5 hover:bg-red-950 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                      title="Uninstall app"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HMS CORE & LXC RUNTIME TAB */}
        {activeTab === 'hms-bridge' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-slate-100 text-xs">HMS Core &amp; Waydroid Architecture</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                DevForge Linux bridges Huawei Mobile Services (HMS) and Android apps natively via Waydroid:
              </p>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono pt-1">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold">HMS Core Service Layer</div>
                  <div className="text-emerald-400">Huawei Mobile Services v6.12 (Active)</div>
                  <div className="text-[10px] text-slate-500">PushKit, AccountKit, MapKit emulation enabled</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold">Graphics &amp; Compositor</div>
                  <div className="text-cyan-400">Wayland EGL / Vulkan VirGL Passthrough</div>
                  <div className="text-[10px] text-slate-500">Zero-copy hardware buffer streaming at 144Hz</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* App Detail Modal */}
      {selectedApp && (
        <div 
          onClick={() => setSelectedApp(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-text"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${selectedApp.iconBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {selectedApp.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{selectedApp.name}</h4>
                  <div className="text-[11px] text-slate-400 font-mono">{selectedApp.developer}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-500 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedApp.description}
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-slate-400 text-[10px] font-bold">SECURITY &amp; SANDBOX PERMISSIONS:</div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {selectedApp.permissions.map(p => (
                  <span key={p} className="px-1.5 py-0.2 bg-slate-900 border border-slate-700 rounded text-slate-300 text-[10px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Close
              </button>
              {selectedApp.installed ? (
                <button
                  onClick={() => {
                    handleUninstallApp(selectedApp.id);
                    setSelectedApp(null);
                  }}
                  className="px-4 py-1.5 bg-red-950 border border-red-800 text-red-300 rounded-lg text-xs"
                >
                  Uninstall
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleInstallApp(selectedApp.id);
                    setSelectedApp(null);
                  }}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-medium"
                >
                  Install to Waydroid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

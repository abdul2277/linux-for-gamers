import React, { useState } from 'react';
import { useDistro } from '../../context/DistroContext';
import { DistroTheme } from '../../types/distro';
import { 
  Sliders, 
  Keyboard, 
  Palette, 
  Cpu, 
  Disc, 
  Download, 
  Check, 
  Zap, 
  Edit2 
} from 'lucide-react';

export const SettingsApp: React.FC = () => {
  const { theme, setTheme, keybindings, updateKeybinding, telemetry } = useDistro();
  const [activeTab, setActiveTab] = useState<'themes' | 'shortcuts' | 'iso-builder'>('shortcuts');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingKeys, setEditingKeys] = useState('');
  const [isoGenerating, setIsoGenerating] = useState(false);
  const [isoReady, setIsoReady] = useState(false);

  const themes: Array<{ id: DistroTheme; name: string; bg: string; accent: string; desc: string }> = [
    {
      id: 'obsidian',
      name: 'Obsidian Dark (Default)',
      bg: '#0b0f19',
      accent: '#2563eb',
      desc: 'High contrast deep slate for maximum battery and reduced eye strain.'
    },
    {
      id: 'tokyo',
      name: 'Tokyo Night',
      bg: '#1a1b26',
      accent: '#7aa2f7',
      desc: 'Clean indigo-purple developer aesthetic inspired by Tokyo neon nights.'
    },
    {
      id: 'nord',
      name: 'Nord Cold Dark',
      bg: '#2e3440',
      accent: '#88c0d0',
      desc: 'Arctic, north-bluish clean palette engineered for fluent reading.'
    },
    {
      id: 'cyber-slate',
      name: 'Cyber Slate',
      bg: '#090d16',
      accent: '#06b6d4',
      desc: 'Monochrome titanium with cyan terminal accents.'
    },
    {
      id: 'gruvbox',
      name: 'Gruvbox Charcoal',
      bg: '#1d2021',
      accent: '#fe8019',
      desc: 'Warm retro dark tone with amber highlights.'
    }
  ];

  const handleStartEdit = (id: string, currentKeys: string) => {
    setEditingId(id);
    setEditingKeys(currentKeys);
  };

  const handleSaveShortcut = (id: string) => {
    if (editingKeys.trim()) {
      updateKeybinding(id, editingKeys.trim());
    }
    setEditingId(null);
  };

  const handleGenerateIso = () => {
    setIsoGenerating(true);
    setIsoReady(false);
    setTimeout(() => {
      setIsoGenerating(false);
      setIsoReady(true);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Settings Subheader */}
      <div className="h-10 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-300" />
          <span className="font-semibold text-slate-100 text-xs">Distro Customizer &amp; Settings</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'shortcuts' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard Shortcuts</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'themes' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Dark Mode UI</span>
          </button>

          <button
            onClick={() => setActiveTab('iso-builder')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'iso-builder' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>ISO &amp; Kernel Builder</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* KEYBOARD SHORTCUTS TAB */}
        {activeTab === 'shortcuts' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-slate-100 text-sm mb-1">Customizable Keyboard Shortcuts</h3>
              <p className="text-slate-400 text-[11px]">
                Global workstation hotkeys are actively bound in your browser session. Click "Edit" to customize any keybinding.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Keybinding</th>
                    <th className="py-2.5 px-4 text-right">Customize</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {keybindings.map(kb => {
                    const isEditing = editingId === kb.id;
                    return (
                      <tr key={kb.id} className="hover:bg-slate-850 transition-colors">
                        <td className="py-2.5 px-4 font-sans font-medium text-slate-200">
                          {kb.name}
                        </td>
                        <td className="py-2.5 px-4 text-[10px] text-slate-400">
                          {kb.category}
                        </td>
                        <td className="py-2.5 px-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingKeys}
                              onChange={e => setEditingKeys(e.target.value)}
                              autoFocus
                              className="px-2 py-0.5 bg-slate-950 border border-blue-500 rounded text-blue-300 font-mono text-xs focus:outline-none"
                            />
                          ) : (
                            <kbd className="px-2 py-1 bg-slate-850 border border-slate-700 rounded text-slate-300 text-[11px]">
                              {kb.keys}
                            </kbd>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveShortcut(kb.id)}
                              className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-sans font-medium cursor-pointer"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(kb.id, kb.keys)}
                              className="flex items-center gap-1 ml-auto text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer text-[10px] font-sans"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* THEMES TAB */}
        {activeTab === 'themes' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-slate-100 text-sm mb-1">Developer Dark Mode Themes</h3>
              <p className="text-slate-400 text-[11px]">
                High-contrast palettes designed for prolonged code editing, low eye fatigue, and optimal terminal visibility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map(t => {
                const isSelected = theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-slate-900 shadow-md ring-1 ring-blue-500/30'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: t.accent }} 
                        />
                        <span className="font-semibold text-slate-100 text-xs">{t.name}</span>
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] text-blue-400 font-mono">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ISO & KERNEL BUILDER TAB */}
        {activeTab === 'iso-builder' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-slate-100 text-sm mb-1">Distro Recipe &amp; Bootable ISO Builder</h3>
              <p className="text-slate-400 text-[11px]">
                Generate a minimal developer ISO image containing pre-installed Docker, k3s, Mold linker, and the lightweight desktop environment.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Kernel Architecture &amp; Scheduler
                  </label>
                  <select 
                    aria-label="Kernel Architecture and Scheduler"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value="rt">Linux 6.12.8 PREEMPT_RT (Real-Time Low Latency)</option>
                    <option value="xanmod">Linux 6.12 XanMod Edge (Aggressive Threading)</option>
                    <option value="hardened">Linux 6.12 Hardened Security Profile</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Default Linker Toolchain
                  </label>
                  <select 
                    aria-label="Default Linker Toolchain"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value="mold">Mold 2.34 Ultra-Fast (Default, 4.4x faster)</option>
                    <option value="lld">LLD 19 (LLVM Linker)</option>
                    <option value="gold">GNU ld.gold</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
                <div>Architecture: x86_64 / UEFI Secure Boot Enabled</div>
                <div>Idle Memory Footprint: ~280 MB RAM (Sway/Wayland minimal core)</div>
                <div>Pre-seeded Docker Layers: alpine, bun, node:22-alpine, postgres:17-alpine</div>
                <div>Estimated ISO size: 1.42 GB</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleGenerateIso}
                  disabled={isoGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Disc className={`w-4 h-4 ${isoGenerating ? 'animate-spin' : ''}`} />
                  <span>{isoGenerating ? 'Generating ISO & Squashing Filesystem...' : 'Build Custom DevForge ISO'}</span>
                </button>

                {isoReady && (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                    <Check className="w-4 h-4" />
                    <span>ISO image compiled: devforge-linux-2026.1-x86_64.iso</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

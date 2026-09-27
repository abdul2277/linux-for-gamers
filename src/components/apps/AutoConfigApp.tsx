import React, { useState } from 'react';
import { useDistro } from '../../context/DistroContext';
import { INITIAL_PRESETS } from '../../data/distroDefaults';
import { DevStackPreset } from '../../types/distro';
import { 
  Wrench, 
  Check, 
  Copy, 
  Terminal, 
  Download, 
  Zap, 
  Sparkles, 
  FileCode, 
  Cpu 
} from 'lucide-react';

export const AutoConfigApp: React.FC = () => {
  const { executeTerminalCommand, openApp } = useDistro();
  const [selectedPreset, setSelectedPreset] = useState<DevStackPreset>(INITIAL_PRESETS[0]);
  const [configOptions, setConfigOptions] = useState({
    moldLinker: true,
    dockerTmpfs: true,
    starshipPrompt: true,
    gitAliases: true,
    sysctlTuning: true,
    neovimConfig: true,
    rootlessContainers: true
  });
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'bash' | 'cloud-init' | 'dockerfile'>('bash');

  const toggleOption = (key: keyof typeof configOptions) => {
    setConfigOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generateScript = () => {
    if (activeFormat === 'bash') {
      return `#!/usr/bin/env bash
# ==============================================================================
# DevForge OS — Automated Developer Environment Bootstrap Script
# Preset: ${selectedPreset.name}
# ==============================================================================
set -euo pipefail

echo "==> [DevForge] Bootstrapping developer workstation environment..."

${configOptions.moldLinker ? `# 1. Configure Mold Ultra-Fast Linker as Default
echo "==> Configuring mold linker hooks for cargo, gcc, and clang..."
mkdir -p ~/.cargo
cat << 'EOF' > ~/.cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
EOF
export RUSTC_WRAPPER="sccache"
` : ''}

${configOptions.dockerTmpfs ? `# 2. Docker Daemon Tmpfs & BuildKit Acceleration
echo "==> Enabling BuildKit and tmpfs overlay caching in /etc/docker/daemon.json..."
sudo tee /etc/docker/daemon.json > /dev/null << 'EOF'
{
  "features": { "buildkit": true },
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" },
  "default-ulimits": {
    "nofile": { "Name": "nofile", "Hard": 65536, "Soft": 65536 }
  }
}
EOF
sudo systemctl restart docker
` : ''}

${configOptions.sysctlTuning ? `# 3. Kernel Sysctl Performance Limits (IDE File Watches & Docker Pods)
echo "==> Applying low-latency kernel parameters..."
sudo tee /etc/sysctl.d/99-devforge-performance.conf > /dev/null << 'EOF'
fs.inotify.max_user_watches = 524288
fs.inotify.max_user_instances = 8192
vm.max_map_count = 524288
net.core.somaxconn = 4096
EOF
sudo sysctl -p /etc/sysctl.d/99-devforge-performance.conf
` : ''}

${configOptions.starshipPrompt ? `# 4. Configure Minimalist Starship Prompt with Git & Container status
mkdir -p ~/.config
cat << 'EOF' > ~/.config/starship.toml
add_newline = false
format = "$directory$git_branch$git_status$docker_context$character"

[directory]
style = "bold blue"
truncation_length = 3

[character]
success_symbol = "[λ](bold green)"
error_symbol = "[λ](bold red)"
EOF
` : ''}

# 5. Installing Stack Packages: ${selectedPreset.packages.join(', ')}
echo "==> Installing pre-selected runtime toolchains..."
devforge pkg install ${selectedPreset.packages.join(' ')}

echo "✓ DevForge environment configuration complete! Happy hacking."
`;
    }

    if (activeFormat === 'cloud-init') {
      return `#cloud-config
# DevForge OS Automated Workstation Cloud-Init
package_update: true
package_upgrade: false
packages:
  - docker-ce
  - buildkit
  - mold
  - k3s

write_files:
  - path: /etc/sysctl.d/99-devforge.conf
    content: |
      fs.inotify.max_user_watches=524288
      vm.max_map_count=524288
  - path: /etc/docker/daemon.json
    content: |
      { "features": { "buildkit": true }, "storage-driver": "overlay2" }

runcmd:
  - sysctl -p /etc/sysctl.d/99-devforge.conf
  - systemctl enable --now docker
  - systemctl enable --now k3s
`;
    }

    return `# DevForge Base Developer Containerfile
FROM devforge/base:6.12-rt
LABEL maintainer="DevForge OS"

# Pre-install development stack toolchains
RUN devforge pkg install ${selectedPreset.packages.join(' ')}

# Enable Mold linker and BuildKit optimizations
ENV CC="clang"
ENV CXX="clang++"
ENV LDFLAGS="-fuse-ld=mold"

WORKDIR /workspace
CMD ["/bin/zsh"]
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunInTerminal = () => {
    openApp('terminal');
    executeTerminalCommand('bash -c "echo \\"Executing DevForge bootstrap script...\\""');
    executeTerminalCommand(`devforge pkg install ${selectedPreset.packages.join(' ')}`);
  };

  const handleDownload = () => {
    const script = generateScript();
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFormat === 'bash' ? 'devforge-setup.sh' : activeFormat === 'cloud-init' ? 'cloud-init.yaml' : 'Dockerfile';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* App Header */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 space-y-2 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-100 font-sans">Automated Environment Configuration</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRunInTerminal}
              className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Run in Terminal</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Automate developer workstation setup with tuned kernel sysctl parameters, mold linker bindings, and zero background bloat.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Stack Presets & Dotfile Toggles */}
        <div className="w-full md:w-80 bg-slate-900/50 border-r border-slate-800 flex flex-col p-4 space-y-4 overflow-y-auto select-none shrink-0">
          {/* Preset Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Stack Preset
            </label>
            <div className="space-y-1.5">
              {INITIAL_PRESETS.map(preset => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/30 border-amber-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-200">{preset.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">{preset.buildSpeedup}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Productivity & Kernel Tuning Toggles */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Productivity &amp; Kernel Features
            </label>
            <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configOptions.moldLinker}
                  onChange={() => toggleOption('moldLinker')}
                  className="rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300">Mold Fast Linker ~/.cargo/config</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configOptions.dockerTmpfs}
                  onChange={() => toggleOption('dockerTmpfs')}
                  className="rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300">Docker BuildKit Cache Mounts</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configOptions.sysctlTuning}
                  onChange={() => toggleOption('sysctlTuning')}
                  className="rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300">Kernel inotify &amp; max_map_count limits</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configOptions.starshipPrompt}
                  onChange={() => toggleOption('starshipPrompt')}
                  className="rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300">Minimalist Starship Shell Prompt</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Generated Output Preview */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Format Tabs & Copy */}
          <div className="h-9 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between select-none">
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <button
                onClick={() => setActiveFormat('bash')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeFormat === 'bash' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                devforge-setup.sh
              </button>
              <button
                onClick={() => setActiveFormat('cloud-init')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeFormat === 'cloud-init' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                cloud-init.yaml
              </button>
              <button
                onClick={() => setActiveFormat('dockerfile')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeFormat === 'dockerfile' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Containerfile
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="flex-1 p-4 overflow-auto font-mono text-[11px] leading-relaxed text-slate-300 selection:bg-amber-600/30">
            {generateScript()}
          </pre>
        </div>
      </div>
    </div>
  );
};

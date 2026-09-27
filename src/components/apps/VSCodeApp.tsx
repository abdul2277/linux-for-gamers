import React, { useState } from 'react';
import { useDistro } from '../../context/DistroContext';
import { 
  FileCode, 
  Play, 
  Terminal, 
  FolderTree, 
  Plus, 
  X, 
  Check, 
  Zap, 
  Layers, 
  Puzzle, 
  Copy 
} from 'lucide-react';

export const VSCodeApp: React.FC = () => {
  const { 
    projectFiles, 
    activeFile, 
    openFileTabs, 
    selectFile, 
    closeFileTab, 
    updateFileContent, 
    addProjectFile, 
    runBuild, 
    isBuilding, 
    buildResult,
    clearBuildResult,
    extensions,
    toggleExtension,
    openApp
  } = useDistro();

  const [activeTab, setActiveTab] = useState<'editor' | 'extensions' | 'build-logs'>('editor');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLang, setNewFileLang] = useState('typescript');
  const [copied, setCopied] = useState(false);

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    addProjectFile(newFileName.trim(), newFileLang, `// ${newFileName}\n// Created in DevForge OS\n`);
    setNewFileName('');
    setShowNewFileModal(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden select-text">
      {/* Activity Bar */}
      <div className="w-12 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-2 gap-3 shrink-0 select-none">
        <button
          onClick={() => setActiveTab('editor')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'editor' ? 'text-blue-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Explorer (Files)"
        >
          <FolderTree className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('extensions')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'extensions' ? 'text-blue-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Extensions"
        >
          <Puzzle className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('build-logs')}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'build-logs' ? 'text-blue-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Fast Build Output & Mold Linker"
        >
          <Zap className="w-5 h-5" />
        </button>

        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => openApp('terminal')}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Open Integrated Terminal (Alt+Enter)"
          >
            <Terminal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar (Explorer or Extensions) */}
      <div className="w-56 bg-slate-900/60 border-r border-slate-800 flex flex-col shrink-0 select-none">
        {activeTab === 'editor' && (
          <>
            <div className="h-9 px-3 flex items-center justify-between border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Explorer</span>
              <button
                onClick={() => setShowNewFileModal(true)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
                title="New File"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2 space-y-0.5 overflow-y-auto flex-1 font-mono text-[11px]">
              <div className="px-2 py-1 text-slate-500 font-semibold text-[10px] uppercase">
                WORKSPACE: devforge-app
              </div>
              {projectFiles.map(file => (
                <button
                  key={file.path}
                  onClick={() => selectFile(file.path)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left truncate cursor-pointer ${
                    activeFile.path === file.path
                      ? 'bg-blue-600/20 text-blue-300 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Actions Footer */}
            <div className="p-2 border-t border-slate-800 bg-slate-900/40 space-y-1.5">
              <button
                onClick={() => runBuild()}
                disabled={isBuilding}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isBuilding ? 'animate-spin' : ''}`} />
                <span>{isBuilding ? 'Building (Mold)...' : 'Fast Mold Build'}</span>
              </button>
              <button
                onClick={() => openApp('docker-k8s')}
                className="w-full flex items-center justify-center gap-1.5 py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Deploy to Local K8s</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'extensions' && (
          <div className="flex flex-col h-full">
            <div className="h-9 px-3 flex items-center border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Extensions ({extensions.filter(e => e.installed).length})</span>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1">
              {extensions.map(ext => (
                <div key={ext.id} className="p-2 bg-slate-950/60 rounded border border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate">{ext.name}</span>
                    <button
                      onClick={() => toggleExtension(ext.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                        ext.installed
                          ? 'bg-slate-800 text-slate-300 hover:bg-red-950 hover:text-red-400'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      {ext.installed ? 'Disable' : 'Install'}
                    </button>
                  </div>
                  <p className="text-slate-400 text-[10px] line-clamp-2">{ext.description}</p>
                  <div className="text-slate-500 text-[9px] font-mono">
                    {ext.publisher} · v{ext.version}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'build-logs' && (
          <div className="flex flex-col h-full">
            <div className="h-9 px-3 flex items-center justify-between border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Linker &amp; Build Engine</span>
            </div>
            <div className="p-3 text-[11px] space-y-2 text-slate-300">
              <div className="p-2 bg-blue-950/30 border border-blue-800/50 rounded space-y-1">
                <span className="font-semibold text-blue-300">Mold Linker v2.34</span>
                <p className="text-[10px] text-slate-400">
                  Pre-configured as default ELF linker. Links C++ &amp; Rust binaries in ~0.08s.
                </p>
              </div>
              <div className="p-2 bg-slate-950/80 border border-slate-800 rounded space-y-1">
                <span className="font-semibold text-slate-200">BuildKit Cache-Mount</span>
                <p className="text-[10px] text-slate-400">
                  Reuses layer hashes without rebuilding node_modules or cargo registry.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Editor Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Editor Tabs */}
        <div className="h-9 bg-slate-900/80 border-b border-slate-800 flex items-center overflow-x-auto select-none">
          {openFileTabs.map(path => {
            const file = projectFiles.find(f => f.path === path);
            const isActive = activeFile.path === path;
            return (
              <div
                key={path}
                onClick={() => selectFile(path)}
                className={`flex items-center gap-2 h-full px-3 border-r border-slate-800 text-[11px] cursor-pointer font-mono whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-950 text-blue-400 border-t-2 border-t-blue-500 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <span>{file?.name || path}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFileTab(path);
                  }}
                  className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          <div className="ml-auto pr-3 flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Copy code"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => runBuild()}
              disabled={isBuilding}
              className="flex items-center gap-1 px-2 py-0.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded text-[11px] transition-colors font-mono cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Run</span>
            </button>
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="flex-1 flex overflow-hidden font-mono text-[12px] leading-relaxed">
          {/* Line Numbers */}
          <div className="w-12 py-3 bg-slate-950 border-r border-slate-800/60 text-right pr-3 select-none text-slate-600 font-mono">
            {activeFile.content.split('\n').map((_, i) => (
              <div key={i} className="h-5">{i + 1}</div>
            ))}
          </div>

          {/* Editable Text Area */}
          <textarea
            value={activeFile.content}
            onChange={(e) => updateFileContent(activeFile.path, e.target.value)}
            spellCheck={false}
            className="flex-1 py-3 px-4 bg-transparent text-slate-200 resize-none focus:outline-none overflow-auto font-mono text-[12px] leading-5 whitespace-pre selection:bg-blue-600/30"
          />
        </div>

        {/* Build Benchmark Output Drawer */}
        {buildResult && (
          <div className="h-44 bg-slate-900 border-t border-slate-800 flex flex-col font-mono text-[11px]">
            <div className="h-7 px-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-200">BuildKit + Mold Link Result</span>
                <span className="text-emerald-400 font-semibold">{buildResult.speedup}</span>
              </div>
              <button
                onClick={() => clearBuildResult()}
                className="hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <pre className="flex-1 p-3 overflow-y-auto text-slate-300 text-[11px] leading-tight select-text">
              {buildResult.output}
            </pre>
          </div>
        )}
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateFile} 
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Create New Project File</span>
              <button 
                type="button" 
                onClick={() => setShowNewFileModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">File Name</label>
              <input
                type="text"
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                placeholder="e.g. worker.rs, config.json"
                autoFocus
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Language</label>
              <select
                value={newFileLang}
                onChange={e => setNewFileLang(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="typescript">TypeScript</option>
                <option value="rust">Rust</option>
                <option value="yaml">YAML / Kubernetes</option>
                <option value="dockerfile">Dockerfile</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewFileModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

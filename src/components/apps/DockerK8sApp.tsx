import React, { useState } from 'react';
import { useDistro } from '../../context/DistroContext';
import { 
  Box, 
  Layers, 
  Play, 
  Square, 
  Pause, 
  Trash2, 
  Plus, 
  FileText, 
  RefreshCw, 
  Cpu, 
  Activity, 
  Server, 
  ChevronRight, 
  Check, 
  Copy, 
  X 
} from 'lucide-react';

export const DockerK8sApp: React.FC = () => {
  const { 
    containers, 
    startContainer, 
    stopContainer, 
    pauseContainer, 
    deleteContainer, 
    createContainer,
    pods, 
    deployments, 
    scaleDeployment, 
    restartDeployment, 
    deletePod,
    telemetry,
    toggleDockerDaemon,
    toggleK8sCluster
  } = useDistro();

  const [activeTab, setActiveTab] = useState<'docker' | 'k8s' | 'compose'>('docker');
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(containers[0]?.id || null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [newContainerName, setNewContainerName] = useState('');
  const [newContainerImage, setNewContainerImage] = useState('redis:7.4-alpine');
  const [newContainerPort, setNewContainerPort] = useState('6380:6379');
  const [showYamlModal, setShowYamlModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedContainer = containers.find(c => c.id === selectedContainerId);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContainerImage.trim()) return;
    createContainer(newContainerName, newContainerImage, newContainerPort);
    setShowLaunchModal(false);
    setNewContainerName('');
  };

  const sampleYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: production
spec:
  replicas: ${deployments[0]?.desired || 2}
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: devforge/api-gateway:latest
        ports:
        - containerPort: 8080`;

  const copyYaml = () => {
    navigator.clipboard.writeText(sampleYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 text-xs font-sans overflow-hidden">
      {/* App Subheader */}
      <div className="h-10 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('docker')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'docker' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Docker Containers ({containers.filter(c => c.status === 'running').length}/{containers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('k8s')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'k8s' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kubernetes k3s ({pods.length} pods)</span>
            </button>

            <button
              onClick={() => setActiveTab('compose')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'compose' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Compose Stacks</span>
            </button>
          </div>
        </div>

        {/* Right header controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'docker' && (
            <button
              onClick={() => setShowLaunchModal(true)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deploy Container</span>
            </button>
          )}

          {activeTab === 'k8s' && (
            <button
              onClick={() => setShowYamlModal(true)}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Manifest YAML</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'docker' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Containers List Table */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800/80">
              <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>ACTIVE CONTAINERS (DOCKER ENGINE 27.2)</span>
                <span className="font-mono text-emerald-400 font-normal">tmpfs overlay2 caching enabled</span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900/70 border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase">
                    <tr>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Image</th>
                      <th className="py-2 px-3">Ports</th>
                      <th className="py-2 px-3 text-right">CPU</th>
                      <th className="py-2 px-3 text-right">RAM</th>
                      <th className="py-2 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-[11px]">
                    {containers.map(c => {
                      const isSelected = selectedContainerId === c.id;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedContainerId(c.id)}
                          className={`hover:bg-slate-900/50 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-950/30 text-white' : 'text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <span className="flex items-center gap-1.5 font-mono text-[10px]">
                              <span className={`w-2 h-2 rounded-full ${
                                c.status === 'running' ? 'bg-emerald-400' : c.status === 'paused' ? 'bg-amber-400' : 'bg-slate-600'
                              }`} />
                              <span className="capitalize">{c.status}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold font-mono text-slate-200">
                            {c.name}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400 truncate max-w-[160px]">
                            {c.image}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400 text-[10px]">
                            {c.ports.join(', ') || '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                            {c.status === 'running' ? `${c.cpuUsage.toFixed(1)}%` : '0%'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                            {c.status === 'running' ? `${c.memUsageMB} MB` : '0 MB'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                              {c.status === 'running' ? (
                                <>
                                  <button
                                    onClick={() => pauseContainer(c.id)}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition-colors"
                                    title="Pause"
                                  >
                                    <Pause className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => stopContainer(c.id)}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors"
                                    title="Stop"
                                  >
                                    <Square className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => startContainer(c.id)}
                                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                                  title="Start"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteContainer(c.id)}
                                className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400 transition-colors"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Container Details & Logs Drawer */}
            <div className="w-full md:w-80 bg-slate-950 flex flex-col border-t md:border-t-0 md:border-l border-slate-800">
              <div className="h-9 px-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-slate-300 text-[11px] font-semibold">
                <span>CONTAINER INSPECT &amp; LOGS</span>
                <span className="font-mono text-[10px] text-blue-400">{selectedContainer?.name || 'None'}</span>
              </div>

              {selectedContainer ? (
                <div className="flex-1 flex flex-col p-3 space-y-3 overflow-y-auto">
                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>ID:</span>
                      <span className="text-slate-200">{selectedContainer.id}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Image:</span>
                      <span className="text-blue-300 truncate max-w-[170px]">{selectedContainer.image}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Created:</span>
                      <span className="text-slate-200">{selectedContainer.created}</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Stream Logs (stdout / stderr)
                    </span>
                    <div className="flex-1 min-h-[140px] p-2 bg-black rounded border border-slate-800 font-mono text-[10px] text-emerald-400/90 overflow-y-auto space-y-1 select-text">
                      {selectedContainer.logs.map((line, idx) => (
                        <div key={idx} className="leading-tight">{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Select a container to inspect metrics and live logs.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'k8s' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            {/* Cluster Banner */}
            <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-900/40 rounded border border-indigo-700/60">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-indigo-200">
                    <span>k3s Single-Node Lightweight Cluster</span>
                    <span className="text-[10px] font-mono text-emerald-400">· Ready</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Node: <span className="font-mono text-slate-300">devforge-node-01</span> · Version: <span className="font-mono text-slate-300">v1.31.2+k3s1</span> · RAM Idle: <span className="font-mono text-emerald-400">180 MB</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-mono">5 Pods active</span>
              </div>
            </div>

            {/* Deployments Section with Replica Scaling */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Deployments (Replica Scaler)</span>
                <span className="text-[10px] text-slate-500 font-mono">Horizontal Pod Autoscaler Ready</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deployments.map(dep => (
                  <div key={dep.name} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-200 font-mono text-xs">{dep.name}</span>
                        <div className="text-[10px] text-slate-500 font-mono">ns: {dep.namespace} · port: {dep.servicePort}</div>
                      </div>
                      <button
                        onClick={() => restartDeployment(dep.name)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Rolling Restart Deployment"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
                        <span>Replicas:</span>
                        <span className="font-bold text-indigo-400 tabular-nums">{dep.replicas}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => scaleDeployment(dep.name, -1)}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs cursor-pointer"
                          title="Scale down"
                        >
                          -
                        </button>
                        <button
                          onClick={() => scaleDeployment(dep.name, 1)}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-mono text-xs cursor-pointer"
                          title="Scale up"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pods List */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Kubernetes Pods
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase">
                    <tr>
                      <th className="py-2 px-3">Pod Name</th>
                      <th className="py-2 px-3">Namespace</th>
                      <th className="py-2 px-3">Ready</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">CPU/RAM</th>
                      <th className="py-2 px-3 text-right">Age</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {pods.map(pod => (
                      <tr key={pod.name} className="hover:bg-slate-850 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-200 truncate max-w-[220px]">
                          {pod.name}
                        </td>
                        <td className="py-2 px-3 text-slate-400 text-[10px]">{pod.namespace}</td>
                        <td className="py-2 px-3 text-slate-300">{pod.ready}</td>
                        <td className="py-2 px-3">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{pod.status}</span>
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-400 text-[10px]">
                          {pod.cpuReq} / {pod.memReq}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400 text-[10px]">{pod.age}</td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => deletePod(pod.name)}
                            className="p-1 hover:bg-slate-800 text-slate-500 hover:text-red-400 rounded transition-colors"
                            title="Delete Pod (reschedules)"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compose' && (
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100 text-sm">Stack: devforge-microservices</h3>
                  <p className="text-slate-400 text-[11px]">File: /workspace/docker-compose.yml · 3 services connected</p>
                </div>
                <button
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-xs transition-colors cursor-pointer"
                >
                  Restart Compose Stack
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                  <span className="font-semibold text-blue-400 font-mono">api (Bun 1.2)</span>
                  <div className="text-[11px] text-slate-400 mt-1">Port 8080 · Build context active</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                  <span className="font-semibold text-sky-400 font-mono">db (Postgres 17)</span>
                  <div className="text-[11px] text-slate-400 mt-1">Port 5432 · Volume mounted</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                  <span className="font-semibold text-rose-400 font-mono">redis (Redis 7.4)</span>
                  <div className="text-[11px] text-slate-400 mt-1">Port 6379 · In-memory cache</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Launch Container Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleLaunch} 
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Deploy New Container</span>
              <button 
                type="button" 
                onClick={() => setShowLaunchModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Container Name</label>
              <input
                type="text"
                value={newContainerName}
                onChange={e => setNewContainerName(e.target.value)}
                placeholder="e.g. auth-service"
                autoFocus
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Image (Docker Hub or Local)</label>
              <input
                type="text"
                value={newContainerImage}
                onChange={e => setNewContainerImage(e.target.value)}
                placeholder="e.g. nginx:alpine, redis:latest"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Port Mapping (Host:Container)</label>
              <input
                type="text"
                value={newContainerPort}
                onChange={e => setNewContainerPort(e.target.value)}
                placeholder="e.g. 8080:80"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLaunchModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium"
              >
                Launch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* YAML Manifest Preview Modal */}
      {showYamlModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Generated Kubernetes Manifest</span>
              <button 
                type="button" 
                onClick={() => setShowYamlModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="flex-1 p-3 bg-black rounded border border-slate-800 font-mono text-[11px] text-slate-300 overflow-y-auto select-text">
              {sampleYaml}
            </pre>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-500 font-mono">Compatible with kubectl apply -f</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyYaml}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy YAML'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowYamlModal(false)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

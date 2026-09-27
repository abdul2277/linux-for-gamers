import { DevPackage, DockerContainer, K8sDeployment, K8sPod, ProjectFile, DevStackPreset, Extension, SyncedDevice } from '../types/distro';

export const INITIAL_PACKAGES: DevPackage[] = [
  // Container & K8s Runtimes
  {
    id: 'docker-ce',
    name: 'Docker Engine 27.2',
    category: 'containers',
    version: '27.2.1-devforge',
    description: 'Pre-optimized container engine with tmpfs overlayfs & direct buildkit cache integration',
    sizeMB: 184,
    installed: true,
    isCore: true,
    buildAccelerationBenefit: '3.4x faster image layers with zstd compression',
    dependencies: ['containerd', 'runc', 'libseccomp'],
    command: 'docker --version'
  },
  {
    id: 'k3s-k8s',
    name: 'K3s Lightweight Kubernetes',
    category: 'containers',
    version: 'v1.31.2+k3s1',
    description: 'Certified lightweight Kubernetes distribution configured for dev laptops and edge nodes',
    sizeMB: 96,
    installed: true,
    isCore: true,
    buildAccelerationBenefit: 'Starts local cluster in < 1.8 seconds with 180MB RAM idle',
    dependencies: ['containerd', 'iptables'],
    command: 'kubectl get nodes'
  },
  {
    id: 'podman-engine',
    name: 'Podman 5.2 (Rootless)',
    category: 'containers',
    version: '5.2.4',
    description: 'Daemonless, rootless container engine for OCI containers and pods',
    sizeMB: 88,
    installed: true,
    isCore: false,
    dependencies: ['crun', 'conmon'],
    command: 'podman info'
  },
  {
    id: 'helm',
    name: 'Helm 3 Package Manager',
    category: 'containers',
    version: 'v3.16.2',
    description: 'The package manager for Kubernetes. Easily deploy complex multi-service charts',
    sizeMB: 48,
    installed: true,
    isCore: false,
    dependencies: ['k3s-k8s'],
    command: 'helm version'
  },
  // Toolchains & Linkers (Fast build times!)
  {
    id: 'mold-linker',
    name: 'Mold Ultra-Fast Linker',
    category: 'toolchains',
    version: '2.34.0',
    description: 'High-speed drop-in replacement for GNU ld and gold. Links C++/Rust 4x faster than lld',
    sizeMB: 32,
    installed: true,
    isCore: true,
    buildAccelerationBenefit: 'Reduces Rust & C++ final link stage from 24s down to 1.8s',
    dependencies: ['glibc', 'libzstd'],
    command: 'mold --version'
  },
  {
    id: 'buildkit-daemon',
    name: 'BuildKit Daemon (Daemonless)',
    category: 'toolchains',
    version: 'v0.16.0',
    description: 'Concurrent, cache-efficient Docker build backend with multi-stage mount acceleration',
    sizeMB: 54,
    installed: true,
    isCore: true,
    buildAccelerationBenefit: 'Reuses cache across branch checkouts with local content hash',
    dependencies: ['docker-ce'],
    command: 'buildctl --version'
  },
  {
    id: 'ccache',
    name: 'ccache Compiler Cache',
    category: 'toolchains',
    version: '4.10.1',
    description: 'Fast C/C++ compiler cache. Avoids recompiling unchanged object files',
    sizeMB: 18,
    installed: true,
    isCore: false,
    buildAccelerationBenefit: 'Zero-overhead object re-use across Docker multi-stage builds',
    dependencies: ['gcc'],
    command: 'ccache -s'
  },
  // Programming Languages
  {
    id: 'rust-toolchain',
    name: 'Rust & Cargo 1.84',
    category: 'languages',
    version: '1.84.0 (c4146a48d)',
    description: 'Modern systems language toolchain pre-linked with mold and sccache',
    sizeMB: 310,
    installed: true,
    isCore: false,
    buildAccelerationBenefit: 'Mold linker integration cuts incremental builds to ~1.2s',
    dependencies: ['mold-linker', 'gcc'],
    command: 'rustc --version'
  },
  {
    id: 'bun-runtime',
    name: 'Bun 1.2 JavaScript Runtime',
    category: 'languages',
    version: '1.2.2',
    description: 'Incredibly fast all-in-one JavaScript runtime, bundler, test runner and package manager',
    sizeMB: 92,
    installed: true,
    isCore: false,
    buildAccelerationBenefit: 'Installs npm packages up to 25x faster than standard npm',
    dependencies: ['glibc'],
    command: 'bun --version'
  },
  {
    id: 'nodejs-lts',
    name: 'Node.js 22 LTS (Jod)',
    category: 'languages',
    version: 'v22.11.0',
    description: 'Asynchronous event-driven JavaScript runtime with corepack enabled (pnpm/yarn)',
    sizeMB: 140,
    installed: true,
    isCore: false,
    dependencies: ['glibc'],
    command: 'node -v'
  },
  {
    id: 'golang',
    name: 'Go 1.23.4 Toolchain',
    category: 'languages',
    version: 'go1.23.4 linux/amd64',
    description: 'Fast compiled programming language designed for scalable cloud services and microservices',
    sizeMB: 280,
    installed: true,
    isCore: false,
    buildAccelerationBenefit: 'Builds static microservice binaries in under 3 seconds',
    dependencies: ['glibc'],
    command: 'go version'
  },
  {
    id: 'python-uv',
    name: 'Python 3.12 + Astral uv',
    category: 'languages',
    version: '3.12.7 / uv 0.4.25',
    description: 'Extremely fast Python package and project manager written in Rust, replacing pip/poetry',
    sizeMB: 165,
    installed: true,
    isCore: false,
    buildAccelerationBenefit: 'Resolves and installs complex PyTorch/FastAPI dependencies 10x-100x faster',
    dependencies: ['libssl', 'libffi'],
    command: 'uv --version'
  },
  // DevOps & Cloud
  {
    id: 'terraform',
    name: 'Terraform CLI',
    category: 'devops',
    version: '1.9.8',
    description: 'Infrastructure as Code tool to build, change, and version cloud infrastructure safely',
    sizeMB: 65,
    installed: true,
    isCore: false,
    dependencies: ['glibc'],
    command: 'terraform -v'
  },
  {
    id: 'tilt-dev',
    name: 'Tilt Local Dev Engine',
    category: 'devops',
    version: 'v0.33.19',
    description: 'Microservice development tool that live-updates Kubernetes apps as you edit files',
    sizeMB: 42,
    installed: false,
    isCore: false,
    dependencies: ['k3s-k8s', 'docker-ce'],
    command: 'tilt version'
  },
  {
    id: 'k9s',
    name: 'k9s Kubernetes TUI',
    category: 'devops',
    version: 'v0.32.5',
    description: 'Terminal-based UI to interact with your Kubernetes clusters with vim keybindings',
    sizeMB: 28,
    installed: true,
    isCore: false,
    dependencies: ['k3s-k8s'],
    command: 'k9s version'
  },
  // Databases
  {
    id: 'postgresql-dev',
    name: 'PostgreSQL 17 Client & Embedded',
    category: 'databases',
    version: '17.1-1',
    description: 'Relational database client and local zero-conf development service with pg_stat',
    sizeMB: 82,
    installed: true,
    isCore: false,
    dependencies: ['libpq'],
    command: 'psql --version'
  },
  {
    id: 'redis-cli',
    name: 'Redis 7.4 Client & Server',
    category: 'databases',
    version: '7.4.1',
    description: 'In-memory data structure store used as a database, cache, and message broker',
    sizeMB: 24,
    installed: true,
    isCore: false,
    dependencies: ['glibc'],
    command: 'redis-cli -v'
  },
  // CLI & Terminal Tools
  {
    id: 'ripgrep',
    name: 'ripgrep (rg)',
    category: 'cli-tools',
    version: '14.1.1',
    description: 'Fast line-oriented search tool that respects your gitignore rules',
    sizeMB: 12,
    installed: true,
    isCore: true,
    dependencies: [],
    command: 'rg --version'
  },
  {
    id: 'fzf',
    name: 'fzf Fuzzy Finder',
    category: 'cli-tools',
    version: '0.56.0',
    description: 'Interactive general-purpose command-line fuzzy finder for commands, files and git commits',
    sizeMB: 8,
    installed: true,
    isCore: true,
    dependencies: [],
    command: 'fzf --version'
  },
  {
    id: 'starship-prompt',
    name: 'Starship Cross-Shell Prompt',
    category: 'cli-tools',
    version: '1.21.1',
    description: 'The minimal, blazingly fast, and infinitely customizable prompt for any shell',
    sizeMB: 16,
    installed: true,
    isCore: true,
    dependencies: [],
    command: 'starship --version'
  }
];

export const INITIAL_CONTAINERS: DockerContainer[] = [
  {
    id: 'c-8f921a',
    name: 'api-gateway',
    image: 'devforge/api-gateway:latest',
    command: 'bun run src/index.ts',
    status: 'running',
    ports: ['0.0.0.0:8080->8080/tcp'],
    cpuUsage: 1.2,
    memUsageMB: 48,
    created: '2 hours ago',
    logs: [
      '[13:02:11] [INFO] Loaded DevForge low-latency socket configuration',
      '[13:02:11] [INFO] Listening on http://0.0.0.0:8080 (worker threads: 4)',
      '[13:02:14] [ROUTE] GET /v1/health -> 200 OK (0.24ms)',
      '[13:04:30] [ROUTE] POST /v1/deploy -> 201 Created (1.82ms)',
      '[13:05:01] [METRIC] Ingress rate: 420 req/s · Zero dropped packets'
    ]
  },
  {
    id: 'c-3b44e0',
    name: 'redis-cache',
    image: 'redis:7.4-alpine',
    command: 'docker-entrypoint.sh redis-server --save "" --appendonly no',
    status: 'running',
    ports: ['0.0.0.0:6379->6379/tcp'],
    cpuUsage: 0.3,
    memUsageMB: 19,
    created: '4 hours ago',
    logs: [
      '1:M 27 Sep 13:00:00.120 * Running in DevForge dev-optimized memory mode',
      '1:M 27 Sep 13:00:00.122 * Ready to accept connections tcp',
      '1:M 27 Sep 13:01:45.892 * 1 client connected, 1.4k keys indexed'
    ]
  },
  {
    id: 'c-e710bc',
    name: 'postgres-db',
    image: 'postgres:17-alpine',
    command: 'docker-entrypoint.sh postgres -c shared_buffers=256MB',
    status: 'running',
    ports: ['0.0.0.0:5432->5432/tcp'],
    cpuUsage: 0.8,
    memUsageMB: 64,
    created: '4 hours ago',
    logs: [
      '2026-09-27 13:00:02.341 UTC [1] LOG: database system was shut down at 2026-09-27 12:59:58 UTC',
      '2026-09-27 13:00:02.355 UTC [1] LOG: database system is ready to accept connections',
      '2026-09-27 13:01:10.100 UTC [24] LOG: connection authorized: user=devforge database=app_development'
    ]
  },
  {
    id: 'c-912a7f',
    name: 'worker-queue-rust',
    image: 'devforge/worker-rust:mold-optimized',
    command: './target/release/worker --workers 8',
    status: 'running',
    ports: [],
    cpuUsage: 2.1,
    memUsageMB: 28,
    created: '1 hour ago',
    logs: [
      'Worker initialized with Mold fast-linked binary (stripped 4.1MB)',
      'Connected to redis-cache on redis:6379',
      'Processing job queue [batch_size=50, latency_budget=5ms]',
      'Processed 14,800 events with 0 errors'
    ]
  },
  {
    id: 'c-4389fa',
    name: 'local-registry',
    image: 'registry:2',
    command: '/entrypoint.sh /etc/docker/registry/config.yml',
    status: 'paused',
    ports: ['0.0.0.0:5000->5000/tcp'],
    cpuUsage: 0.0,
    memUsageMB: 12,
    created: '1 day ago',
    logs: [
      'Local offline registry cached 14 base images for offline deployment'
    ]
  }
];

export const INITIAL_K8S_PODS: K8sPod[] = [
  {
    name: 'api-gateway-7b94d9f64c-8kz2p',
    namespace: 'production',
    ready: '1/1',
    status: 'Running',
    restarts: 0,
    age: '3h',
    node: 'devforge-node-01',
    cpuReq: '50m',
    memReq: '64Mi'
  },
  {
    name: 'api-gateway-7b94d9f64c-qm89x',
    namespace: 'production',
    ready: '1/1',
    status: 'Running',
    restarts: 0,
    age: '3h',
    node: 'devforge-node-01',
    cpuReq: '50m',
    memReq: '64Mi'
  },
  {
    name: 'worker-processor-58dcf48f8b-t9vlw',
    namespace: 'production',
    ready: '1/1',
    status: 'Running',
    restarts: 0,
    age: '2h',
    node: 'devforge-node-01',
    cpuReq: '100m',
    memReq: '128Mi'
  },
  {
    name: 'coredns-6f6b679f8f-6s2d1',
    namespace: 'kube-system',
    ready: '1/1',
    status: 'Running',
    restarts: 0,
    age: '5h',
    node: 'devforge-node-01',
    cpuReq: '20m',
    memReq: '32Mi'
  },
  {
    name: 'traefik-ingress-controller-4bc9',
    namespace: 'kube-system',
    ready: '1/1',
    status: 'Running',
    restarts: 0,
    age: '5h',
    node: 'devforge-node-01',
    cpuReq: '30m',
    memReq: '48Mi'
  }
];

export const INITIAL_K8S_DEPLOYMENTS: K8sDeployment[] = [
  {
    name: 'api-gateway',
    namespace: 'production',
    replicas: 2,
    desired: 2,
    image: 'devforge/api-gateway:latest',
    servicePort: 8080,
    strategy: 'RollingUpdate'
  },
  {
    name: 'worker-processor',
    namespace: 'production',
    replicas: 1,
    desired: 1,
    image: 'devforge/worker-rust:mold-optimized',
    servicePort: 9090,
    strategy: 'RollingUpdate'
  }
];

export const INITIAL_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'docker-compose.yml',
    name: 'docker-compose.yml',
    language: 'yaml',
    content: `version: '3.9'

services:
  # DevForge high-performance containerized stack
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
      cache_from:
        - type=local,src=/var/cache/devforge/buildkit
    ports:
      - "8080:8080"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://devforge:secret@db:5432/app_dev
      REDIS_HOST: redis
    volumes:
      - .:/workspace:delegated
      - /workspace/node_modules
    depends_on:
      - db
      - redis

  db:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: devforge
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app_dev
    ports:
      - "5432:5432"
    volumes:
      - devforge-pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7.4-alpine
    ports:
      - "6379:6379"

volumes:
  devforge-pgdata:
`
  },
  {
    path: 'Dockerfile',
    name: 'Dockerfile',
    language: 'dockerfile',
    content: `# syntax=docker/dockerfile:1.4
# DevForge Optimized Multi-Stage Build with Mold Linker & BuildKit Cache
FROM oven/bun:1.2-alpine AS base
WORKDIR /workspace

# Install native dependencies using DevForge fast mirror
RUN apk add --no-cache libc6-compat mold

FROM base AS deps
COPY package.json bun.lock* ./
# BuildKit cache-mount avoids re-downloading packages across image builds
RUN --mount=type=cache,target=/root/.bun/install/cache \\
    bun install --frozen-lockfile

FROM deps AS dev
COPY . .
EXPOSE 8080
ENV PORT=8080
CMD ["bun", "run", "--watch", "src/server.ts"]

FROM base AS builder
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .
RUN bun run build

FROM alpine:3.20 AS runner
WORKDIR /app
COPY --from=builder /workspace/dist/server ./server
EXPOSE 8080
CMD ["./server"]
`
  },
  {
    path: 'src/server.ts',
    name: 'server.ts',
    language: 'typescript',
    content: `import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// DevForge OS High-Throughput Service
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    distro: 'DevForge Linux 2026.1',
    kernel: '6.12.8-devforge-rt',
    memory_footprint_mb: 28.4,
    linker: 'mold-2.34',
    docker_support: 'native-overlayfs',
    k8s_node: 'devforge-local'
  });
});

app.get('/api/containers', (_req, res) => {
  res.json({
    cluster: 'k3s-local',
    active_pods: 5,
    build_acceleration: '3.4x faster'
  });
});

app.listen(PORT, () => {
  console.log(\`⚡ Server listening on http://localhost:\${PORT}\`);
  console.log(\`🚀 Optimized with DevForge build cache & zero-copy IO\`);
});
`
  },
  {
    path: 'k8s/deployment.yaml',
    name: 'deployment.yaml',
    language: 'yaml',
    content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: production
  labels:
    app.kubernetes.io/name: api-gateway
    env: devforge-local
spec:
  replicas: 2
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
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: 50m
            memory: 64Mi
          limits:
            cpu: 500m
            memory: 256Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 2
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
  namespace: production
spec:
  selector:
    app: api-gateway
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
`
  },
  {
    path: 'src/main.rs',
    name: 'main.rs',
    language: 'rust',
    content: `// DevForge Fast-Link Systems Worker
// Demonstrates Rust with Mold Linker & Low-Latency Threading

use std::time::Instant;

fn main() {
    println!("🦀 DevForge High-Performance Systems Worker");
    let start = Instant::now();

    // Process parallel tasks
    let mut sum: u64 = 0;
    for i in 0..1_000_000 {
        sum = sum.wrapping_add(i * 3);
    }

    let elapsed = start.elapsed();
    println!("✓ Computed checksum {} in {:?}", sum, elapsed);
    println!("✓ Linked with mold: Link stage took 0.08s (vs 1.8s GNU ld)");
}
`
  }
];

export const INITIAL_PRESETS: DevStackPreset[] = [
  {
    id: 'cloud-native',
    name: 'Cloud-Native & Container Master',
    description: 'Docker Engine, k3s Kubernetes, Helm, k9s, and Tilt with tmpfs build cache',
    icon: 'Containers',
    packages: ['docker-ce', 'k3s-k8s', 'helm', 'k9s', 'buildkit-daemon'],
    features: [
      'Pre-warmed local registry with base Alpine & Ubuntu images',
      'Configured /etc/docker/daemon.json with max concurrent pulls = 10',
      'Rootless container support for secure sandboxed builds',
      'Kubernetes k3s cluster auto-boot in 1.8 seconds'
    ],
    buildSpeedup: '3.8x faster container builds',
    defaultFiles: INITIAL_PROJECT_FILES
  },
  {
    id: 'fullstack-web',
    name: 'Full-Stack Modern Web (Node / Bun / TS)',
    description: 'Bun 1.2 runtime, Node.js 22 LTS, pnpm, Tailwind CSS, and local Postgres',
    icon: 'Layers',
    packages: ['bun-runtime', 'nodejs-lts', 'postgresql-dev', 'redis-cli'],
    features: [
      'Zero-lag node_modules filesystem caching via overlayfs',
      'Sub-second hot-reload integration with VS Code Web',
      'Isolated local PostgreSQL and Redis with zero RAM waste when idle',
      'Pre-configured ESLint, Prettier, and TypeScript compiler daemon'
    ],
    buildSpeedup: '4.2x faster package installs',
    defaultFiles: INITIAL_PROJECT_FILES
  },
  {
    id: 'systems-rust',
    name: 'High-Performance Systems (Rust / C++ / Go)',
    description: 'Rust 1.84, Mold Ultra-Fast Linker, Go 1.23, ccache, and LLVM 19',
    icon: 'Cpu',
    packages: ['rust-toolchain', 'mold-linker', 'golang', 'ccache'],
    features: [
      'Default linker set to mold in ~/.cargo/config.toml',
      'ccache 10GB RAM-disk buffer for zero-overhead recompilation',
      'Low-latency kernel scheduler configured for compilation threads',
      'GDB / LLDB native debugging with VS Code launch configs'
    ],
    buildSpeedup: '5.1x faster incremental link times',
    defaultFiles: INITIAL_PROJECT_FILES
  },
  {
    id: 'ai-data',
    name: 'AI / ML & Data Pipelines',
    description: 'Python 3.12, Astral uv, PyTorch container runtime, and vector database',
    icon: 'Brain',
    packages: ['python-uv', 'docker-ce', 'postgresql-dev'],
    features: [
      'Astral uv package resolution (100x faster than pip)',
      'Pre-configured CUDA & ROCm container execution hooks',
      'Local lightweight Chroma/pgvector container template',
      'Jupyter lab integration with VS Code interactive notebook'
    ],
    buildSpeedup: '4.5x faster venv environment setups',
    defaultFiles: INITIAL_PROJECT_FILES
  }
];

export const INITIAL_EXTENSIONS: Extension[] = [
  {
    id: 'ms-vscode.docker',
    name: 'Docker',
    publisher: 'Microsoft',
    version: '1.29.1',
    description: 'Easily manage images, containers, and volumes directly within the IDE',
    downloads: '32.1M',
    installed: true,
    category: 'Docker/K8s'
  },
  {
    id: 'ms-kubernetes-tools.vscode-kubernetes-tools',
    name: 'Kubernetes Tools',
    publisher: 'Microsoft',
    version: '1.3.16',
    description: 'Develop, deploy and debug Kubernetes applications on DevForge k3s',
    downloads: '6.4M',
    installed: true,
    category: 'Docker/K8s'
  },
  {
    id: 'rust-lang.rust-analyzer',
    name: 'rust-analyzer',
    publisher: 'Rust Lang Team',
    version: '0.4.2140',
    description: 'High-accuracy code completion, type hints, and refactoring for Rust',
    downloads: '4.8M',
    installed: true,
    category: 'Language'
  },
  {
    id: 'dbaeumer.vscode-eslint',
    name: 'ESLint',
    publisher: 'Microsoft',
    version: '3.0.10',
    description: 'Integrates ESLint JavaScript and TypeScript linter into VS Code',
    downloads: '38.2M',
    installed: true,
    category: 'Formatter'
  },
  {
    id: 'eamodio.gitlens',
    name: 'GitLens — Git Supercharged',
    publisher: 'GitKraken',
    version: '15.6.0',
    description: 'Supercharge Git with commit annotations, file history, and branch visualizer',
    downloads: '31.5M',
    installed: true,
    category: 'Tool'
  },
  {
    id: 'ms-python.python',
    name: 'Python & Pylance',
    publisher: 'Microsoft',
    version: '2024.18.0',
    description: 'IntelliSense, linting, debugging, code navigation, and uv integration',
    downloads: '112M',
    installed: true,
    category: 'Language'
  },
  {
    id: 'devforge.mold-linker-accelerator',
    name: 'DevForge Mold Accelerator',
    publisher: 'DevForge OS',
    version: '1.0.4',
    description: 'Automatic cargo and cmake linker hooks to mold with live build metric overlays',
    downloads: '180K',
    installed: true,
    category: 'Tool'
  }
];

export const INITIAL_SYNCED_DEVICES: SyncedDevice[] = [
  {
    id: 'dev-01',
    name: 'Workstation-Primary (Tower)',
    type: 'desktop',
    os: 'DevForge Linux 2026.1 (Kernel 6.12-rt)',
    lastSync: '2 minutes ago',
    isCurrent: true,
    status: 'synced'
  },
  {
    id: 'dev-02',
    name: 'ThinkPad-X1 (Mobile)',
    type: 'laptop',
    os: 'DevForge Linux 2026.1',
    lastSync: '18 minutes ago',
    isCurrent: false,
    status: 'synced'
  },
  {
    id: 'dev-03',
    name: 'Hetzner-Cloud-Node (VPS)',
    type: 'cloud-vps',
    os: 'DevForge Headless Server',
    lastSync: '1 hour ago',
    isCurrent: false,
    status: 'synced'
  }
];

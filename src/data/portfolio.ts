export type Project = {
  slug: string;
  title: string;
  fullTitle: string;
  subtitle: string;
  date?: string;
  recognition: string;
  summary: string;
  details: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
  tone: "acid" | "blue" | "coral";
  caseStudy: {
    challengeHeading: string;
    challenge: string;
    role: string[];
    architecture: { title: string; description: string }[];
    decisions: { title: string; description: string }[];
    outcomes: string[];
    evidence: {
      label: string;
      href: string;
      description: string;
    }[];
    evidenceNote: string;
  };
};

export type LabProject = {
  title: string;
  summary: string;
  stack: string[];
  href: string;
  note: string;
};

export type OpenSourceContribution = {
  title: string;
  organization: string;
  contribution: string;
  proof: string;
  href: string;
};

export const identity = {
  name: "Krishang Zinzuwadia",
  role: "Computer Science Student · AI, Web, and Security",
  email: "krishangzinzuwadia@gmail.com",
  linkedin: "https://www.linkedin.com/in/krishang-zinzuwadia/",
  github: "https://github.com/Krishang-Zinzuwadia",
  ctftime: "https://ctftime.org/user/252885",
  ctftimeTeam: "https://ctftime.org/team/373452",
  education: "B.Tech, Computer Science & Engineering",
  school: "Vellore Institute of Technology",
  graduation: "Expected July 2028",
};

export const signalStats = [
  { value: "1st", label: "India · CTFTime team rank", note: "Apr 2026" },
  { value: "7th", label: "Global · CTFTime team rank", note: "Apr 2026" },
  { value: "7", label: "typed MCP tools in Quark", note: "Aug 2026" },
  { value: "100 ms", label: "median OCS query latency", note: "Sep 2025" },
];

const establishedProjects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
    fullTitle: "Autonomous Task Learning & Action System",
    subtitle: "Local desktop automation agent",
    recognition: "DevSoc Hack · 2nd place",
    summary:
      "A privacy-first desktop agent that turns natural-language requests into verified on-screen actions through a local perception and planning loop.",
    details: [
      "Built a perceive, understand, plan, act, and verify loop with LLaVA, Mistral, PaddleOCR, and PyAutoGUI.",
      "Engineered a Rust and Tauri runtime alongside a FastAPI and WebSocket backend.",
    ],
    stack: [
      "Python",
      "Rust",
      "Tauri",
      "Next.js",
      "FastAPI",
      "PyAutoGUI",
      "LLaVA",
      "Mistral",
      "PaddleOCR",
    ],
    metrics: [
      { value: "2nd", label: "DevSoc Hack" },
      { value: "Local", label: "desktop execution" },
    ],
    tone: "acid",
    caseStudy: {
      challengeHeading: "Turning a request into a verified desktop action.",
      challenge:
        "Desktop automation has to connect an imprecise human request to exact interface actions. Atlas was built to keep that loop local while giving the agent enough visual context to inspect the screen, decide what to do, perform the action, and check the result.",
      role: [
        "Architected the local agent and its perception-to-action loop.",
        "Built the Rust-based runtime for isolated task execution and cross-process coordination.",
        "Connected the planning stack to PyAutoGUI for desktop control and Tauri for the native interface.",
      ],
      architecture: [
        {
          title: "Perceive",
          description:
            "The vision pipeline reads the current desktop state with LLaVA and PaddleOCR.",
        },
        {
          title: "Understand",
          description:
            "The system combines the request with the visible interface state before choosing a route forward.",
        },
        {
          title: "Plan",
          description:
            "Mistral participates in the planning layer, while the browser agent can use MCP for browser-specific work.",
        },
        {
          title: "Act",
          description:
            "PyAutoGUI carries out desktop actions through the isolated runtime.",
        },
        {
          title: "Verify",
          description:
            "The loop observes the interface again so execution is followed by a state check.",
        },
      ],
      decisions: [
        {
          title: "Keep execution local",
          description:
            "Atlas was designed as a privacy-first local agent rather than a remote-control service.",
        },
        {
          title: "Separate interface and agent services",
          description:
            "A Tauri v2 and Next.js frontend communicates with a FastAPI backend over WebSockets, while Rust handles the desktop runtime.",
        },
        {
          title: "Use a closed action loop",
          description:
            "Perception and verification sit on both sides of planning and action instead of treating a generated plan as the finish line.",
        },
      ],
      outcomes: [
        "Placed second at DevSoc Hack.",
        "Delivered a native desktop interface, a browser-focused MCP agent, and a Flutter companion in the public project architecture.",
        "Kept desktop execution local while coordinating vision, planning, and action components.",
      ],
      evidence: [
        {
          label: "Atlas public repository",
          href: "https://github.com/Krishang-Zinzuwadia/ATLAS",
          description:
            "Source, setup notes, and the current system architecture on GitHub.",
        },
      ],
      evidenceNote:
        "The project record and award record list different months, so this case study deliberately does not assert an Atlas date.",
    },
  },
  {
    slug: "labyrinth",
    title: "Labyrinth",
    fullTitle: "Labyrinth",
    subtitle: "Multi-agent software delivery system",
    date: "Feb 2026",
    recognition: "B3 Hack · 2nd place",
    summary:
      "A 27-agent system that turns a product brief into a deployed application.",
    details: [
      "Orchestrated 27 role-specific agents with LangGraph across Tauri, Bun, Next.js, and FastAPI.",
      "Built Multiverse View to compare architecture options and automated the deployment pipeline.",
    ],
    stack: ["LangGraph", "Tauri 2.0", "Bun", "Next.js", "FastAPI", "Python"],
    metrics: [
      { value: "27", label: "role-specific agents" },
      { value: "Automated", label: "deployment pipeline" },
    ],
    tone: "blue",
    caseStudy: {
      challengeHeading: "Keeping 27 agents on one delivery path.",
      challenge:
        "Turning a short product request into running software requires many connected decisions: architecture, implementation, review, integration, and deployment. Labyrinth explored whether those responsibilities could be divided across specialized agents without losing the end-to-end delivery thread.",
      role: [
        "Built the autonomous multi-agent studio and its cross-stack delivery flow.",
        "Orchestrated 27 specialized agents with LangGraph.",
        "Engineered Multiverse View for parallel architecture comparison and connected the result to automated deployment.",
      ],
      architecture: [
        {
          title: "Brief",
          description:
            "A natural-language product request establishes the software the system needs to deliver.",
        },
        {
          title: "Specialize",
          description:
            "Twenty-seven role-specific agents divide the work under LangGraph orchestration.",
        },
        {
          title: "Compare",
          description:
            "Multiverse View keeps parallel architecture options visible for A/B comparison.",
        },
        {
          title: "Build",
          description:
            "Tauri, Bun, Next.js, and FastAPI form the application and orchestration stack.",
        },
        {
          title: "Deploy",
          description:
            "The delivery path ends in an automated cloud deployment pipeline.",
        },
      ],
      decisions: [
        {
          title: "Assign explicit agent roles",
          description:
            "The system uses 27 specialized agents rather than asking one general agent to own the entire delivery process.",
        },
        {
          title: "Preserve competing architectures",
          description:
            "Multiverse View makes parallel approaches comparable before the system commits to a delivery path.",
        },
        {
          title: "Treat deployment as part of delivery",
          description:
            "The workflow includes a zero-touch cloud deployment pipeline instead of stopping at generated source code.",
        },
      ],
      outcomes: [
        "Placed second at B3 Hack.",
        "Coordinated 27 specialized agents in one software-delivery system.",
        "Connected product generation to an automated deployment pipeline.",
      ],
      evidence: [],
      evidenceNote:
        "The scope and results here are limited to the project record in Krishang's résumé; no public Labyrinth repository is linked yet.",
    },
  },
  {
    slug: "ocs",
    title: "OCS Recruitment Platform",
    fullTitle: "OCS Recruitment Platform",
    subtitle: "Application review and interview platform",
    date: "Sep 2025",
    recognition: "1,000+ applicants · 50+ interviewers",
    summary:
      "A recruitment platform built with a 50+ person team to manage application review, interviews, and administration for 1,000+ applicants.",
    details: [
      "Optimized the CockroachDB schema and Redis caching; median query latency reached 100 ms.",
      "Built a browser-based reviewer workspace and an App Router admin dashboard with Server Actions and PostHog.",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "CockroachDB",
      "Redis",
      "Prisma",
      "PostHog",
    ],
    metrics: [
      { value: "1,000+", label: "applicants" },
      { value: "100 ms", label: "median queries" },
    ],
    tone: "coral",
    caseStudy: {
      challengeHeading: "Making high-volume review fast and workable.",
      challenge:
        "The platform had to keep application review, interviews, and administration workable for more than 1,000 applicants and more than 50 interviewers. That meant the data path and the reviewer interface both had to support a high-volume recruitment workflow.",
      role: [
        "Collaborated within a 50-plus-person team on the applications portal.",
        "Optimized the CockroachDB schema and Redis caching path.",
        "Built the browser-like reviewer workspace and an App Router administration dashboard with Server Actions, Prisma, and PostHog.",
      ],
      architecture: [
        {
          title: "Apply",
          description:
            "The applications portal collects and organizes the candidate workflow for more than 1,000 applicants.",
        },
        {
          title: "Review",
          description:
            "A React and Tailwind workspace recreates browser-style tabs and multitasking for more than 50 interviewers.",
        },
        {
          title: "Administer",
          description:
            "A Next.js 16 App Router dashboard uses Server Actions and Prisma for administrative workflows.",
        },
        {
          title: "Serve",
          description:
            "CockroachDB stores application data while Redis supports the optimized query path.",
        },
        {
          title: "Observe",
          description:
            "PostHog telemetry records product usage so the team can monitor workflows.",
        },
      ],
      decisions: [
        {
          title: "Design around reviewer context",
          description:
            "The reviewer surface uses tabs and browser-like multitasking to keep several application tasks within one workspace.",
        },
        {
          title: "Optimize the shared data path",
          description:
            "Schema work and Redis caching targeted the query path used across the recruitment workflow.",
        },
        {
          title: "Keep administration in the same web stack",
          description:
            "The admin dashboard uses App Router, Server Actions, and Prisma rather than introducing a separate administration application.",
        },
      ],
      outcomes: [
        "Supported a recruitment workflow for more than 1,000 applicants and more than 50 interviewers.",
        "Reached a recorded median query latency of 100 milliseconds after schema and caching work.",
        "Shipped as part of a 50-plus-person team.",
      ],
      evidence: [],
      evidenceNote:
        "The scope and measurements here are limited to the project record in Krishang's résumé; no public OCS repository is linked.",
    },
  },
];

const newProjects: Project[] = [
  {
    slug: "quark",
    title: "Quark",
    fullTitle: "Quark — Human Decision Line for Coding Agents",
    subtitle: "Human-in-the-loop agent infrastructure",
    date: "Aug 2026",
    recognition: "Private R&D · simulator-proven P0",
    summary:
      "A guarded phone-call escalation path for coding agents that need a real human decision before they can continue.",
    details: [
      "Built the authenticated MCP, Fastify API, durable request store, operator UI, simulator, and telephony adapters as one typed checkpoint flow.",
      "Separated human intent from execution authority so a confirmed answer never bypasses Codex permissions or expands the task boundary.",
    ],
    stack: [
      "TypeScript",
      "React",
      "Node.js",
      "SQLite",
      "Docker",
      "MCP",
      "Twilio",
      "Exotel",
    ],
    metrics: [
      { value: "7", label: "typed MCP tools" },
      { value: "24", label: "voice-contract cases" },
    ],
    tone: "acid",
    caseStudy: {
      challengeHeading:
        "Let an agent ask for judgment without giving it more power.",
      challenge:
        "Long-running coding work eventually reaches choices the repository cannot answer. Quark creates one narrow line back to the operator while keeping the existing permissions, task scope, and destructive-action boundaries intact.",
      role: [
        "Defined the product contract, safety policy, privacy boundary, and exact checkpoint semantics.",
        "Built the Fastify API, authenticated MCP surface, SQLite persistence, React operator console, and browser call simulator.",
        "Implemented Twilio and Exotel provider adapters plus the isolated Sarvam voice bridge and versioned evaluation harness.",
      ],
      architecture: [
        {
          title: "Escalate",
          description:
            "Codex submits one bounded question tied to the task and exact checkpoint it cannot resolve.",
        },
        {
          title: "Authenticate",
          description:
            "Scoped keys, request identity, origin checks, expiry, and policy gates decide whether the request may proceed.",
        },
        {
          title: "Call",
          description:
            "The simulator or a telephony adapter presents the decision without exposing credentials or unrelated project context.",
        },
        {
          title: "Confirm",
          description:
            "The selected option is read back and only becomes a structured result after explicit confirmation.",
        },
        {
          title: "Resume",
          description:
            "Codex validates the checkpoint, retrieves the typed result, and acknowledges it idempotently before continuing.",
        },
      ],
      decisions: [
        {
          title: "Keep intent separate from authority",
          description:
            "A phone answer records a decision; it never authorizes financial, destructive, security-critical, production, or external actions.",
        },
        {
          title: "Bind every result to one checkpoint",
          description:
            "Expiry, supersession, disputes, and exact checkpoint matching prevent a stale answer from being reused elsewhere.",
        },
        {
          title: "Minimize sensitive data",
          description:
            "Phone numbers, briefs, transcripts, and results are encrypted at rest, while MCP and logs exclude raw transcript text.",
        },
      ],
      outcomes: [
        "Completed the deterministic local loop across MCP, API, operator UI, simulator, confirmation, and acknowledgement.",
        "Kept all software and provider boundaries under automated contract, API, and browser coverage.",
        "Documented the remaining live-provider proof honestly instead of presenting a simulator pass as production telephony evidence.",
      ],
      evidence: [],
      evidenceNote:
        "The repository is private, so no source link is published here. The simulator-backed software path and provider contracts are implemented; the authoritative Exotel-to-Sarvam-to-Quark live proof remains an explicit open release gate.",
    },
  },
  {
    slug: "scatterfield",
    title: "Scatterfield",
    fullTitle: "Scatterfield",
    subtitle: "Local-first spatial workspace",
    date: "Aug 2026",
    recognition: "Web · mobile · desktop",
    summary:
      "A local-first infinite canvas for notes, links, images, and files that stays useful offline and moves across web, mobile, and desktop.",
    details: [
      "Built an Excalidraw-like workspace backed by IndexedDB, with cloud metadata in D1 and file versions in R2.",
      "Extended the same product into an Expo capture client and a Tauri shell with native file access and deep links.",
    ],
    stack: [
      "TypeScript",
      "React",
      "Next.js",
      "Expo",
      "Tauri",
      "Rust",
      "Cloudflare D1",
      "Cloudflare R2",
    ],
    metrics: [
      { value: "3", label: "client surfaces" },
      { value: "8 MiB", label: "resumable chunks" },
    ],
    tone: "blue",
    caseStudy: {
      challengeHeading:
        "Make a spatial workspace useful before the network arrives.",
      challenge:
        "A canvas full of personal material should open quickly, accept new work offline, and reconcile large files safely later. Scatterfield treats local data as the primary interaction surface while keeping cross-device sync and native access available when configured.",
      role: [
        "Designed and built the local-first web canvas, persistence model, and offline interaction path.",
        "Implemented the Cloudflare Worker, D1 metadata, R2 object storage, multipart transfer, hashing, quotas, and cleanup boundaries.",
        "Built the Expo mobile client and Tauri desktop shell around the same workspace model.",
      ],
      architecture: [
        {
          title: "Capture",
          description:
            "Notes, links, images, and files enter through the canvas, compact mobile capture, or a native desktop file picker.",
        },
        {
          title: "Work locally",
          description:
            "IndexedDB keeps the web workspace available offline without waiting for an account or remote round trip.",
        },
        {
          title: "Reserve",
          description:
            "The cloud path reserves quota and records transfer state before accepting file bodies.",
        },
        {
          title: "Transfer",
          description:
            "Large files upload in resumable multipart chunks and are checked against SHA-256 content hashes.",
        },
        {
          title: "Reconcile",
          description:
            "Version metadata and stale-session cleanup make interrupted transfers and later cross-device access explicit.",
        },
      ],
      decisions: [
        {
          title: "Local data is the fast path",
          description:
            "The canvas remains functional with IndexedDB alone; cloud bindings add availability without becoming a prerequisite for basic use.",
        },
        {
          title: "Share the product model, not every interface",
          description:
            "Mobile emphasizes capture and retrieval, desktop adds native access, and the web client keeps the full spatial workspace.",
        },
        {
          title: "Make file transfer recoverable",
          description:
            "Chunking, quota reservations, hashes, versions, and stale-session cleanup turn uploads into an inspectable state machine.",
        },
      ],
      outcomes: [
        "Delivered one repository with a substantial web application, Expo mobile client, Tauri desktop shell, and Cloudflare data path.",
        "Kept the primary workspace usable offline while supporting resumable cloud-backed file versions.",
        "Added focused tests across the web, mobile, transfer, and desktop boundaries.",
      ],
      evidence: [
        {
          label: "Scatterfield public repository",
          href: "https://github.com/Krishang-Zinzuwadia/scatterfield",
          description:
            "Source, product contract, platform-specific setup, migrations, and tests.",
        },
      ],
      evidenceNote:
        "The repository is public and the local clients and cloud contracts are implemented. GitHub does not currently expose a hosted demo, screenshots, or a CI workflow, so the case study does not claim a public production deployment.",
    },
  },
  {
    slug: "aisle",
    title: "Aisle",
    fullTitle: "Aisle — Public Agent Skills Marketplace",
    subtitle: "Verified public-skill discovery and installation",
    date: "Jul 2026",
    recognition: "32 merged PRs · public marketplace",
    summary:
      "A marketplace for finding public Agent Skills, assembling a stack, and producing one deterministic install command without copying or inventing the underlying skills.",
    details: [
      "Shipped catalog ingestion, provenance and trust gates, package assembly, shell-safe installation plans, documentation, and marketplace UX.",
      "Removed an N+1 package-resolution path and cut a measured packages navigation from 27.9 seconds to about 3.1 seconds.",
    ],
    stack: [
      "TypeScript",
      "Next.js 16",
      "React",
      "SQLite",
      "PostgreSQL",
      "GitHub Actions",
      "Vercel",
    ],
    metrics: [
      { value: "32", label: "merged PRs" },
      { value: "89%", label: "measured navigation gain" },
    ],
    tone: "coral",
    caseStudy: {
      challengeHeading:
        "Build discovery without pretending that public means safe.",
      challenge:
        "Agent Skills are spread across mutable repositories and registries with uneven metadata. Aisle needed to discover what exists while refusing to turn an unresolved source, drifting revision, missing license, or incomplete artifact into an installable result.",
      role: [
        "Authored 32 merged pull requests spanning the marketplace foundation, catalog connectors, provenance rules, package publication, installation UX, and documentation.",
        "Built fail-closed eligibility and source-coverage semantics so discovery records remain visible without becoming selectable prematurely.",
        "Diagnosed and repaired production navigation stalls through batched resolution, client reuse, bounded caching, and restrained prefetching.",
      ],
      architecture: [
        {
          title: "Discover",
          description:
            "Bounded connectors inspect configured public registries and GitHub inventories independently.",
        },
        {
          title: "Hydrate",
          description:
            "Exact public repository paths and revisions are fetched transiently for validation and fingerprinting.",
        },
        {
          title: "Qualify",
          description:
            "Source, revision, artifact, license, inventory, and trust evidence decide whether a record is actionable.",
        },
        {
          title: "Assemble",
          description:
            "Packages pin eligible catalog revisions and fail transactionally when one member drifts.",
        },
        {
          title: "Install",
          description:
            "The planner converts a server-resolved selection into deterministic argv operations and shell-safe commands.",
        },
      ],
      decisions: [
        {
          title: "Fail closed at the product boundary",
          description:
            "Coverage-only and unresolved records can explain what was observed, but they cannot enter selection, packages, or installation.",
        },
        {
          title: "Store evidence, not copied skills",
          description:
            "Aisle persists public source metadata, immutable references, hashes, fingerprints, and audit results—not skill bodies or repackaged trees.",
        },
        {
          title: "Measure the real navigation path",
          description:
            "Production timing exposed roughly 164 sequential reads behind one packages view; batching and cache boundaries addressed that path directly.",
        },
      ],
      outcomes: [
        "Shipped a public marketplace and deterministic stack-building flow through a sequence of merged production pull requests.",
        "Reduced the measured packages navigation by about 89 percent in the recorded production pass.",
        "Made upstream drift visible and blocking instead of silently publishing stale packages.",
      ],
      evidence: [
        {
          label: "Aisle public repository",
          href: "https://github.com/desync-organization/aisle",
          description:
            "Marketplace source, architecture contracts, catalog policy, tests, and operational documentation.",
        },
        {
          label: "Navigation performance pull request",
          href: "https://github.com/desync-organization/aisle/pull/53",
          description:
            "The measured N+1 diagnosis, implementation, and validation record.",
        },
      ],
      evidenceNote:
        "The repository and deployed marketplace are public. The performance figure is a July 2026 measurement, not a permanent SLO; current scheduled catalog runs may fail deliberately when upstream revisions or inventories drift.",
    },
  },
  {
    slug: "helios",
    title: "Helios",
    fullTitle: "Helios — Local-First Software Maintenance Runtime",
    subtitle: "Local specialist orchestration for repository work",
    date: "Jul 2026",
    recognition: "Three-person build · runtime owner",
    summary:
      "The local execution runtime behind a software-maintenance agency: typed plans, DAG scheduling, specialist models, guarded tools, and critic gates around repository work.",
    details: [
      "Owned the Python planner, scheduler, specialists, local-model lifecycle, workspace tools, critic, and runtime-safety lane.",
      "Built a separate site-generation branch with tagged specialists and a live execution-plan interface connected to the Next.js operator console.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "Pydantic",
      "Ollama",
      "pytest",
      "Next.js 16",
      "TypeScript",
      "Bun",
      "Cloudflare",
    ],
    metrics: [
      { value: "Local", label: "model execution" },
      { value: "3", label: "person team" },
    ],
    tone: "acid",
    caseStudy: {
      challengeHeading:
        "Let small local models do useful repository work safely.",
      challenge:
        "A local software-maintenance runtime has to divide work across constrained models, schedule dependencies, expose only the tools each role needs, and still leave credentials and final external mutations outside the model process.",
      role: [
        "Owned the documented Member 1 lane: planner, scheduler, experts, model management, workspace tools, critic, and runtime safety.",
        "Implemented typed planning, dependency-aware execution, bounded local-model handoffs, VRAM lifecycle management, and credential-free write-back intents.",
        "Built the unmerged site-generation extension and its live execution-plan UI as a four-commit feature branch with a successful preview deployment.",
      ],
      architecture: [
        {
          title: "Scope",
          description:
            "The operator console turns a repository request into a bounded runtime job without passing cloud credentials to a local model.",
        },
        {
          title: "Plan",
          description:
            "Typed planning converts the request into explicit tasks, dependencies, specialists, expected artifacts, and review gates.",
        },
        {
          title: "Schedule",
          description:
            "The DAG scheduler dispatches ready work while respecting dependency order and local resource limits.",
        },
        {
          title: "Execute",
          description:
            "Role-specific models receive least-privilege workspace tools and return artifacts rather than direct external mutations.",
        },
        {
          title: "Critique",
          description:
            "Independent review gates decide whether outputs are accepted, retried, or returned as write-back intents to the control plane.",
        },
      ],
      decisions: [
        {
          title: "Keep credentials out of local inference",
          description:
            "GitHub App credentials and final mutations stay in the teammates' control plane; Helios returns explicit intents across that boundary.",
        },
        {
          title: "Make the plan inspectable",
          description:
            "Typed tasks and a live plan view expose dependency and execution state instead of hiding coordination inside one long prompt.",
        },
        {
          title: "Treat model memory as a managed resource",
          description:
            "The runtime owns loading, handoff, and VRAM limits so specialists do not compete unpredictably on a local machine.",
        },
      ],
      outcomes: [
        "Delivered the assigned local runtime lane inside a three-person system with explicit ownership boundaries.",
        "Added a tested site-generation and live-plan extension on a separate feature branch and deployed a working interface preview.",
        "Kept the public case study honest about the unmerged branch, failed repository Actions, and the difference between a hosted UI and a local Ollama runtime.",
      ],
      evidence: [
        {
          label: "Helios public repository",
          href: "https://github.com/desync-organization/helios",
          description:
            "Team source, ownership notes, runtime implementation, operator console, and project documentation.",
        },
        {
          label: "Helios operator interface",
          href: "https://helios-desync2.vercel.app",
          description:
            "Public interface deployment; it does not represent a hosted local-model runtime.",
        },
      ],
      evidenceNote:
        "Helios is a three-person project. The local runtime is Krishang's documented lane; Convex, Cloudflare Worker, GitHub App control-plane, and training work belong to teammates. The site-generation extension is validated on an unmerged branch, and the repository currently has no green Actions run.",
    },
  },
  {
    slug: "hermes",
    title: "Hermes",
    fullTitle: "Hermes — Self-Hostable P2P Messaging in Rust",
    subtitle: "Terminal messaging, discovery, and durable delivery",
    date: "2026",
    recognition: "14 merged PRs · 31 CI tests",
    summary:
      "A Rust terminal messenger built around libp2p, direct and relayed delivery, persistent chat state, durable queues, and a Ratatui interface.",
    details: [
      "Contributed account flows, the terminal chat interface, friend management, database-backed chat lists, and relay configuration across 14 merged team PRs.",
      "Maintained a later 33-commit runtime branch that consolidated client, relay/bootstrap, and authentication modes into one executable.",
    ],
    stack: [
      "Rust",
      "libp2p",
      "Tokio",
      "Ratatui",
      "SQLite",
      "Axum",
      "GitHub Actions",
      "Linux",
    ],
    metrics: [
      { value: "14", label: "merged team PRs" },
      { value: "31", label: "passing CI tests" },
    ],
    tone: "blue",
    caseStudy: {
      challengeHeading:
        "Make terminal messaging survive more than the happy path.",
      challenge:
        "A peer-to-peer messenger still needs usable account flows, discovery, relay fallback, durable local state, acknowledgements, and a coherent interface when peers disconnect or restart. Hermes brings those pieces into a self-hostable Rust application.",
      role: [
        "Authored 14 merged ACM-VIT pull requests covering Ratatui chat, signup and login, friends, persistent chat lists, relay configuration, and reliability fixes.",
        "Maintained a later 33-commit development branch that consolidated duplicated services around one long-lived libp2p swarm.",
        "Added durable queued delivery, Ed25519-backed account identity, SQLx repositories, attachment validation, deployment scripts, and CI hardening.",
      ],
      architecture: [
        {
          title: "Authenticate",
          description:
            "Shared Axum and Argon2 account services establish an account that is resolved to an Ed25519-backed peer identity.",
        },
        {
          title: "Discover",
          description:
            "Kademlia, Identify, relay configuration, and persisted bootstrap state locate peers across restarts and network boundaries.",
        },
        {
          title: "Connect",
          description:
            "TCP or QUIC connects through Noise-secured libp2p transports, with relay and hole-punching support where available.",
        },
        {
          title: "Deliver",
          description:
            "Request-response messages enter an idempotent queue and are acknowledged after the recipient persists them.",
        },
        {
          title: "Persist",
          description:
            "SQLx and SQLite store accounts, friends, history, delivery state, and bounded attachment metadata for the Ratatui client.",
        },
      ],
      decisions: [
        {
          title: "One swarm, several operating modes",
          description:
            "Client, relay/bootstrap, retry worker, and authentication entry points were consolidated into one executable instead of duplicating transports.",
        },
        {
          title: "Acknowledge after persistence",
          description:
            "Delivery success follows recipient storage, making retries idempotent and reducing the gap between a network send and durable chat history.",
        },
        {
          title: "Name the encryption boundary accurately",
          description:
            "Noise protects transport connections; the project does not claim application-layer or group end-to-end encryption that is not implemented.",
        },
      ],
      outcomes: [
        "Merged fourteen concrete feature and reliability pull requests into the ACM-VIT development branch.",
        "Produced a later consolidated runtime branch with formatting, Clippy, and 31 automated tests passing in CI.",
        "Added deployment modes and persistent delivery while keeping multi-node proof, larger transfers, recovery, and group encryption as explicit future work.",
      ],
      evidence: [],
      evidenceNote:
        "The official repository and Krishang's current development branch are private, and the organization default branch is stale. This account is based on the merged PR record and passing CI on the personal dev branch; there is no public demo or release, and WhatsApp or Slack bridges are not presented as implemented.",
    },
  },
];

export const projects: Project[] = [
  ...newProjects.slice(0, 4),
  ...establishedProjects.filter(
    (project) => project.slug === "atlas" || project.slug === "ocs"
  ),
  newProjects[4],
];

export const labProjects: LabProject[] = [
  {
    title: "Sticker Cabinet",
    summary:
      "A local WhatsApp sticker pipeline that extracts over ADB, finds perceptual duplicates, classifies with Ollama, and exports valid packs.",
    stack: ["Python", "FastAPI", "Ollama", "ADB"],
    href: "https://github.com/Krishang-Zinzuwadia/sticker-organiser",
    note: "Local-first utility",
  },
  {
    title: "Zephyr",
    summary:
      "Push-to-talk voice input for Linux with faster-whisper, a GTK overlay, X11 and Wayland typing backends, systemd, and Arch packaging.",
    stack: ["Python", "faster-whisper", "GTK", "Linux"],
    href: "https://github.com/Krishang-Zinzuwadia/zephyr",
    note: "Linux experiment",
  },
  {
    title: "Right Click Clear Folder",
    summary:
      "A small Windows Explorer context-menu utility with confirmation, protected-path checks, and install and uninstall scripts.",
    stack: ["C#", ".NET", "Windows Registry"],
    href: "https://github.com/Krishang-Zinzuwadia/rightclickclearfolder",
    note: "Windows utility",
  },
  {
    title: "Spirit",
    summary:
      "A Windows voice-assistant experiment using Sarvam speech, a PyQt overlay, global shortcuts, and pywinauto actions.",
    stack: ["Python", "PyQt", "Sarvam", "pywinauto"],
    href: "https://github.com/Krishang-Zinzuwadia/spirit",
    note: "Voice interface study",
  },
  {
    title: "Better Terminal",
    summary:
      "A Bash utility for ANSI, 256-color, and true-color prompt text with gradients, completions, and install targets.",
    stack: ["Bash", "Linux", "ANSI"],
    href: "https://github.com/Krishang-Zinzuwadia/better-terminal",
    note: "Open-source micro-tool",
  },
];

export const openSourceContributions: OpenSourceContribution[] = [
  {
    title: "SGLang Docs",
    organization: "sgl-project",
    contribution:
      "Added developer guides for serving, benchmarking, profiling, Docker, JIT kernels, and model evaluation; expanded VLM documentation and repaired navigation across four merged PRs.",
    proof: "4 merged pull requests",
    href: "https://github.com/sgl-project/sgl-docs/pull/33",
  },
  {
    title: "React Bits",
    organization: "DavidHDev",
    contribution:
      "Fixed preview toggle state so the Light Rays and Radar examples update their UI correctly.",
    proof: "PR #992 merged",
    href: "https://github.com/DavidHDev/react-bits/pull/992",
  },
  {
    title: "Componentry",
    organization: "harshjdhv",
    contribution:
      "Repaired a documentation preview layout that clipped the circuit-board topology variant selector.",
    proof: "PR #10 merged",
    href: "https://github.com/harshjdhv/componentry/pull/10",
  },
  {
    title: "Conclave",
    organization: "ACM-VIT",
    contribution:
      "Shipped a synchronized multiplayer Zip puzzle with generator, solver, SFU lifecycle, interface, and tests; also contributed DMs and speaker prioritization.",
    proof: "PRs #205 and #41 merged",
    href: "https://github.com/ACM-VIT/conclave/pull/205",
  },
  {
    title: "Sunny.ai",
    organization: "ACM-VIT",
    contribution:
      "Added LinkedIn OAuth with Better Auth, database migrations, a settings screen, and a complete light, dark, and system theme path.",
    proof: "PR #6 merged",
    href: "https://github.com/ACM-VIT/Sunny.ai/pull/6",
  },
  {
    title: "Peter Robinson Workshop",
    organization: "ACM-VIT",
    contribution:
      "Built the speaker page, event landing experience, footer, motion treatment, and responsive animation fixes across the workshop site.",
    proof: "9 merged pull requests",
    href: "https://github.com/ACM-VIT/DSP-Peter-Robinson-May-2025",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const experience = {
  organization: "ACM Student Chapter, VIT",
  role: "Core Committee Member · Tech Domain",
  location: "Vellore, India",
  date: "May 2025 — Present",
  highlights: [
    "Led technical operations and served as a judge for Code2Create, which had 1,500+ participants.",
    "Built a cryptic-hunt game for 400+ participants, including real-time game logic, challenge design, and scoring.",
    "Led a MERN-stack workshop and deployed an SDG 4 project for digitizing rural education infrastructure.",
  ],
};

export const achievements = [
  {
    place: "1st",
    title: "CTFTime team ranking",
    context: "1st in India · 7th globally",
    date: "Apr 2026",
  },
  {
    place: "1st",
    title: "Hackzero CTF",
    context: "Security and reverse-engineering challenge",
    date: "Apr 2026",
  },
  {
    place: "2nd",
    title: "DevSoc Hackathon",
    context: "CodeChef · 1,200+ participants",
    date: "Feb 2026",
  },
  {
    place: "2nd",
    title: "B3 Hack",
    context: "Web3 hackathon · 200+ participants",
    date: "Feb 2026",
  },
  {
    place: "3rd",
    title: "SENSE Hack",
    context: "International hackathon · local AI systems",
    date: "Dec 2025",
  },
  {
    place: "3rd",
    title: "Clueminati",
    context: "CTF-style logic challenge · 700+ participants",
    date: "Oct 2025",
  },
];

export const skills = {
  featured: [
    "TypeScript",
    "Python",
    "Rust",
    "Go",
    "Next.js",
    "React",
    "Tauri",
    "FastAPI",
    "LangGraph",
    "Redis",
    "PostgreSQL",
    "Docker",
  ],
  languages: [
    "JavaScript",
    "TypeScript",
    "Go",
    "Python",
    "Rust",
    "C",
    "C++",
    "Java",
  ],
  systems: [
    "Next.js",
    "React",
    "Node.js",
    "Redis",
    "Tauri",
    "PyTorch",
    "PostgreSQL",
    "LangChain",
  ],
  tools: [
    "Git",
    "GitHub Actions",
    "Docker",
    "MongoDB",
    "PostHog",
    "Firebase",
    "Bash",
    "Linux",
  ],
};

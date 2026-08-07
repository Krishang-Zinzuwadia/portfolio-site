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
  role: "Computer science student building AI tools, web apps, and security projects",
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
  { value: "1st", label: "CTFTime team rank in India", note: "Apr 2026" },
  { value: "7th", label: "CTFTime team rank worldwide", note: "Apr 2026" },
  { value: "7", label: "MCP tools in Quark", note: "Aug 2026" },
  { value: "100 ms", label: "median query time in OCS", note: "Sep 2025" },
];

const establishedProjects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
    fullTitle: "Autonomous Task Learning & Action System",
    subtitle: "A desktop agent that runs locally",
    recognition: "2nd place at DevSoc Hack",
    summary:
      "Atlas takes a plain-language request, reads the screen, chooses an action, and uses PyAutoGUI to carry it out. It runs on the user's machine and checks the screen again afterward.",
    details: [
      "I built the screen-reading and action loop with LLaVA, Mistral, PaddleOCR, and PyAutoGUI.",
      "The desktop app uses Rust and Tauri, with FastAPI and WebSockets connecting it to the agent services.",
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
      { value: "Local", label: "runs on the user's computer" },
    ],
    caseStudy: {
      challengeHeading:
        "The agent needs to know whether its click actually worked.",
      challenge:
        "People describe desktop tasks loosely, but the computer still needs an exact click or keystroke. Atlas reads the current screen, works out the next action, performs it, and then looks again to see what changed. That entire process stays on the user's machine.",
      role: [
        "I designed the local agent and the loop between screen reading and desktop control.",
        "I built the Rust runtime that isolates tasks and coordinates the different processes.",
        "I connected the model stack to PyAutoGUI, then put the desktop interface in Tauri.",
      ],
      architecture: [
        {
          title: "Reading the screen",
          description:
            "LLaVA and PaddleOCR read what's visible before Atlas decides what to do.",
        },
        {
          title: "Matching the request",
          description:
            "The agent compares the user's request with the text and controls it can currently see.",
        },
        {
          title: "Choosing the next action",
          description:
            "Mistral helps choose the next step. Browser-specific tasks can go through the MCP agent.",
        },
        {
          title: "Using the desktop",
          description:
            "PyAutoGUI handles the mouse and keyboard from the isolated Rust runtime.",
        },
        {
          title: "Looking again",
          description:
            "Atlas reads the screen after the action instead of assuming it succeeded.",
        },
      ],
      decisions: [
        {
          title: "Run it on the user's machine",
          description:
            "Atlas does its desktop work locally. It isn't a remote-control service.",
        },
        {
          title: "Split the app from the agent services",
          description:
            "The Tauri v2 and Next.js app talks to FastAPI over WebSockets, while Rust owns desktop execution.",
        },
        {
          title: "Check after every action",
          description:
            "A generated plan isn't treated as success. Atlas reads the result on screen before moving on.",
        },
      ],
      outcomes: [
        "Atlas placed second at DevSoc Hack.",
        "The public project includes a native desktop app, a browser MCP agent, and a Flutter companion.",
        "Desktop actions remain local while the vision and planning services coordinate around them.",
      ],
      evidence: [
        {
          label: "Atlas on GitHub",
          href: "https://github.com/Krishang-Zinzuwadia/ATLAS",
          description:
            "The source code, setup instructions, and a description of the current design.",
        },
      ],
      evidenceNote:
        "My résumé and the award notes give different months for Atlas, so I've left the date off this page.",
    },
  },
  {
    slug: "labyrinth",
    title: "Labyrinth",
    fullTitle: "Labyrinth",
    subtitle: "A 27-agent app builder",
    date: "Feb 2026",
    recognition: "B3 Hack · 2nd place",
    summary:
      "Labyrinth splits a product brief among 27 specialist agents, compares competing technical approaches, and sends the finished app through an automated cloud deployment pipeline.",
    details: [
      "I coordinated 27 role-specific agents with LangGraph across Tauri, Bun, Next.js, and FastAPI.",
      "I also built Multiverse View for comparing architecture options and wired up automated cloud deployment.",
    ],
    stack: ["LangGraph", "Tauri 2.0", "Bun", "Next.js", "FastAPI", "Python"],
    metrics: [
      { value: "27", label: "specialist agents" },
      { value: "Automated", label: "cloud deployment" },
    ],
    caseStudy: {
      challengeHeading:
        "Twenty-seven agents can disagree in twenty-seven different ways.",
      challenge:
        "A short product brief leaves a lot undecided. Labyrinth tested whether separate agents could own architecture, coding, review, integration, and deployment without producing a pile of disconnected output.",
      role: [
        "I built the multi-agent studio across the desktop app, web app, API, and LangGraph code.",
        "I set up 27 specialist roles in LangGraph.",
        "I built Multiverse View so competing architectures could be compared before the app moved to automated deployment.",
      ],
      architecture: [
        {
          title: "The brief",
          description:
            "The run starts with a plain-language description of the app to build.",
        },
        {
          title: "The agent team",
          description:
            "LangGraph assigns the work to 27 agents with separate roles.",
        },
        {
          title: "Competing approaches",
          description:
            "Multiverse View puts alternative architectures next to each other for A/B comparison.",
        },
        {
          title: "The app stack",
          description:
            "The system itself is built with Tauri, Bun, Next.js, FastAPI, and Python.",
        },
        {
          title: "Cloud deployment",
          description:
            "The resulting app can continue into an automated cloud deployment pipeline.",
        },
      ],
      decisions: [
        {
          title: "Give every agent a specific job",
          description:
            "Labyrinth divides the app among 27 specialists instead of handing the whole brief to one general agent.",
        },
        {
          title: "Compare before committing",
          description:
            "Multiverse View keeps alternative designs available long enough to compare them side by side.",
        },
        {
          title: "Include deployment in the run",
          description:
            "The system doesn't stop after generating source code; it can also deploy the app to the cloud without a manual step.",
        },
      ],
      outcomes: [
        "Placed second at B3 Hack.",
        "Ran 27 specialist agents as one app-building system.",
        "Connected generated applications to an automated cloud deployment pipeline.",
      ],
      evidence: [],
      evidenceNote:
        "These details come from my résumé. I don't have a public Labyrinth repository to link here yet.",
    },
  },
  {
    slug: "ocs",
    title: "OCS Recruitment Platform",
    fullTitle: "OCS Recruitment Platform",
    subtitle: "Applications, reviews, and interviews in one app",
    date: "Sep 2025",
    recognition: "1,000+ applicants · 50+ interviewers",
    summary:
      "OCS handled applications and interviews for 1,000+ applicants and 50+ interviewers. I built parts of the reviewer and admin tools and worked on the database and cache with a team of more than 50 people.",
    details: [
      "I worked on the CockroachDB schema and Redis cache. Median query time reached 100 ms.",
      "I built the browser-style reviewer app and a Next.js App Router admin dashboard using Server Actions and PostHog.",
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
      { value: "100 ms", label: "median query time" },
    ],
    caseStudy: {
      challengeHeading:
        "Reviewing 1,000+ applications shouldn't mean juggling tabs all day.",
      challenge:
        "More than 50 interviewers used OCS to review over 1,000 applicants. The pages had to stay quick, but the bigger usability problem was helping reviewers move between candidates and tasks without losing their place.",
      role: [
        "I worked on the applications portal as part of a team of more than 50 people.",
        "I tuned the CockroachDB schema and Redis cache.",
        "I built the browser-style reviewer app and the App Router admin dashboard with Server Actions, Prisma, and PostHog.",
      ],
      architecture: [
        {
          title: "Applications",
          description:
            "The portal collected and organized submissions from more than 1,000 applicants.",
        },
        {
          title: "Reviewer tabs",
          description:
            "The React and Tailwind reviewer app used browser-style tabs so more than 50 interviewers could move between candidates.",
        },
        {
          title: "Admin tools",
          description:
            "The admin dashboard used Next.js 16 App Router, Server Actions, and Prisma.",
        },
        {
          title: "Database and cache",
          description:
            "CockroachDB stored the application data, with Redis taking repeat work off the main query path.",
        },
        {
          title: "Product analytics",
          description:
            "PostHog recorded how people used the app so the team could find rough spots.",
        },
      ],
      decisions: [
        {
          title: "Make the reviewer app feel like a browser",
          description:
            "Tabs let interviewers keep several candidates open without bouncing between separate pages.",
        },
        {
          title: "Fix the queries everyone used",
          description:
            "The schema and Redis changes focused on the queries used throughout recruitment.",
        },
        {
          title: "Use the same stack for admin",
          description:
            "The admin dashboard stayed in the App Router app with Server Actions and Prisma instead of becoming a separate product.",
        },
      ],
      outcomes: [
        "The platform was used for more than 1,000 applicants and more than 50 interviewers.",
        "Median query time measured 100 milliseconds after the schema and cache changes.",
        "I made these changes as part of a team of more than 50 people.",
      ],
      evidence: [],
      evidenceNote:
        "The usage numbers and timing come from my résumé. The OCS repository isn't public, so there isn't a source link here.",
    },
  },
];

const newProjects: Project[] = [
  {
    slug: "quark",
    title: "Quark",
    fullTitle: "Quark — Phone Questions for Coding Agents",
    subtitle: "A phone check-in when a coding agent gets stuck",
    date: "Aug 2026",
    recognition: "Private R&D · P0 proven in the simulator",
    summary:
      "Quark lets a coding agent call the person who started the task when it reaches a choice the repository can't answer. It asks one fixed question, reads the answer back, and returns that answer to the same checkpoint.",
    details: [
      "I built the MCP server, Fastify API, SQLite request store, operator app, browser simulator, and phone-provider adapters.",
      "A confirmed answer settles the question. It doesn't change Codex permissions or widen the original task.",
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
      { value: "24", label: "voice contract cases" },
    ],
    caseStudy: {
      challengeHeading:
        "The agent needs an answer, not a new set of permissions.",
      challenge:
        "Long coding tasks eventually hit a choice that only the person who asked for the work can make. Quark lets the agent pause and ask by phone. The reply applies only to that checkpoint and can't approve destructive, financial, production, security-sensitive, or external actions.",
      role: [
        "I wrote the product rules, safety policy, privacy rules, and checkpoint behaviour.",
        "I built the Fastify API, authenticated MCP server, SQLite storage, React operator app, and browser call simulator.",
        "I added Twilio and Exotel adapters, an isolated Sarvam voice bridge, and a versioned evaluation suite.",
      ],
      architecture: [
        {
          title: "The question",
          description:
            "Codex sends one fixed-choice question with the ID of the task checkpoint that needs it.",
        },
        {
          title: "Request checks",
          description:
            "Keys, request IDs, origin checks, expiry, and policy rules are checked before a call can start.",
        },
        {
          title: "The call",
          description:
            "The browser simulator or phone provider reads the choices without sending credentials or unrelated project details.",
        },
        {
          title: "Read-back",
          description:
            "Quark reads the selected answer back. It isn't recorded until the person confirms it.",
        },
        {
          title: "Back to Codex",
          description:
            "Codex checks the checkpoint ID, retrieves the typed answer, and acknowledges it once before continuing.",
        },
      ],
      decisions: [
        {
          title: "An answer isn't permission",
          description:
            "A phone reply can answer the question, but it can't approve money, deletion, security-sensitive changes, production changes, or outside actions.",
        },
        {
          title: "Every answer belongs to one checkpoint",
          description:
            "Expiry, replacement, disputes, and exact ID matching stop an old reply from being reused for another decision.",
        },
        {
          title: "Keep private data out of logs",
          description:
            "Phone numbers, briefs, transcripts, and answers are encrypted at rest. Raw transcript text isn't returned through MCP or written to logs.",
        },
      ],
      outcomes: [
        "The full local simulator path works, from the MCP request through the call and confirmation to Codex acknowledging the answer.",
        "Contract, API, and browser tests cover the application code and the phone-provider adapters.",
        "A simulator pass isn't presented as proof that the real phone chain works.",
      ],
      evidence: [],
      evidenceNote:
        "The repository is private, so I can't link the source. The simulator path and provider contracts are implemented. A real Exotel-to-Sarvam-to-Quark call is still required before release.",
    },
  },
  {
    slug: "scatterfield",
    title: "Scatterfield",
    fullTitle: "Scatterfield",
    subtitle: "An offline-first canvas for notes and files",
    date: "Aug 2026",
    recognition: "Web, mobile, and desktop",
    summary:
      "Scatterfield is an infinite canvas for notes, links, images, and files. The web app works from IndexedDB when you're offline, with an Expo capture app and a Tauri desktop version alongside it.",
    details: [
      "I built the Excalidraw-like canvas on IndexedDB, then added D1 for metadata and R2 for versioned files.",
      "I made an Expo app for quick capture and a Tauri desktop app with native file access and deep links.",
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
      { value: "3", label: "apps" },
      { value: "8 MiB", label: "resumable chunks" },
    ],
    caseStudy: {
      challengeHeading:
        "The canvas should still be there when the Wi-Fi isn't.",
      challenge:
        "I didn't want a personal canvas to wait for sign-in or a network request before showing my own notes. Scatterfield saves the main web app to IndexedDB first. Cloud sync and native file access are useful additions, but the canvas doesn't depend on them.",
      role: [
        "I designed and built the web canvas, its IndexedDB storage, and the offline behaviour.",
        "I wrote the Cloudflare Worker and the D1 and R2 code for file versions, multipart uploads, hashes, quotas, and cleanup.",
        "I built the Expo mobile app and Tauri desktop app around the same data model.",
      ],
      architecture: [
        {
          title: "Adding something",
          description:
            "Notes, links, images, and files can come from the canvas, the smaller mobile app, or the desktop file picker.",
        },
        {
          title: "IndexedDB first",
          description:
            "The web app reads and writes IndexedDB, so it opens offline and doesn't require an account for basic use.",
        },
        {
          title: "Before an upload",
          description:
            "The cloud service checks quota and records the upload before accepting the file body.",
        },
        {
          title: "Large files",
          description: "Uploads use resumable chunks and SHA-256 hashes.",
        },
        {
          title: "After an interruption",
          description:
            "Version records and stale-session cleanup let interrupted uploads resume or be removed cleanly.",
        },
      ],
      decisions: [
        {
          title: "Don't make the cloud mandatory",
          description:
            "IndexedDB is enough for the canvas to work. Cloud configuration adds sync, not permission to use the app.",
        },
        {
          title: "Give each app a different job",
          description:
            "Mobile is for quick capture, desktop adds native file access, and the web app keeps the full canvas.",
        },
        {
          title: "Assume uploads will be interrupted",
          description:
            "Chunks, quota reservations, hashes, file versions, and cleanup make it possible to recover from a failed upload.",
        },
      ],
      outcomes: [
        "The repository contains the full web app, an Expo client, a Tauri app, and the Cloudflare code.",
        "The main canvas works offline, while configured accounts can upload resumable file versions.",
        "Tests cover the web and mobile apps, uploads, and desktop integration.",
      ],
      evidence: [
        {
          label: "Scatterfield on GitHub",
          href: "https://github.com/Krishang-Zinzuwadia/scatterfield",
          description:
            "The source code, setup for each app, database migrations, product notes, and tests.",
        },
      ],
      evidenceNote:
        "The source for all three apps is public, but there isn't a hosted demo, screenshot set, or GitHub Actions run to point to. I don't claim a public production deployment.",
    },
  },
  {
    slug: "aisle",
    title: "Aisle",
    fullTitle: "Aisle — A Marketplace for Public Agent Skills",
    subtitle: "Find public skills and install an exact revision",
    date: "Jul 2026",
    recognition: "32 merged PRs · live public marketplace",
    summary:
      "Aisle indexes public Agent Skills and helps people combine them into one install command. It points to exact upstream sources and revisions instead of copying the skills or making new ones.",
    details: [
      "Across 32 merged PRs, I worked on catalog imports, source checks, package building, shell-safe install commands, docs, and the marketplace UI.",
      "I removed an N+1 package query that made one page take 27.9 seconds. The same measured route dropped to about 3.1 seconds.",
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
      { value: "89%", label: "faster measured page load" },
    ],
    caseStudy: {
      challengeHeading:
        "A public repository isn't automatically ready to install.",
      challenge:
        "Agent Skills live in repositories and registries that can change at any time, and their metadata is inconsistent. Aisle can list a skill it found without enabling its install button. Missing source details, a changed revision, an absent license, or an incomplete artifact keeps it unavailable.",
      role: [
        "I wrote 32 merged pull requests across the marketplace base, catalog connectors, source rules, packages, installation UI, and docs.",
        "I made incomplete listings visible but not selectable until their source, revision, license, artifact, inventory, and trust checks pass.",
        "I traced the slow packages page to sequential database reads, then fixed it with batched queries, reused clients, limited caching, and less prefetching.",
      ],
      architecture: [
        {
          title: "Public sources",
          description:
            "Separate connectors check the configured public registries and GitHub inventories.",
        },
        {
          title: "Temporary checkout",
          description:
            "Aisle fetches the exact repository path and revision temporarily so it can validate and fingerprint the skill.",
        },
        {
          title: "Install eligibility",
          description:
            "The source, revision, artifact, license, inventory, and trust checks decide whether the listing can be installed.",
        },
        {
          title: "Packages",
          description:
            "A package pins each eligible listing to a catalog revision. If one has changed, the whole package update fails.",
        },
        {
          title: "The command",
          description:
            "The server resolves the selection into exact argv operations and shell-safe commands.",
        },
      ],
      decisions: [
        {
          title: "Don't enable incomplete listings",
          description:
            "A partial or unresolved listing can explain what Aisle found, but it can't be selected, packaged, or installed.",
        },
        {
          title: "Store references, not copies",
          description:
            "Aisle stores source metadata, immutable references, hashes, fingerprints, and audit results. It doesn't save skill bodies or repackage repository trees.",
        },
        {
          title: "Profile the page people were waiting on",
          description:
            "Production timing found roughly 164 sequential reads behind the packages page. Batching and a small cache fixed that specific path.",
        },
      ],
      outcomes: [
        "The public marketplace and its package builder went live through a series of merged production pull requests.",
        "In the July 2026 measurement, the packages page became about 89 percent faster.",
        "When an upstream source changes unexpectedly, Aisle blocks the stale package instead of publishing it quietly.",
      ],
      evidence: [
        {
          label: "Aisle on GitHub",
          href: "https://github.com/desync-organization/aisle",
          description:
            "The marketplace source, catalog rules, tests, technical notes, and operating docs.",
        },
        {
          label: "The packages-page fix",
          href: "https://github.com/desync-organization/aisle/pull/53",
          description:
            "The N+1 diagnosis, the code change, and the before-and-after timings.",
        },
      ],
      evidenceNote:
        "The repository and marketplace are public. The speed figure comes from a July 2026 measurement, not a permanent guarantee. Scheduled catalog runs are supposed to fail when an upstream revision or inventory changes unexpectedly.",
    },
  },
  {
    slug: "helios",
    title: "Helios",
    fullTitle: "Helios — Local Models for Repository Work",
    subtitle: "A local runtime for specialist coding models",
    date: "Jul 2026",
    recognition: "Three-person project · I owned the local runtime",
    summary:
      "Helios breaks repository work into typed tasks and assigns them to small local models. I owned the Python runtime: planning, dependency scheduling, model loading, limited file tools, and the critic that checks results.",
    details: [
      "My part of the three-person project covered the planner, scheduler, specialists, model loading and unloading, repository tools, critic, and runtime safety.",
      "I also built an unmerged site-generation branch with tagged specialists and a live plan view in the Next.js operator app.",
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
      { value: "3", label: "people on the team" },
    ],
    caseStudy: {
      challengeHeading: "Small local models need smaller, clearer jobs.",
      challenge:
        "A small model is much more useful when it gets a specific task, the few file tools it needs, and a clear expected result. Helios also keeps GitHub credentials and final outside changes away from the model process.",
      role: [
        "I owned the documented Member 1 work: planner, scheduler, experts, model management, repository tools, critic, and runtime safety.",
        "I implemented typed plans, dependency scheduling, limited model handoffs, VRAM management, and requests for outside changes that contain no credentials.",
        "I built the unmerged site-generation extension and live plan UI as a four-commit branch with a working preview.",
      ],
      architecture: [
        {
          title: "The repository job",
          description:
            "The operator app starts a clearly defined repository task without giving cloud credentials to a local model.",
        },
        {
          title: "Typed tasks",
          description:
            "The planner records each task, its dependencies, assigned specialist, expected files, and review checks.",
        },
        {
          title: "Dependency order",
          description:
            "The DAG scheduler starts ready tasks in the right order and stays within the machine's resource limits.",
        },
        {
          title: "Specialist models",
          description:
            "Each specialist gets only the repository tools its task needs. It returns files or a request for an outside change, not direct access to external services.",
        },
        {
          title: "A separate check",
          description:
            "A critic decides whether to accept the result, retry it, or send a requested outside change to the control plane.",
        },
      ],
      decisions: [
        {
          title: "Don't give credentials to the models",
          description:
            "GitHub App credentials and final outside changes stay in my teammates' control plane. Helios sends an explicit request instead.",
        },
        {
          title: "Put the plan on screen",
          description:
            "Typed tasks and a live plan view show dependencies and current state instead of hiding everything in one long prompt.",
        },
        {
          title: "Manage VRAM in the runtime",
          description:
            "Helios controls model loading, handoffs, and VRAM limits so specialists don't fight for memory.",
        },
      ],
      outcomes: [
        "I completed my assigned local-runtime part of the three-person project.",
        "The separate site-generation branch has tests and a working UI preview.",
        "That branch is still unmerged, the repository Actions aren't green, and the hosted UI doesn't run Ollama in the cloud.",
      ],
      evidence: [
        {
          label: "Helios on GitHub",
          href: "https://github.com/desync-organization/helios",
          description:
            "The team source, ownership notes, Python runtime, operator app, and project docs.",
        },
        {
          label: "Helios operator app",
          href: "https://helios-desync2.vercel.app",
          description:
            "A public preview of the interface. It isn't a hosted Ollama runtime.",
        },
      ],
      evidenceNote:
        "Helios has three contributors. I own the documented local-runtime part; my teammates own Convex, the Cloudflare Worker, the GitHub App control plane, and training. The site-generation work is on an unmerged branch, and the repository currently has no green Actions run.",
    },
  },
  {
    slug: "hermes",
    title: "Hermes",
    fullTitle: "Hermes — A Self-Hostable Rust Messenger",
    subtitle: "Peer-to-peer chat in the terminal",
    date: "2026",
    recognition: "14 merged PRs · 31 CI tests",
    summary:
      "Hermes is a terminal messenger written in Rust with libp2p and Ratatui. It can find peers, fall back to relays, keep chats in SQLite, and retry messages until the recipient has stored them.",
    details: [
      "My 14 merged team PRs covered accounts, terminal chat, friends, database-backed chat lists, relay settings, and reliability fixes.",
      "I later maintained a 33-commit branch that put the client, relay/bootstrap, and authentication modes into one executable.",
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
      { value: "31", label: "tests passing in CI" },
    ],
    caseStudy: {
      challengeHeading:
        "The hard part starts when the other person goes offline.",
      challenge:
        "Peer-to-peer chat still needs accounts, peer discovery, relay fallback, local history, and sensible retries when somebody disconnects or restarts. Hermes brings those pieces together in a Rust app that people can host themselves.",
      role: [
        "I wrote 14 merged ACM-VIT pull requests for Ratatui chat, signup and login, friends, saved chat lists, relay settings, and reliability fixes.",
        "I maintained a later 33-commit development branch that replaced duplicated services with one long-running libp2p swarm.",
        "I added a persistent message queue, Ed25519 account identity, SQLx repositories, attachment checks, deployment scripts, and stricter CI.",
      ],
      architecture: [
        {
          title: "Accounts and peer identity",
          description:
            "Axum and Argon2 handle accounts, which resolve to Ed25519-backed peer identities.",
        },
        {
          title: "Finding peers",
          description:
            "Kademlia, Identify, relay settings, and saved bootstrap data help peers find each other after restarts and across networks.",
        },
        {
          title: "The connection",
          description:
            "TCP or QUIC runs through Noise-secured libp2p transport, with relay and hole-punching support where available.",
        },
        {
          title: "The message queue",
          description:
            "Messages enter an idempotent queue. The recipient acknowledges one only after saving it.",
        },
        {
          title: "Local chat history",
          description:
            "SQLx and SQLite store accounts, friends, history, message state, and limited attachment metadata for Ratatui.",
        },
      ],
      decisions: [
        {
          title: "Use one libp2p swarm",
          description:
            "The client, relay/bootstrap mode, retry worker, and authentication entry points share one executable instead of duplicating network code.",
        },
        {
          title: "Acknowledge only after saving",
          description:
            "Hermes marks a message successful after the recipient writes it to storage, so retries don't create duplicate chat entries.",
        },
        {
          title: "Be exact about encryption",
          description:
            "Noise protects each transport connection. Hermes doesn't claim application-level or group end-to-end encryption because those aren't implemented.",
        },
      ],
      outcomes: [
        "Fourteen of my feature and reliability PRs were merged into the ACM-VIT development branch.",
        "My later consolidated branch passes formatting, Clippy, and 31 automated tests in CI.",
        "Multi-node proof, larger transfers, account recovery, and group encryption are still future work.",
      ],
      evidence: [],
      evidenceNote:
        "The official repository and my current development branch are private, and the organization's default branch is stale. The details here come from merged PRs and passing CI on my branch. There is no public demo or release, and I haven't described the unfinished WhatsApp or Slack bridges as working features.",
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
      "This pulls my WhatsApp stickers over ADB, removes near-duplicates, sorts them with Ollama, and rebuilds packs that WhatsApp can import.",
    stack: ["Python", "FastAPI", "Ollama", "ADB"],
    href: "https://github.com/Krishang-Zinzuwadia/sticker-organiser",
    note: "Runs locally",
  },
  {
    title: "Zephyr",
    summary:
      "Hold a key, speak, and Zephyr types the result into Linux apps. It uses faster-whisper, shows a GTK overlay, and supports both X11 and Wayland.",
    stack: ["Python", "faster-whisper", "GTK", "Linux"],
    href: "https://github.com/Krishang-Zinzuwadia/zephyr",
    note: "Voice input for Linux",
  },
  {
    title: "Right Click Clear Folder",
    summary:
      "It adds Clear Folder to the Windows Explorer right-click menu. There is a confirmation step, checks for protected paths, and scripts to add or remove it.",
    stack: ["C#", ".NET", "Windows Registry"],
    href: "https://github.com/Krishang-Zinzuwadia/rightclickclearfolder",
    note: "Explorer right-click tool",
  },
  {
    title: "Spirit",
    summary:
      "A Windows voice-assistant experiment with Sarvam speech, a PyQt overlay, keyboard shortcuts, and pywinauto for desktop actions.",
    stack: ["Python", "PyQt", "Sarvam", "pywinauto"],
    href: "https://github.com/Krishang-Zinzuwadia/spirit",
    note: "Windows voice experiment",
  },
  {
    title: "Better Terminal",
    summary:
      "A Bash helper for styling terminal text with ANSI, 256-color, or true-color output. It also has gradients, completions, and install targets.",
    stack: ["Bash", "Linux", "ANSI"],
    href: "https://github.com/Krishang-Zinzuwadia/better-terminal",
    note: "Small Bash utility",
  },
];

export const openSourceContributions: OpenSourceContribution[] = [
  {
    title: "SGLang Docs",
    organization: "sgl-project",
    contribution:
      "I wrote guides for serving, benchmarking, profiling, Docker, JIT kernels, and model evaluation. I also expanded the VLM docs and fixed their navigation across four merged PRs.",
    proof: "4 merged PRs",
    href: "https://github.com/sgl-project/sgl-docs/pull/33",
  },
  {
    title: "React Bits",
    organization: "DavidHDev",
    contribution:
      "I fixed the preview toggles for Light Rays and Radar so the examples now update the controls correctly.",
    proof: "Merged as PR #992",
    href: "https://github.com/DavidHDev/react-bits/pull/992",
  },
  {
    title: "Componentry",
    organization: "harshjdhv",
    contribution:
      "I fixed a docs preview that was clipping the circuit-board topology variant selector.",
    proof: "Merged as PR #10",
    href: "https://github.com/harshjdhv/componentry/pull/10",
  },
  {
    title: "Conclave",
    organization: "ACM-VIT",
    contribution:
      "I built the synchronized multiplayer Zip puzzle, including its generator, solver, SFU start and stop handling, interface, and tests. I also worked on direct messages and speaker priority.",
    proof: "PRs #205 and #41 were merged",
    href: "https://github.com/ACM-VIT/conclave/pull/205",
  },
  {
    title: "Sunny.ai",
    organization: "ACM-VIT",
    contribution:
      "I added LinkedIn sign-in with Better Auth, wrote the database migrations, built the settings page, and added light, dark, and system themes.",
    proof: "Merged as PR #6",
    href: "https://github.com/ACM-VIT/Sunny.ai/pull/6",
  },
  {
    title: "Peter Robinson Workshop",
    organization: "ACM-VIT",
    contribution:
      "I built the speaker and event pages, the footer, and the motion used across the workshop site. Later fixes made the animations behave on smaller screens.",
    proof: "9 merged PRs",
    href: "https://github.com/ACM-VIT/DSP-Peter-Robinson-May-2025",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const experience = {
  organization: "ACM Student Chapter, VIT",
  role: "Core committee member on the tech team",
  location: "Vellore, India",
  date: "May 2025 — Present",
  highlights: [
    "I ran technical operations and judged Code2Create, which had 1,500+ participants.",
    "I built a cryptic hunt for 400+ players, including the live game logic, challenges, and scoring.",
    "I taught a MERN workshop and deployed an SDG 4 project for digitizing rural education infrastructure.",
  ],
};

export const achievements = [
  {
    place: "1st",
    title: "CTFTime team rank",
    context: "First in India and seventh worldwide",
    date: "Apr 2026",
  },
  {
    place: "1st",
    title: "Hackzero CTF",
    context: "Security and reverse engineering",
    date: "Apr 2026",
  },
  {
    place: "2nd",
    title: "DevSoc Hackathon",
    context: "CodeChef, with 1,200+ participants",
    date: "Feb 2026",
  },
  {
    place: "2nd",
    title: "B3 Hack",
    context: "Web3 hackathon with 200+ participants",
    date: "Feb 2026",
  },
  {
    place: "3rd",
    title: "SENSE Hack",
    context: "International hackathon for local AI systems",
    date: "Dec 2025",
  },
  {
    place: "3rd",
    title: "Clueminati",
    context: "CTF-style logic challenge with 700+ participants",
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

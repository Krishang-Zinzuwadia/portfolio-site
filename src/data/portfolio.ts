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
  role: "Computer science student at VIT Vellore, building agent tools, desktop software, and security projects",
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
  { value: "1st", label: "team rank in India on CTFTime", note: "Apr 2026" },
  { value: "7th", label: "team rank worldwide on CTFTime", note: "Apr 2026" },
  { value: "7", label: "typed MCP tools in Quark", note: "Aug 2026" },
  { value: "100 ms", label: "median OCS query time", note: "Sep 2025" },
];

const establishedProjects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
    fullTitle: "Autonomous Task Learning & Action System",
    subtitle: "A local desktop agent that checks its own work",
    recognition: "DevSoc Hack · 2nd place",
    summary:
      "Atlas takes a desktop request, reads what is on screen, clicks or types, and then looks again to see whether the action worked. I kept the execution loop on the user’s machine.",
    details: [
      "I put together the screen-reading loop with LLaVA, Mistral, PaddleOCR, and PyAutoGUI.",
      "Rust owns the local execution path; Tauri, FastAPI, and WebSockets tie the desktop app to the model services.",
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
    caseStudy: {
      challengeHeading: "The click is only half the job.",
      challenge:
        "People describe desktop jobs loosely; the computer still has to turn that into one exact click or keystroke. Atlas reads the screen, picks the next action, performs it, and looks again before moving on. That loop runs on the user’s machine.",
      role: [
        "I designed the loop between screen reading, planning, and desktop control.",
        "I wrote the Rust runtime that isolates a task and coordinates the processes around it.",
        "I connected the vision and language models to PyAutoGUI, then wrapped the interface in Tauri.",
      ],
      architecture: [
        {
          title: "First, read the screen",
          description:
            "LLaVA identifies the visible interface while PaddleOCR pulls out the text.",
        },
        {
          title: "Match it to the request",
          description:
            "Atlas compares the request with the text and controls it can see right now.",
        },
        {
          title: "Pick one action",
          description:
            "Mistral chooses the next step. Browser-specific work can be handed to the MCP agent.",
        },
        {
          title: "Use the real desktop",
          description:
            "The isolated Rust runtime lets PyAutoGUI use the mouse and keyboard locally.",
        },
        {
          title: "Then look again",
          description:
            "A fresh screen read decides whether Atlas can continue or needs another plan.",
        },
      ],
      decisions: [
        {
          title: "Keep execution on the machine",
          description:
            "The mouse and keyboard work happens locally; Atlas is not a remote-control service.",
        },
        {
          title: "Keep the desktop app separate",
          description:
            "The Tauri and Next.js interface talks to FastAPI over WebSockets, while Rust owns execution.",
        },
        {
          title: "Never trust the planned click",
          description:
            "Atlas treats the new screen—not the generated plan—as evidence that an action worked.",
        },
      ],
      outcomes: [
        "Atlas finished second at DevSoc Hack.",
        "The public repository contains the desktop app, a browser MCP agent, and a Flutter companion.",
        "Mouse and keyboard control stays local while the model services coordinate around it.",
      ],
      evidence: [
        {
          label: "Atlas on GitHub",
          href: "https://github.com/Krishang-Zinzuwadia/ATLAS",
          description:
            "Source code, setup notes, and the current architecture.",
        },
      ],
      evidenceNote:
        "My résumé and the award notes disagree on the month, so I’ve left the date off instead of guessing.",
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
    subtitle: "The application portal behind ACM-VIT recruitment",
    date: "Sep 2025",
    recognition: "1,000+ applicants · 50+ interviewers",
    summary:
      "OCS handled recruitment for 1,000+ applicants and 50+ interviewers. On a team of more than 50, I worked on the database, the browser-style review app, and the admin tools.",
    details: [
      "I worked on the CockroachDB schema and Redis cache; the measured median query time reached 100 ms.",
      "I also built the tabbed reviewer app and a Next.js admin dashboard with Server Actions and PostHog.",
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
        "Recruitment had a database problem and a desk-work problem.",
      challenge:
        "More than 50 interviewers had to get through over 1,000 applications. The queries needed to stay quick, but so did the human part: moving between candidates, notes, and admin work without constantly losing context.",
      role: [
        "I worked on the applications portal with a team of more than 50 people.",
        "My database work covered the CockroachDB schema and the Redis cache.",
        "On the product side, I built the browser-style reviewer and the App Router admin dashboard with Server Actions, Prisma, and PostHog.",
      ],
      architecture: [
        {
          title: "One place for applications",
          description:
            "The portal collected and organised submissions from more than 1,000 applicants.",
        },
        {
          title: "Tabs for the reviewers",
          description:
            "The React reviewer used familiar browser-style tabs so interviewers could keep several candidates open.",
        },
        {
          title: "A separate admin view",
          description:
            "The admin dashboard stayed in Next.js, with Server Actions and Prisma handling its work.",
        },
        {
          title: "CockroachDB plus Redis",
          description:
            "CockroachDB held the application data; Redis took repeated reads off the main query path.",
        },
        {
          title: "Watch how it was used",
          description:
            "PostHog gave the team enough usage data to find the rough parts of the flow.",
        },
      ],
      decisions: [
        {
          title: "Borrow the browser model",
          description:
            "Interviewers already knew how tabs worked, so the reviewer did not need to invent a new navigation model.",
        },
        {
          title: "Tune the busy paths first",
          description:
            "The schema and cache work focused on the queries recruitment kept hitting all day.",
        },
        {
          title: "Keep admin in the same app",
          description:
            "Admin stayed in the App Router codebase instead of turning into another product to maintain.",
        },
      ],
      outcomes: [
        "The platform supported more than 1,000 applicants and more than 50 interviewers.",
        "After the schema and cache work, the measured median query time was 100 milliseconds.",
        "This was team work: more than 50 people contributed to OCS.",
      ],
      evidence: [],
      evidenceNote:
        "The usage numbers and timing come from my résumé. The repository is private, so there is no source link I can share.",
    },
  },
];

const newProjects: Project[] = [
  {
    slug: "quark",
    title: "Quark",
    fullTitle: "Quark — A Phone Call for Stuck Coding Agents",
    subtitle: "A phone call for stuck coding agents",
    date: "Aug 2026",
    recognition: "Private project · simulator path working",
    summary:
      "When a coding agent reaches a choice it can’t safely guess, Quark calls the person who started the task. It asks one fixed-choice question and sends the confirmed answer back to the checkpoint that stopped.",
    details: [
      "I built the MCP server, Fastify API, SQLite request store, operator app, browser call simulator, and phone-provider adapters.",
      "The reply can settle that question. It cannot change Codex permissions or quietly widen the task.",
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
    caseStudy: {
      challengeHeading: "A quick answer should not become a broad approval.",
      challenge:
        "Long coding tasks eventually hit a choice the repository cannot make for me. Quark pauses there and asks by phone. The answer is tied to that checkpoint, and the call cannot approve deletion, money, production changes, security-sensitive work, or outside actions.",
      role: [
        "I started with the product rules: what a phone answer means, what it can never approve, and how long it remains valid.",
        "Then I built the Fastify API, authenticated MCP server, SQLite storage, React operator app, and browser simulator.",
        "The provider side has Twilio and Exotel adapters, an isolated Sarvam bridge, and a versioned evaluation suite.",
      ],
      architecture: [
        {
          title: "One fixed question",
          description:
            "Codex sends the choices together with the ID of the checkpoint that needs an answer.",
        },
        {
          title: "Checks before the call",
          description:
            "Quark checks keys, request IDs, origin, expiry, and policy before it dials anything.",
        },
        {
          title: "Read the choices aloud",
          description:
            "The simulator or phone provider reads only the choices, without credentials or unrelated repository context.",
        },
        {
          title: "Confirm the answer",
          description:
            "Quark reads the selection back and records nothing until the person confirms it.",
        },
        {
          title: "Return to the same checkpoint",
          description:
            "Codex matches the checkpoint ID, retrieves the typed answer, and acknowledges it once before continuing.",
        },
      ],
      decisions: [
        {
          title: "Do not confuse an answer with permission",
          description:
            "A reply can choose A or B. It cannot approve money, deletion, production changes, sensitive security work, or outside actions.",
        },
        {
          title: "Tie every reply to one stop",
          description:
            "Exact ID matching, expiry, replacement, and dispute handling stop an old reply from leaking into a later decision.",
        },
        {
          title: "Leave the private bits out of logs",
          description:
            "Phone numbers, briefs, transcripts, and answers are encrypted at rest. Raw transcripts never come back through MCP or land in logs.",
        },
      ],
      outcomes: [
        "The local simulator completes the whole loop: MCP request, call, confirmation, retrieval, and acknowledgement.",
        "Contract, API, and browser tests cover both the application code and the provider adapters.",
        "I still need to run the real Exotel-to-Sarvam phone chain before I would call Quark ready.",
      ],
      evidence: [],
      evidenceNote:
        "The repository is private, so I cannot link the source. The simulator and provider contracts work; the real Exotel-to-Sarvam-to-Quark call still needs to happen.",
    },
  },
  {
    slug: "scatterfield",
    title: "Scatterfield",
    fullTitle: "Scatterfield",
    subtitle: "A canvas that still opens without Wi-Fi",
    date: "Aug 2026",
    recognition: "Web, mobile, and desktop apps",
    summary:
      "Scatterfield is an infinite canvas for notes, links, images, and files. The web app reads from IndexedDB when you are offline; the Expo and Tauri apps add quick capture and native file access.",
    details: [
      "I built the Excalidraw-like canvas around IndexedDB, then added D1 metadata and versioned files in R2.",
      "The smaller Expo app is for quick capture; the Tauri app adds native file access and deep links.",
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
      { value: "3", label: "connected apps" },
      { value: "8 MiB", label: "upload chunks" },
    ],
    caseStudy: {
      challengeHeading:
        "My canvas should not need permission from the network.",
      challenge:
        "I did not want my own notes to wait for sign-in or a network request. Scatterfield writes the web canvas to IndexedDB first. Sync and native file access are useful extras, but neither one is required to open the canvas.",
      role: [
        "I designed the web canvas and its IndexedDB data model, then made the offline path the default rather than a fallback.",
        "For sync, I wrote the Cloudflare Worker plus the D1 and R2 code for versions, multipart uploads, hashes, quotas, and cleanup.",
        "I built the Expo and Tauri apps around that same model instead of treating them as separate products.",
      ],
      architecture: [
        {
          title: "Capture it anywhere",
          description:
            "Notes, links, images, and files can start on the canvas, in the mobile app, or from the desktop file picker.",
        },
        {
          title: "Write locally first",
          description:
            "The web app reads and writes IndexedDB, so basic use needs neither an account nor a connection.",
        },
        {
          title: "Reserve space before uploading",
          description:
            "The cloud service checks quota and records the session before accepting the file body.",
        },
        {
          title: "Move large files in pieces",
          description:
            "Uploads use resumable 8 MiB chunks and SHA-256 hashes instead of starting over after a dropped connection.",
        },
        {
          title: "Clean up after interruptions",
          description:
            "Version records let an upload resume, while stale-session cleanup removes the abandoned ones.",
        },
      ],
      decisions: [
        {
          title: "Make the cloud optional",
          description:
            "IndexedDB is enough to use the canvas. Cloud configuration adds sync; it does not unlock the app.",
        },
        {
          title: "Give each app one good reason to exist",
          description:
            "Mobile handles quick capture, desktop adds native files, and the web app remains the full canvas.",
        },
        {
          title: "Plan for the upload to fail halfway",
          description:
            "Chunks, quota reservations, hashes, versions, and cleanup make a failed upload recoverable.",
        },
      ],
      outcomes: [
        "The public repository contains the web canvas, Expo client, Tauri app, and Cloudflare service.",
        "The canvas works offline; configured accounts can also sync resumable file versions.",
        "The test suite covers the web and mobile apps, uploads, and desktop integration.",
      ],
      evidence: [
        {
          label: "Scatterfield on GitHub",
          href: "https://github.com/Krishang-Zinzuwadia/scatterfield",
          description:
            "Source code, setup for all three apps, database migrations, notes, and tests.",
        },
      ],
      evidenceNote:
        "All three apps are public, but there is no hosted demo, screenshot set, or GitHub Actions run to point at. For now, it is a public repository—not a production app.",
    },
  },
  {
    slug: "aisle",
    title: "Aisle",
    fullTitle: "Aisle — A Marketplace for Public Agent Skills",
    subtitle: "A marketplace for public Agent Skills",
    date: "Jul 2026",
    recognition: "32 merged PRs · public marketplace live",
    summary:
      "Aisle finds public Agent Skills, checks the source and revision, and lets people bundle the ones that pass into one install command. It points upstream instead of copying anyone’s work.",
    details: [
      "My 32 merged PRs cover catalog imports, source checks, packages, shell-safe commands, docs, and the marketplace itself.",
      "One packages page took 27.9 seconds because of an N+1 path. After batching it, the same measured route took about 3.1 seconds.",
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
      { value: "89%", label: "faster in one measured route" },
    ],
    caseStudy: {
      challengeHeading: "Public does not mean installable.",
      challenge:
        "Agent Skills are scattered across repositories and registries, and those sources can change underneath a catalog. Aisle can show something it found without pretending it is ready. If the source, revision, license, or files are incomplete, the Install button stays off.",
      role: [
        "I wrote 32 merged pull requests across the marketplace, catalog connectors, source rules, packages, install flow, and docs.",
        "I made incomplete listings visible but impossible to select until the source, revision, license, artifact, inventory, and trust checks pass.",
        "I also chased a very slow packages page down to sequential database reads, then fixed that path with batching, reused clients, a small cache, and less prefetching.",
      ],
      architecture: [
        {
          title: "Look through public sources",
          description:
            "Connectors read the configured registries and GitHub inventories without inventing new listings.",
        },
        {
          title: "Check out the exact revision",
          description:
            "Aisle fetches the repository path and pinned revision into a temporary checkout for validation and fingerprinting.",
        },
        {
          title: "Decide whether Install is allowed",
          description:
            "Source, revision, artifact, license, inventory, and trust checks all have to pass before selection is enabled.",
        },
        {
          title: "Pin the package",
          description:
            "Every item is tied to a catalog revision. If one has moved, the package update fails rather than mixing versions.",
        },
        {
          title: "Build a command you can inspect",
          description:
            "The server resolves the selection into argv operations and shell-safe commands before anything is run.",
        },
      ],
      decisions: [
        {
          title: "Show incomplete listings, but lock them",
          description:
            "People can see what Aisle found and why it failed, but they cannot select, package, or install it.",
        },
        {
          title: "Point upstream instead of republishing",
          description:
            "Aisle stores source metadata, immutable references, hashes, fingerprints, and audit results—not skill bodies or copied repository trees.",
        },
        {
          title: "Measure the page that actually felt slow",
          description:
            "Production timing exposed roughly 164 sequential reads behind the packages page. Batching and a small cache fixed that path.",
        },
      ],
      outcomes: [
        "The public marketplace and package builder are live, with the work landing through merged production pull requests.",
        "In a July 2026 measurement, the packages route went from 27.9 seconds to about 3.1 seconds—roughly 89 percent faster.",
        "If an upstream source changes unexpectedly, Aisle blocks the stale package instead of quietly publishing it.",
      ],
      evidence: [
        {
          label: "Aisle on GitHub",
          href: "https://github.com/desync-organization/aisle",
          description:
            "Marketplace source, catalog rules, tests, technical notes, and operating docs.",
        },
        {
          label: "The packages-page fix",
          href: "https://github.com/desync-organization/aisle/pull/53",
          description:
            "The N+1 diagnosis, implementation, and before-and-after timing notes.",
        },
      ],
      evidenceNote:
        "The repository and marketplace are public. The speed number is one July 2026 measurement, not a permanent promise. Scheduled catalog runs deliberately fail when an upstream revision or inventory changes unexpectedly.",
    },
  },
  {
    slug: "helios",
    title: "Helios",
    fullTitle: "Helios — Local Models for Repository Work",
    subtitle: "Repository work split into jobs for local models",
    date: "Jul 2026",
    recognition: "Three-person project · I built the local runtime",
    summary:
      "Helios breaks a repository job into typed tasks for small local models. I built the Python runtime that plans the work, schedules dependencies, loads models, limits their file tools, and checks each result.",
    details: [
      "My part of the three-person project covers the planner, DAG scheduler, specialist hand-offs, model loading, repository tools, critic, and runtime safety.",
      "I also made an unmerged four-commit site-generation branch with tagged specialists and a live plan view.",
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
      { value: "3", label: "people on the project" },
    ],
    caseStudy: {
      challengeHeading: "A whole repository is too much context at once.",
      challenge:
        "A small model is much more useful when it gets one specific task, a short list of file tools, and a clear expected result. Helios keeps GitHub credentials and final outside changes away from that model process too.",
      role: [
        "I built the documented Member 1 work: planner, scheduler, specialists, model management, repository tools, critic, and runtime safety.",
        "That includes typed plans, dependency scheduling, limited hand-offs, VRAM management, and credential-free requests for outside changes.",
        "I also built the unmerged site-generation extension and live plan interface as a four-commit branch with a working preview.",
      ],
      architecture: [
        {
          title: "Start with one repository job",
          description:
            "The operator app starts a defined task without putting cloud credentials in front of a local model.",
        },
        {
          title: "Write down the smaller jobs",
          description:
            "The planner records the dependencies, specialist, expected files, and review checks for each task.",
        },
        {
          title: "Run what is ready",
          description:
            "The DAG scheduler starts ready tasks in dependency order without stepping past the machine’s limits.",
        },
        {
          title: "Hand each model a short tool list",
          description:
            "A specialist returns files or asks for an outside change; it does not get direct access to external services.",
        },
        {
          title: "Check the result separately",
          description:
            "The critic accepts the result, retries it, or passes an outside-change request to the control plane.",
        },
      ],
      decisions: [
        {
          title: "Keep credentials out of the model process",
          description:
            "GitHub App credentials and final outside changes stay in my teammates’ control plane. Helios sends a specific request instead.",
        },
        {
          title: "Let the operator see the plan",
          description:
            "Typed tasks and a live plan view expose dependencies and current state instead of hiding the run inside one prompt.",
        },
        {
          title: "Make the runtime own VRAM",
          description:
            "The runtime controls loading, hand-offs, and VRAM limits so the specialists do not fight for memory.",
        },
      ],
      outcomes: [
        "My documented local-runtime part is in place.",
        "The separate site-generation branch has tests and a working interface preview.",
        "That branch is still unmerged, and the hosted interface is only a preview—it does not run Ollama in the cloud.",
      ],
      evidence: [
        {
          label: "Helios on GitHub",
          href: "https://github.com/desync-organization/helios",
          description:
            "Team source, ownership notes, the Python runtime, operator app, and project docs.",
        },
        {
          label: "Helios operator app",
          href: "https://helios-desync2.vercel.app",
          description:
            "A public interface preview—not a hosted Ollama runtime.",
        },
      ],
      evidenceNote:
        "Helios has three contributors. I built the documented local-runtime part; my teammates own Convex, the Cloudflare Worker, the GitHub App control plane, and training. My site-generation work is still on an unmerged branch.",
    },
  },
  {
    slug: "hermes",
    title: "Hermes",
    fullTitle: "Hermes — A Rust Terminal Messenger",
    subtitle: "Peer-to-peer terminal chat built with libp2p",
    date: "2026",
    recognition: "14 merged PRs · 31 tests passing on my branch",
    summary:
      "Hermes is a Rust messenger for the terminal. It finds peers, falls back to relays, keeps chats in SQLite, and retries a message until the other side has saved it.",
    details: [
      "My 14 merged team PRs cover accounts, terminal chat, friends, saved chat lists, relay settings, and reliability fixes.",
      "Later, I maintained a 33-commit branch that combined the client, relay/bootstrap, and authentication modes in one executable.",
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
      { value: "14", label: "merged ACM-VIT PRs" },
      { value: "31", label: "tests passing on my branch" },
    ],
    caseStudy: {
      challengeHeading: "The other peer will eventually disappear.",
      challenge:
        "Peer-to-peer chat still needs accounts, discovery, relay fallback, local history, and sensible retries after a disconnect or restart. Hermes brings those pieces together in one Rust terminal app.",
      role: [
        "Fourteen of my ACM-VIT pull requests were merged: Ratatui chat, signup and login, friends, saved chat lists, relay settings, and reliability fixes.",
        "On a later 33-commit branch, I replaced duplicated services with one long-running libp2p swarm.",
        "That branch also adds a persistent queue, Ed25519 account identity, SQLx repositories, attachment checks, deployment scripts, and stricter CI.",
      ],
      architecture: [
        {
          title: "Turn an account into a peer identity",
          description:
            "Axum and Argon2 handle accounts; each one resolves to an Ed25519-backed peer identity.",
        },
        {
          title: "Find the other peer again",
          description:
            "Kademlia, Identify, relay settings, and saved bootstrap data help peers reconnect after restarts and across networks.",
        },
        {
          title: "Open a protected connection",
          description:
            "TCP or QUIC runs through Noise-secured libp2p transport, with relays and hole punching where available.",
        },
        {
          title: "Queue before pretending it is sent",
          description:
            "Messages enter an idempotent queue. The recipient acknowledges one only after it reaches storage.",
        },
        {
          title: "Keep history on the machine",
          description:
            "SQLx and SQLite store accounts, friends, chat history, message state, and limited attachment metadata for Ratatui.",
        },
      ],
      decisions: [
        {
          title: "Use one long-running swarm",
          description:
            "The client, relay/bootstrap mode, retry worker, and authentication entry points share one executable instead of duplicating network code.",
        },
        {
          title: "Wait for storage before acknowledging",
          description:
            "Hermes marks a message successful after the recipient saves it, and idempotency keeps retries from creating duplicate chat entries.",
        },
        {
          title: "Say exactly what is encrypted",
          description:
            "Noise protects each transport connection. Application-level and group end-to-end encryption are not implemented, so I do not claim them.",
        },
      ],
      outcomes: [
        "Fourteen of my feature and reliability PRs landed in the ACM-VIT development branch.",
        "My later consolidated branch passes formatting, Clippy, and 31 automated tests in CI.",
        "Multi-node testing, larger transfers, account recovery, and group encryption are still unfinished.",
      ],
      evidence: [],
      evidenceNote:
        "The official repository and my current branch are private, and the organisation’s default branch is stale. These details come from merged PRs and passing CI on my branch. There is no public demo or release; the unfinished WhatsApp and Slack bridges are not listed as working features.",
    },
  },
];

export const projects: Project[] = [
  newProjects[3],
  ...newProjects.slice(0, 3),
  ...establishedProjects.filter(
    (project) => project.slug === "atlas" || project.slug === "ocs"
  ),
  newProjects[4],
];

export const labProjects: LabProject[] = [
  {
    title: "Sticker Cabinet",
    summary:
      "I use Sticker Cabinet to pull my WhatsApp stickers over ADB, remove near-duplicates, sort them locally with Ollama, and rebuild packs WhatsApp can import.",
    stack: ["Python", "FastAPI", "Ollama", "ADB"],
    href: "https://github.com/Krishang-Zinzuwadia/sticker-organiser",
    note: "Local sticker organiser",
  },
  {
    title: "Zephyr",
    summary:
      "Hold a key, speak, and Zephyr types the transcript into the Linux app you are using. It runs faster-whisper behind a GTK overlay on both X11 and Wayland.",
    stack: ["Python", "faster-whisper", "GTK", "Linux"],
    href: "https://github.com/Krishang-Zinzuwadia/zephyr",
    note: "Push-to-talk on Linux",
  },
  {
    title: "Right Click Clear Folder",
    summary:
      "This adds Clear Folder to the Windows Explorer menu, with a confirmation step, protected-path checks, and scripts to install or remove it.",
    stack: ["C#", ".NET", "Windows Registry"],
    href: "https://github.com/Krishang-Zinzuwadia/rightclickclearfolder",
    note: "Explorer utility",
  },
  {
    title: "Spirit",
    summary:
      "Spirit is my Windows voice-interface experiment: Sarvam speech, a PyQt overlay, keyboard shortcuts, and pywinauto desktop actions.",
    stack: ["Python", "PyQt", "Sarvam", "pywinauto"],
    href: "https://github.com/Krishang-Zinzuwadia/spirit",
    note: "Windows voice experiment",
  },
  {
    title: "Better Terminal",
    summary:
      "Better Terminal formats shell output with ANSI, 256-colour, or true-colour text. It also includes gradients, completions, and install targets.",
    stack: ["Bash", "Linux", "ANSI"],
    href: "https://github.com/Krishang-Zinzuwadia/better-terminal",
    note: "Bash formatting helper",
  },
];

export const openSourceContributions: OpenSourceContribution[] = [
  {
    title: "SGLang Docs",
    organization: "sgl-project",
    contribution:
      "Across four merged PRs, I wrote guides for serving, benchmarking, profiling, Docker, JIT kernels, and model evaluation. I also expanded the VLM docs and fixed their navigation.",
    proof: "4 merged PRs",
    href: "https://github.com/sgl-project/sgl-docs/pull/33",
  },
  {
    title: "React Bits",
    organization: "DavidHDev",
    contribution:
      "I fixed the Light Rays and Radar preview toggles so changing an example updates its controls correctly.",
    proof: "Merged as PR #992",
    href: "https://github.com/DavidHDev/react-bits/pull/992",
  },
  {
    title: "Componentry",
    organization: "harshjdhv",
    contribution:
      "I fixed the docs preview that clipped the circuit-board topology variant selector.",
    proof: "Merged as PR #10",
    href: "https://github.com/harshjdhv/componentry/pull/10",
  },
  {
    title: "Conclave",
    organization: "ACM-VIT",
    contribution:
      "I built the synchronized multiplayer Zip puzzle: generator, solver, interface, tests, and SFU start and stop handling.",
    proof: "Merged as PR #205",
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
      "Across nine merged PRs, I built the speaker and event pages, footer, and shared motion. Later fixes made the animations behave on smaller screens.",
    proof: "9 merged PRs",
    href: "https://github.com/ACM-VIT/DSP-Peter-Robinson-May-2025",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const experience = {
  organization: "ACM Student Chapter, VIT",
  role: "Tech committee member",
  location: "Vellore, India",
  date: "May 2025 — Present",
  highlights: [
    "I helped run the technical side of Code2Create and judged projects from 1,500+ participants.",
    "For 400+ players, I built a cryptic hunt with live game logic, challenges, and scoring.",
    "I taught a MERN workshop and deployed an SDG 4 project for digitising rural education infrastructure.",
  ],
};

export const achievements = [
  {
    place: "1st",
    title: "CTFTime team rank",
    context: "Our team was first in India and seventh worldwide",
    date: "Apr 2026",
  },
  {
    place: "1st",
    title: "Hackzero CTF",
    context: "Security and reverse-engineering challenges",
    date: "Apr 2026",
  },
  {
    place: "2nd",
    title: "DevSoc Hackathon",
    context: "CodeChef hackathon with 1,200+ participants",
    date: "2026",
  },
  {
    place: "2nd",
    title: "B3 Hack",
    context: "A Web3 hackathon with 200+ participants",
    date: "Feb 2026",
  },
  {
    place: "3rd",
    title: "SENSE Hack",
    context: "An international hackathon for local AI systems",
    date: "Dec 2025",
  },
  {
    place: "3rd",
    title: "Clueminati",
    context: "A CTF-style logic challenge with 700+ participants",
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

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  recognition: string;
  summary: string;
  details: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
  tone: "acid" | "blue" | "coral";
};

export const identity = {
  name: "Krishang Zinzuwadia",
  role: "AI Systems Builder · Full-Stack Engineer · Cybersecurity Competitor",
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
  { value: "1st", label: "in India on CTFTime", note: "Apr 2026" },
  { value: "7th", label: "globally on CTFTime", note: "Apr 2026" },
  { value: "27", label: "specialized AI agents", note: "Labyrinth" },
  { value: "100 ms", label: "median query latency", note: "OCS platform" },
];

export const projects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
    subtitle: "Autonomous local AI agent for your OS",
    date: "Dec 2025",
    recognition: "2nd place · DevSoc Hack",
    summary:
      "A privacy-first desktop agent that turns natural-language intent into real operating-system actions through a local vision-planner-action pipeline.",
    details: [
      "Composed Mistral and LLaVA into a multimodal planning system with PyAutoGUI-driven execution.",
      "Built a Rust runtime to isolate tasks and coordinate processes inside a lightweight Tauri desktop shell.",
    ],
    stack: [
      "Python",
      "Rust",
      "Tauri",
      "PyTorch",
      "YOLOv8",
      "LLaVA",
      "Llama",
      "Firebase",
    ],
    metrics: [
      { value: "2nd", label: "DevSoc Hack" },
      { value: "Local", label: "privacy-first AI" },
    ],
    tone: "acid",
  },
  {
    slug: "labyrinth",
    title: "Labyrinth",
    subtitle: "Fully autonomous agentic companies",
    date: "Feb 2026",
    recognition: "2nd place · B3 Hack",
    summary:
      "An autonomous multi-agent software studio that takes a natural-language prompt from first idea to a deployed product.",
    details: [
      "Orchestrated 27 specialized agents with LangGraph across a Tauri, Bun, Next.js, and FastAPI architecture.",
      "Created Multiverse View for parallel architectural A/B testing and a zero-touch cloud deployment pipeline.",
    ],
    stack: ["LangGraph", "Tauri 2.0", "Bun", "Next.js", "FastAPI", "Python"],
    metrics: [
      { value: "27", label: "specialized agents" },
      { value: "0-touch", label: "deployment" },
    ],
    tone: "blue",
  },
  {
    slug: "ocs",
    title: "OCS Recruitment Platform",
    subtitle: "High-scale applications and interview operations",
    date: "Sep 2025",
    recognition: "1,000+ applicant production system",
    summary:
      "A recruitment operations platform designed with a 50+ person team for fast, reliable review across applicants, interviewers, and administrators.",
    details: [
      "Optimized the CockroachDB schema and Redis cache to keep median query latency at 100 ms.",
      "Built a browser-within-the-browser reviewer workspace, plus an App Router admin dashboard with Server Actions and PostHog telemetry.",
    ],
    stack: [
      "React",
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
  },
];

export const experience = {
  organization: "ACM Student Chapter, VIT",
  role: "Core Committee Member · Tech Domain",
  location: "Vellore, India",
  date: "May 2025 — Present",
  highlights: [
    "Led technical operations and judged Code2Create for 1,500+ participants, protecting event stability and impartial evaluation.",
    "Developed the Cryptic Hunt Game for 400+ participants, including real-time game logic, challenge design, and scoring.",
    "Led a MERN Stack workshop and deployed an SDG-4 solution for digitizing rural educational infrastructure.",
  ],
};

export const achievements = [
  {
    place: "01",
    title: "1st in India · 7th globally",
    context: "CTFTime national and international standing",
    date: "Apr 2026",
  },
  {
    place: "01",
    title: "Hackzero CTF",
    context: "Security and reverse-engineering challenge",
    date: "Apr 2026",
  },
  {
    place: "02",
    title: "DevSoc Hackathon",
    context: "CodeChef · 1,200+ participants",
    date: "Feb 2026",
  },
  {
    place: "02",
    title: "B3 Hack",
    context: "Web3 hackathon · 200+ participants",
    date: "Feb 2026",
  },
  {
    place: "03",
    title: "SENSE Hack",
    context: "International · Local AI Systems innovation",
    date: "Dec 2025",
  },
  {
    place: "03",
    title: "Clueminati",
    context: "CTF-style logic challenge · 700+ participants",
    date: "Oct 2025",
  },
];

export const skills = {
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

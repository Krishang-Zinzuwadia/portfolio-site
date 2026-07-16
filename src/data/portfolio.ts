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
  { value: "27", label: "agents coordinated in Labyrinth", note: "Feb 2026" },
  { value: "100 ms", label: "median OCS query latency", note: "Sep 2025" },
];

export const projects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
    subtitle: "Local desktop automation agent",
    date: "Dec 2025",
    recognition: "DevSoc Hack · 2nd place",
    summary:
      "A local desktop agent that turns natural-language requests into on-screen actions using vision, planning, and PyAutoGUI.",
    details: [
      "Combined Mistral and LLaVA for multimodal planning and used PyAutoGUI for execution.",
      "Built the desktop runtime in Rust and Tauri with isolated task and process coordination.",
    ],
    stack: ["Python", "Rust", "Tauri", "PyAutoGUI", "LLaVA", "YOLOv8"],
    metrics: [
      { value: "2nd", label: "DevSoc Hack" },
      { value: "Local", label: "desktop execution" },
    ],
    tone: "acid",
  },
  {
    slug: "labyrinth",
    title: "Labyrinth",
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
  },
  {
    slug: "ocs",
    title: "OCS Recruitment Platform",
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
  },
];

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

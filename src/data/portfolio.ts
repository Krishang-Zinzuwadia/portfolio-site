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

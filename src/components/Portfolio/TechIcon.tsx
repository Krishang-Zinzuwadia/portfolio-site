import type { IconType } from "react-icons";
import { BsCpu, BsEye } from "react-icons/bs";
import {
  SiBun,
  SiC,
  SiCockroachlabs,
  SiCplusplus,
  SiDocker,
  SiFastapi,
  SiFirebase,
  SiGit,
  SiGithubactions,
  SiGnubash,
  SiGo,
  SiJavascript,
  SiLangchain,
  SiLanggraph,
  SiLinux,
  SiMeta,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPosthog,
  SiPrisma,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiRust,
  SiTauri,
  SiTypescript,
  SiUltralytics,
} from "react-icons/si";

const icons: Record<string, IconType> = {
  Bash: SiGnubash,
  Bun: SiBun,
  C: SiC,
  "C++": SiCplusplus,
  CockroachDB: SiCockroachlabs,
  Docker: SiDocker,
  FastAPI: SiFastapi,
  Firebase: SiFirebase,
  Git: SiGit,
  "GitHub Actions": SiGithubactions,
  Go: SiGo,
  Java: SiOpenjdk,
  JavaScript: SiJavascript,
  LangChain: SiLangchain,
  LangGraph: SiLanggraph,
  Linux: SiLinux,
  Llama: SiMeta,
  LLaVA: BsEye,
  MongoDB: SiMongodb,
  "Next.js": SiNextdotjs,
  "Next.js 16": SiNextdotjs,
  "Node.js": SiNodedotjs,
  PostHog: SiPosthog,
  PostgreSQL: SiPostgresql,
  Prisma: SiPrisma,
  PyAutoGUI: SiPython,
  Python: SiPython,
  PyTorch: SiPytorch,
  React: SiReact,
  Redis: SiRedis,
  Rust: SiRust,
  Tauri: SiTauri,
  "Tauri 2.0": SiTauri,
  TypeScript: SiTypescript,
  YOLOv8: SiUltralytics,
};

interface TechIconProps {
  className?: string;
  name: string;
}

export default function TechIcon({ className, name }: TechIconProps) {
  const Icon = icons[name] ?? BsCpu;

  return <Icon aria-hidden="true" className={className} focusable="false" />;
}

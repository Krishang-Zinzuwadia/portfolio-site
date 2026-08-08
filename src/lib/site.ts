export const SITE_NAME = "Krishang Zinzuwadia";
export const SITE_ORIGIN = "https://portfolio.krishang.dev";
export const SITE_URL = new URL(`${SITE_ORIGIN}/`);

export const SITE_DESCRIPTION =
  "Hi, I’m Krishang. I study computer science at VIT Vellore and build local agent runtimes, offline tools, and desktop software in TypeScript, Python, and Rust.";

export const WORK_DESCRIPTION =
  "I’ve written up Helios, Quark, Scatterfield, Aisle, Atlas, OCS, and Hermes: what I built, what was difficult, and what is still unfinished.";

export function absoluteUrl(pathname: string = "/") {
  return new URL(pathname, SITE_URL).toString();
}

export const SITE_NAME = "Krishang Zinzuwadia";
export const SITE_ORIGIN = "https://portfolio.krishang.dev";
export const SITE_URL = new URL(`${SITE_ORIGIN}/`);

export const SITE_DESCRIPTION =
  "Krishang Zinzuwadia builds human-in-the-loop agents, local-first software, developer tools, and production systems across Python, Rust, and TypeScript.";

export const WORK_DESCRIPTION =
  "Seven evidence-backed engineering case studies documenting the systems Krishang Zinzuwadia built, the decisions he owned, and the recorded outcomes.";

export function absoluteUrl(pathname: string = "/") {
  return new URL(pathname, SITE_URL).toString();
}

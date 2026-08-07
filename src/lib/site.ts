export const SITE_NAME = "Krishang Zinzuwadia";
export const SITE_ORIGIN = "https://portfolio.krishang.dev";
export const SITE_URL = new URL(`${SITE_ORIGIN}/`);

export const SITE_DESCRIPTION =
  "Krishang Zinzuwadia builds human-in-the-loop agents, local-first software, developer tools, and production systems across Python, Rust, and TypeScript.";

export const WORK_DESCRIPTION =
  "Seven engineering case studies plus focused lab projects and verified open-source contributions by Krishang Zinzuwadia.";

export function absoluteUrl(pathname: string = "/") {
  return new URL(pathname, SITE_URL).toString();
}

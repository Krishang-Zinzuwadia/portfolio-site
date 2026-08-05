export const SITE_NAME = "Krishang Zinzuwadia";
export const SITE_ORIGIN = "https://portfolio.krishang.dev";
export const SITE_URL = new URL(`${SITE_ORIGIN}/`);

export const SITE_DESCRIPTION =
  "Krishang Zinzuwadia builds AI agents, full-stack products, and security tooling. Explore selected projects, engineering experience, and technical results.";

export const WORK_DESCRIPTION =
  "Detailed case studies of Krishang Zinzuwadia's work across local AI agents, multi-agent software delivery, and recruitment infrastructure.";

export function absoluteUrl(pathname: string = "/") {
  return new URL(pathname, SITE_URL).toString();
}

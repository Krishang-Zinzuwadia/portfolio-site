export const SITE_NAME = "Krishang Zinzuwadia";
export const SITE_ORIGIN = "https://portfolio.krishang.dev";
export const SITE_URL = new URL(`${SITE_ORIGIN}/`);

export const SITE_DESCRIPTION =
  "Krishang Zinzuwadia is a computer science student at VIT building agent infrastructure, local-first products, developer tools, and software in TypeScript, Python, and Rust.";

export const WORK_DESCRIPTION =
  "Seven projects by Krishang Zinzuwadia: Quark, Scatterfield, Aisle, Helios, Atlas, OCS, and Hermes.";

export function absoluteUrl(pathname: string = "/") {
  return new URL(pathname, SITE_URL).toString();
}

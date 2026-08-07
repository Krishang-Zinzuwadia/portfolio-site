export const SITE_NAME = "Krishang Zinzuwadia";
export const SITE_ORIGIN = "https://portfolio.krishang.dev";
export const SITE_URL = new URL(`${SITE_ORIGIN}/`);

export const SITE_DESCRIPTION =
  "I’m Krishang Zinzuwadia, a computer science student at VIT. I build agent systems, local-first applications, and developer tools in TypeScript, Python, and Rust.";

export const WORK_DESCRIPTION =
  "I wrote down how Quark, Scatterfield, Aisle, Helios, Atlas, OCS, and Hermes work, what I built, and the code I can share.";

export function absoluteUrl(pathname: string = "/") {
  return new URL(pathname, SITE_URL).toString();
}

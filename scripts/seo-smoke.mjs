import assert from "node:assert/strict";

const requestedBaseUrl = process.env.SEO_BASE_URL ?? "http://127.0.0.1:3000";
const baseUrl = new URL(requestedBaseUrl);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const read = async (pathname, options = {}) => {
  const url = new URL(pathname, baseUrl);
  const response = await fetch(url, {
    redirect: options.redirect ?? "follow",
    headers: {
      "user-agent":
        options.userAgent ??
        "Mozilla/5.0 (compatible; KrishangSeoSmoke/1.0; +https://portfolio.krishang.dev)",
    },
  });

  return {
    response,
    text: await response.text(),
    url,
  };
};

const expectStatus = (result, expected) => {
  assert.equal(
    result.response.status,
    expected,
    `${result.url.pathname} returned ${result.response.status}, expected ${expected}`
  );
};

const expectMatch = (text, pattern, message) => {
  assert.match(text, pattern, message);
};

const expectNoMatch = (text, pattern, message) => {
  assert.doesNotMatch(text, pattern, message);
};

const parseJsonLd = (text) =>
  [
    ...text.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ].map((match) => JSON.parse(match[1]));

const home = await read("/", { userAgent: "Googlebot" });
expectStatus(home, 200);
expectMatch(
  home.text,
  /<title>Krishang Zinzuwadia<\/title>/i,
  "Home title is wrong"
);
expectMatch(
  home.text,
  /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/portfolio\.krishang\.dev\/?["']/i,
  "Home canonical is missing or wrong"
);
expectMatch(
  home.text,
  /<h1[^>]*>[\s\S]*?Krishang Zinzuwadia[\s\S]*?<\/h1>/i,
  "Home needs a crawlable H1 containing the full name"
);
expectMatch(
  home.text,
  /href=["']\/mac["']/i,
  "Home must link to the Macintosh experience"
);
expectMatch(
  home.text,
  /href=["']\/work["']/i,
  "Home must link to the work index"
);
expectMatch(
  home.text,
  /type=["']application\/ld\+json["']/i,
  "Home must include JSON-LD"
);
expectMatch(
  home.text,
  /<meta[^>]+property=["']og:image["'][^>]+content=["']https:\/\/portfolio\.krishang\.dev\/opengraph-image\.jpg[^"']*["']/i,
  "Home Open Graph image must be absolute and canonical"
);
expectMatch(
  home.text,
  /<meta[^>]+name=["']twitter:image["'][^>]+content=["']https:\/\/portfolio\.krishang\.dev\/twitter-image\.jpg[^"']*["']/i,
  "Home Twitter image must be absolute and canonical"
);
const homeJsonLd = parseJsonLd(home.text);
assert.ok(homeJsonLd.length > 0, "Home structured data must be valid JSON");
const homeGraphTypes = new Set(
  homeJsonLd.flatMap((item) =>
    Array.isArray(item["@graph"])
      ? item["@graph"].map((entry) => entry["@type"])
      : [item["@type"]]
  )
);
for (const expectedType of ["WebSite", "ProfilePage", "Person"]) {
  assert.ok(
    homeGraphTypes.has(expectedType),
    `Home structured data is missing ${expectedType}`
  );
}

const mac = await read("/mac", { userAgent: "Googlebot" });
expectStatus(mac, 200);
expectMatch(
  mac.text,
  /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*follow[^"']*["']/i,
  "The immersive route must be noindex, follow"
);
expectMatch(
  mac.text,
  /href=["']\/["']/i,
  "The immersive route must link back to the main portfolio"
);

const editorial = await read("/editorial", { redirect: "manual" });
assert.ok(
  [301, 308].includes(editorial.response.status),
  `/editorial returned ${editorial.response.status}, expected a permanent redirect`
);
assert.equal(
  editorial.response.headers.get("location"),
  "/",
  "/editorial must redirect directly to /"
);

const robots = await read("/robots.txt");
expectStatus(robots, 200);
expectMatch(
  robots.text,
  /^Sitemap:\s*https:\/\/portfolio\.krishang\.dev\/sitemap\.xml$/im,
  "robots.txt must advertise the canonical sitemap"
);

const sitemap = await read("/sitemap.xml");
expectStatus(sitemap, 200);
expectMatch(
  sitemap.text,
  /<loc>https:\/\/portfolio\.krishang\.dev\/?<\/loc>/i,
  "Sitemap is missing home"
);
expectNoMatch(
  sitemap.text,
  /<loc>[^<]*\/mac<\/loc>/i,
  "Noindex Macintosh route must not be in sitemap"
);
expectNoMatch(
  sitemap.text,
  /<loc>[^<]*\/editorial<\/loc>/i,
  "Redirected editorial route must not be in sitemap"
);

const sitemapPaths = [
  ...sitemap.text.matchAll(
    /<loc>(https:\/\/portfolio\.krishang\.dev[^<]*)<\/loc>/gi
  ),
]
  .map((match) => new URL(match[1]).pathname)
  .filter((pathname, index, paths) => paths.indexOf(pathname) === index);

assert.ok(
  sitemapPaths.length >= 5,
  "Sitemap should include home, work, and all initial case studies"
);

const internalLinks = new Set();

for (const pathname of sitemapPaths) {
  const page = await read(pathname, { userAgent: "Googlebot" });
  expectStatus(page, 200);
  const canonicalPath = pathname === "/" ? "" : pathname;
  const canonicalPattern = new RegExp(
    `<link[^>]+rel=["']canonical["'][^>]+href=["']https:\\/\\/portfolio\\.krishang\\.dev${escapeRegExp(canonicalPath)}\\/?["']`,
    "i"
  );
  expectMatch(
    page.text,
    canonicalPattern,
    `${pathname} is missing a self-referencing canonical`
  );
  expectNoMatch(
    page.text,
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i,
    `${pathname} is in the sitemap but marked noindex`
  );
  expectMatch(
    page.text,
    /type=["']application\/ld\+json["']/i,
    `${pathname} is missing structured data`
  );
  const jsonLd = parseJsonLd(page.text);
  assert.ok(
    jsonLd.length > 0,
    `${pathname} structured data must be valid JSON`
  );

  if (pathname === "/work") {
    assert.ok(
      jsonLd.some((item) => item["@type"] === "CollectionPage"),
      "/work structured data must describe a CollectionPage"
    );
  } else if (pathname.startsWith("/work/")) {
    const graphTypes = new Set(
      jsonLd.flatMap((item) =>
        Array.isArray(item["@graph"])
          ? item["@graph"].map((entry) => entry["@type"])
          : [item["@type"]]
      )
    );
    for (const expectedType of ["WebPage", "BreadcrumbList", "CreativeWork"]) {
      assert.ok(
        graphTypes.has(expectedType),
        `${pathname} structured data is missing ${expectedType}`
      );
    }
  }

  for (const match of page.text.matchAll(
    /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi
  )) {
    const href = match[1];
    if (href.startsWith("#") || href.startsWith("mailto:")) continue;

    const target = new URL(href, baseUrl);
    if (target.origin === baseUrl.origin) {
      internalLinks.add(`${target.pathname}${target.search}`);
    }
  }
}

for (const pathname of internalLinks) {
  const target = await read(pathname);
  assert.ok(
    target.response.status >= 200 && target.response.status < 400,
    `Internal link ${pathname} returned ${target.response.status}`
  );
}

for (const pathname of [
  "/opengraph-image.jpg",
  "/twitter-image.jpg",
  "/icon.svg",
]) {
  const asset = await read(pathname);
  expectStatus(asset, 200);
  assert.match(
    asset.response.headers.get("content-type") ?? "",
    /^image\//i,
    `${pathname} must return an image content type`
  );
}

const missing = await read("/seo-smoke-definitely-missing", {
  userAgent: "Googlebot",
});
expectStatus(missing, 404);
expectMatch(
  missing.text,
  /<meta[^>]+name=["']robots["'][^>]+content=["']noindex["']/i,
  "404 must be noindex"
);
expectNoMatch(
  missing.text,
  /rel=["']canonical["']/i,
  "404 must not canonicalize to the homepage"
);
assert.equal(
  [...missing.text.matchAll(/<meta[^>]+name=["']robots["']/gi)].length,
  1,
  "404 must emit exactly one robots meta tag"
);

const invalidWork = await read("/work/not-a-real-project", {
  userAgent: "Googlebot",
});
expectStatus(invalidWork, 404);
expectMatch(
  invalidWork.text,
  /<h1[^>]*>[\s\S]*?nothing broadcasting here[\s\S]*?<\/h1>/i,
  "Invalid work routes must render the usable 404 without JavaScript"
);
expectNoMatch(
  invalidWork.text,
  /rel=["']canonical["']/i,
  "Invalid work routes must not inherit a canonical"
);

console.log(
  `SEO smoke checks passed for ${baseUrl.origin} (${sitemapPaths.length} canonical URLs).`
);

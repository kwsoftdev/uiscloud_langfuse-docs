import "server-only";
import { loader } from "fumadocs-core/source";
import {
  docs,
  docsKr,
  selfHosting,
  selfHostingKr,
  blog,
  changelog,
  guides,
  guidesKr,
  faq,
  faqKr,
  integrations,
  integrationsKr,
  security,
  securityKr,
  promptEngineering,
  promptEngineeringKr,
  library,
  customers,
  handbook,
  handbookKr,
  marketing,
  academy,
  academyJa,
  academyKr,
  workshop,
  resources,
  resourcesKr,
} from "fumadocs-mdx:collections/server";
import { CONTENT_DIR_TO_URL_PREFIX } from "./content-dir-map.js";

function baseUrl(contentDir: string): string {
  const prefix = CONTENT_DIR_TO_URL_PREFIX[contentDir];
  if (typeof prefix !== "string") {
    throw new Error(`Missing content-dir-map entry for "${contentDir}"`);
  }
  return prefix === "" ? "" : `/${prefix}`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shared page-tree transformer that replaces a node's sidebar name with
shortTitle ?? sidebarTitle from frontmatter when either field is set.
Registered via pageTree.transformers in each loader so layouts call
.getPageTree() directly with no post-processing required. */
const shortTitleTransformer: any = {
  file(node: any, filePath?: string): any {
    if (!filePath) return node;
    const page = (this as any).storage.read(filePath) as
      | { data?: { shortTitle?: string; sidebarTitle?: string } }
      | undefined;
    if (!page) return node;
    const label = page.data?.shortTitle ?? page.data?.sidebarTitle;
    return typeof label === "string" ? { ...node, name: label } : node;
  },
};

/**
 * Transformer that re-types meta.json link shortcuts (e.g. `[Text](url)`) from
 * `type: "page"` to `type: "link"`.
 *
 * Without this, fumadocs' `searchPath` walks the tree depth-first and stops at
 * the first node whose URL matches the current pathname. A shortcut link placed
 * near the top of the tree can be found before the real page node nested inside
 * a folder, so `searchPath` returns a path that contains no folder ancestors —
 * meaning those folders never expand in the sidebar.
 *
 * Changing the type to "link" makes `searchPath` skip these nodes (its matcher
 * is `node.type === "page"`), so the real page node inside the folder is found
 * and its ancestor folders open correctly. The shortcut still renders as a
 * clickable sidebar link and still shows as visually active via the direct
 * `isActive(url, pathname)` comparison in the sidebar item renderer.
 *
 * Link shortcut nodes have no backing MDX file, so `filePath` is `undefined` in
 * the transformer — that is how they are distinguished from real content pages.
 */
const shortcutLinkTransformer: any = {
  file(node: any, filePath?: string): any {
    // Only link shortcuts have no backing file
    if (filePath) return node;
    return { ...node, type: "link" };
  },
};

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------
export const source = loader({
  baseUrl: baseUrl("docs"),
  source: docs.toFumadocsSource(),
  pageTree: {
    idPrefix: "docs",
    transformers: [shortcutLinkTransformer, shortTitleTransformer],
  },
});

export const docsKrSource = loader({
  baseUrl: "/docs/kr",
  source: docsKr.toFumadocsSource(),
  pageTree: { idPrefix: "docs-kr", transformers: [shortTitleTransformer] },
});

export const selfHostingSource = loader({
  baseUrl: baseUrl("self-hosting"),
  source: selfHosting.toFumadocsSource(),
  pageTree: { idPrefix: "self-hosting", transformers: [shortTitleTransformer] },
});

export const selfHostingKrSource = loader({
  baseUrl: "/self-hosting/kr",
  source: selfHostingKr.toFumadocsSource(),
  pageTree: {
    idPrefix: "self-hosting-kr",
    transformers: [shortTitleTransformer],
  },
});

export const blogSource = loader({
  baseUrl: baseUrl("blog"),
  source: blog.toFumadocsSource(),
});

export const changelogSource = loader({
  baseUrl: baseUrl("changelog"),
  source: changelog.toFumadocsSource(),
});

export const guidesSource = loader({
  baseUrl: baseUrl("guides"),
  source: guides.toFumadocsSource(),
  pageTree: { idPrefix: "guides", transformers: [shortTitleTransformer] },
});

// Korean translation pilot — sub-collection of `guides`, same rationale as
// `academyJaSource` above: baseUrl is a literal nested path so URLs sit under
// /guides/kr/ instead of requiring a /<locale> prefix.
export const guidesKrSource = loader({
  baseUrl: "/guides/kr",
  source: guidesKr.toFumadocsSource(),
  pageTree: { idPrefix: "guides-kr", transformers: [shortTitleTransformer] },
});

export const faqSource = loader({
  baseUrl: baseUrl("faq"),
  source: faq.toFumadocsSource(),
  pageTree: { transformers: [shortTitleTransformer] },
});

export const faqKrSource = loader({
  baseUrl: "/faq/kr",
  source: faqKr.toFumadocsSource(),
  pageTree: { idPrefix: "faq-kr", transformers: [shortTitleTransformer] },
});

export const integrationsSource = loader({
  baseUrl: baseUrl("integrations"),
  source: integrations.toFumadocsSource(),
  pageTree: { idPrefix: "integrations", transformers: [shortTitleTransformer] },
});

export const integrationsKrSource = loader({
  baseUrl: "/integrations/kr",
  source: integrationsKr.toFumadocsSource(),
  pageTree: {
    idPrefix: "integrations-kr",
    transformers: [shortTitleTransformer],
  },
});

export const securitySource = loader({
  baseUrl: baseUrl("security"),
  source: security.toFumadocsSource(),
  pageTree: { transformers: [shortTitleTransformer] },
});

export const securityKrSource = loader({
  baseUrl: "/security/kr",
  source: securityKr.toFumadocsSource(),
  pageTree: { idPrefix: "security-kr", transformers: [shortTitleTransformer] },
});

export const promptEngineeringSource = loader({
  baseUrl: baseUrl("prompt-engineering"),
  source: promptEngineering.toFumadocsSource(),
  pageTree: {
    idPrefix: "prompt-engineering",
    transformers: [shortTitleTransformer],
  },
});

export const promptEngineeringKrSource = loader({
  baseUrl: "/prompt-engineering/kr",
  source: promptEngineeringKr.toFumadocsSource(),
  pageTree: {
    idPrefix: "prompt-engineering-kr",
    transformers: [shortTitleTransformer],
  },
});

export const librarySource = loader({
  baseUrl: baseUrl("library"),
  source: library.toFumadocsSource(),
  pageTree: { idPrefix: "library", transformers: [shortTitleTransformer] },
});

export const usersSource = loader({
  baseUrl: baseUrl("customers"),
  source: customers.toFumadocsSource(),
});

export const handbookSource = loader({
  baseUrl: baseUrl("handbook"),
  source: handbook.toFumadocsSource(),
  pageTree: { transformers: [shortTitleTransformer] },
});

export const handbookKrSource = loader({
  baseUrl: "/handbook/kr",
  source: handbookKr.toFumadocsSource(),
  pageTree: { idPrefix: "handbook-kr", transformers: [shortTitleTransformer] },
});

export const academySource = loader({
  baseUrl: baseUrl("academy"),
  source: academy.toFumadocsSource(),
  pageTree: { idPrefix: "academy", transformers: [shortTitleTransformer] },
});

// Japanese academy is implemented as a separate collection rather than via
// Fumadocs i18n, so URLs sit naturally under /academy/japan/ instead of
// requiring a /<locale> prefix. baseUrl is a literal nested path (not the
// baseUrl() helper) because this is a sub-collection of academy, not a
// top-level content dir, so it has no content-dir-map entry. Fumadocs splits
// baseUrl on "/", so a multi-segment value yields /academy/japan/<slug>.
export const academyJaSource = loader({
  baseUrl: "/academy/japan",
  source: academyJa.toFumadocsSource(),
  pageTree: { idPrefix: "academy-ja", transformers: [shortTitleTransformer] },
});

export const academyKrSource = loader({
  baseUrl: "/academy/kr",
  source: academyKr.toFumadocsSource(),
  pageTree: { idPrefix: "academy-kr", transformers: [shortTitleTransformer] },
});

export const workshopSource = loader({
  baseUrl: baseUrl("workshop"),
  source: workshop.toFumadocsSource(),
  pageTree: { idPrefix: "workshop", transformers: [shortTitleTransformer] },
});

export const resourcesSource = loader({
  baseUrl: baseUrl("resources"),
  source: resources.toFumadocsSource(),
  pageTree: { idPrefix: "resources", transformers: [shortTitleTransformer] },
});

export const resourcesKrSource = loader({
  baseUrl: "/resources/kr",
  source: resourcesKr.toFumadocsSource(),
  pageTree: {
    idPrefix: "resources-kr",
    transformers: [shortTitleTransformer],
  },
});

export const marketingSource = loader({
  baseUrl: baseUrl("marketing"),
  source: marketing.toFumadocsSource(),
});

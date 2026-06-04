import type { MetadataRoute } from "next";
import { TOPICS } from "./data/topics";
import { BLOG_POSTS } from "./blog/posts";

// Sitemap is GENERATED, not hand-maintained.
//
// Dynamic route sets (training modules under /[module], blog posts under
// /blog/[slug]) are derived from their source data files, so adding a topic
// or a post automatically appears here. Static routes are listed explicitly
// below; when you add a new static page, add it to STATIC_ROUTES so it can't
// silently drift out of the sitemap the way the old hand-maintained list did.

const BASE = "https://medeor.app";

// Content date floor. Bump when meaningful content changes ship.
const UPDATED = "2026-06-03";

type Freq = "weekly" | "monthly";

interface StaticRoute {
  path: string;
  changeFrequency: Freq;
  priority: number;
}

// Every static (non-dynamic) route with a page.tsx, minus:
//   /[module] and /blog/[slug]  - dynamic, generated below
//   /pfc                        - 308 redirect to /pcc/card, not indexable
const STATIC_ROUTES: StaticRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },

  // Reference
  { path: "/meds", changeFrequency: "monthly", priority: 0.9 },
  { path: "/cpgs", changeFrequency: "weekly", priority: 0.9 },
  { path: "/videos", changeFrequency: "monthly", priority: 0.8 },
  { path: "/rmh", changeFrequency: "monthly", priority: 0.8 },
  { path: "/reference", changeFrequency: "monthly", priority: 0.8 },
  { path: "/table8", changeFrequency: "monthly", priority: 0.8 },

  // PCC
  { path: "/pcc", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pcc/meds", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pcc/skills", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pcc/wound", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pcc/cpgs", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pcc/card", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pcc/nursing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pcc/vent", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pcc/trouble", changeFrequency: "monthly", priority: 0.9 },

  // Tools
  { path: "/tools", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools/documentation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools/documentation/sf600", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/documentation/dd1380", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tools/documentation/aar", changeFrequency: "monthly", priority: 0.8 },

  // Blog index + utility
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: UPDATED,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Training modules: /[module] resolves by topic id.
  const moduleEntries: MetadataRoute.Sitemap = TOPICS.map((t) => ({
    url: `${BASE}/${t.id}`,
    lastModified: UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Blog posts: /blog/[slug].
  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map(
    (p: { slug: string }) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }),
  );

  return [...staticEntries, ...moduleEntries, ...blogEntries];
}

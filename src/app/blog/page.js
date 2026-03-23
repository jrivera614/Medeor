import { BLOG_POSTS } from "./posts";
import BlogIndex from "./BlogIndex";

export const metadata = {
  title: "Blog - Medeor | TCCC Training Articles & Guides",
  description: "Free TCCC, CLS, and PFC training articles. MARCH protocol guides, tourniquet application, needle decompression, cricothyrotomy, and prolonged field care resources for combat medics.",
  alternates: { canonical: "https://medeor.app/blog" },
};

export default function BlogPage() {
  return <BlogIndex posts={BLOG_POSTS} />;
}

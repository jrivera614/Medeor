import { BLOG_POSTS } from "../posts";
import BlogPost from "./BlogPost";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} | Medeor`,
    description: post.description,
    alternates: { canonical: `https://medeor.app/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://medeor.app/blog/${post.slug}`,
      publishedTime: post.date,
    },
    other: {
      "article:published_time": post.date,
    },
  };
}

export default function BlogPostPage({ params }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return <div>Post not found</div>;
  return <BlogPost post={post} />;
}

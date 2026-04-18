import type { Metadata } from "next";
import { BLOG_POSTS } from "../posts";
import BlogPost from "./BlogPost";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return <div>Post not found</div>;
  return <BlogPost post={post} />;
}

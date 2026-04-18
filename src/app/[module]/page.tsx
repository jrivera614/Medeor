import type { Metadata } from "next";
import ModuleClient from "./ModuleClient";
import { TOPICS } from "../data";

interface ModulePageProps {
  params: Promise<{ module: string }>;
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { module } = await params;
  const topic = TOPICS.find(t => t.id === module);
  if (!topic?.seo) return { title: "Training Module | Medeor" };
  return {
    title: topic.seo.title,
    description: topic.seo.description,
    openGraph: { title: topic.seo.title, description: topic.seo.description, url: `https://medeor.app/${module}` },
    alternates: { canonical: `https://medeor.app/${module}` },
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { module } = await params;
  const topic = TOPICS.find(t => t.id === module);

  return (
    <>
      {topic?.seo && (
        <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }} aria-hidden="true">
          <h1>{topic.seo.heading}</h1>
          <p>{topic.seo.intro}</p>
          <ul>
            {topic.seo.ssrTopics.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p>{topic.seo.keywords}</p>
        </div>
      )}
      <ModuleClient />
    </>
  );
}

import VideoClient from "./VideoClient";

export const metadata = {
  title: "TCCC Skill Videos - 31 Deployed Medicine Training Videos | Medeor",
  description: "31 Deployed Medicine TCCC training videos organized by module. Tourniquet application, wound packing, chest seals, needle decompression, cricothyrotomy, airway management, and more.",
  openGraph: { title: "TCCC Skill Videos | Medeor", url: "https://medeor.app/videos" },
  alternates: { canonical: "https://medeor.app/videos" },
};

export default function VideoPage() { return <VideoClient />; }

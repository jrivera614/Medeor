import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

// Legacy /pfc route retires. Permanent redirect to /pcc/card preserves
// existing bookmarks, inbound links, and SEO equity. Using
// permanentRedirect() emits a 308, which instructs search engines to
// transfer ranking signals to the new URL.

export const metadata: Metadata = {
  title: "PCC Casualty Card | Medeor",
  description: "Redirecting to the PCC Casualty Card.",
  robots: { index: false, follow: true },
};

export default function PfcLegacyPage(): never {
  permanentRedirect("/pcc/card");
}

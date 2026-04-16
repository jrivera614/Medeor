export default function sitemap() {
  const base = 'https://medeor.app';
  // Use actual content modification dates, not build time.
  // Update these when content actually changes.
  const launched = '2026-03-23';
  const updated = '2026-03-27';

  return [
    // Core
    { url: base, lastModified: updated, changeFrequency: 'weekly', priority: 1 },

    // Training modules
    { url: `${base}/march`, lastModified: updated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/epaws`, lastModified: launched, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/ravines`, lastModified: launched, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/hemorrhage`, lastModified: updated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/airway`, lastModified: updated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/wbb`, lastModified: launched, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pfc-scenarios`, lastModified: launched, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/pfc-meds`, lastModified: launched, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/shock`, lastModified: launched, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/longitudinal`, lastModified: launched, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pfc-procedures`, lastModified: updated, changeFrequency: 'monthly', priority: 0.9 },

    // Reference content
    { url: `${base}/meds`, lastModified: updated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/cpgs`, lastModified: launched, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/videos`, lastModified: launched, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/rmh`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reference`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/table8`, lastModified: launched, changeFrequency: 'monthly', priority: 0.8 },

    // PCC
    { url: `${base}/pcc`, lastModified: updated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/pcc/card`, lastModified: updated, changeFrequency: 'monthly', priority: 0.9 },

    // Blog
    { url: `${base}/blog`, lastModified: launched, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/free-tccc-practice-quiz`, lastModified: launched, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/march-protocol-steps`, lastModified: launched, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/how-to-apply-tourniquet-cat-gen7`, lastModified: launched, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/needle-chest-decompression-guide`, lastModified: launched, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/prolonged-field-care-guide`, lastModified: launched, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/tccc-changes-2024-2025-airway-antibiotics`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/tccc-practice-test-2026`, lastModified: updated, changeFrequency: 'monthly', priority: 0.8 },
  ];
}

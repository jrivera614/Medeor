export default function sitemap() {
  const base = 'https://medeor.app';
  const now = new Date();
  return [
    // Core
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },

    // Training modules -- high value content
    { url: `${base}/march`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/epaws`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/ravines`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/hemorrhage`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/airway`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/wbb`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pfc-scenarios`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Reference content
    { url: `${base}/cpgs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/videos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/rmh`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reference`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/table8`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Blog
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/free-tccc-practice-quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/march-protocol-steps`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/how-to-apply-tourniquet-cat-gen7`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/needle-chest-decompression-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/prolonged-field-care-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // REMOVED: /pfc (tool/form), /tools (calculators/nav), /contact, /privacy, /terms
    // These trigger AdSense "screens without publisher content" violation
  ];
}

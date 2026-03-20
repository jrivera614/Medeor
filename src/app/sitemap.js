export default function sitemap() {
  const base = 'https://medeor.app';
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/march`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/epaws`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/ravines`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/hemorrhage`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/airway`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/wbb`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pfc-scenarios`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/cpgs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/videos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/rmh`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
}

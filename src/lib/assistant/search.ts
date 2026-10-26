// Retrieval for the website assistant: BM25 over small knowledge chunks, in process.
// The model calls search_knowledge and gets only the few chunks that match, never the whole site.
// No "@/" imports here, so `node --test` can load this file directly.

export type Chunk = {
  /** Stable identifier, e.g. "concept:recognition-treaty". */
  id: string;
  title: string;
  /** Where to read more: a page on www.genesismesh.org, the docs, or a repository. */
  url: string;
  text: string;
  /** Extra words that should find this chunk (synonyms, product names). */
  keywords?: string;
};

const STOP = new Set(
  ("a an and are as at be by can do does for from has have how i if in into is it its me my of on or our " +
    "so than that the their them then there these they this to us was we what when where which who why will with " +
    "you your about tell explain please").split(" "),
);

export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith("ies") ? `${t.slice(0, -3)}y` : t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t));
}

export type Index = {
  chunks: Chunk[];
  docs: Map<string, number>[];
  lengths: number[];
  avg: number;
  df: Map<string, number>;
};

export function buildIndex(chunks: Chunk[]): Index {
  const docs = chunks.map((c) => {
    const counts = new Map<string, number>();
    // Titles and keywords count three times: a match there is a strong signal.
    for (const [text, weight] of [[c.title, 3], [c.keywords ?? "", 3], [c.text, 1]] as const) {
      for (const t of tokens(text)) counts.set(t, (counts.get(t) ?? 0) + weight);
    }
    return counts;
  });
  const lengths = docs.map((d) => [...d.values()].reduce((a, b) => a + b, 0));
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  return { chunks, docs, lengths, avg: lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length), df };
}

export type Hit = { id: string; title: string; url: string; text: string; score: number };

/** The best matching chunks for a query, highest first; none when nothing matches. */
export function search(index: Index, query: string, limit = 5): Hit[] {
  const terms = [...new Set(tokens(query))];
  if (!terms.length) return [];
  const n = index.chunks.length;
  const k1 = 1.4;
  const b = 0.75;
  const scored = index.docs.map((doc, i) => {
    let score = 0;
    for (const t of terms) {
      const f = doc.get(t);
      if (!f) continue;
      const df = index.df.get(t) ?? 0;
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * index.lengths[i]) / index.avg));
    }
    return { i, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, limit)
    .map(({ i, score }) => {
      const c = index.chunks[i];
      return { id: c.id, title: c.title, url: c.url, text: c.text.slice(0, 1200), score: Math.round(score * 100) / 100 };
    });
}

export const searchTool = {
  type: "function",
  function: {
    name: "search_knowledge",
    description:
      "Search the Genesis Mesh website, documentation pointers, SDKs, repositories, concepts, videos and articles. Returns the few most relevant passages, each with a URL. Call it before answering any question about Genesis Mesh, with a short query in English; call it again with other words if the first results do not answer.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { query: { type: "string", description: "A few keywords, e.g. 'recognition treaty revocation'" } },
      required: ["query"],
    },
  },
} as const;

/**
 * JSON-LD for a `<script type="application/ld+json">` element. `<` is written
 * as its JSON escape, so no string in the data can end the element early.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

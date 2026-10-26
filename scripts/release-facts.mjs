#!/usr/bin/env node
/**
 * Refresh src/generated/release.json from the facts the core docs build
 * publishes on every main push (the release version and the collected test
 * count), so the assistant names the current release. Runs before every build.
 *
 * If the docs site cannot be reached, the committed file is kept and the build
 * warns instead of failing an unrelated deploy. A Renovate pull request moves
 * the committed version when a release is published, which rebuilds the site.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const TARGET = join(ROOT, "src", "generated", "release.json");
const SOURCE = "https://docs.genesismesh.org/release-facts.json";

const valid = (facts) =>
  facts && typeof facts.version === "string" && /^\d+\.\d+\.\d+$/.test(facts.version) && Number.isInteger(facts.tests) && facts.tests > 0;

const current = JSON.parse(readFileSync(TARGET, "utf8"));
if (!valid(current)) {
  console.error(`release-facts: ${TARGET} is invalid`);
  process.exit(1);
}

try {
  const response = await fetch(SOURCE, { signal: AbortSignal.timeout(10_000), cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const facts = await response.json();
  if (!valid(facts)) throw new Error("unexpected content");
  const next = { version: facts.version, tests: facts.tests, source: SOURCE };
  writeFileSync(TARGET, JSON.stringify(next, null, 2) + "\n");
  console.log(`release-facts: v${next.version}, ${next.tests} tests`);
} catch (error) {
  console.warn(
    `release-facts: WARNING could not read ${SOURCE} (${error.message}); keeping v${current.version} from the committed file`,
  );
}

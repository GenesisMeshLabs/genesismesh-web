/** Evidence snapshot: never relabel these findings with the latest release automatically. */
export const visionReview = {
  date: "2026-11-05",
  displayDate: "5 November 2026",
  coreVersion: "1.9.1",
  coreCommit: "a54b2d81f205c9b0203158f846f7ad44dc677063",
  original: "https://claude.ai/artifact/ParjPaubYJkVdkWcaCx4pt",
};

const core = `https://github.com/GenesisMeshLabs/genesismesh/blob/${visionReview.coreCommit}`;
const connect = "https://github.com/GenesisMeshLabs/genesismesh-connect/blob/5e0f2327ddde4b0c3249eb90d2dfca183849cb61";
const gateway = "https://github.com/GenesisMeshLabs/gateway/blob/2e6486ee6a6481adca1be3b9dae70a4ef32036f9";
const mcp = "https://github.com/GenesisMeshLabs/genesismesh-mcp/blob/ca43d5fcb5bb0c66f8908c5666a998c25cc08a58";

export const visionSources = {
  core: { label: "Core 1.9.1 source", href: `${core}/README.md` },
  treaties: { label: "Recognition treaty semantics", href: `${core}/docs/rfcs/rfc-002-recognition-treaties.md` },
  oversight: { label: "Human oversight: current interface", href: `${core}/docs/examples/human-oversight.md` },
  grants: { label: "Offline grants and fallback policy", href: `${core}/docs/operations/grants.md` },
  delegation: { label: "Delegation chain boundaries", href: `${core}/docs/examples/delegation-chain.md` },
  interoperability: { label: "Interoperability and conformance", href: `${core}/docs/development/interoperability.md` },
  claims: { label: "Attestation claim gate", href: `${core}/genesis_mesh/trust/context/registry.py#L625` },
  spiffe: { label: "SPIFFE mapping boundaries", href: `${core}/genesis_mesh/interop/spiffe.py` },
  vc: { label: "Verifiable Credential mapping boundaries", href: `${core}/genesis_mesh/interop/w3c_vc.py` },
  jwt: { label: "Signed JWT bridge", href: `${core}/genesis_mesh/interop/jose.py` },
  connect: { label: "Connect: everyday workflow", href: `${connect}/docs/everyday-workflow.md` },
  services: { label: "Connect: TCP sharing and limits", href: `${connect}/docs/service-sharing.md` },
  receipts: { label: "Connect: receipt semantics", href: `${connect}/docs/protected-read.md` },
  gateway: { label: "Gateway: federation and its limits", href: `${gateway}/docs/federation.md` },
  mcp: { label: "MCP: OAuth and scoped tools", href: `${mcp}/docs/http-transport.md` },
  replay: { label: "MCP: uncertain execution and replay", href: `${mcp}/docs/workflows.md` },
  sdkTypescript: { label: "TypeScript SDK 1.9.1", href: "https://github.com/GenesisMeshLabs/sdk-typescript/tree/8154ca7ac459ffbcd22d35900ca72f8093165bfc" },
  sdkGo: { label: "Go SDK 1.9.1", href: "https://github.com/GenesisMeshLabs/sdk-go/tree/ade949888eacd0ccc16126941427e1211f82aec8" },
  sdkRust: { label: "Rust SDK 1.9.1", href: "https://github.com/GenesisMeshLabs/sdk-rust/tree/b67c248717d5d99aca6f4dad320692f3f6c07c69" },
  sdkDotnet: { label: ".NET SDK 1.9.1", href: "https://github.com/GenesisMeshLabs/sdk-dotnet/tree/241d99b7508b378ce7c613dfc0baeed7cc5df56c" },
  wlcg: { label: "CERN: who can use WLCG", href: "https://wlcg.web.cern.ch/using-wlcg/who-can-use-wlcg" },
  ray: { label: "Ray: existing job submission", href: "https://docs.ray.io/en/latest/cluster/running-applications/job-submission/index.html" },
  openziti: { label: "OpenZiti: identities", href: "https://openziti.io/docs/learn/core-concepts/identities/overview/" },
};

export type VisionSource = { label: string; href: string };

export const reviewNotes = [
  "Delegation permits an equal or narrower capability set; it does not yet attenuate arbitrary parameters, budgets or use counts along a chain.",
  "Recognition-path depth is not bounded in the reviewed core. Bounded paths are a requirement of the proposed scale design.",
  "Core grants can optionally use an explicitly configured break-glass fallback. The cross-owner journey proposed here requires fail-closed behavior with no emergency fallback.",
  "SDK conformance coverage varies by supported surface. Portable artifact helpers do not imply an authority approval endpoint, single-use enforcement or a Connect approval screen.",
  "The Rust HTTP trust gateway is an existing component. A remote-desktop gateway and a sandboxed compute runner are separate proposed integrations.",
];

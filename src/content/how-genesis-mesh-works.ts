/**
 * "How Genesis Mesh Works": one shared model behind three views.
 *
 * Every concept and relationship is declared exactly once. The Foundation,
 * Governed Action, and Full Model views are filters over this data, so the
 * explanations never drift between views.
 *
 * Copy is taken from the How Genesis Mesh Works guide; do not paraphrase
 * definitions here without updating the source guide as well.
 */

export type StoryId = "foundation" | "governed-action";
export type ViewId = StoryId | "full-model";

/** A paragraph, a small `text` diagram, or a highlighted quote. */
export type Block = string | { code: string[] } | { quote: string[] };

export type Concept = {
  /** URL fragment, e.g. `/foundation#recognition-treaty`. */
  id: string;
  name: string;
  /** `system` concepts (Genesis Mesh itself) appear in every view. */
  story: StoryId | "system";
  /** Short label shown on the map, lifted from the guide's own wording. */
  tagline: string;
  whatItIs: Block[];
  whereItFits: Block[];
  analogy: Block[];
  note?: { title: string; body: Block[] };
  /** Anchor on the Genesis Mesh glossary page, when the term has an entry. */
  glossaryAnchor?: string;
};

export type RelationKind =
  /** The main chain of a story. Always drawn, animated. */
  | "flow"
  /** A concept to one of its detail concepts. Drawn when the cluster is expanded. */
  | "detail"
  /** Connects the Foundation story to the Governed Action story. Full Model only. */
  | "bridge"
  /** A secondary link, drawn only while one of its ends is focused. */
  | "reference";

export type Relation = {
  from: string;
  to: string;
  label: string;
  kind: RelationKind;
  /** One of the few relationships labelled on the map by default. */
  primary?: boolean;
};

export type StageNode = {
  id: string;
  /** Step of the story this node represents, shown on the node itself. */
  tag?: string;
  /** Horizontal centre within the lane, 0–1. Defaults to an even spread. */
  at?: number;
  /** Detail concepts revealed when this node (or group) is expanded. */
  details?: string[];
  /** Heading shown above the revealed details. */
  detailsLabel?: string;
};

export type Stage = {
  id: string;
  /** Row heading, taken from the guide's simplified view. */
  label?: string;
  /** Draw the simplified view's "↓" from the previous row into this one. */
  continues?: boolean;
  nodes: StageNode[];
};

/** A layout-only cluster of detail concepts; it has no explanation of its own. */
export type Group = {
  id: string;
  name: string;
};

export type Story = {
  id: StoryId;
  label: string;
  title: string;
  /** Concept opened from the lane frame label. */
  frameConcept: string;
  /** Where the guided read starts. */
  startConcept: string;
  intro: Block[];
  stages: Stage[];
};

export type MentalModelStep = {
  question: string;
  concepts: string[];
};

export type ViewMeta = {
  id: ViewId;
  label: string;
  path: string;
  title: string;
  description: string;
};

export const howItWorksBasePath = "/concepts/how-genesis-mesh-works";

export const howItWorksViews: ViewMeta[] = [
  {
    id: "foundation",
    label: "Foundation",
    path: `${howItWorksBasePath}/foundation`,
    title: "Genesis Mesh Foundation",
    description:
      "Where trust comes from, how participants join, how authority is delegated, and how independent domains recognize each other.",
  },
  {
    id: "governed-action",
    label: "Governed Action",
    path: `${howItWorksBasePath}/governed-action`,
    title: "From Request to Verifiable Action",
    description:
      "How identity, policy, decisions, execution, and evidence work together when a real action is requested.",
  },
  {
    id: "full-model",
    label: "Full Model",
    path: `${howItWorksBasePath}/full-model`,
    title: "How It All Fits Together",
    description:
      "How the foundation establishes trust, and how that trust governs a real action from identity through policy, decision, execution, and evidence.",
  },
];

export const howItWorksPage = {
  eyebrow: "Concepts",
  title: "How Genesis Mesh Works",
  lead: "Genesis Mesh is easier to understand as a connected trust model than as a list of isolated terms.",
  hint: "Select any concept to see what it is, where it fits, and a real-world analogy.",
  textIndexTitle: "Explore all concepts as text",
};

export const whereToStart = {
  title: "Where to start",
  steps: [
    { label: "Read the foundation story", href: `${howItWorksBasePath}/foundation`, external: false },
    { label: "Follow a governed action", href: `${howItWorksBasePath}/governed-action`, external: false },
    { label: "Try it on the live mesh", href: "https://mesh.genesismesh.org", external: true },
  ],
};

export const fullModelIntro: { lead: string[]; chain: string[] } = {
  lead: [
    "The Foundation explains where trust comes from and how it can extend across participants and organizations.",
    "The Governed Action story explains how that trust is used for one concrete action.",
  ],
  chain: [
    "Sovereign trust",
    "Identity and recognition",
    "Request",
    "Policy",
    "Signed decision",
    "Execution",
    "Signed evidence",
    "Verifiable history",
  ],
};

export const mentalModel: { title: string; outro: string; steps: MentalModelStep[] } = {
  title: "A useful mental model",
  outro: "That sequence is the bridge between the Genesis Mesh foundation and real-world use.",
  steps: [
    {
      question: "Who are you?",
      concepts: ["membership-attestation", "node", "agent"],
    },
    {
      question: "What authority do you have?",
      concepts: [
        "network-authority",
        "agreement-record",
        "delegated-agreement-record",
        "recognition-treaty",
        "recognition-policy",
        "membership-attestation",
      ],
    },
    {
      question: "What are you asking to do?",
      concepts: ["context-record"],
    },
    {
      question: "Which rules apply?",
      concepts: ["boundary-policy", "gate"],
    },
    {
      question: "Is it allowed?",
      concepts: ["boundary-engine", "boundary-decision"],
    },
    {
      question: "Why?",
      concepts: ["justification-proof", "policy-binding", "attestation-binding", "boundary-decision"],
    },
    {
      question: "Who executed it?",
      concepts: ["executor-identity"],
    },
    {
      question: "What actually happened?",
      concepts: ["execution-evidence"],
    },
    {
      question: "Can we prove the complete history later?",
      concepts: ["evidence-store", "resource-chain", "evidence-chain"],
    },
  ],
};

export const groups: Group[] = [
  { id: "advanced-authorization", name: "Advanced Authorization" },
  { id: "trust-observability", name: "Trust Observability" },
  { id: "technical-foundations", name: "Technical Foundations" },
  {
    id: "supporting",
    name: "Supporting concepts",
  },
];

export const stories: Story[] = [
  {
    id: "foundation",
    label: "Foundation",
    title: "Genesis Mesh Foundation",
    frameConcept: "sovereign",
    startConcept: "sovereign",
    intro: [
      "This section explains the trust foundation underneath Genesis Mesh.",
      "A simplified view is:",
      {
        code: [
          "Root Sovereign",
          "      ↓",
          "Genesis Block",
          "      ↓",
          "Network Authority",
          "      ↓",
          "Identity, Nodes, Agreements, Recognition",
          "      ↓",
          "Delegation, Revocation, Federation",
          "      ↓",
          "Advanced authorization and trust observability",
        ],
      },
      "The central idea is simple:",
      {
        quote: [
          "Each trust domain keeps control of its own identity, policies, keys, and decisions, while still being able to cooperate with other domains under explicit and verifiable rules.",
        ],
      },
    ],
    stages: [
      { id: "root", nodes: [{ id: "root-sovereign", at: 0.4 }] },
      {
        id: "genesis",
        nodes: [{ id: "genesis-block", at: 0.4 }, { id: "operator-key", at: 0.84 }],
      },
      { id: "authority", nodes: [{ id: "network-authority", at: 0.4 }] },
      {
        id: "participants",
        label: "Identity, Nodes, Agreements, Recognition",
        nodes: [
          { id: "node", details: ["invite-token", "join-certificate", "crl"] },
          { id: "agent" },
          { id: "agreement-record" },
          { id: "recognition-treaty", details: ["recognition-policy"] },
        ],
      },
      {
        id: "extension",
        label: "Delegation, Revocation, Federation",
        nodes: [
          { id: "delegated-agreement-record", at: 0.625 },
          { id: "sovereign-revocation-feed", at: 0.875, details: ["freshness-proof"] },
        ],
      },
      {
        id: "advanced",
        continues: true,
        nodes: [
          {
            id: "advanced-authorization",
            details: [
              "ibct",
              "human-oversight",
              "consensus-authorization",
              "selective-disclosure",
              "model-attestation",
            ],
          },
          { id: "trust-observability", details: ["recognition-graph", "connectome"] },
          { id: "technical-foundations", details: ["policy-manifest", "canonical-json"] },
        ],
      },
    ],
  },
  {
    id: "governed-action",
    label: "Governed Action",
    title: "From Request to Verifiable Action",
    frameConcept: "governed-action",
    startConcept: "membership-attestation",
    intro: [
      "This section explains how Genesis Mesh handles a real governed action.",
      "The action could be changing infrastructure, granting data access, rotating a credential, calling an external API, executing an AI agent tool, modifying a production resource, or another sensitive operation.",
      {
        quote: [
          "Can we prove who was trusted, what was requested, which rules applied, why the action was allowed, who executed it, and what actually happened?",
        ],
      },
    ],
    stages: [
      {
        id: "inputs",
        nodes: [
          { id: "membership-attestation", tag: "Identity", at: 1 / 6 },
          { id: "context-record", tag: "Requested action", at: 3 / 6 },
          { id: "boundary-policy", tag: "Rules", at: 5 / 6 },
        ],
      },
      {
        id: "gates",
        nodes: [
          {
            id: "gate",
            at: 5 / 6,
            details: ["gate-registry", "observe-mode", "enforce-mode"],
          },
        ],
      },
      {
        id: "evaluation",
        nodes: [{ id: "boundary-engine", tag: "Evaluation", at: 0.5 }],
      },
      {
        id: "decision",
        nodes: [
          {
            id: "boundary-decision",
            tag: "Decision",
            at: 0.5,
            details: ["policy-binding", "attestation-binding", "justification-proof"],
            detailsLabel: "Reason",
          },
        ],
      },
      {
        id: "execution",
        nodes: [{ id: "executor-identity", tag: "Execution", at: 0.5 }],
      },
      {
        id: "outcome",
        nodes: [
          { id: "execution-evidence", tag: "Outcome", at: 0.5, details: ["execution-recorder"] },
        ],
      },
      {
        id: "history",
        nodes: [
          {
            id: "evidence-store",
            tag: "History",
            at: 0.5,
            details: ["resource-id", "resource-chain", "evidence-chain", "retention-checkpoint"],
          },
        ],
      },
      {
        id: "supporting",
        nodes: [
          {
            id: "supporting",
            at: 0.5,
            details: ["revocation", "metadata-guard", "sdk", "reconciliation", "signer"],
          },
        ],
      },
    ],
  },
];

export const concepts: Concept[] = [
  // ─── System ─────────────────────────────────────────────────────────────
  {
    id: "genesis-mesh",
    name: "Genesis Mesh",
    story: "system",
    tagline: "Trust, policy, authorization, and evidence layer",
    whatItIs: [
      "Genesis Mesh is a trust, policy, authorization, and evidence layer for interactions between machines, services, agents, people, and organizations.",
      "It does not require every participant to give control to one central authority. Instead, it provides a way to establish identity, define authority, make signed decisions, delegate rights, revoke trust, and prove what happened.",
    ],
    whereItFits: [
      "Genesis Mesh is the overall system that connects the concepts in this guide.",
      "It can be used inside one organization or across multiple independent organizations.",
    ],
    analogy: [
      "Think of a system that combines identity documents, contracts, policy rules, approval decisions, delegated authority, revocation, and an official evidence archive.",
      "Each part has a different job, but together they create a complete trust model.",
    ],
  },

  // ─── Foundation ─────────────────────────────────────────────────────────
  {
    id: "sovereign",
    name: "Sovereign",
    story: "foundation",
    tagline: "Independently controlled trust domain",
    glossaryAnchor: "sovereign",
    whatItIs: [
      "A Sovereign is an independently controlled Genesis Mesh trust domain.",
      "It owns its own keys, policies, authority, state, and trust decisions.",
    ],
    whereItFits: [
      "A Sovereign is the top-level ownership boundary.",
      "Different organizations can each operate their own Sovereign without giving control of their trust domain to another organization.",
    ],
    analogy: [
      "Think of an independent country or company.",
      "It has its own rules, identity system, and decision-making authority. It can cooperate with others without giving up control of itself.",
    ],
  },
  {
    id: "root-sovereign",
    name: "Root Sovereign",
    story: "foundation",
    tagline: "Cryptographic root of trust",
    whatItIs: [
      "The Root Sovereign is the cryptographic root of trust for a Sovereign.",
      "It establishes the identity of the trust domain and anchors the authority that operates below it.",
      "It is typically kept protected and is not intended for normal day-to-day operations.",
    ],
    whereItFits: [
      "The Root Sovereign establishes the Genesis Block, which in turn anchors the Network Authority.",
      { code: ["Root Sovereign", "      ↓", "Genesis Block", "      ↓", "Network Authority"] },
    ],
    analogy: [
      "Think of the founding legal documents of an organization.",
      "They are not used for every daily action, but they prove where the organization's authority originally comes from.",
    ],
  },
  {
    id: "genesis-block",
    name: "Genesis Block",
    story: "foundation",
    tagline: "Immutable root document",
    glossaryAnchor: "genesis-block",
    whatItIs: [
      "The Genesis Block is the immutable root document that establishes the Sovereign.",
      "It identifies the trust domain and anchors important information such as the root public key and the Network Authority.",
    ],
    whereItFits: [
      "Everything that follows can trace its trust back to the Genesis Block.",
      "It provides a stable answer to:",
      { quote: ["Where did this authority come from?"] },
    ],
    analogy: [
      "Think of an organization's certificate of incorporation or constitutional document.",
      "It establishes the organization and the authority structure that follows from it.",
    ],
  },
  {
    id: "network-authority",
    name: "Network Authority",
    story: "foundation",
    tagline: "Main control-plane authority",
    glossaryAnchor: "network-authority-na",
    whatItIs: [
      "The Network Authority (NA) is the main Genesis Mesh control-plane authority.",
      "Depending on the capability in use, it can manage attestations, evaluate policy, sign authorization decisions, manage recognition and revocation state, register trusted executors, and store evidence.",
    ],
    whereItFits: [
      "The Network Authority is the active authority underneath the Sovereign.",
      "The Root Sovereign establishes trust. The Network Authority performs the day-to-day trust and policy work.",
    ],
    analogy: [
      "Think of a central public administration.",
      "The constitution establishes its authority, but the administration performs the daily work of issuing official decisions, maintaining records, and applying rules.",
    ],
  },
  {
    id: "operator-key",
    name: "Operator Key",
    story: "foundation",
    tagline: "Authenticates privileged admin actions",
    whatItIs: [
      "The Operator Key authenticates privileged administrative actions against the Network Authority.",
      "It can be used for actions such as publishing policy, issuing or revoking attestations, registering executor identities, and changing trusted administrative state.",
    ],
    whereItFits: [
      "The Operator Key is for governance of the authority itself.",
      "It is separate from the identities that execute normal workload actions.",
    ],
    analogy: [
      "Think of an administrator credential that can change official rules and register trusted users.",
      "A normal worker may execute approved work, but only an authorized administrator can change the system of authority.",
    ],
  },
  {
    id: "node",
    name: "Node",
    story: "foundation",
    tagline: "Cryptographically enrolled peer",
    whatItIs: [
      "A Node is a cryptographically enrolled Genesis Mesh peer.",
      "It has its own key material and a Join Certificate proving that it was admitted into the trust domain.",
    ],
    whereItFits: [
      "Nodes are useful when trust or enforcement needs to be distributed closer to workloads, edge environments, or other participating systems.",
      "Not every application or executor needs to be a Node.",
    ],
    analogy: [
      "Think of an officially registered branch office.",
      "It has its own local identity, but it is recognized as part of the wider organization.",
    ],
  },
  {
    id: "invite-token",
    name: "Invite Token",
    story: "foundation",
    tagline: "Single-use enrollment authorization",
    whatItIs: ["An Invite Token is a single-use authorization used to enroll a new Node."],
    whereItFits: [
      "It is part of the Node enrollment process.",
      {
        code: [
          "Invite Token",
          "      ↓",
          "Enrollment",
          "      ↓",
          "Join Certificate",
          "      ↓",
          "Node",
        ],
      },
    ],
    analogy: [
      "Think of a one-time invitation to join a private organization.",
      "The invitation lets someone begin enrollment, but it is not the permanent identity they use afterwards.",
    ],
  },
  {
    id: "join-certificate",
    name: "Join Certificate",
    story: "foundation",
    tagline: "Proof a Node was admitted",
    glossaryAnchor: "join-certificate",
    whatItIs: [
      "A Join Certificate is a short-lived Network Authority-signed certificate that proves a Node was admitted into the trust domain.",
    ],
    whereItFits: [
      "After a Node is enrolled, the Join Certificate becomes the Node's proof that it is a recognized participant.",
    ],
    analogy: [
      "Think of an official staff badge issued after an employee has completed onboarding.",
      "The invitation allowed them to apply. The badge proves they were accepted.",
    ],
  },
  {
    id: "crl",
    name: "CRL",
    story: "foundation",
    tagline: "Certificate Revocation List",
    glossaryAnchor: "crl-certificate-revocation-list",
    whatItIs: [
      "A CRL (Certificate Revocation List) is a signed list of Node certificates that should no longer be trusted.",
      "A Node may be revoked because it was retired, its key was compromised, the system was decommissioned, or trust was withdrawn.",
    ],
    whereItFits: ["The CRL lets trust be removed before a Join Certificate naturally expires."],
    analogy: [
      "Think of a security office publishing a list of access badges that have been cancelled even though the printed expiry date has not yet passed.",
    ],
  },
  {
    id: "agent",
    name: "Agent",
    story: "foundation",
    tagline: "Workload or autonomous actor",
    whatItIs: [
      "An Agent is a workload or autonomous actor that can perform useful operations.",
      "An AgentDescriptor is a signed description of that agent, including information such as its capabilities and endpoint.",
    ],
    whereItFits: [
      "Agents allow Genesis Mesh to represent active machine actors, not only infrastructure peers.",
      "An Agent can participate in trusted workflows where its identity and capabilities need to be understood.",
    ],
    analogy: [
      "Think of an employee and their official job profile.",
      "The employee is the actor. The job profile describes what they do, what capabilities they have, and where they operate.",
    ],
  },
  {
    id: "agreement-record",
    name: "AgreementRecord",
    story: "foundation",
    tagline: "Dual-signed agreement between two parties",
    whatItIs: [
      "An AgreementRecord is a dual-signed agreement between two independently governed parties.",
      "It defines what capabilities or terms both parties agree to.",
    ],
    whereItFits: [
      "An AgreementRecord is useful when authority is based on mutual agreement rather than one party simply issuing an internal permission to another.",
    ],
    analogy: [
      "Think of a contract signed by two companies.",
      "Both sides agree to the same terms, and both signatures matter.",
    ],
  },
  {
    id: "delegated-agreement-record",
    name: "DelegatedAgreementRecord",
    story: "foundation",
    tagline: "Delegates a narrower subset of authority",
    whatItIs: [
      "A DelegatedAgreementRecord allows an authorized party to delegate a narrower subset of its authority to another identity.",
      "The delegated authority must remain inside the authority originally granted.",
    ],
    whereItFits: [
      "It supports chains such as:",
      { code: ["Organization", "     ↓", "Platform", "     ↓", "Team", "     ↓", "Workload"] },
      "Each level can receive only the authority that the previous level is allowed to delegate.",
    ],
    analogy: [
      "Think of a power of attorney.",
      "If someone authorizes you to pay a bill on their behalf, you cannot use that authority to sell their property.",
      "Delegation cannot exceed the original permission.",
    ],
  },
  {
    id: "recognition-treaty",
    name: "Recognition Treaty",
    story: "foundation",
    tagline: "Recognition between two Sovereigns",
    glossaryAnchor: "recognition-treaty",
    whatItIs: [
      "A Recognition Treaty is a signed, scoped, and revocable recognition relationship between two independent Sovereigns.",
    ],
    whereItFits: [
      "It enables two independently controlled trust domains to recognize each other without either domain becoming subordinate to the other.",
      { code: ["Sovereign A", "     ↕", "Recognition Treaty", "     ↕", "Sovereign B"] },
    ],
    analogy: [
      "Think of two countries agreeing to recognize certain official documents issued by each other.",
      "Each country remains independent, but they establish explicit rules for cooperation.",
    ],
  },
  {
    id: "recognition-policy",
    name: "Recognition Policy",
    story: "foundation",
    tagline: "What the local domain accepts",
    whatItIs: [
      "A Recognition Policy defines the local rules for what an external Sovereign, attestation, or trust statement is accepted for.",
    ],
    whereItFits: [
      "A Recognition Treaty establishes a relationship.",
      "Recognition Policy decides what the local domain actually accepts through that relationship.",
    ],
    analogy: [
      "Two countries may recognize each other diplomatically, but that does not mean every document from one country is automatically valid in the other.",
      "Local law still defines what is accepted and for what purpose.",
    ],
  },
  {
    id: "sovereign-revocation-feed",
    name: "Sovereign Revocation Feed",
    story: "foundation",
    tagline: "Revocation exchanged between Sovereigns",
    whatItIs: [
      "A Sovereign Revocation Feed is signed revocation information exchanged between Sovereigns.",
      "It allows one domain to learn that another domain has withdrawn trust from an identity or trust artifact.",
    ],
    whereItFits: ["Cross-domain trust is only safe if revocation can also cross the boundary."],
    analogy: [
      "Think of an issuing authority informing another organization that a previously valid passport, certificate, or professional license has been cancelled.",
    ],
  },
  {
    id: "freshness-proof",
    name: "FreshnessProof",
    story: "foundation",
    tagline: "Revocation data was current enough",
    whatItIs: [
      "A FreshnessProof is signed proof that revocation information was current enough when an authorization decision was made.",
    ],
    whereItFits: [
      "It answers an important audit question:",
      { quote: ["Was the system making its decision using recent enough trust information?"] },
    ],
    analogy: [
      "It is not enough to show a list of cancelled credentials.",
      "An auditor may also ask:",
      { quote: ["When was this list last updated?"] },
      "FreshnessProof provides evidence about that timing.",
    ],
  },
  {
    id: "ibct",
    name: "IBCT",
    story: "foundation",
    tagline: "Invocation-Bound Capability Token",
    glossaryAnchor: "ibct-invocation-bound-capability-token",
    whatItIs: [
      "An Invocation-Bound Capability Token (IBCT) is a short-lived, tightly scoped capability token that can be verified without a live call to the Network Authority for every operation.",
    ],
    whereItFits: [
      "IBCT can support high-volume operations, latency-sensitive systems, disconnected environments, and edge workloads.",
    ],
    analogy: [
      "Instead of calling headquarters every time someone opens a door, headquarters issues a badge valid for five minutes and only for one specific door.",
      "The local system can verify the badge without calling headquarters each time.",
    ],
  },
  {
    id: "human-oversight",
    name: "Human Oversight",
    story: "foundation",
    tagline: "Dual-Signed Commitment with a human key",
    whatItIs: [
      "Human Oversight allows sensitive authorization to require both an automated identity and a human approval key.",
      "A Dual-Signed Commitment provides cryptographic evidence that both sides approved the action.",
    ],
    whereItFits: [
      "This is useful when automation should be allowed to operate, but certain high-risk actions still require explicit human involvement.",
    ],
    analogy: [
      "Think of a high-value bank transfer that requires both the automated payment system and an authorized manager to approve it.",
    ],
  },
  {
    id: "consensus-authorization",
    name: "Consensus Authorization",
    story: "foundation",
    tagline: "Threshold of independent validators",
    glossaryAnchor: "consensus-proof",
    whatItIs: [
      "Consensus Authorization requires a threshold of independent validators before a consequential action is authorized.",
      "For example:",
      {
        code: ["5 validators exist", "3 approvals required", "3 of 5 → authorized", "2 of 5 → not authorized"],
      },
    ],
    whereItFits: ["It reduces dependence on a single approver for highly sensitive operations."],
    analogy: [
      "Think of a board resolution that requires a minimum number of members to vote in favor before the decision becomes valid.",
    ],
  },
  {
    id: "selective-disclosure",
    name: "Selective Disclosure",
    story: "foundation",
    tagline: "Prove one property, reveal nothing else",
    whatItIs: [
      "Selective Disclosure allows an identity to prove a specific capability or property without revealing its complete capability set or identity data.",
    ],
    whereItFits: [
      "It is useful when trust crosses organizational boundaries and only the minimum necessary information should be disclosed.",
    ],
    analogy: [
      "If someone needs to know whether you are legally allowed to drive, you should not have to reveal your salary, bank balance, and employment history.",
      "You prove only the fact that is required.",
    ],
  },
  {
    id: "model-attestation",
    name: "ModelAttestation",
    story: "foundation",
    tagline: "Binds an AI agent to an approved configuration",
    whatItIs: [
      "A ModelAttestation binds an AI agent to an approved model, prompt, tools, or configuration before execution.",
    ],
    whereItFits: [
      "It allows trust decisions to consider not only the identity of an AI agent, but also the approved configuration under which it is operating.",
    ],
    analogy: [
      "Knowing the employee's identity is not always enough.",
      "For some jobs, you also need proof that the employee is using approved equipment, following the approved procedure, and working under the correct certification.",
    ],
  },
  {
    id: "recognition-graph",
    name: "Recognition Graph",
    story: "foundation",
    tagline: "Direct recognition between Sovereigns",
    glossaryAnchor: "recognition-edge",
    whatItIs: [
      "The Recognition Graph represents direct trust and recognition relationships between Sovereigns.",
    ],
    whereItFits: [
      "As more independent domains are connected, the Recognition Graph provides a way to understand the topology of those trust relationships.",
    ],
    analogy: [
      "Think of a map showing which countries, companies, or institutions have formal recognition agreements with each other.",
      "The map shows the relationships. It does not automatically make trust transitive.",
    ],
  },
  {
    id: "connectome",
    name: "Connectome",
    story: "foundation",
    tagline: "Observability view of recognition",
    glossaryAnchor: "connectome",
    whatItIs: [
      "The Connectome is an observability view derived from recognition relationships.",
      "It helps operators and architects understand how trust domains are connected.",
    ],
    whereItFits: [
      "The Connectome is for visibility and analysis rather than enforcement.",
      "It can help answer questions such as who recognizes whom, which domains are isolated, where major trust dependencies exist, and where a recognition relationship changed.",
    ],
    analogy: [
      "Think of a transport map.",
      "The map does not control the vehicles. It helps you understand how the network is connected.",
    ],
  },
  {
    id: "policy-manifest",
    name: "PolicyManifest",
    story: "foundation",
    tagline: "Network or runtime configuration policy",
    whatItIs: [
      "A PolicyManifest is Genesis Mesh network or runtime configuration policy.",
      "It should not be confused with a BoundaryPolicy.",
    ],
    whereItFits: [
      "PolicyManifest controls aspects of how the Genesis Mesh environment operates.",
      "BoundaryPolicy controls whether a specific requested action should be allowed.",
    ],
    analogy: [
      "Think of the difference between the operating rules for how a government department itself is configured and the laws used to decide whether a citizen's request is allowed.",
      "They are both policies, but they apply at different layers.",
    ],
  },
  {
    id: "canonical-json",
    name: "Canonical JSON",
    story: "foundation",
    tagline: "Deterministic bytes for signing",
    glossaryAnchor: "canonicaljson",
    whatItIs: [
      "Canonical JSON is a deterministic representation of JSON data used for signing and verification.",
      "Different systems must produce the same exact byte representation before cryptographic signatures can be verified reliably.",
    ],
    whereItFits: [
      "Genesis Mesh uses signed artifacts across implementations and SDKs.",
      "Canonical JSON ensures that two systems agree on exactly what was signed.",
    ],
    analogy: [
      "Two contracts may contain the same words but use different spacing, ordering, or formatting.",
      "A human may consider them equivalent. A digital signature works on exact bytes.",
      "Canonical JSON makes sure everyone writes the document in exactly the same form before signing it.",
    ],
  },

  // ─── Governed Action ────────────────────────────────────────────────────
  {
    id: "governed-action",
    name: "Governed Action",
    story: "governed-action",
    tagline: "Decide, act, record, submit evidence",
    whatItIs: [
      "A Governed Action is the complete pattern:",
      {
        code: [
          "ask for a decision",
          "      ↓",
          "act only when allowed",
          "      ↓",
          "record success or failure",
          "      ↓",
          "submit execution evidence",
        ],
      },
    ],
    whereItFits: ["It combines authorization and evidence into one operational pattern."],
    analogy: [
      "A regulated maintenance process may require approval before work, work performed only after approval, and a signed completion record afterwards.",
      "The action is governed from request through completion.",
    ],
  },
  {
    id: "membership-attestation",
    name: "MembershipAttestation",
    story: "governed-action",
    tagline: "Signed identity and authorization record",
    glossaryAnchor: "attestation",
    whatItIs: [
      "A MembershipAttestation is a signed identity and authorization record.",
      "It can describe a person, vendor, product team, workload, service, or another subject.",
      "Its claims can include capabilities, associated applications, organizational membership, or other scoped attributes.",
      "It can also be revoked.",
    ],
    whereItFits: [
      "The MembershipAttestation establishes the trusted identity basis for an authorization decision.",
    ],
    analogy: [
      "Think of an official company badge.",
      "It proves who the person is and may also show their role, department, and which areas they are allowed to access.",
    ],
  },
  {
    id: "attestation-binding",
    name: "AttestationBinding",
    story: "governed-action",
    tagline: "Which attestation a decision used",
    whatItIs: [
      "An AttestationBinding records exactly which attestation was used when a decision was made.",
      "It can preserve information about the subject, issuer, and revocation state that formed the identity basis of the decision.",
    ],
    whereItFits: [
      "It makes the decision auditable later.",
      "A reviewer can see not only that an action was allowed, but which trusted identity statement was used.",
    ],
    analogy: [
      "Think of an approval document that records the exact ID card or professional certificate that was checked before approval was granted.",
    ],
  },
  {
    id: "boundary-policy",
    name: "BoundaryPolicy",
    story: "governed-action",
    tagline: "Signed, versioned allow/deny rules",
    whatItIs: [
      "A BoundaryPolicy is a signed and versioned policy that defines the rules for allowing or denying an action.",
      "Examples of rules include a required owner, an allowed resource, a maximum value, an approved environment, or an allowed capability.",
    ],
    whereItFits: ["The BoundaryPolicy expresses the governance rules applied to a requested action."],
    analogy: ["Think of the written rules used by an organization to decide whether a request is acceptable."],
  },
  {
    id: "gate",
    name: "Gate",
    story: "governed-action",
    tagline: "One focused policy check",
    whatItIs: [
      "A Gate is one specific policy check inside a BoundaryPolicy.",
      "Examples:",
      {
        code: [
          "resource must be approved",
          "requested duration must be below a limit",
          "environment must be allowed",
          "identity must contain a required claim",
        ],
      },
    ],
    whereItFits: ["A policy can contain several Gates.", "Each Gate answers one focused question."],
    analogy: [
      "Think of an airport security process.",
      "One checkpoint validates the ticket, another checks identity, and another checks baggage.",
      "Each checkpoint has a specific purpose.",
    ],
  },
  {
    id: "gate-registry",
    name: "Gate Registry",
    story: "governed-action",
    tagline: "Trusted Gate implementations",
    whatItIs: [
      "The Gate Registry is the trusted set of Gate implementations that the Network Authority is allowed to execute.",
      "Policies can configure approved Gate types rather than supplying arbitrary executable code.",
    ],
    whereItFits: ["The Gate Registry separates trusted implementation from configurable policy."],
    analogy: [
      "A regulator may publish a list of approved inspection methods.",
      "A local policy can choose which inspections apply, but it cannot invent an untrusted inspection procedure and run arbitrary code.",
    ],
  },
  {
    id: "observe-mode",
    name: "Observe Mode",
    story: "governed-action",
    tagline: "Record violations without blocking",
    whatItIs: [
      "In Observe Mode, policy rules are evaluated and violations can be recorded without blocking the action.",
    ],
    whereItFits: [
      "Observe Mode is useful when introducing a new rule or onboarding an existing environment.",
      "It allows teams to understand the impact of a policy before making it mandatory.",
    ],
    analogy: [
      "A city may introduce a new traffic rule with an initial warning period.",
      "The system records violations, but drivers are not yet penalized.",
    ],
  },
  {
    id: "enforce-mode",
    name: "Enforce Mode",
    story: "governed-action",
    tagline: "Failures affect the decision",
    whatItIs: [
      "In Enforce Mode, policy failures affect the final authorization decision.",
      "A failing rule can cause the requested action to be denied.",
    ],
    whereItFits: ["Enforce Mode is used when the policy is ready to become mandatory."],
    analogy: ["The warning period is over.", "The same traffic rule is now actively enforced."],
  },
  {
    id: "context-record",
    name: "ContextRecord",
    story: "governed-action",
    tagline: "What exactly is being requested",
    whatItIs: [
      "A ContextRecord is the normalized description of the requested action.",
      "It can include information such as requested operation, target resource, environment, owner, duration, application, subscription, or other relevant metadata.",
    ],
    whereItFits: [
      "The ContextRecord tells Genesis Mesh:",
      { quote: ["What exactly is being requested?"] },
    ],
    analogy: [
      "Think of an official application form.",
      "The identity tells the authority who you are.",
      "The form tells the authority what you are asking for.",
    ],
  },
  {
    id: "boundary-engine",
    name: "BoundaryEngine",
    story: "governed-action",
    tagline: "identity + request + rules → result",
    whatItIs: ["The BoundaryEngine evaluates the request against identity, policy, and configured Gates."],
    whereItFits: [
      "It is the decision-processing component that turns:",
      { code: ["identity + request + rules"] },
      "into an authorization result.",
    ],
    analogy: [
      "Think of the official reviewing an application against the relevant rules and checking each required condition.",
    ],
  },
  {
    id: "boundary-decision",
    name: "BoundaryDecision",
    story: "governed-action",
    tagline: "Signed ALLOW or DENY",
    glossaryAnchor: "boundarydecision",
    whatItIs: [
      "A BoundaryDecision is the signed ALLOW or DENY result produced for a specific requested action.",
    ],
    whereItFits: [
      "It is the authorization result consumed by the system that wants to perform the action.",
      { code: ["DENY  → do not proceed", "ALLOW → action may proceed"] },
    ],
    analogy: [
      "Think of a signed permit.",
      "It does not perform the work itself. It officially states whether the work is authorized.",
    ],
    note: {
      title: "Other verdicts",
      body: [
        "ALLOW and DENY are the outcomes a calling system acts on. The Genesis Mesh glossary also records the Network Authority policy engine's verdict as one of allow, block, escalate, or warn.",
      ],
    },
  },
  {
    id: "policy-binding",
    name: "PolicyBinding",
    story: "governed-action",
    tagline: "Which policy version decided",
    whatItIs: [
      "A PolicyBinding records exactly which policy version and policy evaluation contributed to a decision.",
    ],
    whereItFits: ["It makes old decisions understandable even after policies change."],
    analogy: [
      "If a decision was made two years ago, an auditor should judge it against the law that was active at that time, not the law that exists today.",
      "PolicyBinding records that connection.",
    ],
  },
  {
    id: "justification-proof",
    name: "JustificationProof",
    story: "governed-action",
    tagline: "Why it was allowed or denied",
    whatItIs: [
      "A JustificationProof provides signed evidence explaining how the decision was reached.",
      "It can include ordered Gate evaluations and their outcomes.",
    ],
    whereItFits: ["It answers:", { quote: ["Why was this action allowed or denied?"] }],
    analogy: [
      "Instead of receiving only:",
      { quote: ["Approved."] },
      "you receive:",
      {
        quote: [
          "Approved because identity was valid, resource ownership matched, requested scope was permitted, and all required controls passed.",
        ],
      },
    ],
  },
  {
    id: "executor-identity",
    name: "Executor Identity",
    story: "governed-action",
    tagline: "Trusted system that performs the action",
    whatItIs: [
      "The Executor Identity represents the trusted system that performs an approved action.",
      "The Executor Key signs the resulting ExecutionEvidence.",
    ],
    whereItFits: ["It allows Genesis Mesh to prove which trusted system actually carried out the action."],
    analogy: [
      "An approval says the work may happen.",
      "The contractor's signed completion record says which authorized contractor actually performed it.",
    ],
  },
  {
    id: "execution-evidence",
    name: "ExecutionEvidence",
    story: "governed-action",
    tagline: "Signed record of what happened",
    whatItIs: [
      "ExecutionEvidence is a signed record produced after an approved action is executed.",
      "It records what actually happened.",
      "For example:",
      {
        code: [
          "decision: ALLOW",
          "requested action: update resource",
          "execution result: success",
          "executor: controller-01",
          "resource: resource-123",
          "time: ...",
        ],
      },
    ],
    whereItFits: [
      "A BoundaryDecision proves permission.",
      "ExecutionEvidence proves execution.",
      "These are deliberately separate.",
    ],
    analogy: [
      "A building permit proves construction was authorized.",
      "The completion certificate proves the work was actually carried out.",
    ],
  },
  {
    id: "execution-recorder",
    name: "Execution Recorder",
    story: "governed-action",
    tagline: "Creates and signs ExecutionEvidence",
    whatItIs: [
      "The Execution Recorder creates and signs ExecutionEvidence produced by an executor.",
      "It helps maintain the correct decision and resource history.",
    ],
    whereItFits: ["It connects the actual execution result back into the Genesis Mesh evidence model."],
    analogy: [
      "Think of a system that automatically creates the official completion record after an authorized job has been performed.",
    ],
  },
  {
    id: "evidence-store",
    name: "Evidence Store",
    story: "governed-action",
    tagline: "Decision and execution history",
    whatItIs: [
      "The Evidence Store keeps decision and execution history for later verification and audit.",
      "It stores governance and execution metadata, not sensitive secret values.",
    ],
    whereItFits: ["It provides the historical record required to reconstruct what happened."],
    analogy: [
      "Think of an official archive where signed decisions and execution records are preserved so they can be reviewed later.",
    ],
  },
  {
    id: "resource-id",
    name: "Resource ID",
    story: "governed-action",
    tagline: "Stable identifier for a resource",
    whatItIs: [
      "A Resource ID is a stable identifier for the governed resource associated with evidence.",
    ],
    whereItFits: [
      "It allows Genesis Mesh to group the history of one resource across many decisions and executions.",
    ],
    analogy: [
      "Think of a case number or property registration number that lets an auditor find every event related to the same object.",
    ],
  },
  {
    id: "resource-chain",
    name: "Resource Chain",
    story: "governed-action",
    tagline: "History of one resource",
    whatItIs: [
      "A Resource Chain is the ordered, tamper-evident execution history for one governed resource.",
    ],
    whereItFits: [
      "It can show the lifecycle of the same resource across multiple actions.",
      {
        code: ["created", "   ↓", "updated", "   ↓", "rotated", "   ↓", "revoked", "   ↓", "removed"],
      },
    ],
    analogy: [
      "Think of the complete maintenance history for one aircraft.",
      "Every inspection, repair, replacement, and retirement event belongs to the same asset history.",
    ],
  },
  {
    id: "evidence-chain",
    name: "Evidence Chain",
    story: "governed-action",
    tagline: "Hash-linked Store Chain",
    whatItIs: [
      "The Evidence Chain or Store Chain is the hash-linked history of evidence records.",
      "It makes missing, reordered, or modified records detectable.",
    ],
    whereItFits: [
      "The Resource Chain organizes history around a resource.",
      "The Evidence Chain protects the integrity of the evidence store itself.",
    ],
    analogy: [
      "Imagine an official register where every page contains a fingerprint of the previous page.",
      "Changing or removing an older page breaks the chain and becomes detectable.",
    ],
  },
  {
    id: "retention-checkpoint",
    name: "RetentionCheckpoint",
    story: "governed-action",
    tagline: "Proof left when old evidence is removed",
    whatItIs: [
      "A RetentionCheckpoint is a signed proof left when old evidence is legitimately removed under retention rules.",
    ],
    whereItFits: [
      "It allows evidence retention policies to be applied without making the remaining history unverifiable.",
    ],
    analogy: [
      "An archive may legally destroy old files after a retention period.",
      "Before destruction, it records an official signed inventory proving what existed and where the historical boundary now begins.",
    ],
  },
  {
    id: "revocation",
    name: "Revocation",
    story: "governed-action",
    tagline: "Withdraws previously granted trust",
    whatItIs: [
      "Revocation withdraws trust that was previously granted.",
      "It can apply to identities, attestations, certificates, or other trust artifacts.",
    ],
    whereItFits: [
      "Revocation is one of the main ways Genesis Mesh ensures that trust is not permanent by default.",
      "Future actions can be denied after trust is withdrawn.",
    ],
    analogy: [
      "An employee badge may still have six months before its printed expiry date.",
      "If the employee leaves today, the organization revokes the badge immediately.",
    ],
  },
  {
    id: "metadata-guard",
    name: "Metadata Guard",
    story: "governed-action",
    tagline: "Keeps secrets out of evidence",
    whatItIs: [
      "The Metadata Guard protects the governance and evidence layer from receiving obvious secret material.",
      "Genesis Mesh should receive identifiers, metadata, versions, timestamps, and evidence, not raw secret values.",
    ],
    whereItFits: [
      "It helps maintain a clean separation between governance data and protected secret material.",
    ],
    analogy: [
      "An audit report should contain:",
      { quote: ["Safe deposit box 123 was opened by authorized employee 45 at 10:15."] },
      "It should not contain the contents of the safe deposit box.",
    ],
  },
  {
    id: "sdk",
    name: "GenesisMeshClient / SDK",
    story: "governed-action",
    tagline: "Supported client for the Network Authority",
    whatItIs: [
      "A Genesis Mesh SDK provides application code with a supported way to interact with the Network Authority and Genesis Mesh data structures.",
      "It can handle areas such as requests, signing, verification, policy evaluation, evidence submission, and related client-side operations.",
    ],
    whereItFits: [
      "Applications and controllers can use the SDK instead of manually implementing the Network Authority protocol and signing behavior.",
    ],
    analogy: [
      "Instead of every company building its own custom interface to a government service, the government provides an official client library that follows the required forms and procedures correctly.",
    ],
  },
  {
    id: "reconciliation",
    name: "Reconciliation",
    story: "governed-action",
    tagline: "Detects what bypassed the governed path",
    whatItIs: [
      "Reconciliation compares recorded Genesis Mesh state with the observed state of the real system.",
      "It can identify cases such as unmanaged resources, drift, resources removed outside the governed flow, or resources that still exist after trust was revoked.",
    ],
    whereItFits: [
      "Preventive controls govern actions that go through Genesis Mesh.",
      "Reconciliation provides detective control for things that happened outside the expected path.",
    ],
    analogy: [
      "A company's accounting system may approve every purchase order.",
      "Reconciliation later compares the purchase records with the actual bank transactions to find anything that bypassed the approved process.",
    ],
  },
  {
    id: "signer",
    name: "Signer",
    story: "governed-action",
    tagline: "Signing without embedded private keys",
    whatItIs: [
      "A Signer is the abstraction used to create Genesis Mesh signatures without requiring private keys to be embedded directly in application code.",
      "The signing implementation can use a protected key service, HSM, or another secure signing mechanism.",
    ],
    whereItFits: ["It separates the need to sign from where the private key is actually stored."],
    analogy: [
      "An employee can request an official company stamp without carrying the master stamp around in their pocket.",
      "The secure signing service keeps the sensitive signing material protected.",
    ],
  },
];

/**
 * Relationships, each traceable to a sentence in the guide. Bridges are the
 * points where the Foundation story hands trust to the Governed Action story.
 */
export const relations: Relation[] = [
  // Foundation flow
  { from: "root-sovereign", to: "genesis-block", label: "establishes", kind: "flow" },
  { from: "genesis-block", to: "network-authority", label: "anchors", kind: "flow" },
  { from: "operator-key", to: "network-authority", label: "authenticates admin actions", kind: "flow" },
  { from: "network-authority", to: "node", label: "signs Join Certificates", kind: "flow" },
  { from: "network-authority", to: "agent", label: "", kind: "flow" },
  { from: "network-authority", to: "agreement-record", label: "", kind: "flow" },
  { from: "network-authority", to: "recognition-treaty", label: "manages recognition state", kind: "flow" },
  { from: "agreement-record", to: "delegated-agreement-record", label: "delegates a narrower subset", kind: "flow" },
  { from: "recognition-treaty", to: "sovereign-revocation-feed", label: "revocation crosses the boundary", kind: "flow" },

  // Foundation details
  { from: "node", to: "invite-token", label: "enrolled with", kind: "detail" },
  { from: "node", to: "join-certificate", label: "proves admission with", kind: "detail" },
  { from: "node", to: "crl", label: "revoked through", kind: "detail" },
  { from: "invite-token", to: "join-certificate", label: "enrollment", kind: "reference" },
  { from: "network-authority", to: "join-certificate", label: "signs", kind: "reference" },
  { from: "recognition-treaty", to: "recognition-policy", label: "accepted through", kind: "detail" },
  { from: "sovereign-revocation-feed", to: "freshness-proof", label: "proved current by", kind: "detail" },
  { from: "advanced-authorization", to: "ibct", label: "", kind: "detail" },
  { from: "advanced-authorization", to: "human-oversight", label: "", kind: "detail" },
  { from: "advanced-authorization", to: "consensus-authorization", label: "", kind: "detail" },
  { from: "advanced-authorization", to: "selective-disclosure", label: "", kind: "detail" },
  { from: "advanced-authorization", to: "model-attestation", label: "", kind: "detail" },
  { from: "trust-observability", to: "recognition-graph", label: "", kind: "detail" },
  { from: "trust-observability", to: "connectome", label: "", kind: "detail" },
  { from: "technical-foundations", to: "policy-manifest", label: "", kind: "detail" },
  { from: "technical-foundations", to: "canonical-json", label: "", kind: "detail" },
  { from: "recognition-treaty", to: "recognition-graph", label: "forms", kind: "reference" },
  { from: "recognition-graph", to: "connectome", label: "derived view", kind: "reference" },
  { from: "agent", to: "model-attestation", label: "bound to approved configuration", kind: "reference" },

  // Governed Action flow
  { from: "membership-attestation", to: "boundary-engine", label: "identity", kind: "flow" },
  { from: "context-record", to: "boundary-engine", label: "request", kind: "flow" },
  { from: "boundary-policy", to: "gate", label: "contains", kind: "flow" },
  { from: "gate", to: "boundary-engine", label: "rules", kind: "flow" },
  { from: "boundary-engine", to: "boundary-decision", label: "produces", kind: "flow" },
  { from: "boundary-decision", to: "executor-identity", label: "ALLOW → may proceed", kind: "flow" },
  { from: "executor-identity", to: "execution-evidence", label: "signs", kind: "flow" },
  { from: "execution-evidence", to: "evidence-store", label: "submitted to", kind: "flow" },

  // Governed Action details
  { from: "boundary-decision", to: "attestation-binding", label: "records which attestation", kind: "detail" },
  { from: "attestation-binding", to: "membership-attestation", label: "identity basis", kind: "reference" },
  { from: "gate", to: "gate-registry", label: "implemented by", kind: "detail" },
  { from: "gate", to: "observe-mode", label: "evaluated in", kind: "detail" },
  { from: "gate", to: "enforce-mode", label: "evaluated in", kind: "detail" },
  { from: "boundary-decision", to: "policy-binding", label: "records policy version", kind: "detail" },
  { from: "boundary-decision", to: "justification-proof", label: "explained by", kind: "detail" },
  { from: "policy-binding", to: "boundary-policy", label: "which version", kind: "reference" },
  { from: "execution-evidence", to: "execution-recorder", label: "created by", kind: "detail" },
  { from: "evidence-store", to: "resource-id", label: "groups by", kind: "detail" },
  { from: "evidence-store", to: "resource-chain", label: "per resource", kind: "detail" },
  { from: "evidence-store", to: "evidence-chain", label: "protected by", kind: "detail" },
  { from: "evidence-store", to: "retention-checkpoint", label: "pruned with", kind: "detail" },
  { from: "supporting", to: "revocation", label: "", kind: "detail" },
  { from: "supporting", to: "metadata-guard", label: "", kind: "detail" },
  { from: "supporting", to: "sdk", label: "", kind: "detail" },
  { from: "supporting", to: "reconciliation", label: "", kind: "detail" },
  { from: "supporting", to: "signer", label: "", kind: "detail" },
  { from: "revocation", to: "membership-attestation", label: "can revoke", kind: "reference" },
  { from: "signer", to: "execution-evidence", label: "signs without embedded keys", kind: "reference" },
  { from: "metadata-guard", to: "evidence-store", label: "keeps secrets out", kind: "reference" },

  // Bridges: Foundation trust → Governed Action
  { from: "network-authority", to: "membership-attestation", label: "manages attestations", kind: "bridge", primary: true },
  { from: "network-authority", to: "boundary-engine", label: "evaluates policy", kind: "bridge", primary: true },
  { from: "network-authority", to: "boundary-decision", label: "signs decisions", kind: "bridge", primary: true },
  { from: "network-authority", to: "evidence-store", label: "stores evidence", kind: "bridge", primary: true },
  { from: "operator-key", to: "boundary-policy", label: "publishes policy", kind: "bridge", primary: true },
  { from: "operator-key", to: "executor-identity", label: "registers executor identities", kind: "bridge" },
  { from: "operator-key", to: "membership-attestation", label: "issues or revokes attestations", kind: "reference" },
  { from: "recognition-policy", to: "membership-attestation", label: "accepts external attestations", kind: "bridge" },
  { from: "freshness-proof", to: "boundary-decision", label: "revocation current at decision time", kind: "bridge" },
  { from: "crl", to: "revocation", label: "removes trust early", kind: "reference" },
  { from: "sovereign-revocation-feed", to: "revocation", label: "revocation across domains", kind: "reference" },
  { from: "model-attestation", to: "boundary-engine", label: "approved configuration", kind: "reference" },
  { from: "human-oversight", to: "boundary-decision", label: "human approval", kind: "reference" },
  { from: "consensus-authorization", to: "boundary-decision", label: "validator threshold", kind: "reference" },
  { from: "policy-manifest", to: "boundary-policy", label: "different layer, not the same policy", kind: "reference" },
  { from: "canonical-json", to: "signer", label: "exact bytes to sign", kind: "reference" },
];

export const conceptsById: Record<string, Concept> = Object.fromEntries(
  concepts.map((concept) => [concept.id, concept]),
);

export const groupsById: Record<string, Group> = Object.fromEntries(
  groups.map((group) => [group.id, group]),
);

export function isViewId(value: string | null | undefined): value is ViewId {
  return howItWorksViews.some((view) => view.id === value);
}

export function storiesInView(view: ViewId): Story[] {
  return view === "full-model" ? stories : stories.filter((story) => story.id === view);
}

/** Whether a concept belongs to a view; `system` concepts belong to all of them. */
export function conceptInView(concept: Concept, view: ViewId) {
  return concept.story === "system" || view === "full-model" || concept.story === view;
}

/** The view a concept lives in when it is linked from a view that does not show it. */
export function homeViewFor(concept: Concept): ViewId {
  return concept.story === "system" ? "full-model" : concept.story;
}

/** Concepts in a story, ordered by stage, frame concept first. */
export function storyConceptOrder(story: Story): string[] {
  const order: string[] = [story.frameConcept];
  for (const stage of story.stages) {
    for (const node of stage.nodes) {
      if (conceptsById[node.id]) {
        order.push(node.id);
      }
      for (const detail of node.details ?? []) {
        order.push(detail);
      }
    }
  }
  return order;
}

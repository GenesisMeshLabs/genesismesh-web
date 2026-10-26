# Genesis Mesh Web

The public Genesis Mesh hub for product concepts, SDKs, documentation, videos,
and articles. This project is intended for `www.genesismesh.org`.

The separate `site` project serves the multilingual Genesis Mesh landing site at
`genesismesh.org`. It has its own content and deployment. `site` and `web` are
both maintained; neither replaces the other.

Routes:

```text
www.genesismesh.org/
www.genesismesh.org/overview
www.genesismesh.org/start-here
www.genesismesh.org/sdks
www.genesismesh.org/docs
www.genesismesh.org/videos
www.genesismesh.org/articles
www.genesismesh.org/concepts/how-genesis-mesh-works/foundation
www.genesismesh.org/concepts/how-genesis-mesh-works/governed-action
www.genesismesh.org/concepts/how-genesis-mesh-works/full-model
```

`/concepts/how-genesis-mesh-works` redirects to the Foundation view. Concepts are
deep-linkable by fragment, e.g. `/foundation#recognition-treaty`.

This repository is intended to be public. Do not commit local environment files,
generated screenshots, deployment credentials, or private campaign drafts.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- `lucide-react` icons

## Local Development

```bash
npm ci
npm run dev
```

Default local URL:

```text
http://localhost:3000/
```

## Content Model

Genesis Mesh links, fallback video IDs, fallback article links, SDK cards, pillars, and campaign cards live in:

```text
src/content/genesismesh.ts
```

Public content indexes are fetched server-side:

- YouTube videos use the public GenesisMesh Labs channel feed.
- Patreon articles are discovered from public GenesisMesh Labs post links.
- Both pages fall back to curated local content if a public feed or page is unavailable.

How Genesis Mesh Works concepts, relationships, stages, and the mental-model
questions live in one file; the three views are filters over it:

```text
src/content/how-genesis-mesh-works.ts
```

Shared UI sections live in:

```text
src/components/
```

Marketing and brand images are served from:

```text
public/images/
```

## Website Assistant

The chat button in the bottom-right corner answers questions about Genesis Mesh
and forwards inquiries to the team. `POST /api/chat` handles it:

- The model never receives the whole site. It calls a `search_knowledge` tool,
  which searches chunks built from `src/content` plus a few curated facts in
  `src/lib/assistant/knowledge.ts`, and answers from the passages it gets back.
  Content edits reach the assistant on the next deploy.
- Only Genesis Mesh questions are answered. A separate scope check judges each
  message alongside the answer, and a reply is shown only when both agree it is
  on topic; anything else gets a fixed refusal.
- Inquiries are collected one question at a time and shown on a summary card.
  Nothing is emailed until the visitor presses "Confirm and send" on that card,
  whose signed token is checked by the server.

Environment variables (set in Vercel; locally in `.env`, which is not committed):

```text
AZURE_OPENAI_ENDPOINT      Azure OpenAI resource URL
AZURE_OPENAI_API_KEY       its key
AZURE_OPENAI_DEPLOYMENT    the chat model deployment name
SMTP_HOST, SMTP_PORT       mail server (port 465 uses TLS, 587 STARTTLS)
SMTP_USER, SMTP_PASS       mailbox that sends the inquiries
MAIL_TO                    where inquiries are delivered (defaults to SMTP_USER)
CHAT_SIGNING_SECRET        signs inquiry summary cards (required with several instances)
MAIL_DRY_RUN=1             optional: log inquiries instead of sending them
```

Variables already set in your shell take precedence over `.env` in `next dev`.

## Validation

```bash
npm run lint
npm test
npm run build
```

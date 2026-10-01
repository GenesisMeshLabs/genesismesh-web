# Genesis Mesh Web

The public Genesis Mesh hub for product concepts, SDKs, documentation, videos,
and articles. This project is intended for `www.genesismesh.org`.

The separate `site` project serves the multilingual Genesis Mesh landing site at
`genesismesh.org`. It has its own content and deployment. `site` and `web` are
both maintained; neither replaces the other.

Routes:

```text
www.genesismesh.org/
www.genesismesh.org/genesismesh
www.genesismesh.org/genesismesh/sdks
www.genesismesh.org/genesismesh/docs
www.genesismesh.org/genesismesh/videos
www.genesismesh.org/genesismesh/articles
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

## Validation

```bash
npm run lint
npm run build
```

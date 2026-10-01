# AGENTS

This repository is the Genesis Mesh public web app, prepared for
`www.genesismesh.org`. Its documentation links point to `docs.genesismesh.org`.

Keep the site modular:

- Put reusable content and platform links in `src/content`.
- Keep site-wide URLs, navigation, channels, and sitemap routes in `src/content/site.ts`.
- Keep page copy, route cards, CTAs, and page intro data in `src/content/pages.ts`.
- Keep Genesis Mesh domain data in `src/content/genesismesh.ts`.
- Put shared visual sections and UI primitives in `src/components`.
- Prefer shared classes from `src/app/globals.css` (`site-container`, `page-section`, `link-card`, `btn-*`, etc.) before adding one-off Tailwind strings.
- Keep icon color semantics consistent: lime for protocol/action emphasis, neutral white/soft surfaces for source, platform, and navigation markers.
- Keep route files small and focused on composition, data loading, and metadata.
- Use `src/content/metadata.ts` for ordinary page metadata instead of repeating Open Graph/Twitter objects.
- Keep Genesis Mesh framed as portable trust for sovereign systems, not as only an AI-agent framework.
- Prefer real product/source links over invented claims.
- Verify responsive UI after visual changes. Use temporary screenshots for desktop and mobile, review them, then delete them before committing.
- Run `npm run lint` and `npm run build` before publishing.

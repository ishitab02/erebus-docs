# erebus-docs

The Erebus documentation site. Next.js, static export, no server. Extracted from
`web/app/docs` in the main `PoulavBhowmick03/Erebus` repo on 2026-09-17 so the docs can be
deployed on their own domain.

Published at **https://docs.erebusagents.live**. Pages live at the domain root — `/` is the
Quickstart, not `/docs`.

## Routes

| path            | page                 |
| --------------- | -------------------- |
| `/`             | Quickstart           |
| `/how-it-works` | How it works         |
| `/concepts`     | Core concepts        |
| `/walkthrough`  | Walkthrough          |
| `/tools`        | Call the tools       |
| `/errors`       | Responses and errors |
| `/privacy`      | Privacy model        |
| `/limits`       | Limits               |
| `/architecture` | Architecture         |

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4000
pnpm build      # static export to ./out
pnpm typecheck
pnpm serve      # serve ./out on :4000
```

`pnpm-workspace.yaml` exists only to carry `allowBuilds` for pnpm 11; this package is
standalone and is not part of the main repo's workspace.

## Deploy

Vercel, git-driven: every push to `main` rebuilds. Static export (`output: "export"` in
`next.config.ts`), so there is no server and no runtime environment.

Custom domain `docs.erebusagents.live` is attached to this Vercel project. The DNS record
lives at GoDaddy for the apex `erebusagents.live`; Vercel prints the exact record to add when
the domain is added to the project.

## Content

Page text lives in `app/(docs)`, with shared definitions and examples in `lib/content.ts`.
The architecture diagram is `public/erebus-overview.svg`. The social preview is `public/og.png`.

Technical wording follows the `main` branch of the main `Erebus` repository.
This review used commit `27ced71` for Protocol 5 and wire v3. Check source code when
older upstream documents disagree with the current release. Keep the diagram and search
snippets consistent with page text when behavior changes.

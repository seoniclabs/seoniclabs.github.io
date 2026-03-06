# Seonic Web

Marketing and documentation site for Seonic, built with Next.js and exported as a static site for GitHub Pages.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Local Development

```bash
npm ci
npm run typecheck
npm run build
```

For a local dev server, run:

```bash
npm run dev
```

## Deployment

The site is configured for static export and GitHub Pages deployment through `.github/workflows/deploy.yml`.

For project Pages deployments, `next.config.mjs` derives `basePath` and `assetPrefix` from `GITHUB_REPOSITORY`, so assets and routes resolve correctly under `/<repo-name>`.

## License

MIT

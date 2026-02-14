# Tom Peirs CV Site

Personal CV/portfolio site built with Vite, React, TypeScript, TailwindCSS, shadcn-ui components, and Framer Motion.

## Development
1. Install dependencies: `npm install`
2. Start Vite dev server: `npm run dev`
3. Run tests: `npm run test`
4. Create a production build locally: `npm run build`

## Deployment
GitHub Pages is configured to build automatically using `.github/workflows/deploy.yml`. Every push to `main` triggers the workflow, which:
- installs dependencies and runs `npm run build`
- uploads the `dist/` folder as a Pages artifact
- deploys the artifact so `https://peirstom.github.io` is always up to date

No manual copying of `dist/` is required. Just push to `main` and GitHub Actions handles the rest.

## Project Structure
- `src/` – React components, pages, hooks, and utilities
- `public/` – static assets copied to the final build
- `vite.config.ts` – Vite configuration (React + TypeScript + alias)
- `tailwind.config.ts` and `src/index.css` – Tailwind theme setup
- `vitest.config.ts` plus `src/test/` – Vitest + Testing Library configuration

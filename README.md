# peirstom.github.io

This repository now contains both the published CV site and the source code that builds it.

## Structure
- `/site` – the Vite + React source (copied from the previous `tom-peirs.dev` project).
- Repository root – static build artifacts that GitHub Pages serves at https://peirstom.github.io/.

## Develop locally
```sh
cd site
npm install      # first time only
npm run dev      # start Vite locally
```

## Deploy
```sh
cd site
npm run deploy   # builds and copies /dist into the repo root
cd ..
git add -A
git commit -m "Deploy site"
git push
```

The deploy script preserves `/site`, `.git`, `.github`, and `README.md` so configuration files stay safe. Set the `PAGES_DIR` env var if you ever need to deploy to a different folder.

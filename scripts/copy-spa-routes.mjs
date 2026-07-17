// GitHub Pages serves HTTP 404 for paths without a file. The 404.html redirect
// makes deep links work in browsers, but crawlers see the 404 status and skip
// the page. Copying index.html to each route's folder makes every URL a real 200.
// Add new blog slugs here when adding posts (keep in sync with App.tsx routes).
import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const routes = [
  "blog/five-signs-terraform-slowing-your-team",
  "blog/knowledge-base-mcp-for-engineering-context",
  "blog/datadog-status-pages-and-slos",
  "blog/securing-aws-lambda-at-scale",
  "blog/devsecops-pipeline-patterns-gitlab",
  "blog/react-performance-in-enterprise-apps",
];

for (const route of routes) {
  const target = join("dist", route, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  cpSync(join("dist", "index.html"), target);
  console.log(`created ${target}`);
}

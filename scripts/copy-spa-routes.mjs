// GitHub Pages serves HTTP 404 for paths without a file. Copying index.html to
// each route's folder makes every URL a real 200 for crawlers, and injecting
// per-route meta means link previews (LinkedIn etc., whose crawlers don't run
// JS) show each article's own title instead of the site default.
// Add new blog posts here AND in src/components/RouteMeta.tsx (keep in sync).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const routes = [
  {
    path: "blog/five-signs-terraform-slowing-your-team",
    title: "5 Signs Your Terraform Setup Is Slowing Your Team Down · Tom Peirs",
    description:
      "Copy-paste modules, plans nobody trusts, snowflake environments: five symptoms of an immature Terraform setup and the order I fix them in.",
  },
  {
    path: "blog/knowledge-base-mcp-for-engineering-context",
    title: "Building a Knowledge-Base MCP for Engineering Context · Tom Peirs",
    description:
      "How I built a knowledge-base MCP: a Python server, a RAG pipeline over pipelines, Terraform and docs, deployed on AWS Bedrock AgentCore with weekly refresh.",
  },
  {
    path: "blog/datadog-status-pages-and-slos",
    title: "Automated Status Pages and Year-to-Date SLOs in Datadog · Tom Peirs",
    description:
      "Building a zero-maintenance status page and year-to-date SLO dashboards in Datadog with Workflow Automations, custom health metrics and historical backfill.",
  },
  {
    path: "blog/securing-aws-lambda-at-scale",
    title: "Securing AWS Lambda at Scale · Tom Peirs",
    description:
      "Least-privilege IAM, runtime protections and anomaly monitoring for AWS Lambda. Patterns that keep serverless workloads secure without slowing teams down.",
  },
  {
    path: "blog/devsecops-pipeline-patterns-gitlab",
    title: "DevSecOps Pipeline Patterns with GitLab CI/CD · Tom Peirs",
    description:
      "How I structure GitLab CI/CD stages to run SAST, DAST and dependency scanning in parallel and gate releases without creating bottlenecks.",
  },
  {
    path: "blog/react-performance-in-enterprise-apps",
    title: "React Performance in Enterprise Apps · Tom Peirs",
    description:
      "Code-splitting, memoization and state management techniques that keep enterprise React apps fast in production.",
  },
];

const template = readFileSync(join("dist", "index.html"), "utf8");

for (const { path, title, description } of routes) {
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1https://peirstom.github.io/${path}$2`);
  const target = join("dist", path, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  console.log(`created ${target}`);
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_META = {
  title: "Tom Peirs · Platform Engineering & DevOps",
  description:
    "Platform and DevOps engineer in Zurich. I turn messy cloud infrastructure into low-maintenance, developer-friendly platforms: Terraform, CI/CD, AWS and Azure.",
};

const META: Record<string, { title: string; description: string }> = {
  "/": DEFAULT_META,
  "/blog/five-signs-terraform-slowing-your-team": {
    title: "5 Signs Your Terraform Setup Is Slowing Your Team Down · Tom Peirs",
    description:
      "Copy-paste modules, plans nobody trusts, snowflake environments: five symptoms of an immature Terraform setup and the order I fix them in.",
  },
  "/blog/knowledge-base-mcp-for-engineering-context": {
    title: "Building a Knowledge-Base MCP for Engineering Context · Tom Peirs",
    description:
      "How I built a knowledge-base MCP: a Python server, a RAG pipeline over pipelines, Terraform and docs, deployed on AWS Bedrock AgentCore with weekly refresh.",
  },
  "/blog/datadog-status-pages-and-slos": {
    title: "Automated Status Pages and Year-to-Date SLOs in Datadog · Tom Peirs",
    description:
      "Building a zero-maintenance status page and year-to-date SLO dashboards in Datadog with Workflow Automations, custom health metrics and historical backfill.",
  },
  "/blog/securing-aws-lambda-at-scale": {
    title: "Securing AWS Lambda at Scale · Tom Peirs",
    description:
      "Least-privilege IAM, runtime protections and anomaly monitoring for AWS Lambda. Patterns that keep serverless workloads secure without slowing teams down.",
  },
  "/blog/devsecops-pipeline-patterns-gitlab": {
    title: "DevSecOps Pipeline Patterns with GitLab CI/CD · Tom Peirs",
    description:
      "How I structure GitLab CI/CD stages to run SAST, DAST and dependency scanning in parallel and gate releases without creating bottlenecks.",
  },
  "/blog/react-performance-in-enterprise-apps": {
    title: "React Performance in Enterprise Apps · Tom Peirs",
    description:
      "Code-splitting, memoization and state management techniques that keep enterprise React apps fast in production.",
  },
};

const setMetaContent = (selector: string, attribute: string, value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    const [attrName, attrValue] = attribute.split("=");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
};

const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = META[pathname] ?? DEFAULT_META;
    document.title = meta.title;
    setMetaContent('meta[name="description"]', "name=description", meta.description);
    setMetaContent('meta[property="og:title"]', "property=og:title", meta.title);
    setMetaContent('meta[property="og:description"]', "property=og:description", meta.description);
    setMetaContent('meta[property="og:url"]', "property=og:url", `https://peirstom.github.io${pathname === "/" ? "/" : pathname}`);
  }, [pathname]);

  return null;
};

export default RouteMeta;

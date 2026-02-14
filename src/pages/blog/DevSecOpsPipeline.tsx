import { Link } from "react-router-dom";

const phases = [
  {
    title: "Blueprint: Security as the Default",
    paragraphs: [
      "Every pipeline starts with alignment between platform, product, and security. I document threat models per service, define risk appetite, and map controls to pipeline stages. The guardrails become part of the merge request template so developers know exactly which evidences an MR must produce before it can ship.",
      "From there I build a reusable GitLab CI/CD template (think `include:`) that exposes toggles for language-specific scanners but keeps the core flow identical: lint → unit → SCA/SAST → build artifact → DAST/IaC → deploy. Pipelines inherit the template, so we avoid bespoke YAML that drifts out of compliance.",
    ],
    callouts: [
      "Store policy-as-code (OPA/Conftest) in the same repo so rule changes version alongside application commits.",
      "Enforce branch protection with signed commits plus CODEOWNERS entries for security-critical paths.",
    ],
  },
  {
    title: "Parallelize Checks Without Slowing Down",
    paragraphs: [
      "Traditional pipelines serialize scans, making developers wait minutes before seeing feedback. In GitLab I break scans into independent stages and rely on the DAG view so SAST, dependency, container, and IaC scanners run concurrently. The only gating rule is that all security jobs must report `allow_failure: false` before we promote an artifact.",
      "To avoid re-downloading toolchains, each scanner job runs inside a hardened container image that already contains the required CLI. We publish those images to the GitLab Container Registry and sign them with cosign, guaranteeing provenance. Cache keys tie to the dependency lockfiles, keeping runtimes predictable.",
    ],
    callouts: [
      "Use `needs:` to connect jobs so only the minimal prerequisites run before an environment deploy.",
      "Emit SARIF reports so Merge Request widgets show findings inline, eliminating the need to parse raw logs.",
    ],
  },
  {
    title: "Gate Deployments with Risk Signals",
    paragraphs: [
      "Security data is only useful if it influences release decisions. Every scan publishes a JSON summary to a central channel (Elastic + Slack). A lightweight policy engine evaluates severity, exploitability, and compensating controls; if risk exceeds tolerance, the pipeline triggers a manual approval and posts context to the on-call channel.",
      "For production releases, I integrate GitLab's `deployments` API with ServiceNow change records. The pipeline attaches evidence (scan reports, test coverage, artifact hash) to the change ticket so auditors can trace every deployment to its security posture.",
    ],
    callouts: [
      "Rotate pipeline tokens and limit them to `read_api`/`write_repository`; use short-lived OIDC tokens for cloud deploys.",
      "Mirror critical repositories to a fallback Git provider so a GitLab outage doesn't halt hotfixes.",
    ],
  },
  {
    title: "Continuously Improve",
    paragraphs: [
      "Dashboards (Grafana/Loki) track mean time to remediate findings, pipeline duration, and flaky-job counts. When a metric drifts, we host blameless reviews to understand whether tooling, process, or people need support. Those insights feed back into the template so future services inherit the fixes.",
      "Finally, security champions inside each squad own the backlog of pipeline enhancements. By sharing metrics and success stories, we keep momentum and prove that security can accelerate delivery rather than block it.",
    ],
    callouts: [
      "Instrument pipelines with OpenTelemetry traces so you can pinpoint bottlenecks per job.",
      "Treat every pipeline change like application code: unit test it, peer review it, and ship via merge requests.",
    ],
  },
];

const DevSecOpsPipeline = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Writing · DevSecOps</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">DevSecOps Pipeline Patterns with GitLab CI/CD</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A field-tested blueprint for pipelines where security is baked into every merge request, not bolted on at the end.
          </p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed text-muted-foreground">
          {phases.map((phase) => (
            <section key={phase.title} className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">{phase.title}</h2>
              {phase.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="font-light">
                  {paragraph}
                </p>
              ))}
              <div className="bg-muted rounded-xl p-5 border border-border/60">
                <p className="font-semibold text-sm uppercase tracking-wide text-foreground mb-3">Playbook Tips</p>
                <ul className="list-disc list-inside space-y-2 text-sm font-light">
                  {phase.callouts.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 flex justify-between items-center border-t border-border pt-8">
          <Link to="/" className="font-sans text-sm text-primary underline hover:text-primary/80">
            ← Back to homepage
          </Link>
          <a href="mailto:peirstom@gmail.com" className="font-sans text-sm text-foreground hover:text-primary transition-colors">
            Book a pipeline review →
          </a>
        </div>
      </div>
    </div>
  );
};

export default DevSecOpsPipeline;

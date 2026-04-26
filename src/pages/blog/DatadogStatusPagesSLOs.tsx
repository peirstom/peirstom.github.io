import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Why Status Pages Matter in Enterprise",
    body: [
      <>Monitoring tools like Datadog give your engineering teams <strong>deep, real-time visibility</strong> into cloud infrastructure — metrics, traces, logs, synthetic tests, all in one place. That visibility is invaluable for debugging and capacity planning. But there is a parallel audience that needs to understand your infrastructure health too: <strong>your stakeholders</strong>.</>,
      <>In mature organisations, staying ahead of incidents is only half the battle. <strong>The other half is communication.</strong> When services degrade, the questions come fast — from product managers, from account teams, from executives. A well-maintained status page <strong>answers those questions before they are even asked</strong>. It replaces ad-hoc Slack announcements, email chains, and manual maintenance notices with a <strong>single, authoritative, self-service source of truth</strong> that anyone can subscribe to.</>,
    ],
    highlights: [
      "Team distribution lists can subscribe to status page notifications, replacing hand-crafted announcement emails.",
      "A public or internal status page signals operational maturity — it shows stakeholders that incidents are managed, not just survived.",
    ],
  },
  {
    title: "2. Datadog's Status Page — and the Atlassian Irony",
    body: [
      <>Here is something worth knowing before you design your solution: <strong>Datadog's own service status lives on an Atlassian Statuspage instance.</strong> They are not alone — Atlassian Statuspage is the de-facto standard for SaaS incident communication, and Datadog uses it just like everyone else, even though Datadog ships its own Status Page feature as part of the Incident Management suite.</>,
      <>I did a deep dive into Datadog's native status page capability. The feature is clean and effective: you define components representing your services, mark them as operational, degraded, or down, attach incidents, and let subscribers receive real-time email and webhook updates. The interface is simple enough that non-engineers can read it, and structured enough that on-call engineers can update it consistently. <strong>The gap is integration</strong> — as of today, there is <strong>no native connection between a Datadog monitor firing and the status page component flipping to degraded</strong>. That gap is exactly where the interesting engineering lives.</>,
    ],
    highlights: [
      "Datadog Status Page is part of the Incident Management suite — separate from the Atlassian-backed status.datadoghq.com.",
      "Component granularity is a design choice: too coarse and you lose signal, too fine and the page becomes noisy.",
    ],
  },
  {
    title: "3. Zero-Maintenance Automation via Workflow Automations",
    body: [
      <>The goal was straightforward: when a service degrades, the status page should reflect that <strong>automatically, without anyone opening a browser</strong>. Datadog's <strong>Workflow Automation</strong> feature makes this achievable. Workflows are event-driven orchestration layers that sit above monitors, synthetic tests, and metric alerts. You wire a trigger condition to an action sequence, and Datadog handles the rest.</>,
      <>The pattern we settled on is <strong>bidirectional</strong>: if a composite monitor enters an alert state, the workflow fires the <strong>Datadog Status Pages API</strong> to open a degradation or outage on the corresponding component. When the monitor recovers, the same workflow resolves the incident. The Status Pages API covers everything needed — create an incident, update its status, resolve it — giving you <strong>full lifecycle automation with no human in the loop</strong>. The documentation lives at docs.datadoghq.com/api/latest/status-pages/ and covers the endpoints clearly. This automated loop now runs silently in production, and <strong>the status page reflects reality within seconds of a monitor transition</strong>.</>,
    ],
    highlights: [
      "Workflow Automations support both monitor-based and synthetic-based triggers — you can chain both into the same status page update workflow.",
      "Build one workflow per component with alert → create-incident and recovery → resolve-incident branches to keep logic clean.",
      "The Status Pages API accepts structured severity levels, so you can distinguish 'degraded performance' from 'full outage' automatically.",
    ],
  },
  {
    title: "4. Composite Monitors: Modelling Real-World Degradation",
    body: [
      <>One problem that surfaces quickly with status pages is granularity. A component on the page is typically a high-level service — 'Payments', 'API Gateway', 'Data Pipeline'. But those services are composed of many sub-components, each monitored individually. <strong>If one synthetic test fails out of three, is the service actually down? Probably not.</strong></>,
      <><strong>Composite monitors</strong> solve this precisely. Datadog lets you combine existing monitors using boolean logic, and the composite monitor only alerts when the defined condition is met. We model each status page component as a composite monitor that uses <strong>AND logic</strong>: the component is only considered down <strong>when all of its sub-monitors are in alert simultaneously</strong>. This prevents a single flapping synthetic from triggering a public incident. It also makes the trigger semantics explicit and reviewable — the composite definition is the documented definition of 'this component is down'.</>,
    ],
    highlights: [
      "Use AND (&&) logic in composites to require multiple failure signals before declaring an outage — prevents noise-driven false positives.",
      "Combine synthetic tests and metric-based monitors in the same composite to model both availability and performance degradation.",
      "Composite monitors serve double duty: they trigger the status page workflow and serve as the health signal for SLO calculation.",
    ],
  },
  {
    title: "5. SLO Dashboards: Breaking the 90-Day Ceiling",
    body: [
      <>The status page is excellent for real-time communication, but it has a hard limitation: <strong>the incident history only reaches back 90 days</strong>. That is not useful when an executive asks for year-to-date uptime, or when you need to demonstrate SLA compliance over a contract period.</>,
      <>The solution is to build a separate SLO dashboard in Datadog, but this comes with its own complexity. Datadog SLOs come in two flavours: <strong>monitor-based</strong> and <strong>metric-based</strong>. Monitor-based SLOs are easy to create but difficult to combine accurately. If you group three monitor-based SLOs into a parent SLO, <strong>Datadog defaults to OR logic</strong> — meaning the parent SLO fails if any single sub-SLO fails. For a service with redundant sub-components this produces misleading numbers, and the only manual escape valve is the <strong>corrections feature</strong>, which requires ongoing human intervention to apply. That is the opposite of zero-maintenance.</>,
    ],
    highlights: [
      "Datadog composite SLOs use OR logic by default — this is correct for some architectures but wrong for redundant systems.",
      "The SLO corrections feature can paper over bad numbers but creates a maintenance burden that grows with time.",
      "Year-to-date metrics require a persistence mechanism that outlasts the 90-day status page window.",
    ],
  },
  {
    title: "6. Custom Metrics and Historical Backfill",
    body: [
      <>To get accurate, long-lived SLO data that respects AND logic, we designed <strong>custom health metrics</strong> — one per status page component, named with a consistent convention such as <strong>statuspage.health.payments</strong>, statuspage.health.api_gateway, and so on. A poller workflow runs every minute, evaluates the same composite monitor used to trigger the status page, and writes a value of <strong>1 (healthy) or 0 (degraded)</strong> to the custom metric. The SLO for each component is then a metric-based SLO on that custom metric, which Datadog can calculate correctly over any time window.</>,
      <>There is one final wrinkle: if you implement this solution mid-year, you have six months of missing data. The custom metric did not exist before you created it, so naive SLO calculations would show a <strong>false 100% uptime</strong> for the blank period. Datadog's <strong>Historical Metrics Ingestion</strong> feature handles exactly this case. You can submit metric points with past timestamps, <strong>effectively backfilling the health signal</strong> for periods you can reconstruct from incident records, logs, or the status page history. The documentation at docs.datadoghq.com/metrics/custom_metrics/historical_metrics/ covers both the API approach and Python SDK usage. This lets you populate the full year — including any known outages — before you present the dashboard to stakeholders.</>,
    ],
    highlights: [
      "Use a poller workflow on a 1-minute interval to write 0/1 health values to a custom metric, keeping SLO data in sync with composite monitor state.",
      "Historical Metrics Ingestion lets you backfill past outage periods so year-to-date SLO numbers are accurate from day one.",
      "One custom metric per component keeps SLO calculations independent — no cross-contamination between services.",
    ],
  },
];

const DatadogStatusPagesSLOs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Writing · Datadog · Observability</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Automated Status Pages and Year-to-Date SLOs in Datadog</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Datadog gives engineers deep infrastructure visibility, but keeping stakeholders informed and proving long-term
            reliability requires an extra layer of engineering. Here is how we built a fully automated status page and a
            year-to-date SLO dashboard — with zero ongoing maintenance.
          </p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed text-muted-foreground">
          {sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
              {section.body.map((paragraph, idx) => (
                <p key={idx} className="font-light">
                  {paragraph}
                </p>
              ))}
              <div className="bg-muted rounded-xl p-5 border border-border/60">
                <p className="font-semibold text-sm uppercase tracking-wide text-foreground mb-3">Field Notes</p>
                <ul className="list-disc list-inside space-y-2 text-sm font-light">
                  {section.highlights.map((tip) => (
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
            Discuss observability architecture →
          </a>
        </div>
      </div>
    </div>
  );
};

export default DatadogStatusPagesSLOs;

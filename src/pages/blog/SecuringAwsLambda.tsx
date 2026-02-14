import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Model the Blast Radius Before Writing Code",
    body: [
      "Start with a simple inventory: which teams own the functions, what data they touch, and which accounts/environments they live in. I map those details into an ADR (architecture decision record) so everyone agrees on the desired trust boundaries.",
      "From there, design the minimum IAM surface. Each function receives its own execution role scoped to exactly the AWS API calls it needs, and access to parameters is delegated by resource tag. CloudFormation stacks (or CDK constructs) enforce those relationships so the deploy pipeline fails if a developer tries to grant `*:*` access.",
    ],
    highlights: [
      "Tag Lambda functions and IAM roles with `Environment`, `DataClassification`, and `Owner` for later policy scoping.",
      "Block wildcard resources in IAM by using `aws:requestTag` conditions inside service control policies.",
    ],
  },
  {
    title: "2. Bake Guardrails into CI/CD",
    body: [
      "A Lambda that ships without scrutiny will accumulate permissions. I wire the pipeline so that every merge request runs: (a) IaC scanning (cfn-nag + Checkov) for CloudFormation/CDK templates, (b) policy linting via `iam-live` to spot unused actions, and (c) unit tests that exercise the handler with mocked context.",
      "The pipeline publishes a signed SAR (Serverless Application Repository) layer containing baseline observability tooling—AWS Powertools, structured logging, and a custom metric decorator—so every function gets the same safeguards by default.",
    ],
    highlights: [
      "Fail the build when a function-env pair lacks mandatory environment variables such as `POWERTOOLS_SERVICE_NAME`.",
      "Use GitLab/GitHub protected environments so only security reviewers can approve production Lambda deploys.",
    ],
  },
  {
    title: "3. Instrument Runtime Protections",
    body: [
      "Better IAM reduces risk, but you still need detection. Each function ships with AWS Lambda Extensions that forward logs to AWS Security Lake in near real time. We layer AWS WAF on API Gateway/Lambda URLs and enable AWS Shield Advanced for mission-critical endpoints.",
      "Runtime monitoring looks for privileged API calls (for example `ssm:GetParameter` against secrets) that deviate from an established baseline. When they do, EventBridge triggers an automated isolation playbook that revokes the execution role, pages the on-call, and snapshots logs for forensics.",
    ],
    highlights: [
      "Enable Lambda insights with enhanced metrics so cold-start spikes, memory thrash, and throttles surface quickly.",
      "Route detections to Security Hub with custom finding types so they participate in organization-level metrics.",
    ],
  },
  {
    title: "4. Close the Feedback Loop",
    body: [
      "Security controls only stick when teams see outcomes. Every Friday the DevSecOps crew reviews IAM usage reports (from Access Analyzer) with product squads. If an action hasn’t been used in 30 days it’s pruned. If a function repeatedly hits concurrency limits, we investigate whether retry storms could mask an incident.",
      "Finally, we run quarterly GameDays that simulate key compromise, runaway costs, and supply-chain attacks on Lambda layers. Those drills refine our runbooks and validate that alarms reach humans as fast as machines.",
    ],
    highlights: [
      "Export IAM Access Advisor data to Athena for trend analysis across thousands of roles.",
      "Document remediation steps in runbooks stored next to the code so context travels with each function.",
    ],
  },
];

const SecuringAwsLambda = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Writing · AWS Security</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Securing AWS Lambda at Scale</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Serverless gives teams insane velocity, but that speed collapses if permissions sprawl or runtime attacks go
            undetected. This field guide documents how I run Lambda programs that are fast, compliant, and battle-tested.
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
            Discuss a security review →
          </a>
        </div>
      </div>
    </div>
  );
};

export default SecuringAwsLambda;

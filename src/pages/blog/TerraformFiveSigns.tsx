import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Copy-Paste Modules Everywhere",
    body: [
      <>You need to change one firewall rule, and you end up editing twelve nearly identical files. Somebody once copied a working block, then somebody copied the copy. Now every environment has its own slightly divergent version of the same resource: <strong>same intent, different drift</strong>.</>,
      <>The test is simple. Grep for something that should be defined once: a security group rule, a bucket policy, a tagging standard. <strong>If it comes back in double digits, every future change costs double digits too.</strong></>,
      <>The fix is reusable modules with well-chosen variables, extracted at the right moment. A module carved out too early, around the wrong abstraction, hurts as much as the copy-paste did. My rule of thumb: <strong>tolerate the second repetition, extract on the third</strong>, when you can actually see which parts vary.</>,
    ],
    highlights: [
      "Grep for anything that should exist once; double-digit hits mean double-digit cost per change.",
      "Copy-paste drift is silent: each duplicate mutates independently until no two environments agree.",
      "Extract modules on the third repetition. Early abstractions around the wrong axis hurt as much as duplication.",
    ],
  },
  {
    title: "2. A Plan Nobody Trusts",
    body: [
      <>You run <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">terraform plan</code> and it announces 47 changes for a one-line edit. Everyone squints at the wall of diff, decides it's probably just the usual noise, and applies anyway. Or worse: applies with <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">-target</code> to route around it.</>,
      <>That noise has a history. Someone once fixed an incident directly in the console at 2 a.m. and never backported it. Then it happened again. Now reality and code disagree in dozens of places, and the plan output, <strong>the one safety mechanism Terraform gives you</strong>, has become something the team has learned to ignore.</>,
      <>A plan you can't read in one screen and trust completely isn't a formality problem. It means you no longer know what applying will do. <strong>That's not automation. That's gambling with extra steps.</strong></>,
    ],
    highlights: [
      "Drift starts as incident hotfixes in the console that never get backported to code.",
      "Once the team learns to ignore plan noise, Terraform's core safety mechanism is effectively disabled.",
      "Target state: a plan you can read in one screen and trust completely. Anything else is applied hope.",
    ],
  },
  {
    title: "3. One Person Holds All the Knowledge",
    body: [
      <>Every team has someone who's "good with the infra." That's fine. What's not fine is when applying changes <strong>requires</strong> that person, because only they know that the modules have to be applied in a particular order, that workspace X shares state with Y, that the script in <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">/scripts</code> must run first, and that the one in <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">/tools</code> must never run again.</>,
      <>You can measure this one in the calendar: <strong>when that person is on vacation, infrastructure work stops.</strong></>,
      <>Bus factor 1 isn't a people problem, it's an architecture problem. The knowledge lives in a head because the setup is too irregular to live anywhere else. <strong>A boring, uniform structure is what makes knowledge transferable.</strong></>,
    ],
    highlights: [
      "If applying changes requires a specific human, the architecture is the bottleneck, not the human.",
      "Measure it in the calendar: vacations that freeze infrastructure work are a bus-factor-1 alarm.",
      "Irregular setups force knowledge into heads; uniform ones let it live in the repo where anyone can read it.",
    ],
  },
  {
    title: "4. Environments That Don't Match",
    body: [
      <>Staging was hand-tuned during an incident in 2023. Production got the fix a different way. Dev was cloned from an old branch and nobody remembers which. Each environment is now a snowflake, and <strong>"it works on staging" has become a statement about staging</strong>, not about production.</>,
      <>The whole value of infrastructure as code is that environments are <strong>the same code with different inputs</strong>. Same modules, different variables. Nothing else.</>,
      <>The moment an environment can only be reproduced by remembering what was clicked, you don't have infrastructure as code anymore. You have <strong>infrastructure with code-flavored documentation</strong>.</>,
    ],
    code: [
      {
        label: "the whole difference between environments, in one listing",
        content: `environments/
  dev.tfvars        # size, counts, feature flags
  staging.tfvars
  prod.tfvars
modules/            # identical for every environment — no exceptions`,
      },
    ],
    highlights: [
      "Environments must differ only in their variables: same modules, same structure, different tfvars.",
      "Every hand-applied incident fix that isn't backported turns an environment into a snowflake.",
      "If reproducing an environment requires remembering clicks, the code is documentation, not infrastructure.",
    ],
  },
  {
    title: "5. Security Bolted On, Not Built In",
    body: [
      <>Secrets sitting in <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">tfvars</code> files, which means they're in git history. IAM policies with wildcards nobody dares tighten. Long-lived cloud keys on developer laptops, the same laptops deployments run from. A security review that happens annually, in a meeting, instead of on every change, in the pipeline.</>,
      <><strong>Bolted-on security loses to deadlines every time</strong>, because it depends on someone remembering to care under pressure. Built-in security wins by default: format and validation checks, a linter, a policy scanner and a reviewed plan as pipeline gates. Short-lived credentials via OIDC instead of static keys. Secrets in a secrets manager, referenced in code and never stored there.</>,
      <>When the pipeline is the only path to production, the guardrails work even on the busy days. <strong>Especially on the busy days.</strong></>,
    ],
    code: [
      {
        label: ".gitlab-ci.yml — gates that make the right way the only way",
        content: `stages: [validate, plan, apply]

fmt-and-validate:
  stage: validate
  script:
    - terraform fmt -check -recursive
    - terraform validate

lint-and-policy:
  stage: validate
  script:
    - tflint --recursive
    - checkov -d . --quiet     # policy + secret scanning on every change

plan:
  stage: plan
  script:
    - terraform plan -out=tfplan
  artifacts:
    paths: [tfplan]

apply:
  stage: apply
  script:
    - terraform apply tfplan   # applies exactly the reviewed plan
  when: manual                 # a human approves what they can read
  environment: production`,
      },
    ],
    highlights: [
      "Security that depends on remembering to care loses to deadlines; gates in the pipeline win by default.",
      "OIDC-issued short-lived credentials remove the scariest artifact: long-lived keys on laptops.",
      "Secrets live in a secrets manager and are referenced in code, never stored in it.",
    ],
  },
  {
    title: "6. What Mature Looks Like",
    body: [
      <>None of this is exotic. A mature setup is mostly boring, and that's the point. <strong>A state layout that matches how the team actually works</strong>, with no mystery workspaces and no apply-order folklore. <strong>A plan you can read in one screen and trust completely.</strong> <strong>Environments that differ only in their variables.</strong> <strong>One automated path to production with quality and security gates built in</strong>, and no deploys from laptops. A structure a new engineer can navigate in their first week, without the oral tradition.</>,
      <>Infrastructure should be boring, in the best way. <strong>Boring means predictable, reviewable, changeable at will.</strong> Every hour your team spends fighting the setup is an hour not spent shipping, and unlike feature work this cost compounds silently.</>,
      <>If you recognized your setup in more than two of these signs, the good news is that the path out is well-trodden: <strong>unify the state layout first, make the plan trustworthy second, automate the path to production third.</strong> In my experience the first two weeks of a determined cleanup remove most of the daily pain. The rest is discipline, and the pipeline enforces that for free.</>,
    ],
    highlights: [
      "Maturity is boring on purpose: predictable, reviewable, changeable at will.",
      "Fix in this order: state layout → trustworthy plan → automated, gated path to production.",
      "Two determined weeks remove most of the daily pain; the pipeline enforces the rest for free.",
    ],
  },
];

const TerraformFiveSigns = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Writing · Terraform · Platform Engineering</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">5 Signs Your Terraform Setup Is Slowing Your Team Down</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Terraform setups don't fail loudly. They rot quietly while everyone is busy shipping features. Then one day a
            routine change takes three days, needs the one person who knows how the state works, and everyone quietly agrees
            to stop touching infrastructure unless absolutely necessary. I've seen this pattern at enterprise scale and at
            startup scale. The details differ; the symptoms don't. Here are the five I look for first.
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
              {section.code?.map((snippet) => (
                <figure key={snippet.label} className="space-y-2">
                  <figcaption className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                    {snippet.label}
                  </figcaption>
                  <pre className="bg-muted rounded-xl p-5 border border-border/60 overflow-x-auto text-sm">
                    <code className="font-mono text-foreground">{snippet.content}</code>
                  </pre>
                </figure>
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
            Talk Terraform →
          </a>
        </div>
      </div>
    </div>
  );
};

export default TerraformFiveSigns;

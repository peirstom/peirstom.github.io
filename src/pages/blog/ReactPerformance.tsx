import { Link } from "react-router-dom";

const topics = [
  {
    title: "Audit the Critical Path",
    content: [
      "Start with the real user experience, not synthetic benchmarks. I pull Core Web Vitals from RUM tooling and match slow loads to user journeys (e.g., enterprise dashboard, reporting). Lighthouse traces and React Profiler exports show which components mount on the initial route; anything not essential moves behind lazy boundaries.",
      "Bundle splitting works only if teams enforce boundaries. I create route-level chunks with `React.lazy`, but also leverage `@loadable/component` for shared widgets so dashboards load charts only when they scroll into view. Webpack/Vite bundle analyzer budgets keep the main chunk below 200 kB gzipped.",
    ],
    checklist: [
      "Serve modern syntax (ES2022) via browserslist targets to avoid shipping redundant polyfills.",
      "Inline critical CSS using `@layer base` utilities and stream the rest via Tailwind's `content-visibility` patterns.",
    ],
  },
  {
    title: "Control State Explosion",
    content: [
      "Enterprise teams often propagate global context everywhere. I separate concerns: server cache lives in React Query, view state stays local, and cross-cutting events push through a typed event bus. Memoization is applied intentionally—`useMemo` protects derived arrays, while `useCallback` pairs with dependency arrays tied to primitives, not objects.",
      "For complex forms or tables, I snapshot selectors using Zustand or Jotai so only the relevant rows re-render. React DevTools flame charts highlight components with >5ms render cost; those become candidates for virtualization (React Window) or `memo`-wrapped cells.",
    ],
    checklist: [
      "Never pass newly created inline objects to deeply nested components; extract them outside render.",
      "Use `React.Suspense` boundaries to progressively reveal content instead of blocking on all requests.",
    ],
  },
  {
    title: "Optimize Data Fetching",
    content: [
      "I front-load fast, cacheable queries via HTTP/2 multiplexing and rely on ETags so repeat visits only revalidate. React Query's `prefetchQuery` warms caches during navigation, meaning the next screen renders instantly. For dashboards, I aggregate API calls through BFF endpoints to trim round-trips and control payload shape.",
      "Streaming SSR (via React 18) pairs nicely with enterprise apps: header, nav, and skeletons render instantly while data-heavy widgets hydrate when ready. If SSR isn't an option, I still enable progressive hydration with `hydrateRoot` to prevent blocking main-thread work.",
    ],
    checklist: [
      "Configure CDN cache keys that include tenant and locale to maximize hit rates without leaking data.",
      "Compress JSON with Brotli and prune unused fields server-side to keep payloads lean.",
    ],
  },
  {
    title: "Measure, Improve, Repeat",
    content: [
      "Performance tuning never ends. Each release pipeline captures bundle sizes, render timings (via automated Cypress + Web Vitals), and slow-query metrics. Regressions fail the build. Ops dashboards feed alerts to Slack when P95 TTFB or LCP degrade beyond thresholds, triggering a swarming session before users notice.",
      "Sharing the wins is crucial. I document before/after metrics with flame charts and bundle diffs so stakeholders see the impact: shaving 250ms off first render increased weekly active users by 7% for a finance client.",
    ],
    checklist: [
      "Track Web Vitals per tenant to catch regional latency issues masked by global averages.",
      "Automate dependency upgrades (Renovate) to keep modern React/TypeScript optimizations accessible.",
    ],
  },
];

const ReactPerformance = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Writing · Frontend</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">React Performance in Enterprise Apps</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Practical patterns that keep multi-team React platforms fast, resilient, and shippable week after week.
          </p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed text-muted-foreground">
          {topics.map((topic) => (
            <section key={topic.title} className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">{topic.title}</h2>
              {topic.content.map((paragraph, idx) => (
                <p key={idx} className="font-light">
                  {paragraph}
                </p>
              ))}
              <div className="bg-muted rounded-xl p-5 border border-border/60">
                <p className="font-semibold text-sm uppercase tracking-wide text-foreground mb-3">Checklist</p>
                <ul className="list-disc list-inside space-y-2 text-sm font-light">
                  {topic.checklist.map((item) => (
                    <li key={item}>{item}</li>
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
            Need a performance audit? →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReactPerformance;

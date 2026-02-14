import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const posts = [
  {
    title: "Securing AWS Lambda at Scale",
    slug: "securing-aws-lambda-at-scale",
    excerpt: "Lambda functions are deceptively simple to deploy — and deceptively easy to misconfigure. In this post, I walk through how I implement least-privilege IAM policies, layer runtime protections, and monitor for anomalies across hundreds of functions. From scoping execution roles to using Lambda extensions for real-time threat detection, these are the patterns that have kept production workloads secure without sacrificing developer velocity.",
    date: "Feb 10, 2026",
    readTime: "8 min read",
    tags: ["AWS", "Security"],
  },
  {
    title: "DevSecOps Pipeline Patterns with GitLab CI/CD",
    excerpt: "Most teams bolt security onto their pipeline as an afterthought — a SAST scan here, a container check there. I've spent the past two years designing pipelines where security is a first-class citizen. This piece covers how I structure GitLab CI/CD stages to run SAST, DAST, and dependency scanning in parallel, enforce branch protection rules, and gate releases without creating bottlenecks. The goal: shift left without slowing down.",
    date: "Jan 28, 2026",
    readTime: "6 min read",
    tags: ["DevSecOps", "GitLab CI/CD"],
  },
  {
    title: "React Performance in Enterprise Apps",
    excerpt: "When your React app serves thousands of users and ships weekly, performance isn't optional — it's infrastructure. I share the techniques I use to keep enterprise frontends fast: code-splitting strategies that actually work, memoization patterns that don't add complexity, and state management approaches that scale. Real examples from production apps where shaving 200ms off initial load made a measurable business impact.",
    date: "Jan 15, 2026",
    readTime: "10 min read",
    tags: ["React", "Frontend"],
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-24 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Writing</h2>
          <div className="divide-y divide-border">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group py-8 first:pt-0 last:pb-0"
              >
                {post.slug ? (
                  <Link to={`/blog/${post.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-sans text-xs text-muted-foreground">{post.date}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="font-sans text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3 font-light">{post.excerpt}</p>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="font-sans text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-sans text-xs text-muted-foreground">{post.date}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="font-sans text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3 font-light">{post.excerpt}</p>
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="font-sans text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;

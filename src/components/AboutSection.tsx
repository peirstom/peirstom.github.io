import { motion } from "framer-motion";
import { Shield, Cloud, Layers, Boxes, Sparkles } from "lucide-react";

const skills = [
  { icon: Cloud, label: "AWS & Azure", description: "Multi-account architectures, IAM, networking, Control Tower, cost-aware design" },
  { icon: Layers, label: "Infrastructure as Code", description: "Terraform module and state design, reusable IaC, environments that don't drift" },
  { icon: Shield, label: "CI/CD & DevSecOps", description: "GitLab CI/CD, pipeline templates, security and quality gates, release workflows" },
  { icon: Boxes, label: "Platforms & Containers", description: "Kubernetes, Docker, Helm, observability with Datadog and Prometheus/Grafana" },
  { icon: Sparkles, label: "AI-Assisted Engineering", description: "LLM integration, MCP servers, RAG pipelines, AI-powered engineering workflows" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">About Me</h2>
          <div className="space-y-5 text-muted-foreground text-lg leading-relaxed mb-12 font-light">
            <p>
              I'm a platform and DevOps engineer. My work is making cloud infrastructure
              effective, efficient and easy to work with: low-maintenance platforms that
              developers actually like using.
            </p>
            <p>
              Ten years across enterprise and scale-up environments taught me the same
              lesson everywhere. When infrastructure is organized and automated, teams
              move fast. When it isn't, everything slows down: deploys get scary,
              environments drift apart, and one overloaded engineer becomes the
              bottleneck for the whole company.
            </p>
            <p>
              That transition is my specialty. I unify grown Terraform setups into clean,
              reusable modules, build CI/CD pipelines with security and quality gates
              baked in, and turn manual deployment processes into automation nobody has
              to think about.
            </p>
            <p>
              Currently available for <span className="text-primary font-medium">project work</span> and
              consulting engagements.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-muted rounded-lg p-5 hover:shadow-sm transition-shadow"
              >
                <skill.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-sans font-semibold text-sm text-foreground mb-1">{skill.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{skill.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

import { motion } from "framer-motion";
import { Shield, Cloud, Code, Terminal, Sparkles } from "lucide-react";

const skills = [
  { icon: Cloud, label: "AWS", description: "EC2, Lambda, ECS, IAM, CloudFormation, CDK" },
  { icon: Shield, label: "DevSecOps", description: "CI/CD pipelines, SAST/DAST, container security, GitLab CI/CD, release workflows, branching/protection rules" },
  { icon: Code, label: "Frontend", description: "React, Vue, Angular, Next.js, TypeScript" },
  { icon: Terminal, label: "Tooling", description: "Terraform, Docker, Kubernetes, GitHub Actions" },
  { icon: Sparkles, label: "AI", description: "LLM integration, AI-powered tooling, prompt engineering, automation with AI" },
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
              I'm a DevSecOps engineer who thrives at the intersection of development, 
              security, and operations. With deep expertise in AWS and a strong frontend 
              background, I bring a unique perspective to building and securing modern 
              web applications.
            </p>
            <p>
              Whether it's architecting cloud infrastructure, embedding security into 
              CI/CD pipelines, or crafting polished user interfaces — I focus on 
              delivering solutions that are both robust and elegant.
            </p>
            <p>
              Currently available for <span className="text-primary font-medium">freelance work</span> and 
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

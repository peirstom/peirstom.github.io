import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6">
      <div className="max-w-3xl w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-sans text-primary text-sm uppercase tracking-widest mb-6"
        >
          DevSecOps · AWS · Frontend · Based in Zurich 🇨🇭 · CET
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Tom Peirs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground max-w-xl text-xl leading-relaxed mb-10 font-light"
        >
          I build and secure cloud infrastructure. DevSecOps engineer with a passion 
          for AWS, security automation, and crafting beautiful frontend experiences.
          Available worldwide for remote work.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-4"
        >
          <a
            href="#about"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-sans text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Read more
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-foreground text-foreground px-6 py-3 rounded-full font-sans text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a href="#about">
          <ArrowDown className="text-muted-foreground animate-bounce w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;

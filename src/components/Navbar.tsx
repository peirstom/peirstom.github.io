import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const links = [
  { label: "About", href: "#about" },
  { label: "Writing", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border"
    >
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="font-bold text-xl">
          Tom Peirs
        </a>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 ml-2 border-l border-border pl-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/tom-peirs/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="mailto:peirstom@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

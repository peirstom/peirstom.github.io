import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
        <div className="flex gap-5">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/tom-peirs/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:peirstom@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
        <p className="font-sans text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tom Peirs
        </p>
      </div>
    </footer>
  );
};

export default Footer;

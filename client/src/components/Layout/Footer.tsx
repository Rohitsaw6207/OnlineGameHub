import { Link } from "wouter";
import { Mail, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left: Developer Credit */}
          <div className="text-center md:text-left">
            <p className="text-foreground font-medium">
              Developed by <span className="text-purple-600 font-semibold">Rohit Kumar</span>
            </p>
          </div>

          {/* Center: Copyright */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Online Game Hub. All rights reserved. | 
              <Link href="/privacy-policy">
                <span className="text-cyan-500 hover:text-purple-600 transition-colors ml-1 cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
            </p>
          </div>

          {/* Right: Social Links */}
          <div className="flex space-x-4">
            <a 
              href="mailto:rohitku@6207gmail.com" 
              className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/rohit-kumar-saw6207" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com/Rohitsaw6207" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-gray-800 hover:text-white transition-all group"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

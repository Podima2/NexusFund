import React from 'react';
import { Github } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-neutral-900 border border-neutral-800 rounded-lg">
              <Logo size="sm" />
            </div>
            <div>
              <h3 className="text-lg brand-text text-white">NEXUSFUND</h3>
              <p className="brand-subtitle text-neutral-500">POWERED BY AVAIL</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-9 h-9 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </a>
            
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-9 h-9 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="X (Twitter)"
            >
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-neutral-500 text-center md:text-right">
            <p className="font-semibold">© 2025 NEXUSFUND PLATFORM</p>
            <div className="flex items-center justify-center md:justify-end space-x-2 mt-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold tracking-wide">DECENTRALIZED</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
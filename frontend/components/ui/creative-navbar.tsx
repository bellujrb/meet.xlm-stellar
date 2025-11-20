'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function CreativeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-[#f5f1e8]/95 dark:bg-zinc-900/80 border-b-2 border-zinc-900 dark:border-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div
              className={cn(
                "w-12 h-12 rounded-full",
                "bg-gradient-to-br from-amber-400 to-amber-500",
                "border-2 border-zinc-900 dark:border-white",
                "flex items-center justify-center",
                "shadow-[3px_3px_0px_0px] shadow-zinc-900 dark:shadow-white",
                "transition-all duration-300",
                "group-hover:shadow-[5px_5px_0px_0px]",
                "group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]",
                "rotate-[-5deg] group-hover:rotate-[0deg]"
              )}
            >
              <Sparkles className="w-6 h-6 text-zinc-900" />
            </div>
            <span className="font-handwritten text-2xl font-bold text-zinc-900 dark:text-white rotate-[-1deg]">
              Meet.XLM
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  "font-handwritten text-lg font-bold text-zinc-900 dark:text-white",
                  "hover:text-amber-500 transition-colors",
                  "relative",
                  index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-amber-400 transition-all hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Button
              className={cn(
                "h-10 px-6 font-handwritten text-base font-bold",
                "bg-amber-400 text-zinc-900",
                "border-2 border-zinc-900 dark:border-white",
                "shadow-[3px_3px_0px_0px] shadow-zinc-900 dark:shadow-white",
                "hover:bg-amber-400 hover:text-zinc-900",
                "hover:shadow-[5px_5px_0px_0px]",
                "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                "transition-all duration-300",
                "rotate-[-2deg] hover:rotate-[0deg]"
              )}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-900 dark:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t-2 border-zinc-900 dark:border-white pt-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block font-handwritten text-lg font-bold text-zinc-900 dark:text-white hover:text-amber-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button
              className={cn(
                "w-full h-10 font-handwritten text-base font-bold",
                "bg-amber-400 text-zinc-900",
                "border-2 border-zinc-900",
                "shadow-[3px_3px_0px_0px] shadow-zinc-900",
                "hover:bg-amber-400 hover:text-zinc-900",
                "hover:shadow-[5px_5px_0px_0px]",
                "transition-all duration-300"
              )}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}


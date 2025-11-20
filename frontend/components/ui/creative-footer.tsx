'use client';

import { Footer } from "@/components/ui/footer";
import { Sparkles, Twitter, Github, MessageCircle, Mail } from "lucide-react";

export function CreativeFooter() {
  return (
    <Footer
      logo={<Sparkles className="h-6 w-6 text-zinc-900" />}
      brandName="Meet.XLM"
      socialLinks={[
        {
          icon: <Twitter className="h-5 w-5" />,
          href: "https://twitter.com",
          label: "Twitter",
        },
        {
          icon: <Github className="h-5 w-5" />,
          href: "https://github.com",
          label: "GitHub",
        },
        {
          icon: <MessageCircle className="h-5 w-5" />,
          href: "https://discord.com",
          label: "Discord",
        },
        {
          icon: <Mail className="h-5 w-5" />,
          href: "mailto:hello@meetxlm.com",
          label: "Email",
        },
      ]}
      mainLinks={[
        { href: "#features", label: "Features" },
        { href: "#pricing", label: "Pricing" },
        { href: "/docs", label: "Documentation" },
        { href: "/blog", label: "Blog" },
        { href: "#about", label: "About" },
        { href: "/contact", label: "Contact" },
      ]}
      legalLinks={[
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/cookies", label: "Cookie Policy" },
      ]}
      copyright={{
        text: "© 2024 Meet.XLM",
        license: "Built with ❤️ for the Stellar community",
      }}
    />
  );
}


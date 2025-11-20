'use client';

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { 
  Calendar, 
  Users, 
  Shield, 
  Zap, 
  Trophy,
  Sparkles
} from "lucide-react";

const features = [
    {
      Icon: Zap,
      name: "On-Chain Attendance Badges",
      description:
        "Mint verifiable proof-of-attendance badges on the Stellar blockchain. Simple, fast, and tamper-proof.",
      href: "#",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-amber-100 to-transparent" />
      ),
      className: "lg:col-span-1 lg:row-span-2",
    },
    {
      Icon: Calendar,
      name: "Event Registry & Management",
      description:
        "Create events, generate QR claims, and track attendance instantly. The official open protocol for Stellar events.",
      href: "#",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-transparent" />
      ),
      className: "lg:col-span-1 lg:row-span-1",
    },
    {
      Icon: Users,
      name: "Sybil-Resistant Community Reputation",
      description:
        "Build trust with real participation history. Reward genuine community members and prevent bots from farming events.",
      href: "#",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-100 to-transparent" />
      ),
      className: "lg:col-span-1 lg:row-span-2",
    },
    {
      Icon: Shield,
      name: "ZK Eligibility Checks",
      description:
        "For exclusive events: users can prove eligibility—like having a minimum XLM balance—without revealing their wallet or balance, using zero-knowledge proofs.",
      href: "#",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-purple-100 to-transparent" />
      ),
      className: "lg:col-span-1 lg:row-span-1",
    },
  ];
  

export function FeaturesSection() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-400 border-3 border-zinc-900 rounded-full shadow-[3px_3px_0px_0px] shadow-zinc-900 rotate-[-1deg]">
          <Sparkles className="w-4 h-4 text-zinc-900" />
          <span className="font-handwritten text-base font-bold text-zinc-900">
            Features
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 font-handwritten">
          Everything you need
        </h2>
        
        <p className="text-lg text-zinc-700 max-w-2xl mx-auto">
          All the tools to create, distribute, and manage proof-of-attendance badges on Stellar blockchain
        </p>
      </div>

      {/* Bento Grid */}
      <BentoGrid className="lg:grid-rows-2">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}


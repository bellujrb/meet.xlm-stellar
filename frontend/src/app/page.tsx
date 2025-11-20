import { CreativePricing } from "@/components/ui/creative-pricing";
import { CreativeHeader } from "@/components/ui/creative-header";
import { CreativeNavbar } from "@/components/ui/creative-navbar";
import type { PricingTier } from "@/components/ui/creative-pricing";
import { Pencil, Star, Sparkles } from "lucide-react";

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

const sampleTiers: PricingTier[] = [
  {
    name: "Creator",
    icon: <Pencil className="w-6 h-6" />,
    price: 29,
    description: "Perfect for short video beginners",
    color: "amber",
    features: [
      "60-second Video Export",
      "10 Trending Templates",
      "Auto Text-to-Speech",
      "Basic Transitions",
    ],
  },
  {
    name: "Influencer",
    icon: <Star className="w-6 h-6" />,
    price: 79,
    description: "For serious content creators",
    color: "blue",
    features: [
      "3-minute Video Export",
      "Voice Effects & Filters",
      "Trending Sound Library",
      "Auto Captions & Subtitles",
    ],
    popular: true,
  },
  {
    name: "Pro Studio",
    icon: <Sparkles className="w-6 h-6" />,
    price: 149,
    description: "For viral content masters",
    color: "purple",
    features: [
      "Multi-clip Editing",
      "Green Screen Effects",
      "Viral Sound Detection",
      "Engagement Analytics",
    ],
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Creative Navbar */}
      <CreativeNavbar />

      {/* Creative Header with 3D Robot */}
      <CreativeHeader
        title="Meet.XLM"
        subtitle="Proof of Attendance Protocol"
        description="Collect unforgettable moments on the Stellar blockchain. Create, share, and own your digital memories forever! 🚀"
        robotSceneUrl={ROBOT_SCENE_URL}
      />

      {/* Pricing Section */}
      <div className="py-20" id="pricing">
        <CreativePricing 
          tag="Simple Pricing"
          title="Choose Your Plan"
          description="Start collecting memories today"
          tiers={sampleTiers} 
        />
      </div>
    </div>
  );
}

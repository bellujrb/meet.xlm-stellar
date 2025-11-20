'use client';

import { InteractiveRobotSpline } from '@/components/blocks/interactive-3d-robot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';

interface CreativeHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  robotSceneUrl: string;
}

export function CreativeHeader({
  title = "Meet.XLM",
  subtitle = "Your Digital Memories",
  description = "The coolest way to collect proof of attendance on Stellar blockchain",
  robotSceneUrl,
}: CreativeHeaderProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Text Content */}
        <div className="space-y-6 order-2 lg:order-1">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 border-2 border-zinc-900 rounded-full rotate-[-1deg] shadow-[3px_3px_0px_0px] shadow-zinc-900">
            <Sparkles className="w-4 h-4" />
            <span className="font-handwritten text-sm font-bold text-zinc-900">
              Built on Stellar
            </span>
          </div>

          {/* Main Title */}
          <div className="relative">
            <h1 className="font-handwritten text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white rotate-[-2deg]">
              {title}
              <div className="absolute -right-8 top-0 text-3xl rotate-12">
                ⭐️
              </div>
            </h1>
            <div className="absolute -bottom-3 left-8 w-32 h-4 bg-blue-500/30 rotate-[-2deg] rounded-full blur-sm" />
          </div>

          {/* Subtitle */}
          <h2 className="font-handwritten text-2xl md:text-3xl text-blue-500 rotate-[1deg] font-bold">
            {subtitle}
            <span className="ml-2">✨</span>
          </h2>

          {/* Description */}
          <p className="font-handwritten text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-lg">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              className={cn(
                "h-14 px-8 font-handwritten text-lg",
                "bg-amber-400 text-zinc-900",
                "border-2 border-zinc-900",
                "shadow-[4px_4px_0px_0px] shadow-zinc-900",
                "hover:shadow-[6px_6px_0px_0px]",
                "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                "transition-all duration-300",
                "rotate-[-1deg]"
              )}
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            
            <Button
              className={cn(
                "h-14 px-8 font-handwritten text-lg",
                "bg-white text-zinc-900",
                "border-2 border-zinc-900",
                "shadow-[4px_4px_0px_0px] shadow-zinc-900",
                "hover:shadow-[6px_6px_0px_0px]",
                "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                "transition-all duration-300",
                "rotate-[1deg]"
              )}
            >
              Learn More
            </Button>
          </div>

          {/* Fun decorative elements */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-zinc-900"
                />
              ))}
            </div>
            <span className="font-handwritten text-sm text-zinc-600 dark:text-zinc-400">
              Join 1,000+ collectors
            </span>
          </div>
        </div>

        {/* Right side - 3D Robot */}
        <div className="order-1 lg:order-2 group relative rotate-[2deg] transition-all duration-300 hover:rotate-[0deg]">
          <div
            className={cn(
              "absolute inset-0 bg-white dark:bg-zinc-900",
              "border-2 border-zinc-900 dark:border-white",
              "rounded-3xl shadow-[8px_8px_0px_0px] shadow-zinc-900 dark:shadow-white",
              "transition-all duration-300",
              "group-hover:shadow-[12px_12px_0px_0px]",
              "group-hover:translate-x-[-4px]",
              "group-hover:translate-y-[-4px]"
            )}
          />
          
          <div className="relative overflow-hidden rounded-3xl h-[400px] md:h-[500px] lg:h-[600px]">
            <InteractiveRobotSpline
              scene={robotSceneUrl}
              className="w-full h-full"
            />
            
            {/* Fun badge overlay */}
            <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-full border-2 border-zinc-900 shadow-[3px_3px_0px_0px] shadow-zinc-900 rotate-12 font-handwritten text-sm font-bold">
              Interactive! 🎮
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-40 left-10 text-4xl opacity-50 rotate-12 hidden xl:block">
        ✏️
      </div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-50 -rotate-12 hidden xl:block">
        ✎
      </div>
    </div>
  );
}


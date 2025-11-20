'use client';

import { InteractiveRobotSpline } from '@/components/blocks/interactive-3d-robot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Settings, Zap } from 'lucide-react';

interface CreativeHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  robotSceneUrl: string;
}

export function CreativeHeader({
  title = "Meet.XLM",
  subtitle = "Proof of Attendance Protocol",
  description = "Collect unforgettable moments on the Stellar blockchain. Create, share, and own your digital memories forever! 🚀",
  robotSceneUrl,
}: CreativeHeaderProps) {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left side - Text Content */}
        <div className="space-y-6 order-2 lg:order-1">
          {/* Tag - Badge amarelo com ícone */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 border-3 border-zinc-900 rounded-full shadow-[3px_3px_0px_0px] shadow-zinc-900">
            <Settings className="w-4 h-4 text-zinc-900" />
            <span className="font-handwritten text-base font-bold text-zinc-900">
              Built on Stellar
            </span>
          </div>

          {/* Main Title - Fonte handwritten preta */}
          <div className="relative">
            <h1 className="font-handwritten text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900">
              {title}
            </h1>
          </div>

          {/* Subtitle - Azul com emoji */}
          <h2 className="font-handwritten text-2xl md:text-3xl text-blue-500 font-normal">
            {subtitle} ✨
          </h2>

          {/* Description - Texto normal cinza */}
          <p className="text-base md:text-lg text-zinc-700 max-w-lg leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              className={cn(
                "h-12 px-6 font-handwritten text-base font-bold",
                "bg-amber-400 text-zinc-900",
                "border-3 border-zinc-900",
                "rounded-xl",
                "shadow-[4px_4px_0px_0px] shadow-zinc-900",
                "hover:bg-amber-400 hover:text-zinc-900",
                "hover:shadow-[6px_6px_0px_0px]",
                "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                "transition-all duration-300"
              )}
            >
              <Zap className="w-4 h-4 mr-2 fill-zinc-900" />
              Get Started
            </Button>
            
            <Button
              className={cn(
                "h-12 px-6 font-handwritten text-base font-bold",
                "bg-white text-zinc-900",
                "border-3 border-zinc-900",
                "rounded-xl",
                "shadow-[4px_4px_0px_0px] shadow-zinc-900",
                "hover:bg-white hover:text-zinc-900",
                "hover:shadow-[6px_6px_0px_0px]",
                "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                "transition-all duration-300"
              )}
            >
              Learn More
            </Button>
          </div>

          {/* Avatares + Join collectors */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-purple-500 border-2 border-zinc-900"
                />
              ))}
            </div>
            <span className="text-sm text-zinc-600 font-medium">
              Join 1,000+ collectors
            </span>
          </div>
        </div>

        {/* Right side - 3D Robot Card */}
        <div className="order-1 lg:order-2 group relative">
          <div
            className={cn(
              "absolute inset-0",
              "bg-white",
              "border-4 border-zinc-900",
              "rounded-3xl shadow-[12px_12px_0px_0px] shadow-zinc-900",
              "transition-all duration-300",
              "group-hover:shadow-[16px_16px_0px_0px]",
              "group-hover:translate-x-[-4px]",
              "group-hover:translate-y-[-4px]"
            )}
          />
          
          <div className="relative overflow-hidden rounded-3xl h-[450px] md:h-[550px] lg:h-[600px]">
            {/* Container do robô com fundo dividido */}
            <div className="relative w-full h-full">
              {/* Parte superior branca */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-white" />
              {/* Parte inferior roxa/preta escura */}
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-purple-950 via-purple-900 to-black" />
              
              {/* Robô 3D */}
              <div className="absolute inset-0">
                <InteractiveRobotSpline
                  scene={robotSceneUrl}
                  className="w-full h-full"
                />
              </div>
            </div>
            
            {/* Badge "Interactive" roxo no canto superior direito */}
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full border-2 border-zinc-900 shadow-[3px_3px_0px_0px] shadow-zinc-900 rotate-12 font-handwritten text-sm font-bold z-20">
              Interactive! 🎮
            </div>

          </div>
        </div>
      </div>

      {/* Decorative elements */}
      {/* Estrela amarela no canto esquerdo */}
      <div className="absolute top-20 -left-4 text-5xl hidden lg:block">
        ⭐️
      </div>
      {/* Lápis no canto inferior direito */}
      <div className="absolute bottom-10 right-0 text-4xl opacity-70 rotate-45 hidden lg:block">
        ✏️
      </div>
    </div>
  );
}


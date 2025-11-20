import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        "lg:grid-flow-dense",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden",
      // Creative style with border and shadow
      "bg-white border-3 border-zinc-900 rounded-2xl",
      "shadow-[6px_6px_0px_0px] shadow-zinc-900",
      "transition-all duration-300",
      "hover:shadow-[10px_10px_0px_0px]",
      "hover:translate-x-[-4px] hover:translate-y-[-4px]",
      className,
    )}
  >
    {/* Background image/element */}
    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
      {background}
    </div>

    {/* Content */}
    <div className="relative z-10 flex transform-gpu flex-col gap-3 p-6 transition-all duration-300 group-hover:-translate-y-4">
      <div className="w-14 h-14 rounded-xl border-3 border-zinc-900 bg-amber-400 flex items-center justify-center shadow-[3px_3px_0px_0px] shadow-zinc-900 transition-all duration-300 group-hover:shadow-[5px_5px_0px_0px] group-hover:rotate-[-5deg]">
        <Icon className="h-7 w-7 text-zinc-900" />
      </div>
      
      <h3 className="text-2xl font-bold text-zinc-900 font-handwritten mt-2">
        {name}
      </h3>
      
      <p className="text-base text-zinc-700 leading-relaxed">
        {description}
      </p>
    </div>

    {/* CTA Button - appears on hover */}
    <div
      className={cn(
        "relative z-10 flex w-full translate-y-10 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button 
        asChild 
        className={cn(
          "font-handwritten text-base font-bold",
          "bg-white text-zinc-900",
          "border-2 border-zinc-900",
          "rounded-xl",
          "shadow-[3px_3px_0px_0px] shadow-zinc-900",
          "hover:bg-white hover:text-zinc-900",
          "hover:shadow-[5px_5px_0px_0px]",
          "hover:translate-x-[-2px] hover:translate-y-[-2px]"
        )}
      >
        <a href={href} className="flex items-center gap-2">
          {cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
    </div>

    {/* Hover overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-amber-50/30" />
  </div>
);

export { BentoCard, BentoGrid };


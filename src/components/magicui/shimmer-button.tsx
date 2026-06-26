import { cn } from "../../lib/utils";
import React from "react";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  children: React.ReactNode;
  className?: string;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(255,255,255,0.4)",
      shimmerSize = "0.08em",
      shimmerDuration = "1.6s",
      borderRadius = "1rem",
      background = "linear-gradient(135deg, hsl(24 95% 53%) 0%, hsl(4 92% 62%) 55%, hsl(38 96% 53%) 100%)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap px-6 py-3 font-bold",
          "text-white [background:var(--background)]",
          "rounded-[var(--border-radius)]",
          // shimmer pseudo-element via inline styles via tailwind arbitrary
          "before:absolute before:inset-0 before:-z-10",
          "before:[background:linear-gradient(90deg,transparent_0%,var(--shimmer-color)_50%,transparent_100%)]",
          "before:[background-size:200%_100%]",
          "before:animate-[shimmer_var(--shimmer-duration)_linear_infinite]",
          "shadow-elevated hover:scale-[1.03] active:scale-[0.97] transition-transform duration-200",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;

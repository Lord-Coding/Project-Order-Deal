import { cn } from "../../lib/utils";
import React from "react";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedGradientText = ({ children, className }: AnimatedGradientTextProps) => {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent animate-[gradient-shift_4s_linear_infinite]",
        "[background-size:300%_auto]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, hsl(24 95% 60%), hsl(38 96% 55%), hsl(4 92% 65%), hsl(48 100% 65%), hsl(24 95% 60%))",
        backgroundSize: "300% auto",
        animation: "gradient-shift 4s linear infinite",
      }}
    >
      {children}
    </span>
  );
};

export default AnimatedGradientText;

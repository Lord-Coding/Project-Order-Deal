import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
}

interface SparklesTextProps {
  text: string;
  className?: string;
  sparklesCount?: number;
  colors?: { first: string; second: string };
}

const generateSparkle = (colors: { first: string; second: string }): Sparkle => ({
  id: Math.random().toString(36).slice(2),
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  color: Math.random() > 0.5 ? colors.first : colors.second,
  delay: Math.random() * 2,
  scale: Math.random() * 1 + 0.3,
});

const SparklesText = ({
  text,
  className,
  sparklesCount = 8,
  colors = { first: "hsl(38 96% 53%)", second: "hsl(24 95% 53%)" },
}: SparklesTextProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>(() =>
    Array.from({ length: sparklesCount }, () => generateSparkle(colors)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) =>
          Math.random() > 0.6 ? generateSparkle(colors) : s,
        ),
      );
    }, 700);
    return () => clearInterval(interval);
  }, [colors, sparklesCount]);

  return (
    <span className={cn("relative inline-block", className)}>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.svg
            key={sparkle.id}
            className="pointer-events-none absolute z-20"
            style={{ left: sparkle.x, top: sparkle.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, sparkle.scale, 0] }}
            transition={{ duration: 0.8, delay: sparkle.delay, ease: "easeInOut" }}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 0 C8 0 8 8 8 8 C8 8 0 8 0 8 C0 8 8 8 8 8 C8 8 8 16 8 16 C8 16 8 8 8 8 C8 8 16 8 16 8 C16 8 8 8 8 8 C8 8 8 0 8 0 Z"
              fill={sparkle.color}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
      <span className="relative z-10">{text}</span>
    </span>
  );
};

export default SparklesText;

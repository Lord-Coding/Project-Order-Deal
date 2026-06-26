import { useEffect, useRef } from "react";

interface LottiePlayerProps {
  animationData: object;
  loop?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const LottiePlayer = ({
  animationData,
  loop = true,
  style,
  className,
}: LottiePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let anim: { destroy: () => void } | null = null;

    // Dynamic import to avoid ESM/CJS resolution issues
    import("lottie-web").then((lottieModule) => {
      // lottie-web CJS exports via module.exports, handle both cases
      const lottie =
        (lottieModule as unknown as { default: typeof import("lottie-web") })
          .default ?? lottieModule;

      const loadFn =
        (lottie as unknown as { loadAnimation: Function }).loadAnimation;

      if (!loadFn || !containerRef.current) return;

      anim = loadFn({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay: true,
        animationData,
      });
    });

    return () => {
      anim?.destroy();
    };
  }, [animationData, loop]);

  return <div ref={containerRef} style={style} className={className} />;
};

export default LottiePlayer;

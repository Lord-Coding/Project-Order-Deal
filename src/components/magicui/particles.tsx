import { useEffect, useRef, useCallback } from "react";
import { cn } from "../../lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  ease?: number;
  color?: string;
  refresh?: boolean;
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

const Particles = ({
  className,
  quantity = 60,
  ease = 80,
  color = "#ffffff",
  refresh = false,
}: ParticlesProps) => {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const context       = useRef<CanvasRenderingContext2D | null>(null);
  const circles       = useRef<Circle[]>([]);
  const mouse         = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize    = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr           = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafRef        = useRef<number>(0);

  const hexToRgb = useCallback((hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [255, 255, 255];
  }, []);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;
    circles.current = [];
    canvasSize.current.w = containerRef.current.offsetWidth;
    canvasSize.current.h = containerRef.current.offsetHeight;
    canvasRef.current.width  = canvasSize.current.w * dpr;
    canvasRef.current.height = canvasSize.current.h * dpr;
    canvasRef.current.style.width  = `${canvasSize.current.w}px`;
    canvasRef.current.style.height = `${canvasSize.current.h}px`;
    context.current = canvasRef.current.getContext("2d");
    context.current?.scale(dpr, dpr);
  }, [dpr]);

  const circleParams = useCallback((): Circle => ({
    x: Math.random() * canvasSize.current.w,
    y: Math.random() * canvasSize.current.h,
    translateX: 0,
    translateY: 0,
    size: Math.random() * 2 + 1,
    alpha: 0,
    targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    magnetism: 0.1 + Math.random() * 4,
  }), []);

  const drawCircle = useCallback(
    (circle: Circle, update = false) => {
      if (!context.current) return;
      const { x, y, translateX, translateY, size, alpha } = circle;
      const rgb = hexToRgb(color);
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(",")},${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!update) circles.current.push(circle);
    },
    [color, dpr, hexToRgb],
  );

  const clearContext = useCallback(() => {
    if (!context.current) return;
    context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
  }, []);

  const drawParticles = useCallback(() => {
    clearContext();
    for (let i = 0; i < quantity; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  }, [quantity, circleParams, drawCircle, clearContext]);

  const animate = useCallback(() => {
    clearContext();
    circles.current.forEach((circle, i) => {
      const dx = mouse.current.x - circle.x;
      const dy = mouse.current.y - circle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const magnetism = circle.magnetism / dist;

      if (circle.alpha < circle.targetAlpha) {
        circle.alpha = parseFloat(Math.min(circle.alpha + 0.02, circle.targetAlpha).toFixed(2));
      } else if (circle.alpha > circle.targetAlpha) {
        circle.alpha = parseFloat(Math.max(circle.alpha - 0.02, circle.targetAlpha).toFixed(2));
      }

      circle.x += circle.dx + (dist < 200 ? dx * magnetism * 0.01 : 0);
      circle.y += circle.dy + (dist < 200 ? dy * magnetism * 0.01 : 0);
      circle.translateX += (dx * magnetism * 0.02 - circle.translateX) / ease;
      circle.translateY += (dy * magnetism * 0.02 - circle.translateY) / ease;

      // respawn off-screen
      if (
        circle.x < -20 || circle.x > canvasSize.current.w + 20 ||
        circle.y < -20 || circle.y > canvasSize.current.h + 20
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      } else {
        drawCircle(circle, true);
      }
    });
    rafRef.current = requestAnimationFrame(animate);
  }, [ease, circleParams, drawCircle, clearContext]);

  useEffect(() => {
    initCanvas();
    drawParticles();
    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => { initCanvas(); drawParticles(); };
    const handleMouse  = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [refresh, initCanvas, drawParticles, animate]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default Particles;

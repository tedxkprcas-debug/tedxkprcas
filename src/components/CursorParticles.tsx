import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

const CursorParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationId = useRef<number>(0);
  const lastSpawn = useRef(0);
  const scrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Disable on touch / mobile devices — no cursor to show particles for
  const isTouchDevice =
    typeof window !== "undefined" &&
    (window.innerWidth < 768 || "ontouchstart" in window);

  const spawnParticles = useCallback((x: number, y: number) => {
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 1,
        maxLife: 40 + Math.random() * 30,
        size: 2 + Math.random() * 4,
        hue: Math.random() > 0.4 ? 0 : 30,
      });
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice) return; // Skip everything on mobile

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastSpawn.current > 30) {
        spawnParticles(e.clientX, e.clientY);
        lastSpawn.current = now;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    /* Pause while scrolling to free main thread */
    const onScroll = () => {
      scrollingRef.current = true;
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => { scrollingRef.current = false; }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const animate = () => {
      if (scrollingRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationId.current = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => {
        p.life++;
        const progress = p.life / p.maxLife;
        if (progress >= 1) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gravity
        p.vx *= 0.99;

        const alpha = 1 - progress;
        const size = p.size * (1 - progress * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 84%, 50%, ${alpha * 0.6})`;
        ctx.fill();

        // glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 84%, 50%, ${alpha * 0.15})`;
        ctx.fill();

        return true;
      });

      animationId.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      cancelAnimationFrame(animationId.current);
    };
  }, [spawnParticles, isTouchDevice]);

  // Don't render canvas at all on touch devices
  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};

export default CursorParticles;

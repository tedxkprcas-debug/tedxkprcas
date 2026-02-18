import { useEffect, useRef, useCallback } from "react";

interface Cube {
  x: number;
  y: number;
  size: number;
  rotationSpeed: number;
  rotation: number;
  glowIntensity: number;
  glowDirection: number;
  baseAlpha: number;
  floatOffset: number;
  floatSpeed: number;
  depth: number;
  hue: number;
}

/* Detect mobile / low-power device once */
const isMobile = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || "ontouchstart" in window);

const GeometricBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cubesRef = useRef<Cube[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const mobileRef = useRef(isMobile());

  const initCubes = useCallback((width: number, height: number) => {
    const cubes: Cube[] = [];
    const mobile = mobileRef.current;
    // Mobile: far fewer shapes (8-12), Desktop: 20-60
    const count = mobile
      ? Math.max(6, Math.min(Math.floor((width * height) / 80000), 12))
      : Math.max(20, Math.min(Math.floor((width * height) / 25000), 60));

    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      cubes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: mobile
          ? 18 + depth * 30 + Math.random() * 15
          : 25 + depth * 60 + Math.random() * 30,
        rotationSpeed: (0.2 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1),
        rotation: Math.random() * Math.PI * 2,
        glowIntensity: 0.3 + Math.random() * 0.7,
        glowDirection: 1,
        baseAlpha: 0.15 + depth * 0.45,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.7,
        depth,
        hue: -5 + Math.random() * 10,
      });
    }

    cubes.sort((a, b) => a.depth - b.depth);
    cubesRef.current = cubes;
  }, []);

  const drawCube3D = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      alpha: number,
      glowIntensity: number,
      hue: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const s = size;
      const topOffset = s * 0.35;
      const mobile = mobileRef.current;

      const redBase = `hsla(${hue}, 85%, 50%, ${alpha})`;
      const redDark = `hsla(${hue}, 80%, 30%, ${alpha * 0.8})`;
      const redDarker = `hsla(${hue}, 75%, 18%, ${alpha * 0.7})`;
      const redGlow = `hsla(${hue}, 100%, 55%, ${glowIntensity * alpha})`;

      // Mobile: skip expensive shadowBlur entirely
      if (!mobile) {
        ctx.shadowColor = redGlow;
        ctx.shadowBlur = 15 + glowIntensity * 20;
      }

      // Top face
      ctx.beginPath();
      ctx.moveTo(0, -topOffset);
      ctx.lineTo(s * 0.5, -topOffset * 0.4);
      ctx.lineTo(0, topOffset * 0.2);
      ctx.lineTo(-s * 0.5, -topOffset * 0.4);
      ctx.closePath();
      ctx.fillStyle = redBase;
      ctx.fill();
      ctx.strokeStyle = redGlow;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Right face
      if (!mobile) ctx.shadowBlur = 8 + glowIntensity * 10;
      ctx.beginPath();
      ctx.moveTo(s * 0.5, -topOffset * 0.4);
      ctx.lineTo(s * 0.5, s * 0.4);
      ctx.lineTo(0, s * 0.6);
      ctx.lineTo(0, topOffset * 0.2);
      ctx.closePath();
      ctx.fillStyle = redDark;
      ctx.fill();
      ctx.strokeStyle = redGlow;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Left face
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -topOffset * 0.4);
      ctx.lineTo(0, topOffset * 0.2);
      ctx.lineTo(0, s * 0.6);
      ctx.lineTo(-s * 0.5, s * 0.4);
      ctx.closePath();
      ctx.fillStyle = redDarker;
      ctx.fill();
      ctx.strokeStyle = redGlow;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Edge highlights — skip on mobile
      if (!mobile) {
        ctx.shadowBlur = 25 + glowIntensity * 30;
        ctx.shadowColor = redGlow;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha * glowIntensity * 0.6})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, -topOffset);
        ctx.lineTo(s * 0.5, -topOffset * 0.4);
        ctx.moveTo(0, -topOffset);
        ctx.lineTo(-s * 0.5, -topOffset * 0.4);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(s * 0.5, -topOffset * 0.4);
        ctx.lineTo(s * 0.5, s * 0.4);
        ctx.moveTo(-s * 0.5, -topOffset * 0.4);
        ctx.lineTo(-s * 0.5, s * 0.4);
        ctx.moveTo(0, topOffset * 0.2);
        ctx.lineTo(0, s * 0.6);
        ctx.stroke();
      }

      ctx.restore();
    },
    []
  );

  const drawHexagon = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      alpha: number,
      glowIntensity: number,
      hue: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const mobile = mobileRef.current;
      const redGlow = `hsla(${hue}, 100%, 55%, ${glowIntensity * alpha})`;

      if (!mobile) {
        ctx.shadowColor = redGlow;
        ctx.shadowBlur = 12 + glowIntensity * 18;
      }

      // Outer hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = Math.cos(angle) * size * 0.4;
        const py = Math.sin(angle) * size * 0.4;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      ctx.fillStyle = `hsla(${hue}, 80%, 15%, ${alpha * 0.5})`;
      ctx.fill();
      ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${alpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner hexagon — skip on mobile
      if (!mobile) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = Math.cos(angle) * size * 0.25;
          const py = Math.sin(angle) * size * 0.25;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsla(${hue}, 100%, 55%, ${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    },
    []
  );

  const animate = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const render = (timestamp: number) => {
        const deltaTime = (timestamp - timeRef.current) / 1000;
        timeRef.current = timestamp;

        // Clear with dark background
        ctx.fillStyle = "rgba(5, 2, 2, 1)";
        ctx.fillRect(0, 0, width, height);

        // Subtle radial gradient overlay
        const gradient = ctx.createRadialGradient(
          width * 0.5,
          height * 0.4,
          0,
          width * 0.5,
          height * 0.4,
          width * 0.8
        );
        gradient.addColorStop(0, "rgba(40, 5, 5, 0.3)");
        gradient.addColorStop(0.5, "rgba(15, 2, 2, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Update and draw cubes
        cubesRef.current.forEach((cube, i) => {
          // Update rotation
          cube.rotation += cube.rotationSpeed * deltaTime * 0.3;

          // Update glow (pulsing)
          cube.glowIntensity += cube.glowDirection * deltaTime * 0.4;
          if (cube.glowIntensity > 1) {
            cube.glowIntensity = 1;
            cube.glowDirection = -1;
          } else if (cube.glowIntensity < 0.2) {
            cube.glowIntensity = 0.2;
            cube.glowDirection = 1;
          }

          // Float animation
          const floatY =
            Math.sin(timestamp * 0.001 * cube.floatSpeed + cube.floatOffset) *
            (8 + cube.depth * 12);
          const floatX =
            Math.cos(timestamp * 0.0007 * cube.floatSpeed + cube.floatOffset) *
            (4 + cube.depth * 6);

          const drawX = cube.x + floatX;
          const drawY = cube.y + floatY;

          // Alternate between cubes and hexagons
          if (i % 3 === 0) {
            drawHexagon(
              ctx,
              drawX,
              drawY,
              cube.size,
              cube.rotation,
              cube.baseAlpha,
              cube.glowIntensity,
              cube.hue
            );
          } else {
            drawCube3D(
              ctx,
              drawX,
              drawY,
              cube.size,
              cube.rotation,
              cube.baseAlpha,
              cube.glowIntensity,
              cube.hue
            );
          }
        });

        // Draw connecting lines between nearby cubes (subtle grid effect)
        ctx.save();
        cubesRef.current.forEach((cube, i) => {
          for (let j = i + 1; j < cubesRef.current.length; j++) {
            const other = cubesRef.current[j];
            const dx = cube.x - other.x;
            const dy = cube.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
              const lineAlpha = (1 - dist / 200) * 0.08 * cube.glowIntensity;
              ctx.beginPath();
              ctx.moveTo(cube.x, cube.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `hsla(0, 100%, 50%, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
        ctx.restore();

        // Subtle scan line effect
        ctx.save();
        ctx.globalAlpha = 0.03;
        for (let y = 0; y < height; y += 3) {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, y, width, 1);
        }
        ctx.restore();

        // Vignette
        const vignette = ctx.createRadialGradient(
          width / 2,
          height / 2,
          width * 0.2,
          width / 2,
          height / 2,
          width * 0.7
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.5)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);

        animationRef.current = requestAnimationFrame(render);
      };

      animationRef.current = requestAnimationFrame(render);
    },
    [drawCube3D, drawHexagon]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      initCubes(width, height);

      // Cancel existing animation and restart
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      timeRef.current = performance.now();
      animate(ctx, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initCubes, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "#050202" }}
    />
  );
};

export default GeometricBackground;

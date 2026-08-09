import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  themePreset?: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ themePreset = 'light3d' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor(width / 25), 50);
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const getColors = () => {
      switch (themePreset) {
        case 'dark3d':
          return ['rgba(99, 102, 241, 0.4)', 'rgba(168, 85, 247, 0.3)', 'rgba(59, 130, 246, 0.4)'];
        case 'gold3d':
          return ['rgba(245, 158, 11, 0.4)', 'rgba(217, 119, 6, 0.3)', 'rgba(252, 211, 77, 0.4)'];
        case 'telegramBlue':
          return ['rgba(14, 165, 233, 0.4)', 'rgba(59, 130, 246, 0.4)', 'rgba(3, 105, 161, 0.3)'];
        case 'sunsetGlow':
          return ['rgba(244, 63, 94, 0.4)', 'rgba(251, 113, 133, 0.3)', 'rgba(225, 29, 72, 0.4)'];
        case 'cyberpunk':
          return ['rgba(6, 182, 212, 0.5)', 'rgba(236, 72, 153, 0.5)', 'rgba(168, 85, 247, 0.5)'];
        case 'light3d':
        default:
          return ['rgba(59, 130, 246, 0.15)', 'rgba(225, 29, 72, 0.15)', 'rgba(14, 165, 233, 0.15)'];
      }
    };

    const colors = getColors();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Draw frame
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render floating particle mesh lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx * p1.z;
        p1.y += p1.vy * p1.z;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius * p1.z, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        // Connect nearby particles with subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = (1 - dist / 120) * 0.25;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themePreset]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};

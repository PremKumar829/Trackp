import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface PerspectiveCardProps {
  children: React.ReactNode;
  themePreset?: string;
  enable3dPhysics?: boolean;
  className?: string;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({
  children,
  themePreset = 'light3d',
  enable3dPhysics = true,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D tilt
  const mouseX = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const shineOpacity = useTransform(mouseX, [-0.5, 0.5], [0, 0.25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3dPhysics || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const getThemeStyles = () => {
    switch (themePreset) {
      case 'dark3d':
        return 'bg-slate-900/90 text-white border border-slate-700/60 shadow-2xl shadow-indigo-500/20';
      case 'gold3d':
        return 'bg-gradient-to-b from-amber-950/90 via-slate-900/95 to-slate-950 text-amber-100 border border-amber-500/40 shadow-2xl shadow-amber-500/20';
      case 'telegramBlue':
        return 'bg-gradient-to-b from-sky-900/90 to-blue-950/95 text-white border border-sky-400/40 shadow-2xl shadow-sky-500/25';
      case 'sunsetGlow':
        return 'bg-gradient-to-b from-rose-950/90 to-slate-900/95 text-rose-50 border border-rose-500/40 shadow-2xl shadow-rose-500/20';
      case 'cyberpunk':
        return 'bg-slate-950/95 text-cyan-300 border border-cyan-500/50 shadow-2xl shadow-pink-500/30';
      case 'light3d':
      default:
        return 'bg-white text-slate-900 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)]';
    }
  };

  return (
    <div className="perspective-1000 w-full max-w-sm sm:max-w-md mx-auto">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: enable3dPhysics ? rotateX : 0,
          rotateY: enable3dPhysics ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered && enable3dPhysics ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`relative rounded-[36px] p-6 sm:p-8 transition-shadow duration-300 ${getThemeStyles()} ${className}`}
      >
        {/* Dynamic 3D Glare effect */}
        {enable3dPhysics && (
          <motion.div
            style={{ opacity: shineOpacity }}
            className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 transition-opacity"
          />
        )}

        {/* Card Content with 3D depth layer */}
        <div style={{ transform: 'translateZ(30px)' }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Pre-generate random values outside the component so they remain stable across re-renders
const bubbles = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  // Size: 40px to 120px
  size: Math.floor(Math.random() * 81) + 40,
  // Horizontal start position: 0% to 100%
  left: Math.random() * 100,
  // Animation delay: negative so some bubbles are already visible on load
  delay: Math.random() * 20,
  // Duration: 12s to 30s
  duration: Math.random() * 18 + 12,
  // Opacity: 0.1 to 0.4
  opacity: Math.random() * 0.3 + 0.1,
  // Horizontal drift amount during the rise: -80px to 80px
  drift: Math.floor(Math.random() * 161) - 80,
}));

export default function PurpleBubbles() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full bg-purple-600 mix-blend-multiply filter blur-[8px]"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            bottom: "-150px", // Start lower
            opacity: b.opacity,
          }}
          animate={{
            y: [0, "-130vh"],
            x: [0, b.drift, -b.drift, b.drift], // Organic wavy motion
            scale: [1, 1.25, 0.8, 1.15, 1], // Breathing scale effect
          }}
          transition={{
            y: {
              duration: b.duration,
              repeat: Infinity,
              ease: "linear",
              delay: -b.delay,
            },
            x: {
              duration: b.duration * 0.75, // Decoupled frequency for organic look
              repeat: Infinity,
              ease: "easeInOut",
              delay: -b.delay,
            },
            scale: {
              duration: b.duration * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: -b.delay,
            },
          }}
        />
      ))}
    </div>
  );
}

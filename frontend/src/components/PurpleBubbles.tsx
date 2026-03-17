

// Pre-generate random values outside the component so they remain stable across re-renders
const bubbles = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  // Size: 40px to 100px
  size: Math.floor(Math.random() * 61) + 40,
  // Horizontal start position: 0% to 100%
  left: Math.floor(Math.random() * 101),
  // Animation delay: negative so some bubbles are already visible on load
  delay: Math.floor(Math.random() * 20),
  // Duration: 10s to 25s
  duration: Math.floor(Math.random() * 16) + 10,
  // Opacity: 0.1 to 0.3
  opacity: (Math.random() * 0.2 + 0.1).toFixed(2),
  // Horizontal drift amount during the rise: -50px to 50px
  drift: Math.floor(Math.random() * 101) - 50,
}));

export default function PurpleBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100px) translateX(0);
          }
          100% {
            /* Move well above the viewport */
            transform: translateY(-120vh) translateX(var(--drift));
          }
        }
        
        .bubble-base {
          position: absolute;
          bottom: -100px;
          border-radius: 50%;
          background-color: #6d28d9;
          filter: blur(6px);
          animation: float-up var(--duration) infinite linear;
          animation-delay: calc(var(--delay) * -1s);
          left: var(--left);
          width: var(--size);
          height: var(--size);
          opacity: var(--opacity);
        }

        /* Generate deterministic utility classes for the random values to avoid inline styles */
        ${bubbles.map(b => `
          .bubble-${b.id} {
            --left: ${b.left}%;
            --size: ${b.size}px;
            --delay: ${b.delay};
            --duration: ${b.duration}s;
            --opacity: ${b.opacity};
            --drift: ${b.drift}px;
          }
        `).join('')}
      `}</style>

      {/* Render the bubbles */}
      {bubbles.map(b => (
        <div key={b.id} className={`bubble-base bubble-${b.id}`} />
      ))}
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: number;
  brightness: number;
  decay: number;
  coordinates: [number, number][]; // History for trails
}

interface Firework {
  x: number;
  y: number;
  sx: number; // Start X
  sy: number; // Start Y
  tx: number; // Target X
  ty: number; // Target Y
  distanceToTarget: number;
  distanceTraveled: number;
  angle: number;
  speed: number;
  acceleration: number;
  brightness: number;
  hue: number;
  coordinates: [number, number][];
}

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('resize', resize);
    resize();

    // Configuration
    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    let animationFrameId: number;
    let timerTotal = 40;
    let timerTick = 0;

    // Helpers
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    // Create a new firework rocket
    const createFirework = () => {
      // Start from bottom, random x
      const sx = w / 2 + random(-w / 3, w / 3);
      const sy = h;
      // Target random position in the top half
      const tx = random(w * 0.1, w * 0.9);
      const ty = random(h * 0.1, h * 0.5);

      const angle = Math.atan2(ty - sy, tx - sx);
      const distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));

      fireworks.push({
        x: sx,
        y: sy,
        sx, sy, tx, ty,
        distanceToTarget,
        distanceTraveled: 0,
        angle,
        speed: 2,
        acceleration: 1.05,
        brightness: random(50, 70),
        hue: random(0, 360),
        coordinates: [[sx, sy], [sx, sy], [sx, sy]] // Initialize trail
      });
    };

    // Create explosion particles
    const createParticles = (x: number, y: number, hue: number) => {
      const particleCount = 100; // More particles for fuller explosion
      for (let i = 0; i < particleCount; i++) {
        const angle = random(0, Math.PI * 2);
        const speed = random(1, 12);
        // Friction helps realism (particles slow down)
        const friction = 0.95; 
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          hue: random(hue - 20, hue + 20),
          brightness: random(50, 80),
          decay: random(0.015, 0.03),
          coordinates: [[x, y], [x, y], [x, y]]
        });
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Clear canvas with specific composite operation for trails
      // destination-out fades existing pixels, creating a trail effect
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // 0.2 alpha determines trail length
      ctx.fillRect(0, 0, w, h);

      // Switch to lighter for glowing effect
      ctx.globalCompositeOperation = 'lighter';

      // 1. Update and draw fireworks (rockets)
      let i = fireworks.length;
      while (i--) {
        const f = fireworks[i];
        
        ctx.beginPath();
        // Move to the oldest coordinate in the trail
        const startCoords = f.coordinates[f.coordinates.length - 1];
        ctx.moveTo(startCoords[0], startCoords[1]);
        ctx.lineTo(f.x, f.y);
        ctx.strokeStyle = `hsl(${f.hue}, 100%, ${f.brightness}%)`;
        ctx.lineWidth = 2; // Thicker rocket trail
        ctx.stroke();

        // Update trail history
        f.coordinates.pop();
        f.coordinates.unshift([f.x, f.y]);

        // Physics
        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * f.speed;
        f.speed *= f.acceleration;

        // Check if reached target
        const distanceTraveled = Math.sqrt(Math.pow(f.x - f.sx, 2) + Math.pow(f.y - f.sy, 2));
        if (distanceTraveled >= f.distanceToTarget) {
          createParticles(f.tx, f.ty, f.hue);
          fireworks.splice(i, 1);
        }
      }

      // 2. Update and draw particles (explosions)
      let j = particles.length;
      while (j--) {
        const p = particles[j];
        
        ctx.beginPath();
        const startCoords = p.coordinates[p.coordinates.length - 1];
        ctx.moveTo(startCoords[0], startCoords[1]);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
        ctx.lineWidth = 1; // Finer explosion lines
        ctx.stroke();

        // Update trail history
        p.coordinates.pop();
        p.coordinates.unshift([p.x, p.y]);

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92; // Friction (Air resistance)
        p.vy *= 0.92; // Friction
        p.vy += 0.15; // Gravity (Particles fall down)
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(j, 1);
        }
      }

      // 3. Launch timer
      timerTick++;
      if (timerTick >= timerTotal) {
        if (Math.random() > 0.2) { // 80% chance to launch
             createFirework();
        }
        timerTick = 0;
        // Randomize next launch slightly
        timerTotal = random(15, 40);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default Fireworks;
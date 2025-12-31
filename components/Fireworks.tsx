import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: number;
  brightness: number;
  decay: number;
  coordinates: [number, number][];
}

interface Firework {
  x: number;
  y: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Initialize Audio Context on user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsMuted(!isMuted);
  };

  const playLaunchSound = () => {
    if (!audioContextRef.current || isMuted) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  };

  const playExplosionSound = () => {
    if (!audioContextRef.current || isMuted) return;
    const ctx = audioContextRef.current;
    
    // 1. The Deep Boom
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    // 2. The Crackle (White Noise)
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1500;
    noiseGain.gain.setValueAtTime(0.1, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
  };

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

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    let animationFrameId: number;
    let timerTotal = 60;
    let timerTick = 0;

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const createFirework = () => {
      const sx = w / 2 + random(-w / 3, w / 3);
      const sy = h;
      const tx = random(w * 0.1, w * 0.9);
      const ty = random(h * 0.1, h * 0.5);
      const angle = Math.atan2(ty - sy, tx - sx);
      const distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));

      fireworks.push({
        x: sx, y: sy, sx, sy, tx, ty,
        distanceToTarget,
        distanceTraveled: 0,
        angle,
        speed: 1,
        acceleration: 1.04,
        brightness: random(50, 80),
        hue: random(0, 360),
        coordinates: [[sx, sy], [sx, sy], [sx, sy]]
      });
      playLaunchSound();
    };

    const createParticles = (x: number, y: number, hue: number) => {
      playExplosionSound();
      const particleCount = 120;
      for (let i = 0; i < particleCount; i++) {
        const angle = random(0, Math.PI * 2);
        const speed = random(1, 15);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          hue: random(hue - 30, hue + 30),
          brightness: random(50, 90),
          decay: random(0.01, 0.025),
          coordinates: [[x, y], [x, y], [x, y], [x, y], [x, y]]
        });
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      let i = fireworks.length;
      while (i--) {
        const f = fireworks[i];
        ctx.beginPath();
        const startCoords = f.coordinates[f.coordinates.length - 1];
        ctx.moveTo(startCoords[0], startCoords[1]);
        ctx.lineTo(f.x, f.y);
        ctx.strokeStyle = `hsl(${f.hue}, 100%, ${f.brightness}%)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        f.coordinates.pop();
        f.coordinates.unshift([f.x, f.y]);

        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * f.speed;
        f.speed *= f.acceleration;

        const distanceTraveled = Math.sqrt(Math.pow(f.x - f.sx, 2) + Math.pow(f.y - f.sy, 2));
        if (distanceTraveled >= f.distanceToTarget) {
          createParticles(f.tx, f.ty, f.hue);
          fireworks.splice(i, 1);
        }
      }

      let j = particles.length;
      while (j--) {
        const p = particles[j];
        ctx.beginPath();
        const lastCoords = p.coordinates[p.coordinates.length - 1];
        ctx.moveTo(lastCoords[0], lastCoords[1]);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
        ctx.lineWidth = random(0.5, 2);
        ctx.stroke();

        p.coordinates.pop();
        p.coordinates.unshift([p.x, p.y]);

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vy += 0.12; // Gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(j, 1);
        }
      }

      timerTick++;
      if (timerTick >= timerTotal) {
        if (Math.random() > 0.15) {
          createFirework();
        }
        timerTick = 0;
        timerTotal = random(20, 60);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMuted]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <button
        onClick={initAudio}
        className="fixed bottom-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all group"
        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tet-gold animate-pulse"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        )}
      </button>
    </>
  );
};

export default Fireworks;
import React, { useState, useEffect } from 'react';
import { TimeLeft } from '../types';

// Lunar New Year 2026 (Bính Ngọ) falls on February 17, 2026
const TET_2026_DATE = new Date('2026-02-17T00:00:00').getTime();

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = TET_2026_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4 md:mx-8">
      <div className="glass-panel w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-tet-red/20 to-tet-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="text-3xl sm:text-5xl md:text-6xl font-bold font-sans text-white text-glow z-10">
          {value < 10 ? `0${value}` : value}
        </span>
      </div>
      <span className="text-sm sm:text-lg text-gray-300 uppercase tracking-widest font-light">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center items-center py-10 z-10 relative">
      <TimeUnit value={timeLeft.days} label="Ngày" />
      <TimeUnit value={timeLeft.hours} label="Giờ" />
      <TimeUnit value={timeLeft.minutes} label="Phút" />
      <TimeUnit value={timeLeft.seconds} label="Giây" />
    </div>
  );
};

export default CountdownTimer;
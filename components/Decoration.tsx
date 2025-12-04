import React from 'react';

const Decoration: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Top Left Branch */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 opacity-80 animate-float">
         <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-gray-700/50" style={{strokeWidth: 0.5}}>
             {/* Abstract representation of a branch */}
            <path d="M0,0 Q40,40 60,20 T100,30" stroke="#5C4033" strokeWidth="1" fill="none" />
            {/* Blossoms */}
            <circle cx="20" cy="10" r="2" fill="#FFC0CB" className="animate-pulse" />
            <circle cx="45" cy="35" r="3" fill="#FF69B4" />
            <circle cx="70" cy="15" r="2.5" fill="#FFC0CB" />
            <circle cx="90" cy="35" r="2" fill="#FF69B4" className="animate-pulse" />
         </svg>
      </div>

      {/* Top Right Lanterns */}
      <div className="absolute top-0 right-10 md:right-20 flex gap-8">
        <div className="flex flex-col items-center origin-top animate-[swing_3s_ease-in-out_infinite]">
          <div className="w-1 h-12 md:h-24 bg-tet-gold/50"></div>
          <div className="w-12 h-16 md:w-16 md:h-20 bg-red-600 rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
             <span className="text-tet-gold font-serif font-bold text-xl md:text-2xl z-10">Tết</span>
          </div>
          <div className="flex gap-1 mt-1">
             <div className="w-1 h-4 bg-tet-gold"></div>
             <div className="w-1 h-5 bg-tet-gold"></div>
             <div className="w-1 h-4 bg-tet-gold"></div>
          </div>
        </div>
         <div className="flex flex-col items-center origin-top animate-[swing_4s_ease-in-out_infinite_reverse]">
          <div className="w-1 h-8 md:h-16 bg-tet-gold/50"></div>
          <div className="w-10 h-14 md:w-14 md:h-16 bg-red-600 rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
             <span className="text-tet-gold font-serif font-bold text-xl md:text-2xl z-10">2026</span>
          </div>
             <div className="flex gap-1 mt-1">
             <div className="w-1 h-4 bg-tet-gold"></div>
             <div className="w-1 h-5 bg-tet-gold"></div>
             <div className="w-1 h-4 bg-tet-gold"></div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Decoration;
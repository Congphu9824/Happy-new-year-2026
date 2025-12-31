import React from 'react';
import Fireworks from './components/Fireworks';
import CountdownTimer from './components/CountdownTimer';
import GeminiWish from './components/GeminiWish';
import Decoration from './components/Decoration';

function App() {
  return (
    <div className="min-h-screen w-full relative bg-[#050505] text-white overflow-x-hidden selection:bg-tet-red selection:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] z-0"></div>
      
      <Fireworks />
      <Decoration />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-16 animate-[fadeInDown_1s_ease-out]">
          <h2 className="text-tet-gold uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-4">
            Chào đón năm mới
          </h2>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-tet-gold to-red-500 pb-2">
            TẾT 2026
          </h1>
          <p className="text-xl md:text-3xl mt-4 font-script text-gray-300">
            Xuân Bính Ngọ - Mã Đáo Thành Công
          </p>
        </header>

        {/* Timer */}
        <div className="w-full">
          <CountdownTimer />
        </div>

        {/* AI Interaction */}
        <div className="w-full mt-8">
          <GeminiWish />
        </div>

        {/* Footer */}
        <footer className="mt-20 text-gray-600 text-sm font-light">
          <p>© 2025 Design with <span className="text-red-500">♥</span> by React Developer</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
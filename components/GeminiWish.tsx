import React, { useState } from 'react';
import { generateNewYearWish } from '../services/geminiService';
import { LoadingState } from '../types';

const GeminiWish: React.FC = () => {
  const [wish, setWish] = useState<string>("");
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);

  const handleGenerateWish = async () => {
    setLoadingState(LoadingState.LOADING);
    try {
      const newWish = await generateNewYearWish();
      setWish(newWish);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 z-10 relative mt-12">
      <div className="glass-panel rounded-3xl p-8 text-center border border-tet-gold/30 shadow-[0_0_50px_rgba(255,215,0,0.1)]">
        <h2 className="text-2xl font-serif text-tet-gold mb-6 font-bold">
          ✨ Lời Chúc May Mắn Từ Công Phú ✨
        </h2>
        
        <div className="min-h-[100px] flex items-center justify-center mb-6">
          {loadingState === LoadingState.IDLE && (
             <p className="text-gray-400 italic font-sans">
               Nhấn nút bên dưới để nhận lời chúc đặc biệt cho năm Bính Ngọ 2026.
             </p>
          )}
          
          {loadingState === LoadingState.LOADING && (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-tet-gold border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-300 animate-pulse">Đang xin quẻ đầu năm...</p>
            </div>
          )}

          {loadingState === LoadingState.SUCCESS && (
            <p className="text-lg md:text-xl text-white font-script leading-relaxed animate-[fadeIn_1s_ease-out]">
              "{wish}"
            </p>
          )}

          {loadingState === LoadingState.ERROR && (
            <p className="text-red-400">
               Có chút trục trặc khi kết nối với vũ trụ. Vui lòng thử lại!
            </p>
          )}
        </div>

        <button
          onClick={handleGenerateWish}
          disabled={loadingState === LoadingState.LOADING}
          className="group relative px-8 py-3 bg-gradient-to-r from-red-700 to-red-600 rounded-full text-white font-bold tracking-wide overflow-hidden shadow-lg hover:shadow-tet-red/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <span className="relative flex items-center gap-2">
            <span>{loadingState === LoadingState.IDLE ? "Nhận Lời Chúc" : "Lấy Lời Chúc Mới"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default GeminiWish;
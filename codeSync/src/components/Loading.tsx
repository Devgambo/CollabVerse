import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"
            style={{
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '6s',
              animationIterationCount: 'infinite',
              animationName: 'float'
            }}
          />
        ))}
      </div>

      {/* Main loading container */}
      <div className="text-center text-white z-10">
        {/* Multi-layered spinner */}
        <div className="relative w-20 h-20 mx-auto mb-5">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          
          {/* Middle ring */}
          <div 
            className="absolute inset-1 border-2 border-transparent border-t-blue-500 rounded-full"
            style={{
              animation: 'spin 1.5s linear infinite reverse'
            }}
          ></div>
          
          {/* Inner ring */}
          <div 
            className="absolute inset-2.5 border-2 border-blue-500/30 border-t-slate-500 rounded-full"
            style={{
              animation: 'spin 0.8s linear infinite'
            }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-2xl font-light tracking-widest mb-2 bg-gradient-to-r from-purple-500 via-blue-500 to-slate-500 bg-clip-text text-transparent animate-pulse">
          LOADING
        </div>

        {/* Animated dots */}
        <div className="text-xl text-purple-500 mb-5 h-6">
          <span className="animate-ping">.</span>
          <span className="animate-ping" style={{ animationDelay: '0.5s' }}>.</span>
          <span className="animate-ping" style={{ animationDelay: '1s' }}>.</span>
        </div>

        {/* Progress bar */}
        {/* <div className="w-50 h-1 bg-purple-500/20 rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-slate-500 rounded-full"
            style={{
              animation: 'progress 3s ease-in-out infinite'
            }}
          ></div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
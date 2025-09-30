
import React from 'react';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="w-full text-center mb-8 md:mb-12">
      <div className="flex items-center justify-center gap-4 mb-2">
        <CameraIcon />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-300 text-transparent bg-clip-text">
          톡탁 AI 가족사진 스튜디오
        </h1>
      </div>
      <p className="text-lg text-slate-600">
        우리의 순간을 특별한 사진으로 남겨보세요.
      </p>
    </header>
  );
};

export default Header;
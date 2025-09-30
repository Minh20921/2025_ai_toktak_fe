
import React from 'react';

interface GeneratedImageDisplayProps {
  isLoading: boolean;
  imageUrl: string | null;
  error: string | null;
  onReset: () => void;
}

const loadingMessages = [
    "가족사진을 분석하고 있어요...",
    "AI가 최적의 구도를 잡고 있어요...",
    "선택한 스타일을 적용하고 있어요...",
    "마무리 작업을 하고 있어요...",
    "거의 다 됐어요, 멋진 작품을 준비 중이에요!",
];

const LoadingState: React.FC = () => {
    const [progress, setProgress] = React.useState(0);
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 99) {
                    clearInterval(interval);
                    return 99;
                }
                const increment = Math.random() * 4 + 1;
                return Math.min(prev + increment, 99);
            });
        }, 600);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        if (progress < 20) setMessage(loadingMessages[0]);
        else if (progress < 45) setMessage(loadingMessages[1]);
        else if (progress < 75) setMessage(loadingMessages[2]);
        else if (progress < 99) setMessage(loadingMessages[3]);
        else setMessage(loadingMessages[4]);
    }, [progress]);

    return (
        <div className="text-center p-8 bg-slate-50 rounded-xl flex flex-col items-center justify-center min-h-[500px]">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">가족사진을 만들고 있어요</h3>
            
            <div className="w-full max-w-md mx-auto">
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-3 rounded-full transition-all duration-500 ease-linear" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm font-medium text-indigo-600 mb-6">{Math.round(progress)}%</p>
            </div>
            
            <p className="text-slate-600 transition-opacity duration-500 h-6">{message}</p>
        </div>
    );
};

const ErrorState: React.FC<{ error: string; onReset: () => void }> = ({ error, onReset }) => (
    <div className="text-center p-8 bg-red-50 border border-red-300 rounded-xl flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        </div>
        <h3 className="text-2xl font-bold text-red-800 mb-2">오류가 발생했어요</h3>
        <p className="text-red-700 max-w-lg mb-6">{error}</p>
        <button
            onClick={onReset}
            className="px-6 py-2 bg-white text-slate-800 font-bold rounded-lg hover:bg-slate-100 transition-colors border border-slate-300"
        >
            다시 시도하기
        </button>
    </div>
);


const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ isLoading, imageUrl, error, onReset }) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
      return <ErrorState error={error} onReset={onReset} />;
  }

  if (imageUrl) {
    return (
      <div className="animate-fade-in text-center">
        <h2 className="text-3xl font-bold mb-6">가족사진이 완성됐어요!</h2>
        <div className="bg-slate-100 p-4 rounded-xl inline-block shadow-2xl">
            <img src={imageUrl} alt="Generated family portrait" className="max-w-full md:max-w-2xl lg:max-w-3xl max-h-[70vh] rounded-lg" />
        </div>
        <div className="mt-8 flex justify-center gap-4">
            <button
                onClick={onReset}
                className="px-8 py-3 bg-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-300 transition-colors"
            >
                새 사진 만들기
            </button>
            <a
                href={imageUrl}
                download="family-portrait.jpg"
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors inline-block"
            >
                이미지 저장하기
            </a>
        </div>
      </div>
    );
  }

  return null;
};

export default GeneratedImageDisplay;
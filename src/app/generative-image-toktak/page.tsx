'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { Preset } from './types';
import { generateFamilyPhoto } from './services/geminiService';
import { PRESETS as initialPresets } from './constants';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PresetSelector from './components/PresetSelector';
import GeneratedImageDisplay from './components/GeneratedImageDisplay';
import CameraCapture from './components/CameraCapture';
import { showNoticeError } from '@/utils/custom/notice_error';

const Page: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const imagePreviews = useMemo(() => {
    return uploadedFiles.map((file) => URL.createObjectURL(file));
  }, [uploadedFiles]);

  const handleReset = useCallback(() => {
    setUploadedFiles([]);
    setSelectedPreset(null);
    setGeneratedImageUrl(null);
    setError(null);
    setIsLoading(false);
    // Revoke object URLs to prevent memory leaks
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  const handleCapture = (imageFile: File) => {
    if (uploadedFiles.length < 5) {
      setUploadedFiles((prevFiles) => [...prevFiles, imageFile]);
    }
    setIsCameraOpen(false);
  };

  const handleGenerateClick = async () => {
    if (!selectedPreset || uploadedFiles.length < 1 || uploadedFiles.length > 5) {
      setError('Please upload 1-5 photos and select a preset.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/gemini/count');
      const data = await res.json();

      if (data.total >= 1000) {
        setIsLoading(false);
        showNoticeError(
          '오늘의 톡탁 AI 가족사진 </br>무료 체험이 마감되었습니다.',
          '내일 다시 참여해주세요😊',
          false,
          '확인',
          '취소',
          () => {
            // setLoading(false);
          },
        );
        return;
      }

      const imageUrl = await generateFamilyPhoto(uploadedFiles, selectedPreset.id);
      setGeneratedImageUrl(imageUrl);

      await fetch('/api/gemini/count', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: 1 }),
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during image generation.';
      setError(`Failed to generate image. ${errorMessage}. Please check your API key and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateButtonDisabled = isLoading || !selectedPreset || uploadedFiles.length < 1 || uploadedFiles.length > 5;

  const currentView = useMemo(() => {
    if (isLoading || generatedImageUrl || error) {
      return 'result';
    }
    return 'setup';
  }, [isLoading, generatedImageUrl, error]);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center p-4 md:p-8 text-slate-900">
      <Header />
      <main className="w-full max-w-6xl flex-grow">
        {isCameraOpen && <CameraCapture onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}

        {currentView === 'setup' && !isCameraOpen && (
          <div className="animate-fade-in space-y-8 md:space-y-12">
            <ImageUploader
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              imagePreviews={imagePreviews}
              onTakePhoto={() => setIsCameraOpen(true)}
            />
            <PresetSelector
              presets={initialPresets}
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
            />
          </div>
        )}

        {(isLoading || generatedImageUrl || error) && !isCameraOpen && (
          <GeneratedImageDisplay
            isLoading={isLoading}
            imageUrl={generatedImageUrl}
            error={error}
            onReset={handleReset}
          />
        )}

        <div className="mt-12 flex flex-col items-center gap-8 px-4 w-full">
          {currentView === 'setup' && !isCameraOpen && (
            <div className="w-full max-w-md animate-fade-in">
              <button
                onClick={handleGenerateClick}
                disabled={isGenerateButtonDisabled}
                className="w-full px-12 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
              >
                톡탁 AI로 생성하기
              </button>

              <div className="mt-8 text-center">
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-grow border-t border-slate-300"></div>
                  <h3 className="text-slate-500 font-semibold flex-shrink-0">톡탁 더 즐기기</h3>
                  <div className="flex-grow border-t border-slate-300"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://toktak.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-slate-200 text-slate-800 font-bold text-sm rounded-lg hover:bg-slate-300 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400 focus:ring-opacity-50"
                  >
                    톡탁 바로가기
                  </a>
                  <a
                    href="https://forms.gle/QqwBDXPv1JsdhZiS8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 text-white font-bold text-sm rounded-lg hover:bg-teal-600 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a2.5 2.5 0 00-2.5 2.5V7h5V4.5A2.5 2.5 0 0010 2z" />
                      <path
                        fillRule="evenodd"
                        d="M3.5 8A1.5 1.5 0 002 9.5v6A1.5 1.5 0 003.5 17h13a1.5 1.5 0 001.5-1.5v-6A1.5 1.5 0 0016.5 8h-2.93a3.5 3.5 0 00-6.14 0H3.5zm5.5 2a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    톡탁 이벤트 참여하기
                  </a>
                </div>
                <a
                  href="https://forms.gle/QqwBDXPv1JsdhZiS8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block w-full p-3 bg-amber-100 text-amber-800 font-semibold text-sm rounded-lg hover:bg-amber-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-50"
                >
                  지금 사진 제출만 해도 커피 쿠폰 100% 증정! ☕🎁 꼭 받아가세요
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>&copy; 2025 TOKTAK. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page;

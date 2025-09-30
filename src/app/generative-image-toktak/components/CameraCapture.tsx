import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream | null = null;
    let isCancelled = false;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
          });

          if (!isCancelled) {
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
          } else {
            // If component unmounted while waiting for permission, stop the stream
             mediaStream.getTracks().forEach(track => track.stop());
          }
        } else {
          if (!isCancelled) setError("사용하시는 브라우저가 카메라 접근을 지원하지 않습니다.");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (!isCancelled) {
          setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
        }
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(capturedFile);
          }
        }, 'image/jpeg');
      }
    }
  }, [onCapture]);
  
  // The onClose prop triggers unmount, and the useEffect cleanup now handles stopping the stream.
  const handleClose = () => {
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="relative bg-slate-800 p-4 rounded-lg shadow-2xl w-full max-w-2xl">
        {error ? (
            <div className="text-center text-red-400 p-8 min-h-[300px] flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold mb-2">카메라 오류</h3>
                <p>{error}</p>
            </div>
        ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md bg-slate-900" aria-label="Camera feed"></video>
        )}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Close camera"
          >
            취소
          </button>
          <button
            onClick={handleCapture}
            disabled={!stream || !!error}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
            aria-label="Take picture"
          >
            사진 찍기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;

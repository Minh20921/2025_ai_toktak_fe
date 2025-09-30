
import React, { useRef } from 'react';

interface ImageUploaderProps {
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreviews: string[];
  onTakePhoto: () => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedFiles, setUploadedFiles, imagePreviews, onTakePhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileCount = uploadedFiles.length;
  const isCountValid = fileCount >= 1 && fileCount <= 5;
  const canAddMore = fileCount < 5;
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setUploadedFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, 5));
    }
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]); // Clean up memory
  };
  
  const onUploadClick = () => {
      if(canAddMore) {
        fileInputRef.current?.click();
      }
  };

  return (
    <section>
        <h2 className="text-2xl font-bold text-center mb-1 text-slate-900">1. 사진 불러오기</h2>
        <p className="text-center text-slate-600 mb-6">1~5장의 사진을 올리거나 직접 찍어보세요.</p>

        <div className="flex flex-col sm:flex-row gap-4">
            <div
                onClick={onUploadClick}
                className={`flex-1 bg-slate-50 border-2 border-dashed border-slate-300 p-6 rounded-xl text-center transition-all flex flex-col justify-center items-center ${canAddMore ? 'cursor-pointer hover:border-indigo-500 hover:bg-slate-100' : 'opacity-50 cursor-not-allowed'}`}
                aria-disabled={!canAddMore}
            >
                <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                    disabled={!canAddMore}
                />
                <UploadIcon />
                <p className="text-slate-700 font-semibold">사진 업로드</p>
                <p className="text-sm text-slate-500">클릭해서 선택하거나 끌어다 놓으세요</p>
            </div>

            <button
                onClick={onTakePhoto}
                disabled={!canAddMore}
                className="flex-1 bg-slate-50 border-2 border-dashed border-slate-300 p-6 rounded-xl text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-100 transition-all flex flex-col justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:bg-slate-50"
            >
                <CameraIcon />
                <p className="text-slate-700 font-semibold">카메라로 촬영</p>
                <p className="text-sm text-slate-500">내 기기 카메라로 바로 찍기</p>
            </button>
        </div>
        
        {fileCount > 0 && (
            <div className="mt-6">
                 <p className={`text-center font-medium ${isCountValid ? 'text-green-600' : 'text-amber-600'}`}>
                    {fileCount} / 5 장의 사진이 업로드됐어요.
                </p>
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md shadow-md" />
                            <button 
                                onClick={() => removeFile(index)} 
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                            >
                                <TrashIcon/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </section>
  );
};

export default ImageUploader;
import { Box, Typography } from '@mui/material';
import React, { useRef } from 'react';
import iconUpload from '@/../public/images/generation/material-symbols_upload-rounded.png';
import Image from 'next/image';
interface IUploadsModel {
  setFile: React.Dispatch<React.SetStateAction<File | null | string>>;
  onClose: () => void;
}

const UploadsModel = ({ setFile, onClose }: IUploadsModel) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
    if (files && files.length > 0) {
      setFile(files[0]);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log('Selected files:', e.target.files);
      setFile(e.target.files[0]);
      onClose();
    }
  };
  return (
    <Box
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="p-10 h-[528px] flex items-center justify-center bg-[#EEEEEE]"
    >
      <div>
        <div className="flex justify-center mb-[20px] cursor-pointer">
          <Image onClick={handleClick} src={iconUpload} alt="iconUpload" />
        </div>
        <Typography className="text-center">영상 1개와 이미지 최대 5개를 함께 업로드할 수 있습니다.</Typography>
        <Typography className="text-center">파일을 드래그하거나 컴퓨터에서 선택해 주세요.</Typography>
        <input ref={inputRef} type="file" multiple hidden accept="image/*" onChange={handleChange} />
      </div>
    </Box>
  );
};

export default UploadsModel;

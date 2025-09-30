import { Box, Typography } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import img from '@/../public/images/generation/Loading AnimationSS.gif';
interface ICardLoading {
  task: any;
}
const CardLoading = ({}: ICardLoading) => {
  return (
    <Box className="w-[253px] h-[405px] flex justify-center items-center bg-[#EEEEEE] rounded-[10px]">
      <Box className="flex flex-col items-center">
        <Image className="mb-2" src={img} width={60} height={60} alt="loading..." />
        <Typography className="text-[16px] font-semibold text-[#A4A4A4] mb-[2px] text-center">예상 1분 소요</Typography>
        <Typography className="text-[14px] text-[#A4A4A4] mb-[2px] text-center">사용되는 콘텐츠에 따라</Typography>
        <Typography className="text-[14px] text-[#A4A4A4] mb-[2px] text-center">
          제작 시간이 길어질 수 있습니다.
        </Typography>
      </Box>
    </Box>
  );
};

export default CardLoading;

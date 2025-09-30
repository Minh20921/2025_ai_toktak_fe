import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import img from '@/../public/images/generation/faild.svg';
import imgRefesh from '@/../public/images/generation/material-symbols_refresh-rounded.png';
import imgTrash from '@/../public/images/generation/tabler_trash.png';
import { AiGenerationPayload } from '../../@type/interface';
interface ICardFaild {
  task: any;
  handleDelete: (id: number) => Promise<void>;
  handleUpdate: (item: AiGenerationPayload) => Promise<void>;
}
const CardFaild = ({ handleDelete, task, handleUpdate }: ICardFaild) => {
  return (
    <Box className="relative w-[253px] h-[405px] flex justify-center items-center bg-[#EEEEEE] rounded-[10px]">
      <Box className="flex flex-col items-center">
        <Image className="mb-2" src="/images/generation/faild.svg" width={60} height={60} alt="img" />
        <Typography className="text-[16px] font-semibold text-[#A4A4A4] mb-[2px] text-center">
          컨텐츠 생성성 실패
        </Typography>
      </Box>
      <Box className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2">
        <Button
          color="primary"
          disableElevation
          variant="contained"
          className="relative flex w-[143px] h-[40px] 
                    flex-none !rounded-full font-pretendard items-center
                    bg-[#4776EF]
                    "
          onClick={() => {
            handleUpdate(task);
          }}
        >
          <Image src={imgRefesh} alt="imgRefesh" /> <span>재시도</span>
        </Button>
        <Button
          color="primary"
          disableElevation
          variant="contained"
          className="relative flex w-[143px] h-[40px] 
                    flex-none !rounded-full font-pretendard items-center
                    bg-[#232323]
                    "
          onClick={() => {
            handleDelete(task?.id as number);
          }}
        >
          <Image src={imgTrash} alt="imgTrash" /> <span>삭제</span>
        </Button>
      </Box>
    </Box>
  );
};

export default CardFaild;

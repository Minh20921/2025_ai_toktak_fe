'use client';

import React from 'react';
import { Box, Button, Dialog, DialogContent, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import iconClose from '@/../public/images/generation/close.png';
import Image from 'next/image';
import { AiGenerationItem } from '../../@type/interface';

interface IDialogViewDetailByUser {
  open: boolean;
  handleClose: () => void;
  task: AiGenerationItem | null;
}
const DialogViewDetailByUser = ({ open, handleClose, task }: IDialogViewDetailByUser) => {
  const theme = useTheme();
  return (
    <Dialog
      fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        sx: {
          width: '735px',
          maxWidth: '735px',
        },
      }}
      className="hide-scrollbar"
    >
      <DialogContent className="hide-scrollbar" sx={{ padding: '24px !important' }}>
        <Box>
          <Box className="flex items-center justify-between mb-[24px]">
            <Typography variant="h4" component="h1" className="font-pretendard font-bold sm:block text-[24px]">
              미리보기
            </Typography>

            <Image className="cursor-pointer" onClick={handleClose} src={iconClose} alt="iconClose" />
          </Box>
        </Box>
        {/* phần nội dung chính */}
        <Box display="flex" height="670px" className="gap-[24px]">
          <Box flex={1} display="flex" className="gap-[10px]">
            <Box className="relative" flex={1}>
              {task?.type?.toLowerCase().includes('video') ? (
                <video src={task.url} controls className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Image fill src={task?.url as string} alt="img" className="object-cover rounded-lg" />
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogViewDetailByUser;

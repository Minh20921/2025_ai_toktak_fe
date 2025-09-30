'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, CircularProgress, Button, Menu, MenuItem, Modal, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import API from '@service/api';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/app/lib/store/store';
import { Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';

interface FacebookProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomPopupMobile({ open, onClose, children }: FacebookProps) {
  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="bottom-modal-mobile">
        <Box className="absolute inset-0">
          <Box className="absolute bottom-0 w-full rounded-t-[12px] bg-white shadow-lg">
            {children}
          </Box>
        </Box>
      </Modal>
    </>
  );
}

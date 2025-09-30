'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  Modal,
  Typography,
  Drawer,
  useMediaQuery, Dialog,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import API from '@service/api';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/app/lib/store/store';
import { Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import { BASIC_LIST } from '@/utils/constant';

interface FacebookProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SNSSettingsPopup({ open, onClose, onSuccess }: FacebookProps) {
  const platform = useSelector((state: RootState) => state.platform);
  const snsSettings = useSelector((state: RootState) => state.snsSettings);
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [socialVideoButtons, setSocialVideoButtons] = useState<any[]>([]);
  const [selectedVideoSocial, setSelectedVideoSocial] = useState<number[]>([]);
  const [selectedImageSocial, setSelectedImageSocial] = useState<number[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const updateSNSSettingsAPI = useRef(
    new API(`/api/v1/user/update-user-link-template`, 'POST', {
      success: (res) => {
        onSuccess();
        onClose();
      },
      error: (err) => {
      },
      finally: () => {
      },
    }),
  );

  useEffect(() => {
    setSocialVideoButtons([
      {
        id: 5,
        name: 'youtube',
        label: '유튜브',
        icon: <Youtube className={'w-9 h-9'} />,
        status: platform['youtube'].status,
      },
      {
        id: 2,
        name: 'instagram',
        label: '인스타그램',
        icon: <Instagram className={'w-9 h-9'} />,
        status: platform['instagram'].status,
      },
      {
        id: 1,
        name: 'facebook',
        label: '페이스북',
        icon: <Facebook className={'w-9 h-9'} />,
        status: platform['facebook'].status,
      },
      {
        id: 4,
        name: 'tiktok',
        label: '틱톡',
        icon: <TikTok className={'w-9 h-9'} />,
        status: platform['tiktok'].status,
      },
      {
        id: 6,
        name: 'threads',
        label: '스레드',
        icon: <Threads className={'w-9 h-9'} />,
        status: platform['threads'].status,
      },
      {
        id: 3,
        name: 'twitter',
        label: '엑스',
        icon: <Twitter className={'w-9 h-9'} />,
        status: platform['twitter'].status,
      },
    ]);
  }, [platform]);

  useEffect(() => {
    if (snsSettings) {
      const tmpVideo = snsSettings?.video.filter((item: any) => item.selected === 1).map((item: any) => item.id);
      setSelectedVideoSocial(tmpVideo);
      const tmpImage = snsSettings?.image.filter((item: any) => item.id !== 5 && item.selected === 1).map((item: any) => item.id);
      setSelectedImageSocial(tmpImage);
    }
  }, [snsSettings, open]);

  const handleUpdateSNSSettings = () => {
    updateSNSSettingsAPI.current.config.data = {
      video: selectedVideoSocial,
      image: selectedImageSocial,
    };
    updateSNSSettingsAPI.current.call();
  };

  const isDisableBtn = () => selectedVideoSocial.length === 0 && selectedImageSocial.length === 0;

  const canSelectAll = (type = 0) =>
    !(
      BASIC_LIST.indexOf(user?.subscription || '') !== -1 &&
      (type === 0 ? selectedImageSocial : selectedVideoSocial).length > 0
    );

  const Content = (
    <Box
      sx={{
        width: '100%',
        borderRadius: { xs: 0, sm: '30px' },
        backgroundColor: 'white',
        boxShadow: 3,
        py: { xs: 2.5, sm: '50px' },
        px: { xs: 2, sm: 10 },
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'stretch' },
          position: 'relative',
          mx: 'auto',
        }}
      >
        <Typography
          sx={{
            color: '#090909',
            fontSize: { xs: '18px', sm: '21px' },
            fontWeight: 600,
            textAlign: 'center',
            mt: { xs: 0, sm: '10px' },
          }}
        >
          채널별 콘텐츠 선택
        </Typography>

        {/* VIDEO */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            width: '100%',
            gap: 2,
            mt: { xs: '32px', sm: '50px' },
          }}
        >
          <Typography
            sx={{
              color: '#272727',
              fontSize: { xs: '16px', sm: '14px' },
              fontWeight: { xs: 600, sm: 500 },
              flexGrow: 1,
            }}
          >
            VIDEO
          </Typography>
          <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: { xs: 'start', sm: 'flex-end' } }}>
            {socialVideoButtons.map((social) => {
              const selected = selectedVideoSocial.includes(social.id);
              const isActive = social.status;

              return (
                <Box
                  key={`video-${social.name}`}
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    px: '7px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: selected && isActive ? '#4776EF' : '#F6F7F9',
                    cursor: isActive ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (isActive) {
                      setSelectedVideoSocial((prev) =>
                        selected ? prev.filter((id) => id !== social.id) : [...prev, social.id],
                      );
                      if (!canSelectAll(0)) {
                        setSelectedImageSocial([]);
                      }
                    }

                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: selected && isActive ? '#4776EF' : isActive ? '#272727' : '#A4A4A4',
                    }}
                  >
                    {social.icon}
                    {social.label}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* IMAGE */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            width: '100%',
            gap: 2,
            mt: { xs: '20px', sm: '16px' },
          }}
        >
          <Typography
            sx={{
              color: '#272727',
              fontSize: { xs: '16px', sm: '14px' },
              fontWeight: { xs: 600, sm: 500 },
              flexGrow: 1,
            }}
          >
            IMAGE
          </Typography>
          <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: { xs: 'start', sm: 'flex-end' } }}>
            {socialVideoButtons.map((social, index) => {
              if (index === 0) return null;
              const selected = selectedImageSocial.includes(social.id);
              const isActive = social.status;

              return (
                <Box
                  key={`image-${social.name}`}
                  sx={{
                    display: 'flex',
                    gap: '5px',
                    px: '7px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: selected && isActive ? '#4776EF' : '#F6F7F9',
                    cursor: isActive ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (isActive) {
                      setSelectedImageSocial((prev) =>
                        selected ? prev.filter((id) => id !== social.id) : [...prev, social.id],
                      );
                      if (!canSelectAll(1)) {
                        setSelectedVideoSocial([]);
                      }
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: selected && isActive ? '#4776EF' : isActive ? '#272727' : '#A4A4A4',
                    }}
                  >
                    {social.icon}
                    {social.label}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* BUTTONS */}
        <Box sx={{ width: '100%', mt: '55px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button
            disableElevation
            variant="contained"
            size="large"
            sx={{
              display: { xs: 'none', sm: 'block' },
              width: '158px',
              height: '50px',
              borderRadius: '37px',
              fontSize: '18px',
              fontWeight: 600,
              px: 0,
              pt: '9px',
              backgroundColor: '#E7E7E7',
              color: '#6A6A6A',
              '&:hover': {
                backgroundColor: '#dcdcdc',
              },
            }}
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            disableElevation
            disabled={isDisableBtn()}
            variant="contained"
            aria-label="save"
            size="large"
            sx={{
              width: { xs: '100%', sm: '158px' },
              height: '50px',
              borderRadius: { xs: '6px', sm: '37px' },
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: { xs: 500, sm: 600 },
              px: 0,
              pt: '9px',
              backgroundColor: { xs: '#4776EF', sm: '#272727' },
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: { xs: '#4776EF', sm: '#1f1f1f' },
              },
            }}
            onClick={handleUpdateSNSSettings}
          >
            확인
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Loading Modal */}
      <Modal
        className="w-screen flex items-center justify-center"
        open={loading}
        onClose={() => setLoading(false)}
      >
        <CircularProgress />
      </Modal>

      {/* Main Modal or Drawer */}
      {isMobile ? (
        <Drawer anchor="bottom" open={open} onClose={onClose}
                PaperProps={{ sx: { borderTopLeftRadius: 12, borderTopRightRadius: 12 } }}
        >
          {Content}
        </Drawer>
      ) : (
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="sns-dialog"
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: 30,
              padding: 0,
            },
          }}
        >
          {Content}
        </Dialog>
      )}
    </>
  );
}

'use client';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Api from '@service/api';
import API from '@service/api';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/lib/store/store';
import { type PlatformState, setPlatformState } from '@/app/lib/store/platformSlice';
import { PLATFORM_TEXT } from '@/utils/constant';
import type { ResponseLinked } from '@/app/(DashboardLayout)/profile/ProviderPlatform';

interface PageOption {
  id: string;
  name: string;
  avatar: string;
}

interface PageSelectDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PageSelectDialog({ open, onClose }: PageSelectDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const platform = useSelector((state: RootState) => state.platform);
  const [selected, setSelected] = useState<string | undefined>(
    platform?.facebook?.page_id || platform?.facebook?.social_id.toString(),
  );
  const [pageOptions, setPageOptions] = useState<PageOption[]>([]);

  const getDataAPI = new API('/api/v1/user/links', 'GET', {
    success: (response) => {
      const listConnect = response.data as ResponseLinked[];
      listConnect.forEach((connect) => {
        dispatch(
          setPlatformState({
            platform: PLATFORM_TEXT[connect.link_id] as keyof PlatformState,
            status: !!connect.status,
            token: '',
            info: connect,
          }),
        );
      });
    },
    error() {
      console.log('error');
    },
    finally() {
      // console.log('finish');
    },
  });

  const getFacebookPage = useRef(
    new Api('/api/v1/user/get-facebook-page', 'GET', {
      success: (res) => {
        const pages = res.data
          ?.filter((item: any) => item.tasks.includes('CREATE_CONTENT'))
          .map((item: any) => {
            return {
              id: item?.id,
              name: item?.name,
              avatar: item?.picture?.data?.url,
            };
          });
        setPageOptions(pages);
      },
      error: (err) => {
      },
    }),
  );

  const selectFacebookPage = useRef(
    new Api('/api/v1/user/select-facebook-page', 'POST', {
      success: (res) => {
        getDataAPI.call().finally(() => onClose());
      },
      error: (err) => {
      },
    }),
  );

  useEffect(() => {
    if (platform.facebook.status) {
      getFacebookPage.current.call();
      setSelected(platform?.facebook?.page_id || platform?.facebook?.social_id.toString());
    }
  }, [platform.facebook.status]);

  const handleConfirm = () => {
    if (selected) {
      selectFacebookPage.current.config.data = {
        page_id: selected,
      };
      selectFacebookPage.current.call();
    }
  };

  const handleCancel = () => {
    onClose();
    setSelected(platform?.facebook?.page_id || platform?.facebook?.social_id.toString());
  };

  const PageContent = () => (
    <Box
      sx={
        pageOptions.length > 1
          ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }
          : {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
      }
    >
      {pageOptions.map((page) => (
        <Box
          key={page.id}
          onClick={() => setSelected(page.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            border: '2px solid',
            height: 40,
            borderColor: selected === page.id ? '#4776EF' : '#F6F7F9',
          }}
        >
          <Avatar src={page.avatar} alt={page.name} sx={{ width: 24, height: 24 }} />
          <Typography
            noWrap
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: '14px',
              maxWidth: '100%',
              textAlign: 'center',
              color: selected === page.id ? '#4776EF' : '#6A6A6A',
            }}
          >
            {page.name.length > 10 ? `${page.name.slice(0, 10)}...` : page.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const ActionButtons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
      <Button
        onClick={handleCancel}
        variant="outlined"
        sx={{
          borderRadius: '9999px',
          width: '48%',
          height: 50,
          py: 1,
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: '21px',
          backgroundColor: '#E7E7E7',
          color: '#6A6A6A',
          border: 'none',
          '&:hover': {
            backgroundColor: '#e0e0e0',
            border: 'none',
          },
        }}
      >
        취소
      </Button>
      <Button
        onClick={handleConfirm}
        variant="contained"
        disabled={!selected}
        sx={{
          borderRadius: '9999px',
          width: '48%',
          height: 50,
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: '21px',
          py: 1,
          backgroundColor: '#272727',
          '&:hover': {
            backgroundColor: '#333',
          },
        }}
      >
        확인
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: '30px',
            borderTopRightRadius: '30px',
            py: 5,
            maxHeight: '80vh',
          },
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '21px',
            pb: 0,
            lineHeight: '30px',
            mb: 1,
          }}
          color="#090909"
        >
          업로드 할 페이지 선택
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 500,
            fontSize: '14px',
            color: '#A4A4A4',
            px: 4,
            pb: '30px',
          }}
        >
          아래에서 연결할 페이스북 페이지를 선택해 주세요.
        </Typography>
        <Box sx={{ pt: 0, pb: 5, px: 2 }}>
          <PageContent />
        </Box>
        <Box sx={{ px: 4, py: 0 }}>
          <ActionButtons />
        </Box>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: '30px', p: 5 } } }}
    >
      <DialogTitle
        sx={{ textAlign: 'center', fontWeight: 600, fontSize: '21px', pb: 0, lineHeight: '30px' }}
        color="#090909"
      >
        업로드 할 페이지 선택
      </DialogTitle>
      <Typography sx={{ textAlign: 'center', fontWeight: 500, fontSize: '14px', color: '#A4A4A4', px: 4, pb: '30px' }}>
        아래에서 연결할 페이스북 페이지를 선택해 주세요.
      </Typography>
      <DialogContent sx={{ pt: 0, pb: 5, px: 2 }}>
        <PageContent />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 4, py: 0 }}>
        <ActionButtons />
      </DialogActions>
    </Dialog>
  );
}

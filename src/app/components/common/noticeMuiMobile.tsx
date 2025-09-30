import React from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';

interface Props {
  title: string;
  html: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: string;
  icon_url?: string;
}

export const MobileNoticeDialog = ({
  title,
  html,
  showCancelButton,
  confirmButtonText,
  cancelButtonText,
  onClose,
  onConfirm,
  onCancel,
  icon,
  icon_url,
}: Props) => {
  return (
    <Dialog
      open
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return; // không cho đóng khi click ra ngoài
        onClose();
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: '310px',
          p: '30px 0 20px',
          zIndex: 9999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, fontFamily: 'var(--font-pretendard)' }}>
        <Box
          sx={{
            width: '64px',
            height: '64px',
            border: 'none',
            backgroundColor: '#FBD62F1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
          }}
        >
          {icon_url ? (
            <img src={icon_url} alt="icon" />
          ) : icon ? (
            <img src={`/images/home/${icon}`} alt="icon" />
          ) : (
            <img src="/images/home/ring.svg" alt="icon" />
          )}
        </Box>
      </Box>

      <DialogTitle
        sx={{
          py: 0,
          px: 2.5,
          fontSize: '18px',
          lineHeight: '25px',
          color: '#272727',
          paddingBottom: '12px',
          fontFamily: 'var(--font-pretendard)',
          fontWeight: 600,
          textAlign: 'center',
          wordBreak: 'keep-all',
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: title }} />
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', flexGrow: 1, width: '100%', overflow: 'hidden', px: 2.5 }}>
        <Box
          sx={{
            minHeight: '40px',
            overflow: 'hidden',
            position: 'relative',
            margin: '0 auto',
            color: '#A4A4A4',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'var(--font-pretendard)',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', padding: 0, width: '100%', px: 2.5 }}>
        {showCancelButton && (
          <Button
            onClick={onCancel}
            disableRipple
            disableElevation
            sx={{
              borderRadius: '8px',
              fontSize: '18px',
              fontFamily: 'var(--font-pretendard)',
              fontWeight: 600,
              lineHeight: '21px',
              backgroundColor: '#E7E7E7',
              color: '#6A6A6A',
              height: '50px',
              width: '100%',
            }}
          >
            {cancelButtonText || 'Cancel'}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          disableRipple
          disableElevation
          sx={{
            borderRadius: '8px',
            fontSize: '18px',
            fontFamily: 'var(--font-pretendard)',
            fontWeight: 600,
            lineHeight: '21px',
            backgroundColor: '#272727',
            color: '#fff',
            height: '50px',
            width: '100%',
          }}
        >
          {confirmButtonText || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { MobileNoticeDialog } from '@/app/components/common/noticeMuiMobile';

type NoticeInputProps = {
  title: string;
  html: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  successCallback?: (email: string) => void;
  cancelCallback?: () => void;
  icon?: string;
  icon_url?: string;
  onCloseHost: () => void; // ⬅️ để đóng root bên ngoài
};

/** Desktop dialog: component cấp module => dùng hook hợp lệ */
function NoticeInputDesktop({
  title,
  html,
  showCancelButton,
  confirmButtonText,
  cancelButtonText,
  successCallback,
  cancelCallback,
  icon,
  icon_url,
  onCloseHost,
}: NoticeInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCancel = () => {
    cancelCallback?.();
    onCloseHost();
  };

  const handleConfirm = () => {
    if (!validateEmail(value)) {
      setError(true);
      return;
    }
    setError(false);
    successCallback?.(value);
    onCloseHost();
  };

  return (
    <Dialog
      open
      onClose={(_event, reason) => {
        // không cho đóng bằng ESC / backdrop
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onCloseHost();
        }
      }}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: '30px',
          width: '472px',
          height: '430px',
          py: '48px',
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
            width: '80px',
            height: '80px',
            border: 'none',
            backgroundColor: '#4776EF14',
            backdropFilter: 'blur(75px)',
            boxShadow: '0 0 60px 20px rgba(59,130,246,0.2)',
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
          fontSize: '21px',
          lineHeight: '30px',
          color: '#090909',
          paddingBottom: '12px',
          fontFamily: 'var(--font-pretendard)',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: title }} />
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', flexGrow: 1, width: '100%', overflow: 'hidden' }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontFamily: 'var(--font-pretendard)',
            fontWeight: 500,
            minHeight: '40px',
            overflow: 'hidden',
            position: 'relative',
            margin: '0 auto',
            color: '#A4A4A4',
          }}
          component="div"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              overflow: 'hidden',
              right: 0,
              transform: 'translateY(-50%)',
              textAlign: 'center',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Typography>

        <Box sx={{ mt: 3 }} className="notice-input">
          <TextField
            id="notice-input"
            type="email"
            placeholder="이메일을 입력하세요"
            variant="outlined"
            fullWidth
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirm();
            }}
            error={error}
            helperText={error ? '이메일을 작성해 주세요.' : ' '}
            InputProps={{ sx: { borderRadius: '10px' } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: '16px', padding: 0 }}>
        {showCancelButton && (
          <Button
            onClick={handleCancel}
            disableRipple
            disableElevation
            sx={{
              borderRadius: '9999px',
              fontSize: '18px',
              fontFamily: 'var(--font-pretendard)',
              fontWeight: 600,
              lineHeight: '21px',
              backgroundColor: '#E7E7E7',
              color: '#6A6A6A',
              height: '50px',
              width: '158px',
            }}
          >
            {cancelButtonText || 'Cancel'}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          disableRipple
          disableElevation
          sx={{
            borderRadius: '9999px',
            fontSize: '18px',
            fontFamily: 'var(--font-pretendard)',
            fontWeight: 600,
            lineHeight: '21px',
            backgroundColor: '#272727',
            color: '#fff',
            height: '50px',
            width: '158px',
          }}
        >
          {confirmButtonText || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Helper mở dialog – KHÔNG dùng hook ở đây */
export const noticeInput = (
  title: string,
  html: string,
  showCancelButton?: boolean,
  confirmButtonText?: string,
  cancelButtonText?: string,
  successCallback?: (email: string) => void,
  cancelCallback?: () => void,
  icon?: string,
  icon_url?: string,
) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);

  const onCloseHost = () => {
    root.unmount();
    container.remove();
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  root.render(
    isMobile ? (
      // ⚠️ Nếu MobileNoticeDialog cần input + validate, hãy sửa component đó tương tự Desktop
      <MobileNoticeDialog
        title={title}
        html={html}
        showCancelButton={showCancelButton}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        onClose={onCloseHost}
        onConfirm={() => {
          // tạm thời confirm không có input ở mobile
          successCallback?.('');
          onCloseHost();
        }}
        icon={icon}
        icon_url={icon_url}
      />
    ) : (
      <NoticeInputDesktop
        title={title}
        html={html}
        showCancelButton={showCancelButton}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        successCallback={successCallback}
        cancelCallback={cancelCallback}
        icon={icon}
        icon_url={icon_url}
        onCloseHost={onCloseHost}
      />
    ),
  );
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { CloseIcon } from '@/utils/icons/icons';

export const showServerNotice = (label: string, title: string, color: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const closeModal = () => {
    // cancelCallback && cancelCallback();
    root.unmount();
    container.remove();
  };

  const handleConfirm = () => {
    // successCallback && successCallback();
    closeModal();
  };

  const isMobile = window.innerWidth <= 768;

  const root = ReactDOM.createRoot(container);
  root.render(
    <Dialog
      open
      // onClose={closeModal}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? '8px' : '16px',
          width: isMobile ? '339px' : '673px',
          height: isMobile ? '58px' : '80px',
          maxWidth: isMobile ? '339px' : '673px',
          zIndex: 9999999,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
        },
      }}
      BackdropProps={{ sx: { opacity: '0!important', display: 'none!important' } }}
      sx={{
        position: 'absolute',
        top: isMobile ? 'auto' : '0',
        bottom: isMobile ? '20px' : 'auto',
        '.MuiDialog-container': {
          display: 'block',
          justifyItems: isMobile ? 'center' : 'end',
          alignContent: isMobile ? 'end' : 'start',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: isMobile ? '12px' : '16px',
          lineHeight: '20px',
          color: '#fff',
          padding: '0',
          fontFamily: 'var(--font-pretendard)',
          fontWeight: 600,
          textAlign: 'center',
          backgroundColor: color || '#000',
          borderRadius: isMobile ? '14px' : '20px',
          width: isMobile ? '65px' : '90px',
          height: isMobile ? '24px' : '32px',
          alignContent: 'center',
          marginLeft: isMobile ? '10px' : '30px',
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: label }} />
      </DialogTitle>
      <DialogTitle
        sx={{
          fontSize: isMobile ? '12px' : '18px',
          lineHeight: isMobile ? '20px' : '30px',
          color: '#272727',
          padding: isMobile ? '0 10px' : '12px 20px',
          fontFamily: 'var(--font-pretendard)',
          fontWeight: 500,
          width: isMobile ? 'calc(100% - 100px)' : 'auto',
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: title }} />
      </DialogTitle>
      <CloseIcon
        width={isMobile ? 15 : 30}
        height={isMobile ? 15 : 30}
        fill="#A4A4A4"
        style={{
          position: 'absolute',
          top: isMobile ? '20px' : '25px',
          right: isMobile ? '10px' : '20px',
          cursor: 'pointer',
        }}
        onClick={handleConfirm}
      />
    </Dialog>,
  );
};

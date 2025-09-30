import { MobileNoticeDialog } from '@/app/components/common/noticeMuiMobile';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import ReactDOM from 'react-dom/client';

export const showNotice = (
  title: string,
  html: string,
  showCancelButton?: boolean,
  confirmButtonText?: string,
  cancelButtonText?: string,
  successCallback?: () => void,
  icon?: string,
  cancelCallback?: () => void,
) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const closeModal = () => {
    root.unmount();
    container.remove();
  };

  const handleCancel = () => {
    cancelCallback && cancelCallback();
    root.unmount();
    container.remove();
  };

  const handleConfirm = () => {
    successCallback && successCallback();
    root.unmount();
    container.remove();
  };

  const isMobile = window.innerWidth <= 768;

  const root = ReactDOM.createRoot(container);
  root.render(
    isMobile ? (
      <MobileNoticeDialog
        title={title}
        html={html}
        showCancelButton={showCancelButton}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        onClose={closeModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        icon={icon}
      />
    ) : (
      <Dialog
        open
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return; // không cho đóng khi click ra ngoài
          closeModal();
        }}
        PaperProps={{
          sx: {
            borderRadius: '30px',
            width: '472px',
            height: '380px',
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
              backgroundColor: icon == 'fail_coupon.gif' ? '#EF44441A' : '#4776EF14',
              backdropFilter: 'blur(75px)',
              boxShadow:
                icon == 'fail_coupon.gif'
                  ? '0 0 60px 20px rgba(239, 68, 68, 0.2)'
                  : '0 0 60px 20px rgba(59,130,246,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
            }}
          >
            {icon ? <img src={`/images/home/${icon}`} alt="icon" /> : <img src="/images/home/ring.svg" alt="icon" />}
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
              overflow: 'hidden',
              position: 'relative',
              margin: '0 auto',
              color: '#A4A4A4',
            }}
            component="div"
          >
            <Box dangerouslySetInnerHTML={{ __html: html }} />
          </Typography>
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
                minWidth: '158px',
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
              minWidth: '158px',
            }}
          >
            {confirmButtonText || 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    ),
  );
};

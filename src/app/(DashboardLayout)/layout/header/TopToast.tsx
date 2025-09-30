'use client';
import { CloseIcon } from '@/utils/icons/icons';
import { Icon } from '@iconify/react';
import { Box, Slide, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TopToast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpenNotice, setIsOpenNotice] = useState(true);

  return (
    <>
      <Snackbar
        open={isOpenNotice}
        anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: 'center' }}
        autoHideDuration={null}
        slots={{ transition: Slide }}
        onClick={(e) => {
          e.stopPropagation();
          router.push('/payment?package=STANDARD');
        }}
        sx={{
          zIndex: 50,
          cursor: 'pointer',

          ...(isMobile ? { alignItems: 'end', bottom: '60px' } : { top: '0px!important' }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100vw',
            height: '48px',
            position: 'relative',
            borderRadius: isMobile ? '8px' : '0',
            flexDirection: 'row',
            bgcolor: '#4776EF',
            boxShadow: '0px 4.11px 30.84px 0px #0000001A',
            p: isMobile ? '12px' : '24px 26px',
            mb: isMobile ? '10px' : '0',
            gap: isMobile ? 1 : 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: isMobile ? '12px' : '20px',
              lineHeight: isMobile ? '20px' : '24px',
              color: '#fff',
              fontFamily: 'var(--font-pretendard)',
              fontWeight: 700,
              flexGrow: 1,
            }}
          >
            <Box dangerouslySetInnerHTML={{ __html: message || '' }} />
            <Icon icon={'ion:chevron-back'} className={` cursor-pointer rotate-180`} width={24} height={24} />
          </Box>
          <CloseIcon
            width={isMobile ? 15 : 30}
            height={isMobile ? 15 : 30}
            fill="#fff"
            style={{
              position: isMobile ? 'relative' : 'absolute',
              right: isMobile ? '0' : '20px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        </Box>
      </Snackbar>
    </>
  );
};
export default TopToast;

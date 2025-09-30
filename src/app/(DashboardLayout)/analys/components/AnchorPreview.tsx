import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { FormData } from '@/app/(DashboardLayout)/analys/advanced/page';
import { Icon } from '@iconify/react';

interface AnchorPreviewProps {
  data: FormData;
  onClose: () => void;
}

const AnchorPreview: React.FC<AnchorPreviewProps> = ({ data, onClose }) => {
  return (
    <Box
      sx={{
        backgroundColor: data.productDescription.enabled || data.productPin.enabled ? '#000000E5' : '#272727',
        color: '#fff',
        width: { xs: '100vw', sm: '242px' },
        aspectRatio: { xs: undefined, sm: '9/16' },
        height: { xs: '100vh', sm: '100%' },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        borderRadius: { xs: 0, sm: '10px' },
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
    >
      <IconButton
        sx={{ display: { xs: 'block', sm: 'none' } }}
        className="absolute top-[18px] left-[18px] p-0"
        onClick={onClose}
      >
        <Icon icon={'iconamoon:arrow-left-2-bold'} width={32} height={32} color={'white'} />
      </IconButton>
      {!data.productDescription.enabled && !data.productPin.enabled && !data.productInfo.enabled ? (
        <Box
          sx={{ height: '100%', textAlign: 'center' }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '21px',
              lineHeight: '25px',
            }}
          >
            미리보기
          </Typography>
          <Typography
            sx={{
              mt: '10px',
              color: '#A4A4A4',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '17px',
            }}
          >
            이 화면에서 비디오 옵션에서 <br />
            적용한 내용을 확인할 수 있습니다.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ height: '25%' }}>
            {/* Góc trên bên phải */}
            <Box
              sx={{
                p: { xs: 2, sm: 1.5 },
                pb: '3px',
                textAlign: 'right',
                justifySelf: 'right',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '10.7px',
                  lineHeight: '13.75px',
                  minHeight: { xs: '42px', sm: '29px' },
                  maxWidth: { xs: '20%', sm: '50px' },
                  wordBreak: 'keep-all',
                  fontFamily: 'Gmarket Sans',
                  color: 'white',
                }}
              >
                {data?.productPin.enabled && data.productPin.value}
              </Typography>
            </Box>

            {/* Hộp sản phẩm */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                background: data.productDescription.enabled
                  ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%)'
                  : 'transparent',
                p: { xs: '20px 28px', sm: 2 },
                minHeight: { xs: 'calc(100% - 74px)', sm: 'calc(100% - 53px)' },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '14px',
                  lineHeight: '18.33px',
                  fontFamily: 'Paperlogy',
                  wordBreak: 'keep-all',
                }}
              >
                {data.productDescription.enabled && data.productDescription.value}
              </Typography>
            </Box>
          </Box>

          {/* Văn bản chính giữa */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: '#272727',
              justifyContent: 'center',
              p: '40px 20px',
              height: '50%',
              overflow: 'hidden',
            }}
          >
            {/* Layer text shadow */}
            {data.productInfo.enabled ? (
              <Typography
                sx={{
                  color: '#3f51b5',
                  textShadow: '2px 2px 0 #3f51b5',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-49%, -50%)',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 'clamp(16px, 5vw, 35.17px)', // 🔥 Tự động fit
                  zIndex: 1,
                  width: '100%',
                  p: '40px 20px',
                  whiteSpace: 'pre-wrap', // Cho phép xuống dòng nếu cần
                  wordBreak: 'break-word', // Tránh tràn
                  fontFamily: 'CookieRun',
                }}
              >
                {data.productInfo.value}
              </Typography>
            ) : (
              <Icon icon="zondicons:play-outline" width={56} height={56} color={'#474747'} />
            )}

            {/* Layer gradient text */}
            <Typography
              sx={{
                background: 'linear-gradient(180deg, #DEECFF 7.68%, #FFE3FF 31.88%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                fontSize: 'clamp(16px, 5vw, 35.17px)', // 🔥 Giống fontSize phía trên
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'CookieRun',
              }}
            >
              {data.productInfo.enabled && data.productInfo.value}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};
export default AnchorPreview;

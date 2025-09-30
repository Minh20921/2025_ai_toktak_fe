import React from 'react';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';
import CustomButton from '@/app/components/common/CustomButton';
import { AlertNotion, AlertNotionMobile } from '@/utils/icons/icons';
import { useRouter } from 'next/navigation';
interface Props {
  label: string;
  showButton?: boolean;
}
const EmptyState: React.FC<Props> = ({ label, showButton = true }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      sx={{
        marginX: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        backgroundColor: '#fff',
        height: `calc(100vh - ${isMobile ? '50vh' : '255px'})`,
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          position: 'relative',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#4776EF14',
          borderRadius: '50%',
        }}
      >
        <div className="w-full h-full bg-[#FBD62F1A] sm:bg-[#4776EF14] rounded-full sm:shadow-[0_0_60px_30px_rgba(59,130,246,0.2)] sm:blur-xl"></div>
        {isMobile ? (
          <AlertNotionMobile className="absolute text-white w-16 h-16" />
        ) : (
          <AlertNotion className="absolute text-white w-9 h-9" />
        )}
      </Box>
      {/* Text */}
      <Typography
        className="font-pretendard text-base sm:text-[21px] leading-[100%] font-semibold mt-[33px]"
        color="#090909"
      >
        {label}
      </Typography>

      {/* Button */}
      {showButton && (
        <CustomButton
          variant="contained"
          className="px-[37px] py-[14px] text-lg font-semibold font-pretendard rounded-full mt-[58px]"
          onClick={() => router.push('/')}
        >
          콘텐츠 생성
        </CustomButton>
      )}
    </Box>
  );
};

export default EmptyState;

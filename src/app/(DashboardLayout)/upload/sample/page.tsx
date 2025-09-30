'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  LinearProgress,
  linearProgressClasses,
  styled,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Post, SAMPLE_BATCH_DATA } from '@/utils/mockData/sampleBatch';
import UploadContentSample from '@/app/(DashboardLayout)/upload/sample/ContentSample';
import ShowSampleInfo from '@/utils/custom/sampleInfo';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  maxWidth: '80%',
  margin: '0 auto',
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundImage: 'linear-gradient(91.47deg, #4776EF 7.33%, #3265EA 95.87%)',
  },
}));

const UploadSample = () => {
  const searchParams = useSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [postsData, setPostsData] = useState<Post[]>();
  const [fakePercent, setFakePercent] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const totalSocialButtons = (postsData?.length || 0) * 7;
  const socialStatusMap = useRef<{ [key: number]: number }>({});
  useEffect(() => {
    const sampleId = Number(searchParams.get('sampleId'));
    if (sampleId) {
      const batchData = SAMPLE_BATCH_DATA.find((data) => data.id === sampleId);
      setPostsData(batchData?.posts);
    }
  }, []);

  const getNoticeText = () => {
    if (fakePercent >= 100) return '생성된 콘텐츠가 업로드 완료되었습니다!';
    if (!searchParams.get('syncId')) return '콘텐츠를 SNS 채널에 업로드 중입니다.';
    return '선택한 콘텐츠를 SNS 채널에 업로드 중입니다.';
  };

  return (
    <Box className="!font-pretendard" sx={{ py: { xs: 3, sm: '35px' }, px: { xs: 2, sm: 5 } }}>
      <Box className="mx-[-15px] w-full flex justify-center absolute sm:block top-0 z-[1000] sm:mx-0 sm:relative leading-[47px] sm:leading-[36px] text-[16px] font-semibold sm:text-[30px] text-[#090909] mb-[20px] sm:mb-[40px] sm:font-bold text-center sm:text-left bg-[#fff] sm:bg-transparent">
        <Icon
          icon="material-symbols:home-outline-rounded"
          color="#090909"
          width={26}
          height={26}
          onClick={() => {
            router.push('/');
          }}
          className="sm:hidden absolute cursor-pointer top-[10px] left-[13px] z-[2222]"
        />
        통합 업로드
      </Box>
      <Box
        className="relative mx-auto"
        sx={{
          width: { xs: 'fit-content', sm: 90, md: 100 },
          height: { xs: 25, sm: 90, md: 100 },
          mt: { xs: 3, sm: 3 },
          mb: { xs: 0.5, sm: 4 },
        }}
      >
        <Box
          className=" top-1/2 left-1/2"
          sx={{
            position: { xs: 'relative', sm: 'absolute' },
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 21, sm: 24 },
              fontWeight: 'bold',
              color: '#4776EF',
              lineHeight: { xs: '25px', sm: '30px' },
              fontFamily: 'var(--font-pretendard)',
            }}
          >
            {fakePercent}%
          </Typography>
        </Box>
        {fakePercent === 100 && !isMobile && (
          <img
            src={`/images/upload/upload_success.gif?timestamp=${new Date().getTime()}`}
            className="absolute inset-0"
            style={{ transform: 'scale(1.5)' }}
          />
        )}

        {!isMobile && (
          <>
            <CircularProgress
              variant="determinate"
              value={100}
              thickness={3.5}
              sx={{ color: '#F4F4F4', display: { xs: 'none', sm: 'inline-block' } }}
              size="100%"
            />
            <CircularProgress
              className="absolute left-0"
              variant="determinate"
              value={fakePercent}
              thickness={3.5}
              sx={{ color: '#4776EF' }}
              size="100%"
            />
          </>
        )}
      </Box>

      <Typography
        sx={{
          mt: { xs: 0, sm: 2 },
          textAlign: 'center',
          fontSize: { xs: 14, sm: 16, md: 18 },
          color: { xs: '#A4A4A4', sm: '#272727' },
          fontFamily: 'var(--font-pretendard)',
        }}
      >
        {getNoticeText()}
      </Typography>
      {isMobile && (
        <BorderLinearProgress variant="determinate" value={fakePercent} sx={{ color: '#F4F4F4', mt: '10px' }} />
      )}

      <Box
        sx={{
          mt: { xs: 4, sm: 6 },
          px: { xs: 0, sm: '18px' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          alignItems: 'center',
        }}
      >
        {postsData?.map((post, idx) => (
          <UploadContentSample
            key={idx}
            type={post.type}
            thumbnail={post.thumbnail}
            blog={post.type === 2 ? post : {}}
            onStatusUpdate={(count) => {
              socialStatusMap.current[idx] = count;
              const totalDone = Object.values(socialStatusMap.current).reduce((a, b) => a + b, 0);
              if (totalDone == totalSocialButtons) {
                setShowToast(true);
              }
              setFakePercent(Math.floor((totalDone / totalSocialButtons) * 100));
            }}
          />
        ))}
      </Box>
      {showToast && !isMobile && (
        <ShowSampleInfo text={'업로드가 완료되었습니다! 버튼을 눌러 게시물을 확인해보세요!🎉'} />
      )}

      {isMobile && (
        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Box
            sx={{
              backgroundColor: '#292929E5',
              backdropFilter: 'blur(4px)',
              color: 'white',
              width: '100%',
              px: 7,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 3,
              fontWeight: 600,
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px' }}>
              업로드가 완료되었습니다! <br />
              버튼을 눌러 게시물을 확인해보세요!🎉
            </Typography>
          </Box>
        </Snackbar>
      )}
    </Box>
  );
};

export default UploadSample;

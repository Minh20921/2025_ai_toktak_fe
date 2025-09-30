import { IconNextStep, UpDownIcon } from '@/utils/icons/icons';
import { Box, Button, Typography, Stack, Grid, CardMedia } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useRef } from 'react';
import { SwiperRef } from 'swiper/react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import Image from 'next/image';
import { sampleTemplates } from '@/utils/constant';

const steps = [
  {
    label: 'STEP 1',
    icon: '/images/guide/BF.png',
    width: 97,
    height: 90,
    desc: '쿠팡, 알리 익스프레스\n링크를 통한 어필리에이트 수익',
  },
  {
    label: 'STEP 2',
    icon: '/images/guide/SFA.png',
    width: 81,
    height: 92,
    desc: '전문셀러와 결합하여\n커머스 판매 수익 더하기',
  },
  {
    label: 'STEP 3',
    icon: '/images/guide/EFA.png',
    width: 118,
    height: 100,
    desc: 'SNS채널을 성장시켜\n조회수 수익 더하기',
  },
  {
    label: 'STEP 4',
    icon: '/images/guide/AVT.png',
    width: 155,
    height: 155,
    desc: '인플루언서로 발전하여\nPPL 수익 더하기',
  },
];

const reviews = [
  {
    name: '김서연',
    avatar: '/images/guide/user1.png',
    info: '인스타그램 운영 3개월',
    text: '"Toktak 덕분에 하루 1시간 투자로 월 30만 원 벌고 있어요! 글쓰기가 어려웠는데 AI가 완벽한 콘텐츠를 만들어줘서 너무 편해요."',
    rating: 5,
  },
  {
    name: '서준호',
    avatar: '/images/guide/user2.png',
    info: '블로그 운영 6개월',
    text: '"직장 다니면서 부업으로 시작했는데, 이제는 본업보다 더 많이 벌어요. 하루에 5-6개 포스팅을 자동으로 만들어서 올리기만 하면 됩니다!"',
    rating: 5,
  },
  {
    name: '강수빈',
    avatar: '/images/guide/user3.png',
    info: '카페 운영 1년',
    text: '"육아하면서 틈틈이 콘텐츠 올리고 있어요. AI가 글을 써주니 시간이 훨씬 절약되고, 월 50만 원 정도 안정적으로 수익이 발생합니다!"',
    rating: 4.5,
  },
];

const IntroGuide = () => {
  const swiperRef = useRef<SwiperRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 0 },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '22px', sm: '36px' },
          mt: { xs: 4, sm: '100px' },
          textAlign: 'center',
          color: '#090909',
          fontWeight: 600,
          background: 'linear-gradient(104.34deg, #4776EF 9.13%, #AD50FF 94.52%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        링크 한 줄, 수익 창출
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '12px', sm: '20px' },
          mt: '5px',
          textAlign: 'center',
          color: '#272727',
        }}
      >
        상품 URL만 붙이면, AI가 콘텐츠를 만들어 SNS에 자동 업로드합니다
        <Box component="br" sx={{ display: { xs: 'block', sm: 'none' } }} />
      </Typography>
      <Box
        id="productUrl"
        maxWidth={1280}
        className="mt-[30px] bg-white mx-auto w-full px-3 py-[5px] rounded-[24px]  pb-3
          flex flex-col gap-2 sm:gap-4 border-[1px] border-[#F5F5F5]"
        style={{ boxShadow: '0px 4.11px 30.84px 0px #0000001A' }}
      >
        <input
          className="w-full h-[40px] sm:h-[50px] md:h-[70px] flex-grow outline-none text-[16px] sm:text-[18px] font-medium text-[#5F5F5F] placeholder:text-[#C5CAD1] px-0 sm:px-3 [&::placeholder]:scale-[0.75] sm:[&::placeholder]:scale-100 [&::placeholder]:origin-left"
          placeholder="상품 URL를 붙여주세요 (예: 쿠팡, 도매꾹/도매매, 알리)"
          readOnly
        />

        <Box className="flex justify-between">
          <Button
            color="primary"
            disableElevation
            variant="contained"
            className="relative flex w-24 h-[40px] flex-none !rounded-full !bg-transparent border-solid border-[1px] border-[#EEEEEE]  font-pretendard"
          >
            <Typography className=" text-sm font-medium text-[#909090] flex items-center gap-[10px]">
              간편
              <UpDownIcon color="#909090" className={`transition-all duration-500 ease-in-out `} />
            </Typography>
          </Button>
          <Button
            color="primary"
            disableElevation
            variant="contained"
            className="relative flex w-24 h-[40px] flex-none !rounded-full font-pretendard"
            sx={{ background: 'linear-gradient(112.75deg, #6F7BF4 18.67%, #9B6BFB 85.03%)' }}
          >
            <Typography className=" text-sm font-medium text-white flex items-center gap-[10px]">생성하기</Typography>
          </Button>
        </Box>
      </Box>
      <Swiper
        modules={[Autoplay, Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        initialSlide={currentIndex}
        touchRatio={1}
        spaceBetween={isMobile ? 10 : 20}
        slidesPerView={isMobile ? 3.3 : 7}
        loop={true}
        speed={500}
        navigation={false}
        centeredSlides={true}
        style={{
          marginTop: '30px',
          padding: '50px 0 30px',
          display: 'flex',
          gap: isMobile ? '5px' : '10px',
          justifyContent: 'flex-end',
          maxHeight: isMobile ? '500px' : '550px',
        }}
      >
        {sampleTemplates.map((item, index) => (
          <SwiperSlide
            key={`sample_${index}`}
            style={{
              position: 'relative',
              cursor: 'pointer',
              backgroundColor: '#FFFFFF',
              width: '100%',
              height: '80%',
              // maxHeight: isMobile ? "35vh" : "auto",
              aspectRatio: '9/19',
              borderRadius: '8px',
              boxShadow: '0px 1.8px 13.53px 0px #0000001A',
              overflow: 'hidden',
              transform: `scale(${index === currentIndex ? '1.1' : '1'})`,
              transition: 'transform 0.3s ease-in-out',
              transformOrigin: 'bottom center',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            {item.iframe ? (
              <Box
                sx={{
                  mx: 'auto',
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '9/19',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  pb: { xs: 1, sm: 2 },
                }}
              >
                <Image
                  src={`/images/home/sample_${index + 1}.png`}
                  alt={'tooltip-3'}
                  fill
                  className="home-sample-image"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    objectFit: 'cover',
                    width: '100%',
                  }}
                  loading="lazy"
                  quality={100}
                  priority={index === 0}
                />
                <video
                  id={`simpate_video_id-${item.id}`}
                  src={item.iframe}
                  width={index === currentIndex + 3 ? 255 : 190}
                  style={{
                    border: 'none',
                    width: '100% !important',
                    height: 'auto !important',
                    maxWidth: '100% !important',
                    aspectRatio: '9/16',
                    display: 'block',
                    margin: '0 auto',
                    borderRadius: '8px',
                  }}
                  className="w-full"
                  muted
                  playsInline
                  autoPlay
                  loop
                />
              </Box>
            ) : (
              <Image
                src={`/images/home/sample_${index + 1}.png`}
                alt={'tooltip-3'}
                fill
                className="home-sample-image home-sample-image-tooltip"
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  margin: '0 auto',
                  width: '100%',
                  objectFit: 'cover',
                  boxShadow: '0px 1.8px 13.53px 0px #0000001A',
                }}
                quality={100}
                priority={index === 0}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <Box
        sx={{
          width: '100%',

          py: { xs: 4, md: 8 },
          px: { xs: 1, md: 0 },
          mt: { xs: 0, sm: 6 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 18, md: 28 },
            color: '#222',
            mb: 4,
            textAlign: 'center',
          }}
        >
          수익을 만드는 가장 쉬운 성장 루트
          <br />
          이렇게 시작됩니다.
        </Typography>
        <Stack
          spacing={{ xs: 1, md: 4 }}
          justifyContent="center"
          alignItems="flex-start"
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            mt: { xs: 2.5, sm: 15 },
            width: '100%',
            maxWidth: { xs: '100%', sm: 1200 },
            maxHeight: { xs: 'auto', sm: 324 },
            px: { xs: 0, sm: '45px' },
            py: { xs: 0, sm: '30px' },
            mx: 'auto',
            background: { xs: 'none', sm: 'linear-gradient(180deg, #D6E2FF 0%, #fff 40.38%)' },
            borderRadius: '14px',
            boxShadow: { xs: 'none', sm: '0px 4.14px 31.06px 0px #0000000D' },

            gap: { xs: 10, sm: 0 },
          }}
        >
          {steps.map((step, idx) => (
            <Box
              key={step.label}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: { xs: 'linear-gradient(180deg, #D6E2FF 0%, #fff 40.38%)', sm: 'none' },
                width: { xs: '100%', sm: 'auto' },
                height: '100%',
                mt: '0 !important',
                borderRadius: { xs: '12px 12px 0 0', sm: '0' },
                px: { xs: 2.5, sm: 0 },
                py: { xs: '28px', sm: 0 },
              }}
            >
              <Box
                sx={{
                  position: { xs: 'static', sm: 'absolute' },
                  top: { xs: 0, sm: -50 },
                  left: { xs: 'auto', sm: '50%' },
                  transform: { xs: 'none', sm: 'translateX(-50%)' },
                  bgcolor: '#2563eb',
                  color: '#fff',
                  px: 3,
                  py: 1,
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: 18,
                  boxShadow: '0 2px 8px 0 #0002',
                  zIndex: 2,
                  mx: { xs: 'auto', sm: 0 },
                }}
              >
                {step.label}
              </Box>
              <Box
                sx={{
                  mb: 2,
                  width: 155,
                  height: 155,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  src={step.icon}
                  alt={step.label}
                  width={step.width}
                  height={step.height}
                  style={{ objectFit: 'contain' }}
                  quality={100}
                />
                {idx < steps.length - 1 && (
                  <IconNextStep className="absolute -bottom-[20%] rotate-90 sm:rotate-0 sm:top-1/3 sm:-right-9 sm:-translate-y-1/2 " />
                )}
              </Box>
              <Typography
                sx={{
                  color: '#3460EA',
                  fontWeight: 700,
                  fontSize: 20,
                  textAlign: 'center',
                  lineHeight: '24px',
                }}
              >
                {step.desc.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Box
        sx={{
          mt: { xs: '60px', sm: 10 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Bottom Section Title */}
        <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: '60px' } }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: { xs: 600, sm: 'bold' },
              fontSize: { xs: 20, sm: 36 },
              lineHeight: { xs: '24px', sm: '45px' },
            }}
            color="#343434"
          >
            당신의 콘텐츠 흐름 <br />
            톡탁이 이어드립니다.
          </Typography>
        </Box>

        {/* Feature Boxes */}
        <Grid
          container
          maxWidth={1083}
          spacing={{ xs: 2, sm: 5 }}
          sx={{ mb: { xs: 0, sm: 8 } }}
          justifyContent="center"
        >
          {/* Feature 1 */}
          <Grid item md={4}>
            <Box className="relative w-[328px] h-[276px]">
              <CardMedia
                component="img"
                image="/images/profile-link/profile-link-6.png?height=300&width=400"
                alt="Feature 1"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0px 4.14px 31.06px 0px #0000000D',
                }}
              />
              <Image
                src="/images/profile-link/typing_domegoook.gif"
                alt="typing_domegoook"
                width={240}
                height={40}
                className="absolute top-[60px] left-1/2 -translate-x-1/2"
                quality={100}
              />
              <Image
                src="/images/profile-link/ArrowDown.gif"
                alt="ArrowDown"
                width={80}
                height={80}
                className="absolute bottom-[33px] left-1/2 -translate-x-1/2 rotate-180"
                quality={100}
              />
            </Box>
            <Typography
              sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', lineHeight: '62px', mt: 1.5 }}
              color="#6A6A6A"
            >
              톡! 눌러 콘텐츠 생성
            </Typography>
          </Grid>

          {/* Feature 2 */}
          <Grid item md={4}>
            <Box className="relative w-[328px] h-[276px]">
              <CardMedia
                component="img"
                image="/images/profile-link/profile-link-7.png?height=300&width=400"
                alt="Feature 2"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0px 4.14px 31.06px 0px #0000000D',
                }}
              />
              <Image
                src="/images/profile-link/typing_hashtag.gif"
                alt="typing_domegoook"
                width={146}
                height={36}
                className="absolute top-[120px] right-[27px] w-[200px]"
                style={{ height: 'auto' }}
                quality={100}
              />
            </Box>
            <Typography
              sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', lineHeight: '62px', mt: 1.5 }}
              color="#6A6A6A"
            >
              + SNS 자동 업로드
            </Typography>
          </Grid>

          {/* Feature 3 */}
          <Grid item md={4}>
            <Box className="relative w-[328px] h-[276px]">
              <CardMedia
                component="img"
                image="/images/profile-link/profile-link-8.png?height=300&width=400"
                alt="Feature 3"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0px 4.14px 31.06px 0px #0000000D',
                }}
              />
              <Image
                src="/images/profile-link/firework.gif"
                alt="firework_left"
                width={210}
                height={210}
                className="absolute -top-[23px] -left-[11px]"
                quality={100}
              />
              <Image
                src="/images/profile-link/firework.gif"
                alt="firework_right"
                width={210}
                height={210}
                className="absolute -bottom-[34px] -right-[19px]"
                quality={100}
              />
            </Box>
            <Typography
              sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', lineHeight: '62px', mt: 1.5 }}
              color="#6A6A6A"
            >
              탁! 나만의 링크샵 완성
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: '100%', mt: { xs: '60px', sm: '102px' } }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 20, md: 28 },
            color: '#222',
            mb: 4,
            textAlign: 'center',
          }}
        >
          실제 사용자 후기
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{ width: '100%', maxWidth: 1200, mx: 'auto', mb: 10 }}
        >
          {reviews.map((review, idx) => (
            <Box
              key={review.name}
              sx={{
                flex: 1,
                bgcolor: '#fff',
                borderRadius: '20px',
                boxShadow: '0 2px 12px 0 #0001',
                p: { xs: 3, md: 3.125 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={38}
                  height={38}
                  style={{ borderRadius: '50%', objectFit: 'cover', marginRight: 12 }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#000000' }}>{review.name}</Typography>
                  <Typography sx={{ color: '#888', fontSize: 14 }}>{review.info}</Typography>
                </Box>
              </Box>
              <Typography sx={{ color: '#222', fontSize: 16, mb: 2 }}>{review.text}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                {[...Array(Math.floor(review.rating))].map((_, i) => (
                  <svg key={i} width="20" height="19" viewBox="0 0 20 19" fill="none">
                    <path
                      d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z"
                      fill="#4776EF"
                    />
                  </svg>
                ))}
                {review.rating % 1 !== 0 && (
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 7.24L12.81 6.62L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27L16.18 19L14.55 11.97L20 7.24ZM10 13.4V4.1L11.71 8.14L16.09 8.52L12.77 11.4L13.77 15.68L10 13.4Z"
                      fill="#4776EF"
                    />
                  </svg>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default IntroGuide;

'use client';
import { Box, Button, CardMedia, Container, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { LayoutType, setFieldName, setProfile, setTreeNodes } from '@/app/lib/store/profileSlice';
import { useDispatch } from 'react-redux';
import React from 'react';
import { LayoutOption, SOCIAL_LINKS, STATUS } from '@/app/(DashboardLayout)/profile-link/components/const';
import Image from 'next/image';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function ProfileHome() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleStart = async () => {
    dispatch(
      setProfile({
        id: 1,
        avatar: '/images/profile-link/avatar-sample.png',
        background_image: '/images/profile-link/backgroud-sample.png',
        notice: '하단 링크로 구매하면 제휴 마켓으로부터 일정액의 수수료를 제공 받습니다👉  감사합니다 💟 ',
        description: 'A cozy space for everyday living — where little gadgets make a big difference.',
        display_name: 'TOKTAK',
        username: 'toktak',
        site_setting: {
          main_text_color: '#272727',
          sub_text_color: '#A4A4A4',
          background_color: '#F4F4F4',
          notice_color: '#272727',
          notice_background_color: '#F4F4F4',
          product_background_color: '#F4F4F4',
          product_name_color: '#272727',
          product_price_color: '#272727',
          show_price: 0,
          layout_type: 'grid-2' as LayoutType,
        },
        status: STATUS.CREATED,
        is_check_name: true,
        isClearingTree: false,
        socials: {
          [SOCIAL_LINKS.facebook]: {
            enabled: true,
            url: '',
          },
          [SOCIAL_LINKS.x]: {
            enabled: true,
            url: '',
          },
          [SOCIAL_LINKS.instagram]: {
            enabled: true,
            url: '',
          },
          [SOCIAL_LINKS.youtube]: {
            enabled: true,
            url: '',
          },
          [SOCIAL_LINKS.spotify]: {
            enabled: true,
            url: '',
          },
          [SOCIAL_LINKS.threads]: {
            enabled: true,
            url: '',
          },
          [SOCIAL_LINKS.tiktok]: {
            enabled: true,
            url: '',
          },
        },
        rootProductsPage: 1,
        rootProductsHasMore: true,
        loading: false,
        dragState: {
          activeId: null,
          overId: null,
          activeItemType: null,
          isDragging: false,
          dragOffset: 0,
          originalTreeState: null,
          savedCollapsedState: null,
        },
        productChanges: {
          movedProducts: [],
          reorderedGroups: [],
          pendingChanges: false,
        },
      }),
    );
    //set treeNodes sample
    dispatch(
      setTreeNodes([
        {
          id: '1',
          type: 'product',
          product: {
            id: '1',
            product_name: '아이린 침대틈새 사이드테 이블 틈새수납 - 사이드...',
            price: '25,000원',
            product_image: '/images/profile-link/product-sample.png',
            product_url: '',
          },
        },
        {
          id: '2',
          type: 'product',
          product: {
            id: '2',
            product_name: '아이린 침대틈새 사이드테 이블 틈새수납 - 사이드...',
            price: '25,000원',
            product_image: '/images/profile-link/product-sample.png',
            product_url: '',
          },
        },
        {
          id: '3',
          type: 'product',
          product: {
            id: '3',
            product_name: '아이린 침대틈새 사이드테 이블 틈새수납 - 사이드...',
            price: '25,000원',
            product_image: '/images/profile-link/product-sample.png',
            product_url: '',
          },
        },
        {
          id: '4',
          type: 'product',
          product: {
            id: '4',
            product_name: '아이린 침대틈새 사이드테 이블 틈새수납 - 사이드...',
            price: '25,000원',
            product_image: '/images/profile-link/product-sample.png',
            product_url: '',
          },
        },
      ]),
    );
  };

  if (isMobile) {
    return (
      <Box
        sx={{
          height: '100dvh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'white',
          pt: 6,
          pb: 0.5,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Typography sx={{ fontWeight: 600, fontSize: '16px', textAlign: 'center', mt: 2 }} color="#090909">
          멀티링크
        </Typography>

        {/* Center icon and text */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateY(-100px)',
          }}
        >
          <Box
            sx={{
              bgcolor: '#F3F7FF',
              borderRadius: '50%',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              mt: 8,
            }}
          >
            <Icon icon={'octicon:link-16'} width={32} height={32} className="text-[#4776EF]" />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '16px', textAlign: 'center', color: '#181818' }}>
            지금 프로필 링크를 생성하세요!
          </Typography>
        </Box>

        {/* Bottom button */}
        <Box sx={{ position: 'fixed', bottom: 0, width: '100%', mx: 'auto', px: 2.25, pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleStart}
            color="primary"
            sx={{
              borderRadius: '6px',
              bgcolor: '#4776EF',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '19px',
              width: '100%',
              height: '50px',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
            }}
          >
            <Icon icon={'gg:add'} width={20} height={20} className="text-white" />
            프로필 링크 생성하기
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mx: 'auto',
        overflowY: 'auto',
        width: '100%',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          p: '30px',
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            component="h1"
            sx={{ fontWeight: 'bold', fontSize: '50px', lineHeight: '107px', pt: 8 }}
            color="#090909"
          >
            링크 관리, 이제 손 놓으세요.
          </Typography>
          <Typography sx={{ mb: 4, fontWeight: 'semibold', fontSize: '24px', lineHeight: '34px' }} color="#A4A4A4">
            콘텐츠만 톡 올리면 <br /> 나머지는 톡탁이 알아서 관리합니다.
          </Typography>

          {/* URL Input Field */}
          <Box
            sx={{
              display: 'flex',
              maxWidth: 600,
              mx: 'auto',
              position: 'relative',
              zIndex: 1,
              bgcolor: 'white',
              borderRadius: '9999px',
              boxShadow: '0px 4.11px 30.84px 0px #0000001A',
              width: '100%',
              height: '70px',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: '10px',
              mb: 10,
            }}
          >
            <Typography
              sx={{ ml: '25px', fontSize: '18px', fontWeight: 'semibold', lineHeight: '21px' }}
              color="#C5CAD1"
            >
              link.toktak.ai/아이디
            </Typography>
            <Button
              variant="contained"
              onClick={handleStart}
              color="primary"
              sx={{
                borderRadius: '9999px',
                p: '14px 44px',
                bgcolor: '#4169e1',
                whiteSpace: 'nowrap',
                fontSize: '18px',
                fontWeight: 'semibold',
                lineHeight: '21px',
                width: '193px',
                textAlign: 'center',
              }}
            >
              생성하러 가기
            </Button>
          </Box>
        </Box>

        {/* Card Grid Section */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 13, position: 'relative' }}>
          {/* Card 1 */}
          <Grid item md={2.2} sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image="/images/profile-link/profile-link-1.png?height=550&width=250"
              alt="Card content 1"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0px 4.14px 31.06px 0px #0000000D',
              }}
            />
          </Grid>

          {/* Card 2 */}
          <Grid item md={2.2} sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image="/images/profile-link/profile-link-2.png?height=550&width=250"
              alt="Card content 2"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0px 4.14px 31.06px 0px #0000000D',
              }}
            />
          </Grid>

          {/* Card 3 - Center, slightly larger */}
          <Grid
            item
            md={2.4}
            sx={{
              position: 'relative',
              mt: { xs: 0, md: -3 },
              zIndex: 2,
            }}
          >
            <CardMedia
              component="img"
              image="/images/profile-link/profile-link-3.png?height=550&width=250"
              alt="Card content 3"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0px 4.14px 31.06px 0px #0000000D',
              }}
            />
          </Grid>

          {/* Card 4 */}
          <Grid item md={2.2} sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image="/images/profile-link/profile-link-4.png?height=550&width=250"
              alt="Card content 4"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0px 4.14px 31.06px 0px #0000000D',
              }}
            />
          </Grid>

          {/* Card 5 */}
          <Grid item md={2.2} sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image="/images/profile-link/profile-link-5.png?height=550&width=250"
              alt="Card content 5"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0px 4.14px 31.06px 0px #0000000D',
              }}
            />
          </Grid>
        </Grid>

        {/* Bottom Section Title */}
        <Box sx={{ textAlign: 'center', mb: '60px' }}>
          <Typography component="h1" sx={{ fontWeight: 'bold', fontSize: '36px', lineHeight: '45px' }} color="#343434">
            당신의 콘텐츠 흐름 <br />
            톡탁이 이어드립니다.
          </Typography>
        </Box>

        {/* Feature Boxes */}
        <Grid container spacing={4} sx={{ mb: 8, maxWidth: 1024, mx: 'auto' }}>
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
      </Container>
    </Box>
  );
}

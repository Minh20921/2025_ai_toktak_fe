'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Divider } from '@mui/material';
import dynamic from 'next/dynamic';

const CoupangPartnersGuide = dynamic(() => import('./coupang'), { ssr: false });
const AliGuide = dynamic(() => import('./ali'), { ssr: false });

interface ServiceGuideProps {
  className?: string;
  [key: string]: any;
}

const ServiceGuide: React.FC<ServiceGuideProps> = ({ className = '', ...props }) => {
  // Section refs
  const sectionRefs = {
    what: useRef<HTMLDivElement>(null),
    feature: useRef<HTMLDivElement>(null),
    usage: useRef<HTMLDivElement>(null),
    sns: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
  };
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'guide' | 'coupang' | 'ali'>('guide');
  const [activeMenu, setActiveMenu] = useState('what');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuClick = (key: string) => {
    const container = document.querySelector('.scroll-container');
    if (!container) return;
    if (key === 'coupang') {
      container.scrollTo({ top: 0, behavior: 'smooth' });
      setView('coupang');
      return;
    }
    if (key === 'ali') {
      container.scrollTo({ top: 0, behavior: 'smooth' });
      setView('ali');
      return;
    }
    setView('guide');
    setActiveMenu(key);
    const ref = sectionRefs[key as keyof typeof sectionRefs];
    if (ref && ref.current) {
      ref.current.style.scrollMarginTop = '170px';
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }
  };

  // Menu list
  const menu = [
    { key: 'what', label: '톡탁이란?' },
    { key: 'feature', label: '기능 소개' },
    { key: 'usage', label: '사용 방법' },
    { key: 'sns', label: '신규 SNS 계정 사용 시 권장사항' },
    { key: 'faq', label: '자주묻는질문' },
    { key: 'coupang', label: '쿠팡 파트너스 가입 가이드' },
    { key: 'ali', label: '알리 어필리에이트 가입 가이드' },
  ];

  // Scroll spy effect
  useEffect(() => {
    if (!mounted || view !== 'guide') return;

    const container = document.querySelector('.scroll-container');
    if (!container) return;

    const handleScroll = () => {
      const OFFSET = 300;
      const sections = Object.entries(sectionRefs);
      // Find the first section that is past the offset
      const activeSection = sections.findLastIndex(([key, ref]) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top - OFFSET;
        return relativeTop <= 0;
      });
      // If we found a section, update the active menu
      if (activeSection !== -1) {
        const key = Object.keys(sectionRefs)[activeSection];
        if (key !== activeMenu) {
          setActiveMenu(key);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [mounted, view, sectionRefs, activeMenu]);

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: '1590px', mx: 'auto', bgcolor: 'white' }} className="guide-container">
      {/* Menu */}
      <Box
        sx={{
          position: 'sticky',
          top: '88px',
          zIndex: 30,
          bgcolor: 'white',
          display: 'flex',
          gap: 2,
          pb: { xs: 1, sm: 2.5 },
          pt: { xs: 1, sm: 0 },
          px: { xs: 2.5, sm: 1 },
          borderBottom: { xs: 'none', sm: '1px solid #F0F0F0' },
          backgroundColor: 'white',
          width: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {menu.map((item, idx) => (
          <Button
            key={item.key}
            onClick={() => handleMenuClick(item.key)}
            sx={{
              flexShrink: 0,
              height: { xs: '30px', sm: '40px' },
              px: { xs: 1.875, sm: 2.5 },
              py: { xs: 1, sm: 1.25 },
              borderRadius: '9999px',
              fontSize: { xs: '12px', sm: '16px' },
              fontWeight: 500,
              transition: 'all 150ms',
              ...((view === 'guide' && activeMenu === item.key) || (view !== 'guide' && view === item.key)
                ? {
                    bgcolor: '#4776EF',
                    color: 'white',
                  }
                : {
                    bgcolor: '#F6F7F9',
                    color: '#6A6A6A',
                  }),
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      {/* Main Content */}
      {view === 'guide' && (
        <Box
          sx={{
            borderRadius: '16px',
            py: { xs: 2.5, sm: 5 },
            mb: '60px',
            px: { xs: 2.5, sm: 0 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Section 1: What is TOKTAK */}
          <Box component="section" ref={sectionRefs.what}>
            <Typography
              sx={{
                fontSize: { xs: '16px', sm: '21px' },
                fontWeight: 600,
                color: '#272727',
                lineHeight: { xs: '22px', sm: '28px' },
                mb: 2.5,
              }}
            >
              TOKTAK이란?
            </Typography>
            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 4 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                  color: '#686868',
                }}
              >
                TOKTAK은{' '}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  상품 링크만 넣으면 AI가 자동으로 영상을 만들어 주고, SNS에 알아서 올려주는 서비스
                </Box>{' '}
                예요! 쇼핑몰을 운영하는 사람이나 온라인에서 물건을 판매하는 분들이 쉽게 영상을 만들고 홍보할 수 있도록
                도와줘요.
              </Typography>
              <Typography
                sx={{
                  mt: 2.5,
                  color: '#FF4040',
                  fontWeight: 700,
                  fontSize: { xs: '12px', sm: '16px' },
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                📌 다른 서비스와 뭐가 다를까요?
              </Typography>
              <Box component="ul" sx={{ listStyle: 'disc', pl: 2.5 }}>
                <Box component="li">
                  보통 영상은 직접 편집해야 하지만, TOKTAK은{' '}
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    AI가 알아서 영상
                  </Box>
                  을 만들어 줘요!
                </Box>
                <Box component="li">
                  영상을 만든 후 SNS에 올리는 것도{' '}
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    자동으로 해결
                  </Box>
                  해 줘요! (유튜브 쇼츠, 인스타그램, 페이스북, 틱톡, 스레드, 엑스, 블로그 가능!)
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#F9F9F9', my: { xs: '40px', sm: '60px' } }} />

          {/* Section 2: Features */}
          <Box component="section" ref={sectionRefs.feature}>
            <Typography
              sx={{
                fontSize: { xs: '16px', sm: '21px' },
                fontWeight: 700,
                color: '#272727',
                lineHeight: { xs: '22px', sm: '28px' },
                mb: 2.5,
              }}
            >
              기능 소개
            </Typography>
            <Box
              component="ul"
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 4 },
              }}
            >
              <Box component="span" sx={{ fontWeight: 600 }}>
                ✅ 상품 URL만 넣으면 AI가 자동 분석
              </Box>
              <Box component="li" sx={{ ml: { xs: 2, sm: 6 } }}>
                상품 페이지(예: 쿠팡, 알리익스프레스, 스마트스토어 등)의 링크를 입력하면 AI가 상품 정보를 분석해요.
              </Box>

              <Box component="span" sx={{ fontWeight: 600 }}>
                ✅ AI가 자동으로 영상 제작
              </Box>
              <Box component="li" sx={{ ml: { xs: 2, sm: 6 } }}>
                생성하기 버튼을 누르면{' '}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  AI가 SNS에 최적화된 콘텐츠를 자동
                </Box>
                으로 만들어줘요.
              </Box>

              <Box component="span" sx={{ fontWeight: 600 }}>
                ✅ SNS에 자동 업로드
              </Box>
              <Box component="li" sx={{ ml: { xs: 2, sm: 6 } }}>
                제작된 콘텐츠는 유튜브 쇼츠, 인스타그램, 페이스북, 틱톡, 스레드, 엑스, 블로그에 자동으로 올려줘요.
              </Box>
            </Box>

            <Typography
              sx={{
                mt: 2.5,
                color: '#FF4040',
                fontWeight: 700,

                fontSize: { xs: '12px', sm: '16px' },
                lineHeight: { xs: '24px', sm: '28px' },
                pl: { xs: 0, sm: 4 },
              }}
            >
              📌 TOKTAK 시작 에서 '샘플 링크 사용해 보기'를 클릭하여 결과물을 확인해보세요!
            </Typography>

            <Box
              sx={{
                position: 'relative',

                my: 2.5,

                overflow: 'hidden',
                boxShadow: 1,
                ml: { xs: 0, sm: 0 },
              }}
            >
              <Box
                component="img"
                src={'/images/guide/service-1.png'}
                alt="service-1"
                loading="lazy"
                sx={{ objectFit: 'contain', width: '100%' }}
              />
            </Box>

            <Typography
              sx={{
                mt: 2.5,
                color: '#FF4040',
                fontWeight: 700,

                fontSize: { xs: '12px', sm: '16px' },
                lineHeight: { xs: '24px', sm: '28px' },
                pl: { xs: 0, sm: 4 },
              }}
            >
              💡 게시된 영상을 처음부터 끝까지 1회 시청하면 더 많은 사람에게 노출돼요!
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#F9F9F9', my: { xs: '40px', sm: '60px' } }} />

          {/* Section 3: How to Use */}
          <Box component="section" ref={sectionRefs.usage}>
            <Typography
              sx={{
                fontSize: { xs: '18px ', sm: '21px' },
                fontWeight: 600,
                color: '#272727',
                lineHeight: '21px',
                mb: 2.5,
              }}
            >
              사용 방법
            </Typography>

            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 4 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 700,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                1) TOKTAK 가입하고 로그인하기
              </Typography>
              <Typography
                sx={{
                  ml: { xs: 2, sm: 3 },
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                1. TOKTAK 홈페이지에 접속해요.
                <br />
                2. 회원가입 없이 구글 이메일 또는 SNS 계정으로 간편하게 가입해요.
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'relative',

                my: 2.5,

                overflow: 'hidden',
                boxShadow: 1,
                pl: { xs: 0, sm: 4 },
              }}
            >
              <Box
                component="img"
                src={'/images/guide/service-2.png'}
                alt="service-2"
                className="w-full h-full object-cover"
              />
            </Box>
            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 2, sm: 6 },
              }}
            >
              3. 로그인하면 바로 시작할 수 있어요!
            </Box>
            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',

                pl: { xs: 0, sm: 3 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 700,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                2) 상품 URL 등록하기
              </Typography>
              <Typography
                sx={{
                  ml: { xs: 2, sm: 3 },
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                1. 도매꾹, 도매매, 쿠팡, 알리익스프레스 등에서 홍보 및 판매하고 싶은 상품의{' '}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  URL을 복사
                </Box>
                해요.
                <br />
                2. TOKTAK 🏠시작에서{' '}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  URL을 붙여넣고 "생성하기"
                </Box>
                버튼을 클릭하면 AI가 자동으로 정보를 가져와서 콘텐츠를 생성해요.
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 2.5,
                color: '#FF4040',
                fontWeight: 700,

                fontSize: { xs: '12px', sm: '16px' },
                lineHeight: { xs: '24px', sm: '28px' },
                pl: { xs: 0, sm: 4 },
              }}
            >
              📌 쿠팡 파트너스나 알리 어필리에이트 링크를 넣으면 더 좋은 퀄리티의 영상을 추출할 수 있어요!
            </Typography>

            <Box
              sx={{
                position: 'relative',
                my: 2.5,
                overflow: 'hidden',
                boxShadow: 1,
              }}
            >
              <Box
                component="img"
                src={'/images/guide/service-3.png'}
                alt="service-3"
                loading="lazy"
                className="object-cover mx-auto"
              />
            </Box>

            <Typography
              sx={{
                mt: 2.5,
                color: '#FF4040',
                fontWeight: 700,

                fontSize: { xs: '12px', sm: '16px' },
                lineHeight: { xs: '24px', sm: '28px' },
                pl: { xs: 0, sm: 4 },
              }}
            >
              💡 쿠팡 파트너스 & 알리 어필리에이트 가입 가이드
            </Typography>

            <Box
              component="ul"
              sx={{
                listStyle: 'disc',
                ml: { xs: 2, sm: 6 },

                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 4 },
              }}
            >
              <Box component="li">
                쿠팡 파트너스: 쿠팡 상품을 홍보하면 일정 금액을 받을 수 있어요! 가입 후 내 쿠팡 링크를 TOKTAK에 넣으면
                돼요.
                <Box
                  component="span"
                  onClick={() => handleMenuClick('coupang')}
                  sx={{ color: '#4776EF', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                >
                  쿠팡 파트너스 가입 가이드
                </Box>
                ,{' '}
                <Box
                  component="a"
                  href={'https://partners.coupang.com/'}
                  title={'https://partners.coupang.com/'}
                  target={'_blank'}
                  sx={{ color: '#4776EF', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                >
                  쿠팡 파트너스 가입하기
                </Box>
              </Box>
              <Box component="li">
                알리 어필리에이트: 알리익스프레스 상품을 홍보하고 수익을 얻을 수 있어요. 가입 후 내 상품 링크를 TOKTAK에
                넣으면 돼요.
                <Box
                  component="span"
                  onClick={() => handleMenuClick('ali')}
                  sx={{ color: '#4776EF', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                >
                  알리 어필리에이트 가입 가이드
                </Box>
                ,{' '}
                <Box
                  component="a"
                  href={'https://portals.aliexpress.com/'}
                  target={'_blank'}
                  title={'https://portals.aliexpress.com/'}
                  sx={{ color: '#4776EF', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                >
                  알리 어필리에이트 가입하기
                </Box>
              </Box>
            </Box>

            <Box
              component="div"
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 4 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 700,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                3) SNS 자동 업로드 설정하기
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                  ml: { xs: 2, sm: 3 },
                }}
              >
                TOKTAK이{' '}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  자동으로 SNS에 업로드
                </Box>
                하려면 SNS 계정을 연결해야 해요!
                <br />
                홈페이지 좌측 하단에 사용자 아이콘 클릭하면 "소셜 채널 관리"를 확인할 수 있어요.
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'relative',

                my: 2.5,

                overflow: 'hidden',
                boxShadow: 1,
                ml: { xs: 0, sm: 0 },
              }}
            >
              <Box
                component="img"
                src={'/images/guide/service-4.png'}
                alt="service-4"
                loading="lazy"
                className="object-cover mx-auto"
              />
            </Box>

            <Typography
              sx={{
                mt: 2.5,
                color: '#FF4040',
                fontWeight: 700,

                fontSize: { xs: '12px', sm: '16px' },
                lineHeight: { xs: '24px', sm: '28px' },
                pl: { xs: 0, sm: 4 },
              }}
            >
              💡 꼭 확인해 주세요!
            </Typography>

            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 4 },
              }}
            >
              <Typography
                sx={{
                  ml: { xs: 2, sm: 3 },
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 700,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                아래 단계 중 완료되지 않은 항목이 있으면 TOKTAK이 SNS 자동 업로드 할 수 없어요.
                <br />
                아래 모든 단계를 완료한 뒤 TOKTAK에 SNS 계정을 연결해 주세요.
              </Typography>

              <Box sx={{ mt: 2, ml: { xs: 2, sm: 6 } }}>
                <Typography
                  sx={{
                    fontSize: { xs: '12px', sm: '16px' },
                    fontWeight: 700,
                    lineHeight: { xs: '24px', sm: '28px' },
                  }}
                >
                  1. 인스타그램을 비즈니스 계정으로 변경하기
                </Typography>
                <Box component="ul" sx={{ listStyle: 'disc', ml: { xs: 4, sm: 6 } }}>
                  <Box component="li">
                    인스타그램 설정 → 계정 유형 및 도구 → "프로페셔널 계정으로 전환" 선택{' '}
                    <Box
                      component="a"
                      href={'https://www.facebook.com/business/help/502981923235522'}
                      title={'인스타그램을 비즈니스 계정으로 변경하기'}
                      target={'_blank'}
                      sx={{ color: '#4776EF', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Meta 비즈니스 지원 센터
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2, ml: { xs: 2, sm: 6 } }}>
                <Typography
                  sx={{
                    fontSize: { xs: '12px', sm: '16px' },
                    fontWeight: 700,
                    lineHeight: { xs: '24px', sm: '28px' },
                  }}
                >
                  2. 페이스북 페이지 만들기
                </Typography>
                <Box component="ul" sx={{ listStyle: 'disc', ml: { xs: 4, sm: 6 } }}>
                  <Box component="li">
                    페이스북에서 "페이지 만들기"를 클릭하고 기본 정보를 입력하면 끝!{' '}
                    <Box
                      component="a"
                      href={'https://www.facebook.com/business/help/1199464373557428?id=418112142508425'}
                      title={'페이스북 페이지 만들기'}
                      target={'_blank'}
                      sx={{ color: '#4776EF', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Meta 비즈니스 지원 센터
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2, ml: { xs: 2, sm: 6 } }}>
                <Typography
                  sx={{
                    fontSize: { xs: '12px', sm: '16px' },
                    fontWeight: 700,
                    lineHeight: { xs: '24px', sm: '28px' },
                  }}
                >
                  3. 인스타그램과 페이스북 페이지 연결하기
                  <Box
                    component="a"
                    href={'https://www.facebook.com/business/help/898752960195806'}
                    target={'_blank'}
                    title={'인스타그램과 페이스북 페이지 연결하기'}
                    sx={{ color: '#4776EF', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', ml: 1 }}
                  >
                    Meta 비즈니스 지원 센터
                  </Box>
                </Typography>

                <Box component="ul" sx={{ listStyle: 'disc', ml: { xs: 4, sm: 6 } }}>
                  <Box component="li">페이스북: 페이지 관리 → 설정 → 연결된 계정 → 계정 연결 선택</Box>
                  <Box component="li">인스타그램: 보기 → 계정 연결 → 연결한 인스타그램 계정 로그인</Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 4 },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '12px', sm: '16px' },
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                4) 블로그 콘텐츠 수동 등록 가이드
              </Typography>
              <Box sx={{ ml: { xs: 2, sm: 3 } }}>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: '12px', sm: '16px' },
                    lineHeight: { xs: '24px', sm: '28px' },
                  }}
                >
                  A. 바로 업로드할 경우
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '12px', sm: '16px' },
                    fontWeight: 400,
                    lineHeight: { xs: '24px', sm: '28px' },
                    ml: { xs: 2, sm: 3 },
                  }}
                >
                  1. 콘텐츠 배포창에서 [복사] 버튼 클릭
                  <br />
                  2. [바로가기] 버튼으로 내 블로그 글쓰기 화면으로 이동
                  <br />
                  3. 글쓰기 창에 붙여넣기(ctrl+V) 해서 업로드
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                position: 'relative',

                my: 2.5,

                overflow: 'hidden',
                boxShadow: 1,
                bgColor: '#FFFFFF',
                flex: 'justify-center',
                py: 2.5,
              }}
            >
              <Box
                component="img"
                src={'/images/guide/service-5.png'}
                alt="service-3"
                loading="lazy"
                className="object-cover mx-auto"
              />
            </Box>
            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '22px', sm: '28px' },
                color: '#686868',
                ml: { xs: 2, sm: 3 },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '12px', sm: '16px' },
                  lineHeight: { xs: '24px', sm: '28px' },
                  ml: { xs: 1, sm: 3 },
                }}
              >
                B. 나중에 업로드할 경우
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                  ml: { xs: 2, sm: 6 },
                }}
              >
                1. [내 콘텐츠] → [임시저장] 탭에서 원하는 블로그 콘텐츠 선택
                <br />
                2. [복사] 버튼 클릭 후 내 블로그 글쓰기 화면에서 붙여넣기
              </Typography>
            </Box>
            <Typography
              sx={{
                mt: 2.5,
                color: '#FF4040',
                fontWeight: 700,

                fontSize: { xs: '12px', sm: '16px' },
                lineHeight: { xs: '24px', sm: '28px' },
                pl: { xs: 0, sm: 3 },
              }}
            >
              💡 꼭 확인해 주세요!
            </Typography>
            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '22px', sm: '28px' },
                color: '#686868',
                pl: { xs: 2, sm: 4 },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '12px', sm: '16px' },
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                아래 단계 중 완료되지 않은 항목이 있으면 TOKTAK이 SNS 자동 업로드 할 수 없어요.
                <br />
                아래 모든 단계를 완료한 뒤 TOKTAK에 SNS 계정을 연결해 주세요.
              </Typography>

              <Box sx={{ mt: 2, ml: { xs: 0, sm: 3 } }}>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: '12px', sm: '16px' },
                    lineHeight: { xs: '24px', sm: '28px' },
                  }}
                >
                  1. 블로그에 붙여 넣은 이미지가 인식되지 않을 수 있어요
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '12px', sm: '16px' },
                    fontWeight: 400,
                    lineHeight: { xs: '24px', sm: '28px' },
                    ml: { xs: 2, sm: 3 },
                  }}
                >
                  네이버 블로그에서는 붙여 넣은 이미지가 인식되지 않아 썸네일이 자동 설정되지 않습니다.
                  <br />
                  썸네일로 쓰고 싶은 이미지는 별도 저장한 뒤 수동으로 추가해 주세요!
                </Typography>
              </Box>
              <Box sx={{ mt: 2, ml: { xs: 2, sm: 6 } }}>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: '12px', sm: '16px' },
                    lineHeight: { xs: '24px', sm: '28px' },
                  }}
                >
                  2. 본문에 삽입된 링크가 클릭되지 않을 수 있어요.
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '12px', sm: '16px' },
                    fontWeight: 400,
                    lineHeight: { xs: '24px', sm: '28px' },
                    ml: { xs: 2, sm: 3 },
                  }}
                >
                  붙여 넣은 링크는 하이퍼링크가 적용되지 않을 수 있습니다.
                  <br />
                  링크 뒤에 엔터(↵)를 눌러야 클릭 가능한 상태로 활성화됩니다!
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#F9F9F9', my: { xs: '40px', sm: '60px' } }} />

            {/* 신규 SNS 계정 사용 시 권장사항 */}
            <Box
              ref={sectionRefs.sns}
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 2 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '16px', sm: '20px' },
                  fontWeight: 600,
                  color: '#272727',
                  lineHeight: { xs: '24px', sm: '28px' },
                  mb: 2.5,
                }}
              >
                신규 SNS 계정 사용 시 권장사항
              </Typography>
              <Typography
                sx={{
                  ml: { xs: 2, sm: 6 },
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                톡탁에서 생성한 콘텐츠를 업로드 하기 전, 안정적인 계정 운영을 위해 아래 사항을 권장드립니다.
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 2.5,
                ml: { xs: 0, sm: 3 },
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '22px', sm: '28px' },
                color: '#686868',
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  lineHeight: { xs: '24px', sm: '28px' },
                  fontWeight: 600,
                }}
              >
                ✅ 신규 계정이라면 이렇게 해보세요.
              </Typography>
              <Box
                sx={{
                  ml: { xs: 2, sm: 6 },
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                1. SNS 계정 개설 직후 바로 콘텐츠를 업로드 하기 보다는, 하루 정도 간단한 활동(좋아요, 댓글, 팔로우 등)을
                먼저 해주세요.
              </Box>
              <Box
                sx={{
                  ml: { xs: 2, sm: 6 },
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                2. 이후 다음날부터 콘텐츠 업로드를 시작하면 플랫폼에서 가계정으로 오인될 가능성을 줄일 수 있습니다.
              </Box>
            </Box>
            <Box
              sx={{
                mt: 2.5,
                ml: { xs: 0, sm: 3 },

                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '22px', sm: '28px' },
                color: '#686868',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '12px', sm: '16px' },
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                ✅ 가급적 기존에 사용하던 계정을 활용하세요.
              </Typography>
              <Typography
                sx={{
                  ml: { xs: 2, sm: 6 },
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                활동 이력이 있는 계정은 플랫폼에서 안정적인 계정으로 인식되어
                <br />
                콘텐츠 업로드 시 문제가 발생할 확률이 더 낮습니다.
              </Typography>
            </Box>
            <Box
              sx={{
                mt: 2.5,
                ml: { xs: 0, sm: 3 },

                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '22px', sm: '28px' },
                color: '#686868',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#FF4040',
                  fontSize: { xs: '12px', sm: '16px' },
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                💡 왜 이렇게 권장하나요?
              </Typography>
              <Typography
                sx={{
                  ml: { xs: 2, sm: 6 },
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                일부 플랫폼은 새로 만들어진 계정에서 영상이나 외부 링크가 포함된 콘텐츠를 바로 올릴 경우
                <br />
                자동으로 스팸이나 비정상 활동으로 판단할 수 있습니다.
                <br />
                하지만 무조건 차단되는 것은 아니며,{' '}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  예방을 위한 가이드
                </Box>
                입니다.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: '#F9F9F9', my: { xs: '40px', sm: '60px' } }} />
          {/* Section 4: FAQ */}
          <Box component="section" ref={sectionRefs.faq}>
            <Typography
              sx={{
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 700,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#272727',
                mb: 2.5,
                pl: { xs: 0, sm: 2 },
              }}
            >
              자주 묻는 질문 (FAQ)
            </Typography>

            <Box
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                fontWeight: 400,
                lineHeight: { xs: '22px', sm: '28px' },
                color: '#686868',
                pl: { xs: 0, sm: 6 },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '12px', sm: '16px' },
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                - 공정위 문구는 자동으로 들어가나요?
              </Typography>
              <Typography
                sx={{
                  ml: 1,
                  fontSize: { xs: '12px', sm: '16px' },
                  fontWeight: 400,
                  lineHeight: { xs: '24px', sm: '28px' },
                }}
              >
                네! 광고/제휴 링크를 사용할 경우{' '}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  공정거래위원회 문구
                </Box>
                가 자동으로 삽입돼요. (예: "쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수
                있습니다.")
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      {view === 'coupang' && <CoupangPartnersGuide />}
      {view === 'ali' && <AliGuide />}
    </Box>
  );
};
export default ServiceGuide;

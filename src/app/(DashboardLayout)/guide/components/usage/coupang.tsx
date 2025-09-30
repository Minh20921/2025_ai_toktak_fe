'use client';
import * as React from 'react';
import { Box, IconButton, Typography, List, ListItem } from '@mui/material';
import { Icon } from '@iconify/react';
import Image from 'next/image';

const CoupangPartnersGuide: React.FC = () => {
  return (
    <Box component="article" sx={{ display: 'flex', flexDirection: 'column', mx: 'auto' }}>
      <Box
        component="main"
        sx={{
          borderRadius: '16px',
          py: { xs: 2.5, sm: 5 },
          px: { xs: 2.5, sm: 0 },
          mb: '60px',
          pr: 4,
        }}
      >
        <Box component="section" sx={{ width: '100%' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '16px', sm: '21px' },
              fontWeight: 700,
              color: '#272727',
              lineHeight: '25px',
            }}
          >
            1단계:
            <Box
              component="a"
              href="https://partners.coupang.com/"
              sx={{
                fontWeight: 700,
                color: '#4776EF',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                textDecorationThickness: '2px',
                textDecorationColor: '#4776EF',
                textDecorationStyle: 'solid',
                textDecorationSkipInk: 'none',
                mx: 0.5,
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              쿠팡 파트너스
            </Box>{' '}
            회원가입하기
          </Typography>

          <List
            sx={{
              listStyleType: 'disc',
              pl: { xs: 2, sm: 4 },
              '& .MuiListItem-root': {
                fontSize: { xs: '12px', sm: '16px' },
                p: 0,
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                display: 'list-item',
                '&::marker': {
                  color: '#686868',
                },
              },
            }}
          >
            <ListItem>쿠팡 계정이 있다면, 그 계정으로 로그인할 수 있어요.</ListItem>
            <ListItem>만약 쿠팡 계정이 없다면, '회원가입' 버튼을 눌러 새로운 계정을 만들어야 해요.</ListItem>
            <ListItem>이메일과 비밀번호를 입력하고, 필요한 정보를 채워주세요</ListItem>
          </List>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              px: { xs: 2, sm: 20 },
              py: 2,
              bgcolor: 'white',
              border: '1px solid #E7E7E7',
              maxWidth: '100%',
            }}
          >
            <Image
              src="/images/guide/coupang-1.png"
              alt="Guide illustration"
              width={1011}
              height={622}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
              quality={100}
            />
          </Box>
        </Box>

        <Box component="section" sx={{ mt: '60px' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '16px', sm: '21px' },
              fontWeight: 700,
              color: '#272727',
              lineHeight: '25px',
            }}
          >
            2단계: 파트너스 신청하기
          </Typography>
          <List
            sx={{
              listStyleType: 'disc',
              pl: { xs: 2, sm: 4 },
              '& .MuiListItem-root': {
                fontSize: { xs: '12px', sm: '16px' },
                p: 0,
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                display: 'list-item',
                '&::marker': {
                  color: '#686868',
                },
              },
            }}
          >
            <ListItem>로그인 후, '파트너스 신청하기' 또는 '시작하기' 버튼을 찾아 클릭해요.</ListItem>
            <ListItem>본인의 블로그, 유튜브 채널, 인스타그램 등 상품을 소개할 곳의 주소(URL)를 입력해요.</ListItem>
            <ListItem>필요한 정보를 모두 입력했다면 '제출' 또는 '완료' 버튼을 눌러요.</ListItem>
          </List>

          <Box
            sx={{
              px: { xs: 2, sm: 20 },
              py: 0,
              bgcolor: 'white',
              border: '1px solid #E7E7E7',
            }}
          >
            <Image
              src="/images/guide/coupang-2.png"
              alt="Guide illustration"
              width={1011}
              height={622}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
              quality={100}
            />
          </Box>
        </Box>

        <Box component="section" sx={{ mt: '60px' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '16px', sm: '21px' },
              fontWeight: 700,
              color: '#272727',
              lineHeight: '25px',
            }}
          >
            3단계: 승인 기다리기
          </Typography>
          <List
            sx={{
              listStyleType: 'disc',
              pl: { xs: 2, sm: 4 },
              '& .MuiListItem-root': {
                fontSize: { xs: '12px', sm: '16px' },
                p: 0,
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                display: 'list-item',
                '&::marker': {
                  color: '#686868',
                },
              },
            }}
          >
            <ListItem>신청이 완료되면 쿠팡에서 신청을 검토해요. 보통 몇 시간에서 몇 일이 걸릴 수 있어요.</ListItem>
            <ListItem>승인이 되면 이메일로 알려줄 거예요!</ListItem>
          </List>
        </Box>

        <Box component="section" sx={{ mt: '60px' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '16px', sm: '21px' },
              fontWeight: 700,
              color: '#272727',
              lineHeight: '25px',
            }}
          >
            4단계: 링크 생성하기
          </Typography>
          <List
            sx={{
              listStyleType: 'disc',
              pl: { xs: 2, sm: 4 },
              '& .MuiListItem-root': {
                fontSize: { xs: '12px', sm: '16px' },
                p: 0,
                fontWeight: 400,
                lineHeight: { xs: '24px', sm: '28px' },
                color: '#686868',
                display: 'list-item',
                '&::marker': {
                  color: '#686868',
                },
              },
            }}
          >
            <ListItem>승인 후, 쿠팡 파트너스에 로그인해요.</ListItem>
            <ListItem>링크 생성 → 간편 링크 만들기 버튼을 클릭해요.</ListItem>
            <ListItem>소개하고 싶은 상품의 쿠팡 페이지 URL을 입력하면, 나의 파트너스 링크가 생성돼요.</ListItem>
            <ListItem>이 링크를 통해 다른 사람이 물건을 구입할 때마다 보상을 받을 수 있어요.</ListItem>
          </List>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'stretch',
              px: { xs: 2, sm: 20 },
              bgcolor: 'white',
              border: '1px solid #E7E7E7',
            }}
          >
            <Image
              src="/images/guide/coupang-3.png"
              alt="Guide illustration"
              width={1011}
              height={330}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
              quality={100}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CoupangPartnersGuide;

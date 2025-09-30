'use client';
import * as React from 'react';
import Image from 'next/image';
import { Box, Typography, Paper, Container, List, ListItem, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

const ImageContainer = styled(Box)(({ theme }) => ({
  padding: '32px 80px',
  backgroundColor: 'white',
  marginTop: '30px',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    marginLeft: 0,
  },
}));

const AliGuide: React.FC = () => {
  const router = useRouter();
  return (
    <Box component="article" sx={{ display: 'flex', flexDirection: 'column', mx: 'auto' }}>
      <Box
        component="main"
        sx={{
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
            1단계:{' '}
            <Link
              href="https://portals.aliexpress.com/"
              target="_blank"
              rel="noopener noreferrer"
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
            >
              알리 어필리에이트
            </Link>{' '}
            회원가입하기
          </Typography>

          <List sx={{ pl: { xs: 2, sm: 4 } }}>
            {[
              '홈페이지 하단에 Join Now 버튼을 클릭해요.',
              '이메일 주소를 입력하고, Send 버튼을 눌러요. 그러면 입력한 이메일로 인증 코드가 전송돼요.',
              '메일을 열어 받은 인증 코드를 사이트에 입력해요.',
              '비밀번호와 다른 필요한 정보를 입력하고, Next 버튼을 눌러요.',
            ].map((text, index) => (
              <ListItem
                key={index}
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  color: '#686868',
                  lineHeight: { sm: '24px' },
                  display: 'list-item',
                  listStyleType: 'disc',
                  p: 0,
                  '&::marker': {
                    color: '#686868',
                  },
                }}
              >
                {text}
              </ListItem>
            ))}
          </List>

          <ImageContainer>
            <Box sx={{ maxWidth: '453px', width: '100%', mx: 'auto' }}>
              <Image
                src="/images/guide/ali-1.png"
                alt="Step 1 illustration"
                width={453}
                height={294}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                priority
              />
            </Box>
            <Box sx={{ mt: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Box sx={{ width: '50%' }}>
                  <Image
                    src="/images/guide/ali-2.png"
                    alt="Step 1 detail 1"
                    width={350}
                    height={271}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                    quality={100}
                  />
                </Box>
                <Box sx={{ width: '50%' }}>
                  <Image
                    src="/images/guide/ali-3.png"
                    alt="Step 1 detail 2"
                    width={350}
                    height={310}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                    quality={100}
                  />
                </Box>
              </Box>
            </Box>
          </ImageContainer>
        </Box>

        <Box component="section" sx={{ mt: 5.5 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '16px', sm: '21px' },
              fontWeight: 700,
              color: '#272727',
              lineHeight: '25px',
            }}
          >
            2단계: 승인 기다리기
          </Typography>
          <List sx={{ pl: { xs: 2, sm: 4 } }}>
            {[
              '알리익스프레스에서 신청을 검토해요. 보통 1~3일 정도 걸릴 수 있어요.',
              '승인이 되면, 이메일로 알려줄 거예요.',
            ].map((text, index) => (
              <ListItem
                key={index}
                sx={{
                  fontSize: { xs: '12px', sm: '16px' },
                  color: '#686868',
                  lineHeight: { sm: '24px' },
                  display: 'list-item',
                  listStyleType: 'disc',
                  p: 0,
                  '&::marker': {
                    color: '#686868',
                  },
                }}
              >
                {text}
              </ListItem>
            ))}
          </List>

          <ImageContainer>
            <Image
              src="/images/guide/ali-4.png"
              alt="Approval process"
              width={1011}
              height={622}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              quality={100}
            />
          </ImageContainer>
        </Box>

        <Box component="section" sx={{ mt: 5.5 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '16px', sm: '21px' },
              fontWeight: 700,
              color: '#272727',
              lineHeight: '25px',
            }}
          >
            3단계: 링크 생성하기
          </Typography>
          <List sx={{ pl: { xs: 2, sm: 4 } }}>
            <ListItem
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                color: '#686868',
                lineHeight: { sm: '24px' },
                display: 'list-item',
                listStyleType: 'disc',
                p: 0,
                '&::marker': {
                  color: '#686868',
                },
              }}
            >
              승인 후, 알리 어필리에이트 사이트에 로그인해요.
            </ListItem>
            <ListItem
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                color: '#686868',
                lineHeight: { sm: '24px' },
                display: 'list-item',
                listStyleType: 'disc',
                p: 0,
                '&::marker': {
                  color: '#686868',
                },
              }}
            >
              <Typography
                component="span"
                sx={{ fontWeight: 500, fontSize: { xs: '12px', sm: '16px' }, lineHeight: { xs: '24px', sm: '28px' } }}
              >
                방법 1){' '}
              </Typography>
              툴 → 링크 변환기 버튼 클릭 후 광고하고 싶은 제품의 URL을 넣으면 돼요.
            </ListItem>
          </List>

          <ImageContainer>
            <Image
              src="/images/guide/ali-5.png"
              alt="Link generation method 1"
              width={1011}
              height={330}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              quality={100}
            />
          </ImageContainer>

          <List sx={{ pl: { xs: 2, sm: 4 }, mt: 1.5 }}>
            <ListItem
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                color: '#686868',
                lineHeight: { sm: '24px' },
                display: 'list-item',
                listStyleType: 'disc',
                p: 0,
                '&::marker': {
                  color: '#686868',
                },
              }}
            >
              <Typography
                component="span"
                sx={{ fontWeight: 500, fontSize: { xs: '12px', sm: '16px' }, lineHeight: { xs: '24px', sm: '28px' } }}
              >
                방법 2){' '}
              </Typography>
              상품상세페이지 상단에 '링크 받기' 버튼 클릭 후 '추적 링크' 복사해요.
            </ListItem>
          </List>

          <ImageContainer>
            <Image
              src="/images/guide/ali-6.png"
              alt="Link generation method 2"
              width={1011}
              height={330}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              quality={100}
            />
          </ImageContainer>

          <List sx={{ pl: { xs: 2, sm: 4 }, mt: 1.5 }}>
            <ListItem
              sx={{
                fontSize: { xs: '12px', sm: '16px' },
                color: '#686868',
                lineHeight: { sm: '24px' },
                display: 'list-item',
                listStyleType: 'disc',
                p: 0,
                '&::marker': {
                  color: '#686868',
                },
              }}
            >
              이 링크를 통해 다른 사람이 물건을 구입할 때마다 보상을 받을 수 있어요.
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default AliGuide;

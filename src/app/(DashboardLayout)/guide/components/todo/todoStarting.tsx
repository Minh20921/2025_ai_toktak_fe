'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Typography, Checkbox, Link, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import { IconChecked, IconNonCheck } from '@/utils/icons/profileLink';
import API from '@service/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import { useRouter } from 'next/navigation';

interface TodoStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  icon: React.ReactNode;
  subItems?: {
    text: string;
    link?: string;
  }[];
}

const TodoStarting = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [steps, setSteps] = useState<TodoStep[]>([
    {
      id: 1,
      title: '회원가입 완료',
      description: '',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji-flat:party-popper" width={32} height={32} />,
    },
    {
      id: 2,
      title: '요금제 확인 및 쿠폰 등록',
      description: '[내 계정]>[요금제]에서 확인 및 등록',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji:money-with-wings" width={32} height={32} />,
    },
    {
      id: 3,
      title: '상품 URL 테스트',
      description: '아래 링크 중 하나를 붙여넣고 콘텐츠 생성',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji-flat:magnifying-glass-tilted-right" width={32} height={32} />,
      subItems: [
        { text: '쿠팡 상품 URL 바로가기', link: 'https://link.coupang.com/a/cuXm2T' },
        { text: '알리 상품 URL 바로가기', link: 'https://s.click.aliexpress.com/e/_okOKwj0' },
      ],
    },
    {
      id: 4,
      title: 'SNS 채널 연결',
      description: '인스타그램, 유튜브 등 SNS 채널 등록',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji:repeat-button" width={32} height={32} />,
    },
    {
      id: 5,
      title: '멀티링크 생성 (선택)',
      description: '톡탁 멀티링크로 나만의 쇼핑몰 만들기',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji:link" width={32} height={32} />,
    },
    {
      id: 6,
      title: '파트너스 가입',
      description: '아래의 페이지에서 계정 생성',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji:man-technologist" width={32} height={32} />,
      subItems: [
        { text: '쿠팡 파트너스 바로가기', link: 'https://partners.coupang.com/' },
        {
          text: '알리 어필리에이트 바로가기',
          link: 'https://portals.aliexpress.com/affiportals/web/portals.htm#/home',
        },
      ],
    },
    {
      id: 7,
      title: '콘텐츠에 수익 링크 삽입 후 업로드',
      description: '[내 콘텐츠]에서 링크 수정 후 SNS에 게시',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji:outbox-tray" width={32} height={32} />,
    },
    {
      id: 8,
      title: '업로드 결과 확인',
      description: '썸네일, 문구, 해시태그 확인',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji:clapper-board" width={32} height={32} />,
    },
    {
      id: 9,
      title: '맞팔해요 참여',
      description: '다른 유저와 계정 공유하고 교류하기',
      isCompleted: false,
      icon: <Icon icon="fluent-emoji:love-letter" width={32} height={32} />,
    },
  ]);
  const getTodo = useRef(
    new API(`/api/v1/user/todo-guide`, 'GET', {
      success: (res) => {
        if (res?.data?.length > 0) {
          setSteps((prev) =>
            prev.map((step) => ({
              ...step,
              isCompleted: res?.data?.find((item: any) => item?.id === step.id)?.is_completed,
            })),
          );
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
    }),
  );
  const updateTodo = useRef(
    new API(`/api/v1/user/update-todo-guide`, 'POST', {
      success: (res) => {
        if (res?.data?.length > 0) {
          setSteps((prev) =>
            prev.map((step) => ({
              ...step,
              isCompleted: res?.data?.find((item: any) => item?.id === step.id)?.is_completed,
            })),
          );
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
    }),
  );
  useEffect(() => {
    getTodo.current.call();
  }, []);
  const handleToggle = (id: number) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setSteps((prevSteps) =>
      prevSteps.map((step) => (step.id === id ? { ...step, isCompleted: !step.isCompleted } : step)),
    );
    updateTodo.current.config.data = {
      id: id,
      is_completed: !steps.find((step) => step.id === id)?.isCompleted,
    };

    updateTodo.current.call();
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2.5, sm: 0 } }}>
      <Typography
        sx={{
          fontSize: { xs: '18px', sm: '21px' },
          fontWeight: 700,
          lineHeight: { xs: '22px', sm: '25px' },
          mb: { xs: '10px', sm: '14px' },
          color: '#272727',
        }}
      >
        URL 하나로 수익 시작하기: Toktak 사용 방법
      </Typography>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: { xs: '15px', sm: '17.8px' },
          fontWeight: 500,
          lineHeight: { xs: '18px', sm: '21px' },
          color: '#A4A4A4',
        }}
      >
        아래 항목을 순서대로 체크하며 따라 해보세요.
        <Icon icon="fluent-emoji:beaming-face-with-smiling-eyes" width={20} height={20} />
      </Typography>
      <Stack spacing={{ xs: 1, sm: 1.5 }} mt={{ xs: 3, sm: 5 }}>
        {steps.map((step) => (
          <Card
            key={step.id}
            elevation={0}
            sx={{
              width: '100%',
              bgcolor: step.isCompleted ? '#EFF5FF' : '#F9F9F9',
              borderRadius: '10px',
            }}
          >
            <CardContent sx={{ p: { xs: '16px 20px !important', sm: '20px 40px !important' } }}>
              <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2.5 }, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 24, sm: 32 },
                    height: { xs: 24, sm: 32 },
                    borderRadius: '8px',
                    flexShrink: 0,
                    '& svg': {
                      width: { xs: '24px', sm: '32px' },
                      height: { xs: '24px', sm: '32px' },
                      filter: step.isCompleted ? 'grayscale(100%)' : 'none',
                    },
                  }}
                >
                  {step.icon}
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: { xs: 180, sm: 237 } }}>
                    <Typography
                      sx={{
                        color: step.isCompleted ? '#A4A4A4' : '#686868',
                        fontSize: { xs: '14px', sm: '16px' },
                        fontWeight: 600,
                      }}
                    >
                      {step.id}.
                    </Typography>
                    <Typography
                      sx={{
                        textDecoration: step.isCompleted ? 'line-through' : 'none',
                        color: step.isCompleted ? '#A4A4A4' : '#686868',
                        fontSize: { xs: '14px', sm: '16px' },
                        lineHeight: { xs: '24px', sm: '29px' },
                        fontWeight: 600,
                      }}
                    >
                      {step.title}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, ml: { xs: 0, sm: 10 } }}>
                    {step.description && (
                      <Typography
                        sx={{
                          color: '#686868',
                          fontSize: { xs: '14px', sm: '16px' },
                          lineHeight: { xs: '24px', sm: '29px' },
                        }}
                      >
                        {step.description}
                      </Typography>
                    )}
                    {step.subItems && (
                      <Stack spacing={1} sx={{ mt: 0.75 }}>
                        {step.subItems.map((item, index) => (
                          <Link
                            key={index}
                            href={item.link}
                            underline="hover"
                            target="_blank"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: '#4776EF',
                              fontSize: { xs: '14px', sm: '16px' },
                              fontWeight: 500,
                            }}
                          >
                            • {item.text}
                          </Link>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Box>
                <Checkbox
                  checked={step.isCompleted}
                  onChange={() => handleToggle(step.id)}
                  icon={<IconNonCheck />}
                  checkedIcon={<IconChecked />}
                  sx={{
                    p: 0,
                    alignSelf: 'center',
                    color: '#DFE3E8',
                    '&.Mui-checked': {
                      color: '#3366FF',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: { xs: 18, sm: 20 },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default TodoStarting;

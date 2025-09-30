'use client';
import SeoHead from '@/app/components/SeoHead';
import { RootState } from '@/app/lib/store/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import PromptEditor from './components/PromptEditor';
import './style.css';
import DialogViewDetail from './components/dialog/DialogViewDetail';
import AIGenerationByUser from './components/AIGenerationByUser';
import DialogViewDetailByUser from './components/dialog/DialogViewDetailByUser';
import DialogExceedCredit from './components/dialog/DialogExceedCredit';
import { AiGenerationItem, VideoImageAITemplate } from './@type/interface';
import { aiGenerationAPI } from './api/api';
import Loading from './components/Loading';
function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const AIGeneration = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<number>(searchParams.get('tab') ? parseInt(searchParams.get('tab')!) : 0);
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState<AiGenerationItem | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token_login');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);
  const pathname = usePathname();
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    router.replace(`${pathname}?tab=${newValue}`);
  };
  const [templates, setTemplates] = useState<VideoImageAITemplate[]>([]);
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await aiGenerationAPI.getListTemplate({ user_id: user?.id as number });
      setTemplates(res?.data?.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.id) fetchTemplates();
  }, [user?.id]);
  if (loading) {
    return <Loading />;
  }
  return (
    <Box className="p-[40px] relative">
      <SeoHead {...{}} />
      <Box>
        <Typography variant="h4" component="h1" className="font-pretendard font-bold  sm:block text-[30px]">
          AI 콘텐츠 생성
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          className="font-pretendard font-semibold mt-[16px] mb-[48px] sm:block text-[16px] text-[#A4A4A4]"
        >
          프롬프트를 입력해서 AI로 나만의 이미지와 영상을 만들어 보세요. ☺️
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          top: { xs: 40, sm: 0 },
          zIndex: 40,
          py: { xs: 0, sm: 2.5 },
          px: { xs: '18px', sm: 0 },
          backgroundColor: '#FFFFFF',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="profile editor tabs"
          variant="fullWidth"
          TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
          sx={{
            '& .MuiTab-root': {
              minHeight: '40px',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 600,
              lineHeight: '18px',
              minWidth: '195px',
              maxWidth: '195px',
            },
            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              height: '2px',
            },
            '& .MuiTabs-indicatorSpan': {
              maxWidth: '60%',
              width: '100%',
              height: '2px',
              backgroundColor: '#537EEF',
            },
          }}
        >
          <Tab icon={undefined} iconPosition="start" label="AI 추천" {...a11yProps(0)} />
          <Tab icon={undefined} iconPosition="start" label="AI 생성" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {activeTab === 1 && (
        <>
          <AIGenerationByUser setOpenDetail={setOpenDetail} />
          <PromptEditor
            tab={activeTab}
            prompt={prompt}
            setPrompt={setPrompt}
            className="sticky bottom-[60px] rounded-xl"
          />
          <DialogViewDetailByUser
            open={Boolean(openDetail?.id)}
            task={openDetail}
            handleClose={() => {
              setOpenDetail(null);
            }}
          />
          {/* <DialogExceedCredit open={Boolean(true)} handleClose={() => { }} /> */}
        </>
      )}
      {activeTab === 0 && (
        <>
          <Box className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px] mt-[40px]">
            {templates?.map((item) => (
              <div
                key={item.id}
                onClick={() => setOpenDialog(item.id)}
                className="group relative w-full h-[405px] rounded-[15px] overflow-hidden cursor-pointer"
              >
                {/* Ảnh */}
                <img
                  src={item.thumbnail_url}
                  alt={`Image ${item.id}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Lớp phủ gradient */}
                <div
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_72.22%,#000000_100%)] 
                        opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                />
                {/* Border + Shadow khi hover */}
                <div
                  className="absolute inset-0 rounded-[15px] border-0 
                        group-hover:border-[5px] group-hover:border-[#4776EF] 
                        group-hover:shadow-[0_0_25px_0_#0000004D] transition-all 
                        duration-300 pointer-events-none"
                />
              </div>
            ))}
          </Box>
          <PromptEditor
            changeTab={setActiveTab}
            tab={activeTab}
            prompt={prompt}
            setPrompt={setPrompt}
            className="sticky bottom-[60px] rounded-xl"
          />
          <DialogViewDetail
            openDialogId={openDialog}
            templates={templates}
            setPrompt={setPrompt}
            open={Boolean(openDialog)}
            handleClose={() => {
              setOpenDialog(null);
            }}
          />
          {/* <DialogExceedCredit open={Boolean(true)} handleClose={() => { }} /> */}
        </>
      )}
    </Box>
  );
};

export default AIGeneration;

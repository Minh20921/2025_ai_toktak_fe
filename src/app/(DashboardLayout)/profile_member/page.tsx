'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';
import { RootState } from '@/app/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';
import API from '@service/api';
import { useRouter } from 'next/navigation';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';

export default function ProfileMemberPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const platform = useSelector((state: RootState) => state.platform);
  const profile = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [userInfo, setUserInfo] = useState<Object>();

  const [avatarList, setAvatarList] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.user?.avatar || '');

  const getUserInfo = useRef(
    new API('/api/v1/auth/user_profile', 'GET', {
      success: (res) => {
        setUserInfo(res.data);

        const levelInfo = JSON.parse(res.data.level_info);
        setAvatarList(levelInfo.map((item) => item.url));
        const activeAvatar = levelInfo.find((item) => item.active === 'active');
        if (activeAvatar) {
          setSelectedAvatar(activeAvatar.url);
        }
      },
      error: (res) => {
        console.log(res);
      },
    }),
  );
  useEffect(() => {
    getUserInfo.current.call();
  }, []);

  const updateUserAPI = new API('/api/v1/auth/update_user', 'POST', {
    success: () => {
      showNotice('성공', '정보가 성공적으로 업데이트되었습니다.', false, '확인');
    },
    error: (err) => {
      console.log(err);
      showNoticeError('오류', '정보 업데이트에 실패했습니다.', false, '확인');
    },
    finally: () => {},
  });

  const handleUpdateUser = () => {
    showNotice('정보를 업데이트하시겠습니까?', '이 정보를 업데이트하시겠습니까?', true, '예', '아니요', () => {
      updateUserAPI.config.data = {
        name: userInfo?.name,
        phone: userInfo?.phone,
        contact: userInfo?.contact,
        company_name: userInfo?.company_name,
      };
      updateUserAPI.call();
    });
  };
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={profile?.user?.avatar || '/images/profile/user-1.jpg'}
          alt="Profile"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{profile?.user?.name || profile?.user?.username}</h2>
          <div className="border-b border-gray-200">
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  padding: '8px 16px',
                  fontSize: '14px',
                  textTransform: 'none',
                },
                '& .Mui-selected': {
                  color: '#4F46E5',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#4F46E5',
                },
              }}
            >
              <Tab label="기본정보" onClick={() => router.push('/profile_member')} />
              <Tab label="상점정보" />
              <Tab label="소셜 계정 연동" />
            </Tabs>
          </div>
        </div>
      </div>
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={4}>
            <Swiper modules={[Navigation]} navigation spaceBetween={10} slidesPerView={1} className="w-full max-w-sm">
              {avatarList.map((avatar, index) => (
                <SwiperSlide key={index}>
                  <Avatar
                    src={avatar}
                    alt="Avatar"
                    sx={{
                      cursor: 'pointer',
                      border: selectedAvatar === avatar ? '3px solid #4F46E5' : 'none',
                    }}
                    onClick={() => setSelectedAvatar(avatar)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <Box flex={1}>
              <UserInfo
                label="이름"
                value={userInfo?.name}
                onChange={(val) => setUserInfo({ ...userInfo, name: val })}
              />
              <UserInfo
                label="전화번호"
                value={userInfo?.phone}
                onChange={(val) => setUserInfo({ ...userInfo, phone: val })}
              />
              <UserInfo
                label="이메일"
                value={userInfo?.email}
                onChange={(val) => setUserInfo({ ...userInfo, email: val })}
              />
              <UserInfo
                label="연락처"
                value={userInfo?.contact}
                onChange={(val) => setUserInfo({ ...userInfo, contact: val })}
              />
              <UserInfo
                label="회사명"
                value={userInfo?.company_name}
                onChange={(val) => setUserInfo({ ...userInfo, company_name: val })}
              />
            </Box>
          </Box>

          <Box className="w-full flex justify-end" sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={handleUpdateUser}>
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Platform Links */}

      <Box className="w-full flex justify-end">
        <Button variant="outlined">DELETE ACCOUNT</Button>
      </Box>
    </div>
  );
}

function UserInfo({ label, value, readOnly = false, onChange }) {
  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
      <Typography fontWeight="bold" sx={{ minWidth: 120 }}>
        {label}:
      </Typography>
      <TextField
        fullWidth
        value={value || ''}
        size="small"
        InputProps={{ readOnly }}
        onChange={(e) => !readOnly && onChange && onChange(e.target.value)}
      />
      {!readOnly && <IconButton size="small">✏️</IconButton>}
    </Box>
  );
}

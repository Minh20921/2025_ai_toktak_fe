'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { Blog, Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import { SocialIcon } from '@/app/(DashboardLayout)/upload/StatusSocial';
import { Icon } from '@iconify/react';

const UploadContentSample = ({
  type = 0,
  thumbnail = '',
  blog = {},
  onStatusUpdate,
}: {
  type?: number;
  thumbnail?: string;
  blog?: any;
  onStatusUpdate?: (count: number) => void;
}) => {
  const [isDownload, setIsDownload] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDisplayNotice, setDisplayNotice] = useState(false);
  const [isOpenBlog, setIsOpenBlog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [socialButtons, setSocialButtons] = useState([
    { name: 'youtube', icon: <Youtube className="w-7 h-7 sm:w-9 sm:h-9" />, status: 0, step: 0, type: [0] },
    { name: 'instagram', icon: <Instagram className="w-7 h-7 sm:w-9 sm:h-9" />, status: 0, step: 0, type: [0, 1] },
    { name: 'facebook', icon: <Facebook className="w-7 h-7 sm:w-9 sm:h-9" />, status: 0, step: 0, type: [0, 1] },
    { name: 'tiktok', icon: <TikTok className="w-7 h-7 sm:w-9 sm:h-9" />, status: 0, step: 0, type: [0, 1] },
    { name: 'threads', icon: <Threads className="w-7 h-7 sm:w-9 sm:h-9" />, status: 0, step: 0, type: [0, 1] },
    { name: 'x', icon: <Twitter className="w-7 h-7 sm:w-9 sm:h-9" />, status: 0, step: 0, type: [0, 1] },
    { name: 'blog', icon: <Blog className="w-7 h-7 sm:w-9 sm:h-9" />, status: 0, step: 0, type: [2] },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSocialButtons((prev) => {
        const updated = prev.map((b) => (b.status ? b : { ...b, status: Math.random() > 0.8 ? 1 : b.status }));
        const count = updated.filter((b) => b.status === 1).length;
        onStatusUpdate?.(count);
        return updated;
      });
    }, 1000);

    setTimeout(() => {
      setSocialButtons((prev) => {
        const updated = prev.map((b) => ({ ...b, status: 1 }));
        onStatusUpdate?.(updated.length);
        return updated;
      });
      clearInterval(interval);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenBlog = () => {
    if (isOpenBlog) return;
    setIsOpenBlog(true);
    window.open('https://blog.naver.com/MyBlog.naver?Redirect=Write', '_blank');
  };

  const handleDownload = async () => {
    setIsDownload(true);
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(blog?.docx_url || '')}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob(); // Nhận dữ liệu dạng blob
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'blog.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url); // Giải phóng bộ nhớ
    } catch (error) {
      console.error('❌ Tải xuống thất bại:', error);
    } finally {
      setIsDownload(false);
    }
  };

  const handleCopy = async () => {
    if (!blog?.content && isCopied) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([blog?.content || ''], { type: 'text/html' }),
        }),
      ]);
      setIsCopied(true);
      setDisplayNotice(true);
      const timeout = setTimeout(() => {
        setDisplayNotice(false);
        clearTimeout(timeout);
      }, 2000);
    } catch (error) {
      console.error('복사 오류:', error);
    }
  };

  const renderSocialButtons = () => {
    return type === 2 ? (
      <Box sx={{ display: 'flex', gap: { xs: '4px', sm: '20px' }, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: isCopied ? '#F6F7F9' : 'transparent',
            '&:hover': { backgroundColor: '#F6F7F9' },
            fontSize: { xs: '10px', sm: '12px' },
            fontWeight: 600,
          }}
          onClick={handleCopy}
        >
          <Icon icon="tabler:copy" width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} />
          복사
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: isDownload ? '#F6F7F9' : 'transparent',
            '&:hover': { backgroundColor: '#F6F7F9' },
            fontSize: { xs: '10px', sm: '12px' },
            fontWeight: 600,
            alignItems: 'center',
          }}
          onClick={handleDownload}
        >
          {isDownload ? (
            <CircularProgress size={isMobile ? 16 : 20} />
          ) : (
            <Icon icon="ic:round-download" width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} />
          )}
          다운로드
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: isOpenBlog ? '#F6F7F9' : 'transparent',
            '&:hover': { backgroundColor: '#F6F7F9' },
            fontSize: { xs: '10px', sm: '12px' },
            fontWeight: 600,
          }}
          onClick={handleOpenBlog}
        >
          <Icon icon="majesticons:open" width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} />
          바로가기
        </Box>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexShrink: 0 }}>
        {socialButtons
          .filter((social) => social.type.includes(type))
          .map((social) => (
            <SocialIcon
              key={social.name}
              status={social.status}
              icon={social.icon}
              size={isMobile ? 28 : 40}
              onClick={() => {}}
            />
          ))}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 2.5 },
        width: '100%',
        maxWidth: '649px',
        borderRadius: { xs: '8px', md: '16px' },
        boxShadow: { xs: '0px 4px 15px 0px #0000000D', md: '0px 0px 30px 0px #0000000D' },
        position: 'relative',
        gap: 2,
      }}
    >
      <Box
        sx={{
          flex: 'none',
          width: '80px',
          height: '80px',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: thumbnail ? 'transparent' : '#F8F8F8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {thumbnail ? (
          <img src={thumbnail} alt="icon" width={80} height={80} />
        ) : (
          <img src={`/images/upload/empty_post_${type + 1}.png`} alt="default" />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 1,
          flex: 1,
          px: { xs: 0, md: 2 },
        }}
      >
        <Box sx={{ fontSize: { xs: '14px', sm: '20px' }, fontWeight: 'bold', color: { xs: '#272727', sm: '#686868' } }}>
          {['VIDEO', 'IMAGE', 'BLOG'][type]}
        </Box>
        {isMobile && <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>{renderSocialButtons()}</Box>}
        <Box sx={{ fontSize: { xs: '10px', sm: '12px' }, fontWeight: { xs: 400, sm: 500 }, color: '#686868' }}>
          {['MP4 | 18.37MB', 'PNG | 3.5MB', 'DOCX | 2.37MB'][type]}
        </Box>
      </Box>

      {!isMobile && <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>{renderSocialButtons()}</Box>}

      {isDisplayNotice && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            mt: 1,
            width: '100%',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#272727',
          }}
        >
          블로그 콘텐츠를 복사했어요.
        </Box>
      )}
    </Box>
  );
};

export default UploadContentSample;

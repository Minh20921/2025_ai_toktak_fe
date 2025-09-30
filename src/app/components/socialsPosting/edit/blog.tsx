'use client';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import CustomButton from '@/app/components/common/CustomButton';
import MuiDropdownSelect, { DropdownOption } from '@/app/components/common/MuiDropdownSelect';
import { toast } from '@/app/components/common/Toast';
import { setNotificationState } from '@/app/lib/store/notificationSlice';
import { RootState } from '@/app/lib/store/store';
import RichTextEditor from '@/components/RichTextEditor';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeError } from '@/utils/custom/notice_error';
import { encodeUserId } from '@/utils/encrypt';
import { IconDone, MoreIcon } from '@/utils/icons/icons';
import { Icon } from '@iconify/react';
import { Avatar, Box, CircularProgress, IconButton, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import API from '@service/api';
import APIV2 from '@service/api_v2';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  handleReFetch: () => void;
}

export default function BlogPreview({ data, open, onClose, handleReFetch }: FacebookProps) {
  const theme = useTheme();
  const router = useRouter();
  const userLogin = useSelector((state: RootState) => state.auth.user);
  const platform = useSelector((state: RootState) => state.platform);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.platform.blog);
  const [showOptions, setShowOptions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [showContent, setShowContent] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDisplayNotice, setDisplayNotice] = useState(false);
  const [isOpenBlog, setIsOpenBlog] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDownload, setIsDownload] = useState(false);

  const user_login = useSelector((state: RootState) => state.auth.user);
  const openMore = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    setDisplayText(data?.content || '');
  }, [data]);

  const editPostAPI = useRef(
    new API(`/api/v1/post/edit_post`, 'POST', {
      success: (res) => {
        if (res?.code === 201) {
          showNoticeError(res?.message, '', false, '확인', '취소', () => {
            // setLoading(false);
          });
        } else {
          toast.success('게시물이 편집되었습니다!');
          setIsEdit(false);
          handleReFetch();
        }
      },
      error: (err) => {},
      finally: () => {},
    }),
  );

  const apiDelete = useRef(
    new API('/api/v1/maker/delete_post', 'POST', {
      success: () => {
        toast.success('게시물이 성공적으로 삭제되었습니다.');
        onClose();
        handleReFetch();
      },
      error: (err) => {
        console.log(err);
        toast.error(err.message);
      },
      finally: () => {},
    }),
  );

  const handleEditDone = () => {
    editPostAPI.current.config.data = {
      content: displayText,
      post_id: data?.id,
    };

    showNotice('✏️ 이 콘텐츠를 수정할까요?', '⚠️ 수정한 콘텐츠는 되돌릴 수 없어요!', true, '확인', '취소', () => {
      editPostAPI.current.call();
      setIsEdit(false);
    });
  };

  const handleRemove = async () => {
    showNotice(
      '선택한 콘텐츠를 삭제하시겠어요?',
      '삭제한 컨텐츠는 다시 복구할 수 없어요.',
      true,
      '삭제',
      '취소',
      async () => {
        apiDelete.current.config.data = {
          post_ids: data?.id.toString(),
        };
        await apiDelete.current.call();
        onClose();
      },
    );
  };

  useEffect(() => {
    if (open) {
      setLoading(false);
      setShowOptions(false);
      //   setShowContent(false);
    }
  }, [open]);

  const fetchNotification = () => {
    const Notification = new APIV2('/api/v1/notification/get_total_unread_notification', 'GET', {
      success: (response) => {
        dispatch(
          setNotificationState({
            notification: response?.data?.total_pages || 0,
          }),
        );
      },
      error() {
        console.log('error');
      },
      finally() {
        // console.log('finish');
      },
    });
    Notification.config.params = {
      user_id: encodeUserId(user_login?.id || 0),
      not: 1,
    };
    Notification.call();
  };

  const copyBlogApi = new API('/api/v1/maker/copy-blog', 'POST', {
    success: async (res) => {
      if (res?.status !== 201) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([data?.content || ''], {
              type: 'text/html',
            }),
          }),
        ]);
        toast.success(`Copy blog success`);
        fetchNotification();
        setIsCopied(true);
        handleReFetch();
      }
    },
    error: (err) => {
      console.log(err);
      // toast.error(err.message);
    },
    finally: () => {},
  });

  const handleOpenBlog = () => {
    if (isOpenBlog) return;
    if (!platform?.blog?.meta_url) {
      showNotice(
        '블로그를 링크하지 않았습니다',
        '블로그에 연결하여 해당 페이지로 바로 이동하세요',
        false,
        '확인',
        '',
        () => {
          router.push('/profile?tabIndex=2');
        },
      );
      return;
    }
    setIsOpenBlog(true);
    window.open(platform?.blog?.meta_url, '_blank');
  };
  const handleCopy = async () => {
    if (!data?.content && isCopied) {
      // toast.error('Blog is empty');
      return;
    }
    try {
      copyBlogApi.config.data = {
        blog_id: data?.id,
      };
      copyBlogApi.call();
    } catch (error) {
      console.error('복사 오류:', error);
      // toast.error('copy blog fail');
    }
  };
  const download = async () => {
    setIsDownload(true);
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(data?.docx_url || '')}`);

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
  const handleDownload = () => {
    if (!userLogin?.can_download) {
      showNoticeError(
        '⏳ 다운로드 기간이 살짝 지났네요.',
        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>언제든 필요한 콘텐츠를 꺼낼 수 있어요.',
        true,
        '확인',
        '취소',
        () => {
          router.push('/rate-plan');
        },
      );
      return;
    }
    if (userLogin?.subscription === 'FREE' && moment().diff(moment(userLogin?.created_at), 'days') <= 3) {
      showNoticeError(
        '⏳ 무료 다운로드는 가입 후 3일만',
        '첫 달 0원 혜택 받고 요금제 업그레이드하면<br>언제든 무제한 다운로드가 가능해요.',
        true,
        '확인',
        '취소',
        () => {
          download();
        },
      );
      return;
    }
    download();
  };
  const optionMore: DropdownOption[] = [
    {
      value: 'edit',
      id: 'edit',
      label: (
        <Box
          className="py-2.5 px-3 flex items-center gap-2"
          onClick={() => {
            setIsEdit(true);
          }}
        >
          {!isMobile && <Icon icon="carbon:edit" />}
          <Typography sx={{ ml: 1 }}>콘텐츠 수정</Typography>
        </Box>
      ),
    },
    {
      value: 'trash',
      id: 'trash',
      label: (
        <Box className="py-2.5 px-3 flex items-center gap-2" onClick={handleRemove}>
          {!isMobile && <Icon icon="tabler:trash" />}
          <Typography sx={{ ml: 1, color: { xs: '#FF5959', sm: 'inherit' } }}>삭제</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box className="h-full">
      <Modal
        open={loading}
        onClose={() => setLoading(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Modal>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: 'auto',
          // bgcolor: 'rgba(0,0,0,0.3)',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: '90%', lg: '1164px' },
            height: { xs: '100%', sm: 'auto' },
            maxHeight: { sm: '90vh' },
            mx: 'auto',
            my: 4,
            bgcolor: '#fff',
            boxShadow: 1,
            borderRadius: { xs: 0, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              borderBottom: '1px solid #EFEFEF',
              pt: { xs: 5, sm: 3 },
              pb: { xs: 2, sm: 2.5 },
              px: { xs: 2, sm: 5 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '18px', sm: '21px' },
                fontWeight: 500,
                color: '#272727',
                textAlign: { xs: 'center', sm: 'left' },
                maxWidth: { xs: '300px', sm: 'none' },
                margin: { xs: '0 auto', sm: 0 },
              }}
            >
              {data?.title}
            </Typography>

            <Box
              sx={{
                display: { xs: 'flex', sm: 'none' },
                alignItems: 'center',
                justifyContent: 'center',
                pt: 2.5,
                pb: 1.5,
                gap: { xs: 1, sm: 3 },
              }}
            >
              <Box
                onClick={handleCopy}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 1.25 },
                  px: { xs: 1, sm: 1.5 },
                  py: { xs: 0.5, sm: 1 },
                  borderRadius: '6px',
                  cursor: 'pointer',
                  ...(isCopied && { bgcolor: '#F6F7F9' }),
                  '&:hover': { bgcolor: '#F6F7F9' },
                }}
              >
                <Icon icon="tabler:copy" width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} />
                <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>복사</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '5px',
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  borderRadius: '6px',
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
                onClick={handleOpenBlog}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 1.25 },
                  px: { xs: 1, sm: 1.5 },
                  py: { xs: 0.5, sm: 1 },
                  borderRadius: '6px',
                  cursor: 'pointer',
                  ...(isOpenBlog && { bgcolor: '#F6F7F9' }),
                  '&:hover': { bgcolor: '#F6F7F9' },
                }}
              >
                <Icon icon="majesticons:open" width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} />
                <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>바로가기</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                mt: { xs: 1, sm: 2 },
              }}
            >
              <Avatar
                src={user?.avatar || '/images/rank/Rank-1.png?height=38&width=38'}
                sx={{
                  width: { xs: 32, sm: 38 },
                  height: { xs: 32, sm: 38 },
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'Pretendard',
                  fontSize: { xs: '12px', sm: '14px' },
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  color: '#272727',
                }}
              >
                TOKTAK
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Pretendard',
                  fontSize: { xs: '12px', sm: '14px' },
                  color: '#A4A4A4',
                  flexGrow: 1,
                }}
              >
                19시간 전
              </Typography>
              <Box>
                {isEdit ? (
                  <CustomButton
                    startIcon={<IconDone />}
                    variant="contained"
                    loading={loading}
                    onClick={handleEditDone}
                    sx={{
                      py: { xs: 0.5, sm: 1 },
                      px: { xs: 2, sm: 3 },
                      borderRadius: '10px',
                    }}
                  >
                    저장
                  </CustomButton>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: { xs: 1, sm: 3 },
                    }}
                  >
                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: { xs: 1, sm: 3 },
                      }}
                    >
                      <Box
                        onClick={handleCopy}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1, sm: 1.25 },
                          px: { xs: 1, sm: 1.5 },
                          py: { xs: 0.5, sm: 1 },
                          borderRadius: '10px',
                          cursor: 'pointer',
                          ...(isCopied && { bgcolor: '#F6F7F9' }),
                          '&:hover': { bgcolor: '#F6F7F9' },
                        }}
                      >
                        <Icon icon="tabler:copy" width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} />
                        <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>복사</Typography>
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
                        onClick={handleOpenBlog}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1, sm: 1.25 },
                          px: { xs: 1, sm: 1.5 },
                          py: { xs: 0.5, sm: 1 },
                          borderRadius: '10px',
                          cursor: 'pointer',
                          ...(isOpenBlog && { bgcolor: '#F6F7F9' }),
                          '&:hover': { bgcolor: '#F6F7F9' },
                        }}
                      >
                        <Icon icon="majesticons:open" width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} />
                        <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>바로가기</Typography>
                      </Box>
                    </Box>
                    <MuiDropdownSelect
                      options={optionMore}
                      isRadio={false}
                      menuOrigin={{
                        transformOrigin: { horizontal: 'left', vertical: 'top' },
                        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
                      }}
                      renderButton={({ onClick }) => (
                        <IconButton onClick={onClick} sx={{ borderRadius: '4px' }}>
                          <MoreIcon />
                        </IconButton>
                      )}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Body */}
          {isEdit ? (
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                flex: 1,
                position: 'relative',
                minHeight: { xs: 'calc(100vh - 200px)', sm: '400px' },
              }}
            >
              <RichTextEditor value={displayText} onChange={setDisplayText} height={'65vh'} />
            </Box>
          ) : (
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                flex: 1,
                position: 'relative',
                mb: { xs: 4, sm: 6 },
                overflowY: { sm: 'auto' },
              }}
            >
              <Box
                id="blog-content"
                sx={{
                  mt: { xs: 1.5, sm: 2 },
                  textAlign: 'left',
                  fontSize: { xs: '14px', sm: '16px' },
                  lineHeight: { xs: '20px', sm: '24px' },
                  color: '#686868',
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto',
                  },
                }}
                dangerouslySetInnerHTML={{ __html: displayText }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

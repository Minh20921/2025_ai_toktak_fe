'use client';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import CustomButton from '@/app/components/common/CustomButton';
import RichTextEditor from '@/components/RichTextEditor';
import { showNoticeError } from '@/utils/custom/notice_error';
import { CloseIcon, DotIcon, IconDone } from '@/utils/icons/icons';
import { Avatar, Box, CircularProgress, IconButton, Menu, MenuItem, Modal, Typography } from '@mui/material';
import API from '@service/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

// Removed direct ReactQuill usage in favor of shared component

interface FacebookProps {
  data: PostData | undefined;
  open: boolean;
  onClose: () => void;
  canEdit?: boolean;
}

export default function BlogPreview({ data, open, onClose, canEdit = false }: FacebookProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
        }
      },
      error: (err) => {},
      finally: () => {},
    }),
  );

  const handleEditDone = () => {
    editPostAPI.current.config.data = {
      content: displayText,
      post_id: data?.id,
    };
    editPostAPI.current.call();
    setIsEdit(false);
  };

  useEffect(() => {
    if (open) {
      setLoading(false);
      setShowOptions(false);
      //   setShowContent(false);
    }
  }, [open]);

  return (
    <>
      <Modal
        className="w-screen flex items-center justify-center"
        open={loading}
        onClose={() => {
          setLoading(false);
          setShowOptions(false);
          //   setShowContent(false);
        }}
      >
        <CircularProgress />
      </Modal>
      <Modal open={open} onClose={onClose} aria-labelledby="facebook-instagram-modal">
        <Box className="absolute inset-0 overflow-y-auto bg-white sm:bg-transparent">
          {/* Close Button */}
          <IconButton className="absolute top-2 right-2" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full sm:h-auto max-w-[1164px] sm:bg-white sm:shadow-lg">
            <div className="flex flex-col items-stretch relative p-3 sm:p-0">
              <Box className="border-b-[1px] border-b-[#EFEFEF] pt-[70px] sm:pt-30 pb-5 px-3 sm:px-[40px]">
                <IconButton className="sm:hidden absolute top-4 right-2 z-[9999]" onClick={onClose}>
                  <CloseIcon fill="#000" width={24} height={24} />
                </IconButton>
                <Typography className="text-[#272727] text-[18px] sm:text-[21px] leading-[25px] font-medium font-pretendard text-center sm:text-left">
                  {data?.title}
                </Typography>
                <Box className="flex items-center gap-4 mt-5 w-[calc(100%+12px)]">
                  <Avatar src={'/images/rank/Rank-1.png?height=38&width=38'} />
                  <Typography className="font-pretendard text-sm font-medium leading-[17px] uppercase" color="#272727">
                    TOKTAK
                  </Typography>
                  <Typography className="font-pretendard text-sm flex-grow  leading-[17px]" color="#A4A4A4">
                    19시간 전
                  </Typography>
                  <Box className={`relative ${canEdit ? '' : 'hidden'}`}>
                    {isEdit ? (
                      <CustomButton
                        className="py-2 px-6 rounded-[10px] disabled:text-[#6A6A6A]"
                        startIcon={<IconDone />}
                        variant="contained"
                        loading={loading}
                        onClick={handleEditDone}
                      >
                        저장
                      </CustomButton>
                    ) : (
                      <IconButton
                        id="demo-positioned-button"
                        aria-controls={openMore ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMore ? 'true' : undefined}
                        onClick={handleClick}
                        className="px-4 rounded hidden sm:block"
                      >
                        <DotIcon className="cursor-pointer" />
                      </IconButton>
                    )}
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={openMore}
                      onClose={handleClose}
                      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    >
                      <MenuItem
                        className="py-2.5 px-3 flex items-center gap-2"
                        onClick={() => {
                          handleClose();
                          setIsEdit(true);
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M2.46 17.793h14.752M5.738 14.404v-3.39l8.195-8.471 3.278 3.389-8.195 8.471zm5.739-9.318 3.278 3.389"
                            stroke="#6A6A6A"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        콘텐츠 수정
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              </Box>
              {isEdit ? (
                <Box className="p-[25px] flex flex-1 gap-[10px] relative min-h-[80vh] sm:max-h-[calc(100vh-200px)]">
                  <RichTextEditor value={displayText} onChange={setDisplayText} height={'65vh'} />
                </Box>
              ) : (
                <Box className="sm:max-h-[calc(100vh-200px)] overflow-y-auto py-[45px] px-3 sm:px-0">
                  <Box
                    id="blog-content"
                    className="text-center text-[12px] sm:text-[16px] leading-[24px] blog-content text-[#686868]"
                    dangerouslySetInnerHTML={{ __html: displayText }}
                  />
                  <img src="/images/home/blogAction.png" className="ml-[60px]" />
                </Box>
              )}
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

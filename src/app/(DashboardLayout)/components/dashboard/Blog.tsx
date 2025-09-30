'use client';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import BlogPreview from '@/app/components/socialsPosting/blog/blogPreview';
import { RootState } from '@/app/lib/store/store';
import RichTextEditor from '@/components/RichTextEditor';
import { showNoticeError } from '@/utils/custom/notice_error';
import { DownloadIcon } from '@/utils/icons/engagements';
import { UpDownIcon } from '@/utils/icons/icons';
import { Blog as IconBlog } from '@/utils/icons/socials';
import { Icon } from '@iconify/react';
import { Box, CircularProgress, Typography } from '@mui/material';
import API from '@service/api';
import moment from 'moment';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Typewriter from 'typewriter-effect';

export interface BlogData extends Partial<PostData> {
  title?: string;
  subtitle?: string;
  content?: string;
  thumbnail?: string;
  docx_url?: string;
}

// Removed direct ReactQuill usage in favor of shared component

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: 'top-popup rounded-[16px] w-[250px] h-[80px]',
    title: 'text-[21px] leading-[30px] text-[#272727] mt-[-50px] font-pretendard font-bold',
  },
});

const Blog = ({
  data = { title: '', subtitle: '', content: '', thumbnail: '' },
  isLoading = false,
  isShowDownload = false,
  percent = 0,
  isDone = false,
  randomText = '',
  isEdit = false,
  callEdit = false,
  setCallEdit = () => { },
}: {
  data?: BlogData;
  isLoading?: boolean;
  isShowDownload?: boolean;
  percent?: number;
  isDone?: boolean;
  randomText?: string;
  isEdit?: boolean;
  callEdit?: boolean;
  setCallEdit?: (callEdit: boolean) => void;
}) => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(!isDone);
  const [displayText, setDisplayText] = useState('');
  const searchParams = useSearchParams();
  const [openPreview, setOpenPreview] = useState(false);
  const platform = useSelector((state: RootState) => state.platform);
  const user = useSelector((state: RootState) => state.auth.user);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    let content = data?.content || '';
    setDisplayText(data?.content || '');
    // if ( content != "" ){
    //   setDisplayText(data?.content || '');
    // }else{
    //   isDone = false;
    //   setIsStreaming(false);
    // }
  }, [data]);

  useEffect(() => {
    if (!isLoading) {
      setShowFullContent(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (callEdit) {
      editPostAPI.current.config.data = {
        post_id: data?.id,
        content: displayText,
      };
      editPostAPI.current.call();
      setCallEdit(false);
    }
  }, [callEdit]);
  const download = async () => {
    setDownloading(true);
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
      setDownloading(false);
    }
  };
  const handleDownload = () => {
    if (!user?.can_download) {
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
    if (user?.subscription === 'FREE' && moment().diff(moment(user?.created_at), 'days') <= 3) {
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
      error: (err) => { },
      finally: () => { },
    }),
  );

  return (
    <Box className="shadow-[0px_0px_40px_rgba(0,0,0,0.08)] sm:shadow-none bg-[#fff] sm:bg-transparent rounded-[8px] p-[20px] sm:p-0">
      <Box className={`flex gap-[10px] items-center sm:mb-[20px]${showFullContent ? ' mb-[20px]' : ''}`}>
        <Box className={`flex gap-[10px] flex-1 items-center`}>
          <Typography className="!text-[#272727] text-[16px] sm:!text-[24px] !font-bold">BLOG</Typography>
          {isShowDownload && (
            <Box className="">
              {downloading ? (
                <CircularProgress className="!h-[20px] !w-[20px]" />
              ) : (
                <DownloadIcon onClick={() => handleDownload()} className="cursor-pointer download_blog_button" />
              )}
            </Box>
          )}
          {isLoading && percent < 100 && !showFullContent && (
            <Typography className="sm:hidden !text-[#4776EF] text-[16px] sm:!text-[24px] !font-medium">
              {percent}%
            </Typography>
          )}
        </Box>
        <Icon
          icon={'ion:chevron-back'}
          onClick={() => setShowFullContent((prev) => !prev)}
          className={`sm:hidden cursor-pointer${showFullContent ? ' rotate-90' : ' -rotate-90'}`}
          width={20}
          height={20}
        />
      </Box>
      <Box className={`sm:flex gap-[40px] sm:pr-[180px]${showFullContent ? '' : ' hidden'}`}>
        {isEdit ? (
          <Box className="rounded-[20px] border-[1px] border-[#F1F1F1] sm:border-[2px] sm:border-[#537EEF] sm:p-[25px] sm:flex flex-1 gap-[10px] relative min-h-[280px]">
            <RichTextEditor value={displayText} onChange={setDisplayText} height={1400} />
          </Box>
        ) : (
          <Box className="rounded-[20px] sm:bg-[#FBFBFB] sm:p-[25px] sm:flex flex-1 gap-[10px] relative sm:min-h-[280px]">
            {showContent ? (
              <Box>
                <Box
                  id="blog-content"
                  className="flex-1 mt-[15px] text-center text-[16px] leading-[24px] blog-content text-[#686868] !font-pretendard"
                  dangerouslySetInnerHTML={{ __html: `${displayText}` }}
                />
                <Box
                  className="flex gap-[10px] justify-center items-center text-[18px] font-semibold text-[#6A6A6A] cursor-pointer mt-[28px]"
                  onClick={() => setShowContent(false)}
                >
                  접기
                  <UpDownIcon className="rotate-180" />
                </Box>
              </Box>
            ) : (
              <Box className="w-full">
                <Box id="blog-content" className={`justify-center w-full sm:pr-[200px]`}>
                  <Box
                    className={`w-full sm:w-[150px] ${isLoading ? 'h-[240px]' : ''} sm:absolute top-[25px] right-[25px] bg-[#F8F8F8] sm:bg-[#FBFBFB] rounded-[8px] content-center`}
                  >
                    {isLoading ? (
                      <Box className="w-full sm:w-[150px] rounded-[16px] content-center space-y-2 sm:space-y-5 sm:pb-[50px]">
                        <img
                          src={`/images/home/analys_progress_blog.gif`}
                          className="hidden sm:block h-[130px] w-[130px] mx-auto mb-[30px]"
                        />
                        <Box className="sm:w-[150px] text-[24px] sm:!text-[36px] font-black text-center content-center text-[#4776EF]">
                          {percent}%
                        </Box>
                        <Box
                          className="sm:hidden text-[10px] sm:text-[14px] font-medium text-[#A4A4A4] text-center"
                          dangerouslySetInnerHTML={{
                            __html: '사용되는 콘텐츠에 따라 제작</br>시간이 길어질 수 있습니다.',
                          }}
                        />
                      </Box>
                    ) : data.thumbnail ? (
                      <img
                        src={data.thumbnail}
                        alt="icon"
                        // height="150"
                        // width="150"
                        className="w-full sm:w-[150px] sm:h-[150px] object-cover rounded-[16px]"
                      />
                    ) : (
                      <Box className="h-[150px] w-[150px] bg-[#D9D9D9] rounded-[16px]" />
                    )}
                  </Box>
                  <>
                    {isDone || !isStreaming ? (
                      <Box className="mt-[15px] space-y-[20px]">
                        <Typography
                          className="text-[16px] sm:!text-[21px] !text-[#272727] !font-bold !font-pretendard"
                          dangerouslySetInnerHTML={{ __html: data.title || '' }}
                        />
                        <Typography
                          className="text-[14px] sm:text-[16px] leading-[24px] min-h-[81px] text-[#686868] !font-pretendard"
                          dangerouslySetInnerHTML={{ __html: data.subtitle + '...' || '' }}
                        />
                      </Box>
                    ) : isLoading ? (
                      <Typography className="hidden sm:block !text-ld !text-[22px] !text-[#272727] !font-pretendard">
                        {randomText}
                      </Typography>
                    ) : (
                      <Box className="mt-[15px] space-y-[20px]">
                        <Typewriter
                          onInit={(typewriter) => {
                            typewriter
                              .typeString(data.title || '')
                              .pauseFor(100)
                              .start();
                          }}
                          options={{
                            wrapperClassName: 'text-[16px] sm:!text-[21px] !text-[#272727] !font-bold',
                            delay: 25,
                          }}
                        />

                        <Typewriter
                          onInit={(typewriter) => {
                            const subtitleText = data.subtitle?.trim(); // dùng optional chaining + trim để kiểm tra chuỗi rỗng
                            const finalText =
                              subtitleText && subtitleText.length > 0 ? subtitleText + '...' : randomText + '...';

                            typewriter.typeString(finalText).pauseFor(100).start();
                          }}
                          options={{
                            wrapperClassName:
                              'text-[14px] sm:text-[16px] leading-[24px] min-h-[81px] text-[#686868] whitespace-pre-line',
                            delay: 25,
                          }}
                        />
                      </Box>
                    )}
                  </>

                  {/* )} */}
                </Box>
                {isLoading ? (
                  <img
                    src="/images/home/blogLoading.gif"
                    height={55}
                    width={55}
                    className="hidden sm:block mx-auto mt-[20px] mb-[-40px]"
                  />
                ) : (
                  <Box
                    className="flex gap-[10px] justify-center items-center text-[16px] sm:text-[18px] font-semibold text-[#6A6A6A] cursor-pointer mt-[28px]"
                    onClick={() => {
                      setShowContent(true);
                      setIsStreaming(false);
                    }}
                  >
                    펼쳐보기
                    <UpDownIcon />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
        <Box className={`${isLoading ? 'hidden ' : ''}sm:flex flex-col justify-end mt-[20px] sm:mt-0`}>
          <h1 className="text-[14px] sm:text-[16px] text-[#686868]">미리보기</h1>
          <Box className="flex gap-[10px] mt-[10px] " onClick={() => platform['blog'].status && setOpenPreview(true)}>
            <Box
              className={`${!platform['blog'].status ? 'opacity-45' : 'text-black cursor-pointer'} rounded-full bg-[#F4F4F4] w-9 h-9`}
            >
              <IconBlog className="w-9 h-9" />
            </Box>
          </Box>
        </Box>
      </Box>
      <BlogPreview open={openPreview} onClose={() => setOpenPreview(false)} data={data as PostData} canEdit />
    </Box>
  );
};

export default Blog;

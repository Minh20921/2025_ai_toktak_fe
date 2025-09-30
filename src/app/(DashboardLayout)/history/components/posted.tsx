import { Box, Button, CircularProgress, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import API from '@service/api';
import CustomTable, { ColumnDef } from '@/app/components/common/CustomTable';
import MobileTable from '@/app/components/common/CustomTable/mobileTable';
import Image from 'next/image';
import { Blog, Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/lib/store/store';
import { convertDateTimeToKoreanFormat } from '@/utils/helper/time';
import { IPost, SNSStatus, TABS_TYPE } from '@/app/(DashboardLayout)/history/components/const';
import Pagination from '@mui/material/Pagination';
import { IconSort } from '@/utils/icons/icons';
import EmptyState from '@/app/(DashboardLayout)/history/components/empty';
import { ContentItem } from '@/app/(DashboardLayout)/history/page';
import { PLATFORM } from '@/utils/constant';
import PostEdit from '@/app/components/socialsPosting/postEdit';
import { CONTENT_TYPE } from '@/app/components/socialsPosting/socialPreview';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';

interface IPagination<T> {
  current_user: number;
  data: T;
  message: string;
  page: number;
  per_page: number;
  status: boolean;
  total: number;
  total_pages: number;
}

interface Props {
  checked: ContentItem[];
  setChecked: (value: ContentItem[]) => void;
  reload: string;
  typeMedia: string;
  typeDate: string;
  handleReFetch: () => void;
  typeSort: string;
  setTypeSort: Dispatch<SetStateAction<string>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setReload: Dispatch<SetStateAction<string>>;
}

const Posted: React.FC<Props> = ({
  checked,
  setChecked,
  reload,
  typeMedia,
  typeDate,
  typeSort,
  setTypeSort,
  page,
  setPage,
  setReload,
  handleReFetch,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const platform = useSelector((state: RootState) => state.platform);
  const [platformViewer, setPlatformViewer] = useState<PLATFORM>();
  const [dataView, setDataView] = React.useState<IPost>();
  const listContainerRef = useRef<HTMLDivElement>(null);
  // desktop states
  const [postList, setPostList] = useState<IPagination<IPost[]>>();
  const [isLoading, setIsLoading] = useState(true);
  const getHistoryPosted = useRef(
    new API(`/api/v1/maker/histories`, 'GET', {
      success: (res) => {
        const data = res?.data?.map((item: any) => ({
          ...item,
          type: item.type === 'image' ? 1 : item.type === 'video' ? 0 : 2,
          type_string: item.type,
        }));
        setPostList({ ...res, data });
      },
      error: (err) => console.error(err),
      finally: () => setIsLoading(false),
    }),
  );

  // mobile states
  const [mobileList, setMobileList] = useState<ContentItem[]>([]);
  const [mobilePage, setMobilePage] = useState(1);
  const [mobileTotalPages, setMobileTotalPages] = useState(1);
  const [mobileLoading, setMobileLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // common: reset when filters change
  useEffect(() => {
    setChecked([]);
    setPage(1);
    if (isMobile) {
      setMobileTotalPages(1);
      setMobileList([]);
      loadMobile(1);
    }
  }, [typeMedia, typeDate, typeSort, reload, isMobile]);

  // desktop: fetch on page / filters
  useEffect(() => {
    if (!isMobile) {
      setIsLoading(true);
      getHistoryPosted.current.config.params = {
        page: page || 1,
        per_page: 20,
        status: TABS_TYPE.POSTED,
        type_order: typeSort,
        type_post: typeMedia,
        time_range: typeDate,
      };
      getHistoryPosted.current.call();
    }
  }, [page, typeMedia, typeDate, typeSort, reload, isMobile]);

  // mobile: load page n
  const loadMobile = async (nextPage = 1) => {
    if (isLoadingRef.current || nextPage > mobileTotalPages) return;
    setMobileLoading(true);
    isLoadingRef.current = true;

    const api = new API(`/api/v1/maker/histories`, 'GET', {
      success: (res) => {
        const items = (res?.data as any[]).map((it) => {
          const norm = {
            ...it,
            type: it.type === 'image' ? 1 : it.type === 'video' ? 0 : 2,
            type_string: it.type,
          };
          return mapToContentItem(norm);
        });
        setMobileList((prev) => (nextPage === 1 ? items : [...prev, ...items]));
        setMobileTotalPages(res.total_pages || 1);
        setMobilePage(nextPage);
      },
      error: (e) => console.error(e),
      finally: () => {
        setMobileLoading(false);
        isLoadingRef.current = false;
      },
    });
    api.config.params = {
      page: nextPage,
      per_page: 20,
      status: TABS_TYPE.POSTED,
      type_order: typeSort,
      type_post: typeMedia,
      time_range: typeDate,
    };
    await api.call();
  };

  // helper: social buttons config
  const socialButtons = [
    {
      name: 'youtube',
      icon: <Youtube className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      action: () => {
        setPlatformViewer(PLATFORM.Youtube);
      },
      status: platform['youtube'].status,
    },
    {
      name: 'instagram',
      icon: <Instagram className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      action: async () => {
        setPlatformViewer(PLATFORM.Instagram);
      },
      status: platform['instagram'].status,
    },
    {
      name: 'facebook',
      icon: <Facebook className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      action: async () => {
        setPlatformViewer(PLATFORM.Facebook);
      },
      status: platform['facebook'].status,
    },
    {
      name: 'tiktok',
      icon: <TikTok className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      action: () => {
        setPlatformViewer(PLATFORM.Tiktok);
      },
      status: platform['tiktok'].status,
    },
    {
      name: 'thread',
      icon: <Threads className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      action: () => {
        setPlatformViewer(PLATFORM.Thread);
      },
      status: platform['threads'].status,
    },
    {
      name: 'x',
      icon: <Twitter className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      action: () => {
        setPlatformViewer(PLATFORM.Twitter);
      },
      status: platform['twitter'].status,
    },
  ];

  // map IPost -> ContentItem (desktop & mobile)
  const mapToContentItem = (item: any): ContentItem => {
    const snsUploaded: SNSStatus[] = item.social_sns_description ? JSON.parse(item.social_sns_description) : [];
    return {
      id: item.id,
      type: item.type_string,
      content: isMobile ? (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 3, cursor: 'pointer' }}
          onClick={() => setDataView(item)}
        >
          {item.thumbnail ? (
            <Box sx={{ position: 'relative', width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, flex: 'none' }}>
              <Image
                src={item.thumbnail}
                width={100}
                height={100}
                style={{ objectFit: 'cover', borderRadius: 4 }}
                alt=""
              />
              {snsUploaded.some((s) => s.status === 'ERRORED') && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    px: 1.25,
                    py: 0.5,
                    bgcolor: 'rgba(39,39,39,0.6)',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption" color="#fff">
                    전송중단
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Skeleton variant="rectangular" width={100} height={100} />
          )}
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              sx={{
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: '14px',
                lineHeight: '17px',
                color: '#272727',
              }}
            >
              {item.type_string}
            </Typography>
            <Box className="flex gap-[10px] mt-[5px]">
              {item.type_string == 'blog' ? (
                <Box
                  key={`${item.type}_${item.id}`}
                  className={`rounded-full bg-[#F4F4F4] cursor-pointer`}
                  sx={{ width: { xs: 28, sm: 36 }, color: { xs: '#686868', sm: '#272727' } }}
                  onClick={() => {
                    setDataView(item);
                    setPlatformViewer(PLATFORM.Blog);
                  }}
                >
                  <Blog className={'w-7 h-7 sm:w-9 sm:h-9'} />
                </Box>
              ) : (
                snsUploaded?.map((sns) => {
                  const social = socialButtons.filter((so) => so.name == sns.title.toLowerCase())?.[0];
                  return (
                    sns.status == 'PUBLISHED' && (
                      <Box
                        key={`${sns.title}_${sns.post_id}`}
                        className={`rounded-full bg-[#F4F4F4] cursor-pointer w-7 h-7 sm:w-9 sm:h-9`}
                        sx={{ width: { xs: 28, sm: 36 }, color: { xs: '#686868', sm: '#272727' } }}
                        onClick={() => {
                          // social.action();
                          window.open(sns?.social_link, '_blank');
                        }}
                      >
                        {social?.icon}
                      </Box>
                    )
                  );
                })
              )}
            </Box>
            <Typography
              color="#686868"
              sx={{
                mt: 1,
                cursor: 'pointer',
                width: '100%',
                fontSize: '10px',
                lineHeight: '12px',
              }}
            >
              {convertDateTimeToKoreanFormat(item.created_at)}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box className="flex items-center gap-30 text-left cursor-pointer" onClick={() => setDataView(item)}>
          {item?.thumbnail ? (
            <Image
              src={item?.thumbnail}
              width={100}
              height={100}
              className="object-cover rounded-md flex-none"
              alt="image preview"
            />
          ) : (
            <Skeleton width={100} height={100} className="object-cover rounded-md flex-none" />
          )}
          <Box>
            <Typography className="uppercase font-bold text-base font-pretendard h-5 leading-[100%]" color="#272727">
              {item.type_string}
            </Typography>
            <Typography className="text-base font-pretendard line-clamp-2 mt-2.5" color="#686868">
              {![0, 1].includes(item.type) ? item?.content?.replace(/<[^>]*>/g, '') : item.description}
            </Typography>
          </Box>
        </Box>
      ),
      platform: (
        <Box className="flex gap-[10px] mt-[5px] justify-center">
          {item.type_string == 'blog' ? (
            <Box
              key={`${item.type}_${item.id}`}
              className={`text-black rounded-full bg-[#F4F4F4] cursor-pointer w-7 h-7 sm:w-9 sm:h-9`}
              onClick={() => {
                setDataView(item);
                setPlatformViewer(PLATFORM.Blog);
              }}
            >
              <Blog className={'w-7 h-7 sm:w-9 sm:h-9'} />
            </Box>
          ) : (
            snsUploaded?.map((sns) => {
              const social = socialButtons.filter((so) => so.name == sns.title.toLowerCase())?.[0];
              return (
                sns.status == 'PUBLISHED' && (
                  <Box
                    key={`${sns.title}_${sns.post_id}`}
                    className={`text-black rounded-full bg-[#F4F4F4] cursor-pointer w-7 h-7 sm:w-9 sm:h-9`}
                    onClick={() => {
                      // social.action();
                      window.open(sns?.social_link, '_blank');
                    }}
                  >
                    {social?.icon}
                  </Box>
                )
              );
            })
          )}
        </Box>
      ),
      date: (
        <Typography color="#686868" className="text-center">
          {convertDateTimeToKoreanFormat(item.created_at)}
        </Typography>
      ),
    };
  };

  // desktop columns
  const columns: ColumnDef<ContentItem>[] = [
    { header: '콘텐츠', accessorKey: 'content', className: 'max-w-[60%] text-center' },
    { header: '업로드 채널', accessorKey: 'platform', className: 'max-w-[20%] text-center justify-center' },
    {
      header: (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => setTypeSort(typeSort === 'id_asc' ? 'id_desc' : 'id_asc')}
        >
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>생성 날짜</Typography>
          <IconSort />
        </Box>
      ),
      accessorKey: 'date',
      className: 'max-w-[20%] text-center',
    },
  ];
  // Infinite scroll: lắng nghe scroll của scroll-container
  useEffect(() => {
    if (!isMobile) return;

    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Khi scroll tới gần đáy (cách đáy 100px)
      if (isLoadingRef.current || mobilePage >= mobileTotalPages) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer as HTMLElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Debounce the loadMobile call
        scrollTimeoutRef.current = setTimeout(() => {
          if (!isLoadingRef.current && mobilePage < mobileTotalPages) {
            loadMobile(mobilePage + 1);
          }
        }, 100);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobile, mobilePage, mobileTotalPages]);
  // if empty
  if (!isLoading && !postList?.total && !mobileList.length) {
    return <EmptyState label="업로드된 콘텐츠가 없습니다." />;
  }

  return (
    <Box>
      {!!dataView && (
        <PostEdit
          type={dataView?.type as CONTENT_TYPE}
          data={dataView as PostData}
          open={!!dataView}
          onClose={() => setDataView(undefined)}
          isPreview={true}
        />
      )}
      {isMobile ? (
        <Box ref={listContainerRef}>
          <MobileTable
            items={mobileList}
            selectedRows={checked}
            onSelectedRowsChange={setChecked}
            headerSx={{
              position: 'sticky',
              mt: '-46px',
              mr: '18px',
              top: 91,
              px: 3.2,
              zIndex: 100,
              width: 'fit-content',
            }}
          />
          {mobileLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      ) : (
        <>
          <CustomTable
            headerClassName="!bg-white sticky top-[87px]"
            data={postList?.data.map(mapToContentItem) || []}
            columns={columns}
            selectedRows={checked}
            onSelectedRowsChange={setChecked}
            select
            currentPage={page}
            loading={isLoading}
          />
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={postList?.total_pages}
              shape="rounded"
              page={page}
              onChange={(_e, p) => setPage(p)}
              sx={{ '& .MuiButtonBase-root': { color: '#A4A4A4' } }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Posted;

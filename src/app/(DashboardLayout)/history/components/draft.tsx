import { Box, Skeleton, Typography, useTheme, useMediaQuery, Button, Checkbox, CircularProgress } from '@mui/material';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import API from '@service/api';
import CustomTable, { ColumnDef } from '@/app/components/common/CustomTable';
import Image from 'next/image';
import { Blog, Facebook, Instagram, Threads, TikTok, Twitter, Youtube } from '@/utils/icons/socials';
import type { RootState } from '@/app/lib/store/store';
import { convertDateTimeToKoreanFormat } from '@/utils/helper/time';
import { CONTENT_TYPE } from '@/app/components/socialsPosting/socialPreview';
import { PostData } from '@/app/(DashboardLayout)/components/dashboard/AnalysVideoImg';
import { IPost, SNSStatus, TABS_TYPE } from '@/app/(DashboardLayout)/history/components/const';
import Pagination from '@mui/material/Pagination';
import { IconSort } from '@/utils/icons/icons';
import EmptyState from '@/app/(DashboardLayout)/history/components/empty';
import { uniqueId } from 'lodash';
import PostEdit from '@/app/components/socialsPosting/postEdit';
import { ContentItem } from '@/app/(DashboardLayout)/history/page';
import { useDispatch, useSelector } from 'react-redux';
import { setSnsSettingsState } from '@/app/lib/store/snsSettingsSlice';
import { PLATFORM } from '@/utils/constant';
import MobileTable from '@/app/components/common/CustomTable/mobileTable';

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

const Draft: React.FC<Props> = ({
  checked,
  setChecked,
  reload,
  typeMedia,
  typeDate,
  typeSort,
  setTypeSort,
  setPage,
  page,
  setReload,
  handleReFetch,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const platform = useSelector((state: RootState) => state.platform);
  const snsSettings = useSelector((state: RootState) => state.snsSettings);
  const listContainerRef = useRef<HTMLDivElement>(null);
  // desktop-only fetch + state
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

  // desktop: re-fetch when filters change
  useEffect(() => {
    setChecked([]);
    setPage(1);
  }, [typeMedia, typeDate, typeSort]);

  useEffect(() => {
    if (!isMobile) {
      setIsLoading(true);
      getHistoryPosted.current.config.params = {
        page: page || 1,
        per_page: 20,
        status: TABS_TYPE.DRAFT,
        type_order: typeSort,
        type_post: typeMedia,
        time_range: typeDate,
      };
      getHistoryPosted.current.call();
    }
  }, [page, typeMedia, typeDate, typeSort, reload, isMobile]);

  // common helpers
  const getSocialStatus = useCallback(
    (type: number = 0, idx: number) => {
      const list = type === 0 ? snsSettings.video : snsSettings.image;
      if (!list.length || list.every((i) => i.selected === 0)) return false;
      return list[idx].selected === 1;
    },
    [snsSettings],
  );
  const socialButtons = (type: number = 0) => [
    {
      name: 'youtube',
      link_id: PLATFORM.Youtube,
      icon: <Youtube className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      status: platform.youtube.status && getSocialStatus(type, 4),
      type: [CONTENT_TYPE.VIDEO],
    },
    {
      name: 'instagram',
      link_id: PLATFORM.Instagram,
      icon: <Instagram className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      status: platform.instagram.status && getSocialStatus(type, 1),
      type: [CONTENT_TYPE.VIDEO, CONTENT_TYPE.IMAGE],
    },
    {
      name: 'facebook',
      link_id: PLATFORM.Facebook,
      icon: <Facebook className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      status: platform.facebook.status && getSocialStatus(type, 0),
      type: [CONTENT_TYPE.VIDEO, CONTENT_TYPE.IMAGE],
    },
    {
      name: 'tiktok',
      link_id: PLATFORM.Tiktok,
      icon: <TikTok className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      status: platform.tiktok.status && getSocialStatus(type, 3),
      type: [CONTENT_TYPE.VIDEO, CONTENT_TYPE.IMAGE],
    },
    {
      name: 'thread',
      link_id: PLATFORM.Thread,
      icon: <Threads className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      status: platform.threads.status && getSocialStatus(type, 5),
      type: [CONTENT_TYPE.VIDEO, CONTENT_TYPE.IMAGE],
    },
    {
      name: 'x',
      link_id: PLATFORM.Twitter,
      icon: <Twitter className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      status: platform.twitter.status && getSocialStatus(type, 2),
      type: [CONTENT_TYPE.VIDEO, CONTENT_TYPE.IMAGE],
    },
    {
      name: 'blog',
      link_id: PLATFORM.Blog,
      icon: <Blog className={'w-7 h-7 sm:w-9 sm:h-9'} />,
      status: platform.blog.status,
      type: [CONTENT_TYPE.BLOG],
    },
  ];

  // mapping IPost -> ContentItem (reuse for both desktop & mobile)
  const mapToContentItem = (item: any): ContentItem => {
    const snsUploaded: SNSStatus[] = item.social_sns_description ? JSON.parse(item.social_sns_description) : [];
    const publishedTitles = snsUploaded.filter((p) => p.status === 'PUBLISHED').map((p) => p.title.toLowerCase());
    const enabled = socialButtons(item.type)
      .filter((s) => s.type.includes(item.type) && s.status && !publishedTitles.includes(s.name))
      .map((s) => s.link_id);
    return {
      id: item.id,
      type: item.type_string,
      snsEnable: enabled,
      snsUploaded,
      content: isMobile ? (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 3, cursor: 'pointer' }}
          onClick={() => openDetail(item, enabled)}
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
            <Box
              sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'left', cursor: 'pointer', width: '100%' }}
              onClick={() => openDetail(item, enabled)}
            >
              {enabled.map((link_id) => {
                const soc = socialButtons(item.type).find((s) => s.link_id === link_id)!;
                return (
                  <Box
                    key={link_id}
                    sx={{
                      width: { xs: 28, sm: 36 },
                      height: { xs: 28, sm: 36 },
                      bgcolor: '#EDEEEF',
                      borderRadius: '50%',
                    }}
                  >
                    {React.cloneElement(soc.icon, {
                      sx: {
                        width: { xs: 28, sm: 36 },
                        height: { xs: 28, sm: 36 },
                        color: { xs: '#686868', sm: '#272727' },
                      },
                    })}
                  </Box>
                );
              })}
            </Box>
            <Typography
              color="#686868"
              sx={{
                mt: 1,
                cursor: 'pointer',
                textAlign: 'center',
                width: '100%',
                fontSize: '10px',
                lineHeight: '12px',
              }}
              onClick={() => openDetail(item, enabled)}
            >
              {convertDateTimeToKoreanFormat(item.created_at)}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 3, cursor: 'pointer' }}
          onClick={() => openDetail(item, enabled)}
        >
          {item.thumbnail ? (
            <Box sx={{ position: 'relative', width: 100, height: 100, flex: 'none' }}>
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
            <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{item.type_string}</Typography>
            <Typography sx={{ mt: 1, color: '#686868' }} className="line-clamp-2">
              {![0, 1].includes(item.type) ? item.content.replace(/<[^>]*>/g, '') : item.description}
            </Typography>
          </Box>
        </Box>
      ),
      platform: (
        <Box
          sx={{ display: 'flex', gap: 1, mt: 0.5, justifyContent: 'center', cursor: 'pointer', width: '100%' }}
          onClick={() => openDetail(item, enabled)}
        >
          {enabled.map((link_id) => {
            const soc = socialButtons(item.type).find((s) => s.link_id === link_id)!;
            return (
              <Box key={link_id} sx={{ width: 36, height: 36, bgcolor: '#F4F4F4', borderRadius: '50%' }}>
                {React.cloneElement(soc.icon, { sx: { width: 36, height: 36, color: '#272727' } })}
              </Box>
            );
          })}
        </Box>
      ),
      date: (
        <Typography
          color="#686868"
          sx={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}
          onClick={() => openDetail(item, enabled)}
        >
          {convertDateTimeToKoreanFormat(item.created_at)}
        </Typography>
      ),
    };
  };

  // Desktop columns
  const columns: ColumnDef<ContentItem>[] = [
    { header: '콘텐츠', accessorKey: 'content', className: 'max-w-[60%] text-center' },
    { header: '업로드 가능 채널', accessorKey: 'platform', className: 'max-w-[20%] text-center' },
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

  // handle detail
  const [dataView, setDataView] = useState<PostData>();
  const openDetail = (item: any, social_list_upload: number[]) => {
    setDataView({ ...item, social_list_upload });
  };

  // ------------ MOBILE load-more logic ------------
  const [mobileList, setMobileList] = useState<ContentItem[]>([]);
  const [mobilePage, setMobilePage] = useState(1);
  const [mobileTotalPages, setMobileTotalPages] = useState(1);
  const [mobileLoading, setMobileLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadMobile = async (nextPage = 1) => {
    if (isLoadingRef.current || nextPage > mobileTotalPages) return;

    isLoadingRef.current = true;
    setMobileLoading(true);
    const api = new API(`/api/v1/maker/histories`, 'GET', {
      success: (res) => {
        const items = (res?.data as any[]).map((it) => {
          // must re-calc type & type_string
          const norm = { ...it, type: it.type === 'image' ? 1 : it.type === 'video' ? 0 : 2, type_string: it.type };
          return mapToContentItem(norm);
        });
        setMobileList((prev) => (nextPage === 1 ? items : [...prev, ...items]));
        setMobileTotalPages(res.total_pages || 1);
        setMobilePage(nextPage);
      },
      error: (e) => console.error(e),
      finally: () => {
        isLoadingRef.current = false;
        setMobileLoading(false);
      },
    });
    api.config.params = {
      page: nextPage,
      per_page: 20,
      status: TABS_TYPE.DRAFT,
      type_order: typeSort,
      type_post: typeMedia,
      time_range: typeDate,
    };
    await api.call();
  };

  // reset + reload mobile when filters/reload change
  useEffect(() => {
    if (isMobile) {
      setMobileTotalPages(1);
      setMobileList([]);
      loadMobile(1);
    }
  }, [typeMedia, typeDate, typeSort, reload, isMobile, snsSettings]);
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
  // ------------- RENDER -------------
  // empty state
  if (!isLoading && !postList?.total && !mobileList.length) {
    return (
      <Box>
        <EmptyState label="생성한 콘텐츠가 없습니다." />
      </Box>
    );
  }

  return (
    <Box>
      {!!dataView && (
        <PostEdit
          type={dataView?.type as CONTENT_TYPE}
          data={dataView as PostData}
          open={!!dataView}
          onClose={() => setDataView(undefined)}
          handleReFetch={() => {
            setReload(uniqueId());
            setChecked([]);
          }}
        />
      )}

      {isMobile ? (
        // --------- MOBILE LIST + LOAD MORE ---------
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
        // --------- DESKTOP TABLE + PAGINATION (unchanged) ---------
        <>
          <CustomTable
            headerClassName="!bg-white font-pretendard sticky top-[87px]"
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
              sx={{ '& .MuiButtonBase-root': { color: '#A4A4A4' } }}
              count={postList?.total_pages}
              shape="rounded"
              page={page}
              onChange={(_e, p) => setPage(p)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Draft;

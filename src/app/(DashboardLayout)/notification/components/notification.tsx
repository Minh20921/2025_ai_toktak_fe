'use client';
import { Box, Typography, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import API from '@service/api';
import CustomTable, { ColumnDef } from '@/app/components/common/CustomTable';
import MobileTable from '@/app/components/common/CustomTable/mobileTable';
import { convertDateTimeToKoreanFormat } from '@/utils/helper/time';
import Pagination from '@mui/material/Pagination';
import { IconSort } from '@/utils/icons/icons';
import EmptyState from '@/app/(DashboardLayout)/notification/components/empty';
import { ContentItem } from '@/app/(DashboardLayout)/notification/page';
import APIV2 from '@service/api_v2';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import { encodeUserId } from '@/utils/encrypt';

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

interface INotification {
  id: number;
  user_id: number;
  batch_id: number;
  thumbnail: string;
  images: Array<string>;
  title: string;
  subtitle: string;
  content: string;
  description: string;
  description_korea: string;
  hashtag: string;
  video_url: string;
  type: number;
  status: number;
  process_number: number;
  render_id: number;
  created_at: string;
  updated_at: string;
  social_sns_description: string;
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
}

const Notification: React.FC<Props> = ({
  checked,
  setChecked,
  reload,
  typeMedia,
  typeDate,
  typeSort,
  setTypeSort,
  page,
  setPage,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const listContainerRef = useRef<HTMLDivElement>(null);

  // desktop state
  const [postList, setPostList] = useState<IPagination<INotification[]>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getHistoryPosted = useRef(
    new APIV2(`/api/v1/notification/histories`, 'GET', {
      success: (res) => {
        setPostList({ ...res, data: res.data });
      },
      error: (err) => console.error('Failed to fetch get:', err),
      finally: () => setIsLoading(false),
    }),
  );

  // mobile states
  const [mobileList, setMobileList] = useState<ContentItem[]>([]);
  const [mobilePage, setMobilePage] = useState(1);
  const [mobileTotalPages, setMobileTotalPages] = useState(1);
  const [mobileLoading, setMobileLoading] = useState(false);
  const user_login = useSelector((state: RootState) => state.auth.user);

  // reset when filters change
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
    if (!isMobile && user_login?.id) {
      setIsLoading(true);
      getHistoryPosted.current.config.params = {
        page: page || 1,
        per_page: 20,
        type_order: typeSort,
        type_post: typeMedia,
        time_range: typeDate,
        user_id: encodeUserId(user_login?.id || 0),
      };
      getHistoryPosted.current.call();
    }
  }, [page, typeMedia, typeDate, typeSort, reload, isMobile, user_login]);

  // load mobile pages (infinite scroll)
  const loadMobile = async (nextPage = 1) => {
    if (mobileLoading || nextPage > mobileTotalPages) return;
    setMobileLoading(true);
    const api_notification_mobile = new APIV2(`/api/v1/notification/histories`, 'GET', {
      success: (res) => {
        const items: ContentItem[] = (res.data || []).map((item: INotification) => ({
          id: item.id,
          content: (
            <Box className="flex flex-col justify-center gap-2 items-start w-full">
              <Typography
                className="text-base font-pretendard mt-2.5 line-clamp-3"
                sx={{
                  wordBreak: 'break-all',
                }}
                color="#686868"
              >
                {item.title}
              </Typography>
              <Typography color="#686868" className="text-xs text-left font-pretendard">
                {convertDateTimeToKoreanFormat(item.created_at)}
              </Typography>
            </Box>
          ),
        }));
        setMobileList((prev) => (nextPage === 1 ? items : [...prev, ...items]));
        setMobileTotalPages(res.total_pages || 1);
        setMobilePage(nextPage);
      },
      error: (err) => console.error('Mobile load error:', err),
      finally: () => setMobileLoading(false),
    });
    api_notification_mobile.config.params = {
      page: nextPage,
      per_page: 20,
      type_order: typeSort,
      type_post: typeMedia,
      time_range: typeDate,
      user_id: encodeUserId(user_login?.id || 0),
    };
    api_notification_mobile.call();
  };

  // infinite scroll handler for mobile
  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMobile(mobilePage + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoading, mobilePage, mobileTotalPages]);

  const columns: ColumnDef<ContentItem>[] = [
    {
      header: '',
      accessorKey: 'content',
      className: 'max-w-[40%] text-left',
    },
    {
      header: (
        <Box
          className="flex items-left justify-left gap-2 cursor-pointer"
          onClick={() => setTypeSort(typeSort === 'id_asc' ? 'id_desc' : 'id_asc')}
        >
          <Typography className="text-sm font-bold font-pretendard">알림 상세</Typography>
          <IconSort />
        </Box>
      ),
      accessorKey: 'description_korea',
      className: 'max-w-[40%] text-left',
    },
    {
      header: (
        <Box
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setTypeSort(typeSort === 'id_asc' ? 'id_desc' : 'id_asc')}
        >
          <Typography className="text-sm font-bold font-pretendard">날짜</Typography>
          <IconSort />
        </Box>
      ),
      accessorKey: 'date',
      className: 'max-w-[20%] text-center',
    },
  ];

  // desktop data mapping
  const dataTable: ContentItem[] = (postList?.data || []).map((item) => ({
    id: item.id,
    content: (
      <Box className="flex items-center gap-30 text-left">
        <Box>
          <Typography className="text-base font-pretendard mt-2.5" color="#686868">
            {item.title}
          </Typography>
        </Box>
      </Box>
    ),
    description_korea: (
      <Box className="flex items-center gap-30 text-left">
        <Box>
          <Typography className="text-base font-pretendard mt-2.5" color="#686868">
            {item.description_korea}
          </Typography>
        </Box>
      </Box>
    ),
    date: (
      <Typography color="#686868" className="text-base font-pretendard">
        {convertDateTimeToKoreanFormat(item.created_at)}
      </Typography>
    ),
  }));

  if (!isLoading && !postList?.total && mobileList.length === 0) {
    return <EmptyState label={''} />;
  }

  return (
    <Box>
      {isMobile ? (
        <Box ref={listContainerRef}>
          <MobileTable
            items={mobileList as ContentItem[]}
            selectedRows={checked}
            onSelectedRowsChange={setChecked}
            rowSx={{
              width: '100vw',
            }}
            headerSx={{
              position: 'sticky',
              mt: '-46px',
              mr: '18px',
              top: 42,
              px: 3.2,
              zIndex: 100,
              width: 'fit-content',
              background: 'white',
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
            headerClassName="!bg-white font-pretendard sticky top-[87px]"
            data={dataTable}
            columns={columns}
            selectedRows={checked}
            onSelectedRowsChange={setChecked}
            select
            currentPage={page}
            loading={isLoading}
          />
          <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Pagination
              className="w-fit"
              sx={{
                '& .MuiButtonBase-root': {
                  color: '#A4A4A4',
                },
              }}
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

export default Notification;

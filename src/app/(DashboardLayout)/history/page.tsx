'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, IconButton, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import PrivatePost from '@/app/(DashboardLayout)/history/components/privatePost';
import TabPanel from '@/app/components/common/TabPanel';
import { IconCalender, IconMedia, IconReFetch } from '@/utils/icons/engagements';
import MuiDropdownSelect from '@/app/components/common/MuiDropdownSelect';
import { menuDate, menuMedia } from '@/app/(DashboardLayout)/history/components/const';
import CustomButton from '@/app/components/common/CustomButton';
import API from '@service/api';
import { toast } from '@/app/components/common/Toast';
import { uniqueId } from 'lodash';
import { pretendard } from '@/app/lib/fonts';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { showNotice } from '@/utils/custom/notice';
import { showNoticeMUI } from '@/app/components/common/noticeMui';
import { PLATFORM } from '@/utils/constant';
import { SNSStatus } from '@/app/(DashboardLayout)/history/components/const';
import { setSnsSettingsState } from '@/app/lib/store/snsSettingsSlice';
import { useDispatch } from 'react-redux';
import { IconTrash } from '@tabler/icons-react';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_HISTORY } from '@/utils/constant';
import dynamic from 'next/dynamic';
import AIGenerationByUserMyContent from '../ai-generation/components/AIGenerationByUserMyContent';

const Posted = dynamic(() => import('@/app/(DashboardLayout)/history/components/posted'), {
  ssr: false,
});
const Draft = dynamic(() => import('@/app/(DashboardLayout)/history/components/draft'), {
  ssr: false,
});

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export interface ContentItem {
  id: number;
  type: string;
  content: React.ReactNode;
  platform: React.ReactNode;
  date: React.ReactNode;
  snsEnable?: Array<PLATFORM> | undefined;
  snsUploaded?: SNSStatus[];
}

const History = () => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [listChecked, setListChecked] = useState<ContentItem[]>([]);
  const [typeMedia, setTypeMedia] = useState<string>('');
  const [typeDate, setTypeDate] = useState<string>('');
  const [reload, setReload] = React.useState('0');
  const [page, setPage] = React.useState(1);
  const [typeSort, setTypeSort] = useState<string>('id_desc');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // fetch SNS settings once
  const getSNSSettingsAPI = useRef(
    new API(`/api/v1/user/get-user-link-template`, 'GET', {
      success: (res) => {
        if (res.code === 200) {
          dispatch(setSnsSettingsState({ snsSettings: res.data }));
        }
      },
      error: () => { },
      finally: () => { },
    }),
  );
  useEffect(() => {
    getSNSSettingsAPI.current.call();
  }, []);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    if ([0, 1, 2, 3].includes(newValue)) {
      setActiveTab(newValue);
      handleReFetch();
      router.replace(`/history?tabIndex=${newValue}`);
    }
  };
  const handleDelete = async (list: ContentItem[]) => {
    showNotice(
      '선택한 콘텐츠를 삭제하시겠어요?',
      '삭제한 컨텐츠는 다시 복구할 수 없어요.',
      true,
      '삭제',
      '취소',
      async () => {
        const deletePost = new API('/api/v1/maker/delete_post', 'POST', {
          success: () => {
            toast.success('게시물이 성공적으로 삭제되었습니다.');
            setReload(uniqueId());
            setListChecked([]);
          },
          error: (err) => {
            console.log(err);
            toast.error(err.message);
          },
          finally: () => { },
        });
        deletePost.config.data = {
          post_ids: list?.map((item) => item.id).join(','),
        };
        await deletePost.call();
      },
    );
  };
  const checkUpload = async (list: ContentItem[]) => {
    const hasBlog = list.some((item) => item.type == 'blog');
    const listNoneBlog = list.filter((item) => item.type != 'blog');
    const uploadFailed = list.length === 1 && (list[0].snsUploaded || []).some((sns) => sns?.status === 'ERRORED');

    const uploadPost = new API('/api/v1/user/send-posts', 'POST', {
      success: (res) => {
        if (res?.code == 200) {
          router.push(`/upload?syncId=${res?.data?.sync_id}&reup=${uploadFailed ? 1 : 0}`);
        } else if (res?.code == 201) {
          showNoticeMUI(
            '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            '🎟️ 참여 방법은 도매꾹 홈페이지 톡탁 이벤트를 확인하세요. 😊',
            false,
            '확인',
            '',
            () => router.push('/profile'),
          );
        } else if (res?.code == 202) {
          showNoticeMUI(
            res?.message || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '',
            true,
            '지금 연결하기',
            '다음에',
          );
        } else {
          showNoticeMUI(res?.message, res?.data?.error_message || '', false, '확인', '');
        }
      },
      error: (err) => {
        console.log(err);
        toast.error(err.message);
      },
      finally: () => { },
    });
    uploadPost.config.data = {
      post_ids: listNoneBlog.map((item) => {
        return {
          id: item.id,
          is_all: 0,
          link_ids: item.snsEnable,
        };
      }),
    };

    if (hasBlog) {
      showNotice(
        '⚠️ 블로그는 자동으로 콘텐츠 업로드 할 수 없어요!',
        '📌 블로그를 제외하고 나머지 콘텐츠 업로드를 진행해 주세요. 😊',
        false,
        '확인',
        '',
        async () => {
          await uploadPost.call();
        },
      );
    } else {
      await uploadPost.call();
    }
  };

  const checkSNSActiveApi = useRef(
    new API(`/api/v1/user/check-sns-link`, 'POST', {
      success: async (res, dataSource) => {
        if (res?.code == 200) {
          await checkUpload(dataSource?.listChecked);
        } else if (res?.code == 201) {
          showNoticeMUI(
            '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            '🎟️ 참여 방법은 도매꾹 홈페이지 톡탁 이벤트를 확인하세요. 😊',
            false,
            '확인',
            '',
            () => router.push('/profile'),
          );
        } else if (res?.code == 202) {
          showNoticeMUI(
            res?.message || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '',
            true,
            '확인',
            '취소',
          );
        } else if (res?.code == 203) {
          showNoticeMUI(
            res?.data?.message_title || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '',
            true,
            '확인',
            '취소',
          );
        } else if (res?.code == 203) {
          showNoticeMUI(
            res?.data?.message_title || '⚠️ 쿠폰 등록 후 업로드를 할 수 있어요!',
            res?.data?.error_message || '',
            true,
            '지금 연결하기',
            '다음에',
          );
        } else {
          showNoticeMUI(res?.message, res?.data?.error_message || '', false, '확인', '');
        }
      },
      error: (err) => {
        console.error('Failed to fetch posts:', err);
      },
    }),
  );

  const handleUpload = async () => {
    const isAnySNSConnected = listChecked.some((item) => !!item?.snsEnable?.length);
    const hasBlogItem = listChecked.some((item) => item.type === 'blog');

    // Trường hợp không có SNS nào được kết nối
    if (!isAnySNSConnected) {
      return showNotice(
        '아직 SNS 연결 전이에요😢 </br> 지금 계정 연동하고 업로드 해보세요!',
        '설정에서 SNS 계정을 먼저 연결해 주세요. 😊',
        true,
        '지금 연결하기',
        '다음에',
        async () => router.push('/profile'),
      );
    }

    // Nếu có kết nối SNS nhưng có blog
    if (hasBlogItem) {
      return showNotice(
        '⚠️ 블로그는 자동으로 콘텐츠 업로드 할 수 없어요!',
        '📌 블로그를 제외하고 나머지 콘텐츠 업로드를 진행해 주세요. 😊',
        false,
        '확인',
        '',
        async () => {
          const itemsExcludingBlog = listChecked.filter((item) => item.type !== 'blog');

          if (itemsExcludingBlog.length > 0) {
            if (itemsExcludingBlog.some((item) => item.snsEnable?.length)) {

              await checkSNSActiveApi.current.call({ listChecked: itemsExcludingBlog });
            } else {
              showNotice(
                '아직 SNS 연결 전이에요😢 </br> 지금 계정 연동하고 업로드 해보세요!',
                '설정에서 SNS 계정을 먼저 연결해 주세요. 😊',
                true,
                '지금 연결하기',
                '다음에',
                async () => router.push('/profile'),
              );
            }
          }
        },
      );
    }

    const listIds = listChecked.map(item => item.id);
    // Trường hợp bình thường: có SNS và không có blog
    checkSNSActiveApi.current.config.data = {
      listIds: listIds,
    };
    await checkSNSActiveApi.current.call({ listChecked });
  };
  const handleReFetch = () => {
    setTypeMedia('');
    setTypeDate('');
    setPage(1);
    setTypeSort('id_desc');
    setListChecked([]);
  };

  useEffect(() => {
    const tabIndex = parseInt(searchParams.get('tabIndex') || '0');
    if (tabIndex) {
      setActiveTab(tabIndex);
    } else {
      setActiveTab(0);
    }
  }, [searchParams.get('tabIndex')]);

  // useEffect(() => {
  //   router.replace(`/history?tabIndex=${activeTab}`);
  // }, [activeTab]);

  return (
    <Box
      sx={{
        px: { xs: 0, sm: 5 },
        py: { xs: 5, sm: 3.75 },
        fontFamily: pretendard.style.fontFamily,
      }}
    >
      <SeoHead {...SEO_DATA_HISTORY} />
      {/* Title */}
      <Box
        component="h1"
        sx={{
          position: { xs: 'sticky', sm: 'static' },
          top: 0,
          zIndex: 40,
          lineHeight: { xs: '19x', sm: '36px' },
          fontSize: { xs: '16px', sm: '30px' },
          mt: 0.5,
          mb: 0.25,
          py: { xs: '14px', sm: 0 },
          fontWeight: 700,
          textAlign: { xs: 'center', sm: 'left' },
          color: '#090909',
          bgcolor: 'white',
        }}
      >
        내 콘텐츠
      </Box>

      <Box sx={{ position: 'relative', pb: { xs: 8, sm: 0 } }}>
        {/* Sticky Tabs + Actions */}
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
            onChange={handleChange}
            aria-label="tab-create"
            indicatorColor="primary"
            textColor="inherit"
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                padding: { xs: '0px 20px', sm: '0px 20px 8px' },
                fontSize: { xs: '14px', sm: '18px' },
                fontWeight: { xs: 500, sm: 600 },
                lineHeight: '100%',
                textTransform: 'none',
                color: '#A4A4A4',
                fontFamily: pretendard.style.fontFamily,
                minHeight: '45px',
              },
              '& .Mui-selected': {
                color: '#272727',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#272727',
              },
              '& .MuiTabs-flexContainer': {
                borderBottom: '2px solid #F1F1F1',
              },
            }}
          >
            <Tab label="게시됨" {...a11yProps(0)} />
            <Tab label="예약됨" {...a11yProps(1)} />
            <Tab label="임시저장" {...a11yProps(2)} />
            <Tab label="AI 콘텐츠" {...a11yProps(3)} />
          </Tabs>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1.5 },
              mt: { xs: 1, sm: '-50px' },
              pl: '180px',
              pb: { xs: 1, sm: '14px' },
            }}
          >
            {/* ReFetch */}
            <IconButton
              onClick={handleReFetch}
              disabled={activeTab === 1}
              sx={{
                width: { xs: 28, sm: 40 },
                height: { xs: 28, sm: 40 },
                color: '#6A6A6A',
                borderRadius: { xs: 0, sm: '10px' },
                '&:hover': { backgroundColor: '#F6F7F9' },
                visibility: activeTab === 1 ? 'hidden' : 'visible',
              }}
            >
              <IconReFetch className="w-3 sm:w-5 h-3 sm:h-5" />
            </IconButton>

            {/* Media Filter */}
            <MuiDropdownSelect
              value={typeMedia}
              onChange={setTypeMedia}
              renderButton={({ selectedOption, onClick, isOpen }) => (
                <Button
                  onClick={onClick}
                  startIcon={<IconMedia className="w-3 sm:w-5 h-3 sm:h-5" />}
                  sx={{
                    fontSize: { xs: '11px', sm: '12px' },
                    fontWeight: 600,
                    fontFamily: pretendard.style.fontFamily,
                    height: { xs: 28, sm: 40 },
                    px: { xs: 1, sm: 2 },
                    borderRadius: { xs: '6px', sm: '10px' },
                    color: '#6A6A6A',
                    backgroundColor: isOpen ? '#F6F7F9' : 'transparent',
                    '&:hover': { backgroundColor: '#F6F7F9' },
                    visibility: activeTab === 1 ? 'hidden' : 'visible',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {!selectedOption?.value ? '종류' : selectedOption?.label}
                </Button>
              )}
              options={activeTab !== 2 ? menuMedia.filter((m) => m.value !== 'error_blog') : menuMedia}
            />

            {/* Date Filter */}
            <MuiDropdownSelect
              value={typeDate}
              onChange={setTypeDate}
              renderButton={({ selectedOption, onClick, isOpen }) => (
                <Button
                  onClick={onClick}
                  startIcon={<IconCalender className="w-3 sm:w-5 h-3 sm:h-5" />}
                  sx={{
                    fontSize: { xs: '11px', sm: '12px' },
                    fontWeight: 600,
                    fontFamily: pretendard.style.fontFamily,
                    height: { xs: 28, sm: 40 },
                    px: { xs: 1, sm: 2 },
                    borderRadius: { xs: '6px', sm: '10px' },
                    color: '#6A6A6A',
                    backgroundColor: isOpen ? '#F6F7F9' : 'transparent',
                    '&:hover': { backgroundColor: '#F6F7F9' },
                    visibility: activeTab === 1 ? 'hidden' : 'visible',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {!selectedOption?.value ? '기간' : selectedOption?.label}
                </Button>
              )}
              options={menuDate}
            />

            {/* Delete */}
            <Button
              variant="outlined"
              onClick={() => handleDelete(listChecked)}
              disabled={listChecked.length === 0}
              sx={{
                height: { xs: 28, sm: 40 },
                px: '13px',
                py: { xs: 1, sm: 2 },
                fontSize: { xs: '11px', sm: '12px' },
                fontWeight: 600,
                lineHeight: '100%',
                borderColor: '#E7E7E7',
                color: '#6A6A6A',
                borderRadius: { xs: '6px', sm: '10px' },
                '&:hover': { backgroundColor: '#F6F7F9' },
                visibility: activeTab === 1 ? 'hidden' : 'visible',
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0, sm: 1 },
                whiteSpace: 'nowrap',
              }}
              startIcon={<IconTrash className="w-3 sm:w-5 h-3 sm:h-5" />}
            >
              삭제
            </Button>

            {/* Upload */}
            {activeTab !== 0 &&
              (isMobile && listChecked.some((item) => !!item?.snsEnable?.length) ? (
                <Box
                  sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    p: '10px 18px 20px',
                    width: '100%',
                    zIndex: 99,
                    bgcolor: 'white',
                  }}
                >
                  <CustomButton
                    variant="contained"
                    onClick={handleUpload}
                    disabled={!listChecked.some((item) => !!item?.snsEnable?.length)}
                    sx={{
                      height: 50,
                      width: '100%',
                      px: 2,
                      fontSize: '16px',
                      fontWeight: 500,
                      fontFamily: pretendard.style.fontFamily,
                      borderRadius: '6px',
                      visibility: activeTab === 1 ? 'hidden' : 'visible',
                    }}
                  >
                    콘텐츠 업로드
                  </CustomButton>
                </Box>
              ) : (
                <CustomButton
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!listChecked.some((item) => !!item?.snsEnable?.length)}
                  sx={{
                    height: 40,
                    px: 2,
                    fontSize: { xs: '11px', sm: '12px' },
                    fontWeight: 600,
                    fontFamily: pretendard.style.fontFamily,
                    borderRadius: { xs: '6px', sm: '10px' },
                    display: activeTab === 1 || isMobile ? 'none' : 'block',
                  }}
                >
                  콘텐츠 업로드
                </CustomButton>
              ))}
          </Box>
        </Box>

        {/* Content Panels */}
        <TabPanel value={activeTab} index={0}>
          <Posted
            checked={listChecked}
            setChecked={setListChecked}
            typeMedia={typeMedia}
            typeDate={typeDate}
            reload={reload}
            handleReFetch={handleReFetch}
            typeSort={typeSort}
            setTypeSort={setTypeSort}
            page={page}
            setPage={setPage}
            setReload={setReload}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <PrivatePost />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Draft
            checked={listChecked}
            setChecked={setListChecked}
            typeMedia={typeMedia}
            typeDate={typeDate}
            reload={reload}
            handleReFetch={handleReFetch}
            typeSort={typeSort}
            setTypeSort={setTypeSort}
            page={page}
            setPage={setPage}
            setReload={setReload}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <AIGenerationByUserMyContent />
        </TabPanel>
      </Box>
    </Box>
  );
};
export default History;

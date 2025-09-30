'use client';
import React, { use, useState } from 'react';
import { Box, Button, IconButton, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import TabPanel from '@/app/components/common/TabPanel';
import { IconCalender, IconReFetch } from '@/utils/icons/engagements';
import MuiDropdownSelect from '@/app/components/common/MuiDropdownSelect';
import { menuDate } from '@/app/(DashboardLayout)/notification/components/const';
import API from '@service/api';
import { toast } from '@/app/components/common/Toast';
import { uniqueId } from 'lodash';
import { pretendard } from '@/app/lib/fonts';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Notification from '@/app/(DashboardLayout)/notification/components/notification';
import { IconTrash } from '@tabler/icons-react';
import { ContentItem } from '@/app/(DashboardLayout)/history/page';
import { showNotice } from '@/utils/custom/notice';
import APIV2 from '@service/api_v2';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import { encodeUserId } from '@/utils/encrypt';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_NOTIFICATION } from '@/utils/constant';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const Notion = () => {
  const router = useRouter();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [listChecked, setListChecked] = useState<ContentItem[]>([]);
  const [typeMedia, setTypeMedia] = useState<string>('');
  const [typeDate, setTypeDate] = useState<string>('');
  const [reload, setReload] = React.useState(uniqueId());
  const [page, setPage] = React.useState(1);
  const [typeSort, setTypeSort] = useState<string>('id_desc');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const user_login = useSelector((state: RootState) => state.auth.user);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if ([0, 1, 2].includes(newValue)) {
      setActiveTab(newValue);
      handleReFetch();
    }
  };
  const handleDelete = async (list: ContentItem[]) => {
    showNotice('선택한 콘텐츠를 삭제하시겠어요?', '삭제한 컨텐츠는 다시 복구할 수 없어요.', true, '삭제', '취소', async () => {
      const deleteNotification = new APIV2('/api/v1/notification/delete_notification', 'POST', {
        success: () => {
          toast.success('알림이 삭제되었습니다.');
          setReload(uniqueId());
          setListChecked([]);
        },
        error: (err) => {
          toast.error(err.message);
        },
        finally: () => {
        },
      });
      deleteNotification.config.data = {
        user_id: encodeUserId(user_login?.id || 0),
        post_ids: list?.map((item) => item.id).join(','),
      };
      await deleteNotification.call();
    });
  };

  const handleReFetch = () => {
    setTypeMedia('');
    setTypeDate('');
    setPage(1);
    setTypeSort('id_desc');
    setListChecked([]);
  };
  return (
    <Box
      sx={{
        px: { xs: 0, sm: 5 },
        py: { xs: 5, sm: 3.75 },
        fontFamily: pretendard.style.fontFamily,
      }}
    >
      <SeoHead {...SEO_DATA_NOTIFICATION} />
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
        알림
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
              display: { xs: 'none', sm: 'block' },
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
            <Tab label="전체 알림" {...a11yProps(0)} />
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
            <Button
              onClick={() => handleDelete(listChecked)}
              className={`h-10 border-[#E7E7E7] border-2 text-[#6A6A6A] rounded-[10px] px-[13px] py-2 text-xs font-semibold leading-[100%] disabled:border-2 ${activeTab == 1 && 'invisible'}`}
              startIcon={<IconTrash className="w-3 sm:w-5 h-3 sm:h-5" />}
            >
              삭제
            </Button>
          </Box>
        </Box>

        {/* Content Panels */}
        <TabPanel value={activeTab} index={0}>
          <Notification
            checked={listChecked}
            setChecked={(value) => setListChecked(value)}
            typeMedia={typeMedia}
            typeDate={typeDate}
            reload={reload}
            handleReFetch={handleReFetch}
            typeSort={typeSort}
            setTypeSort={setTypeSort}
            page={page}
            setPage={setPage}
          />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Notion;

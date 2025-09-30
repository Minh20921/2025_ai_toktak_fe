'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@service/api';
import { Box, Button } from '@mui/material';
import SelectCustom from '../../components/common/Select';

const Created = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [totalVideo, setTotalVideo] = useState(0);
  const [videoList, setVideoList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const TABS = ['게시됨', '예약됨', '임시저장'];

  const getBatchAPI = useRef(
    new API(`/api/v1/maker/batchs?page=1&per_page=40`, 'GET', {
      success: (res) => {
        const data = res?.data;
        setTotalVideo(res?.total);
        if (data) {
          setVideoList(data);
        }
      },
      error: (err) => console.error('Failed to fetch get:', err),
      finally: () => {
        // setLoading(false);
      },
    }),
  );

  useEffect(() => {
    getBatchAPI.current.call();
  }, []);

  return (
    <Box className="font-pretendard">
      <h1 className="text-ld text-4xl mt-[60px]">내 콘텐츠</h1>

      <Box className="mt-[50px] flex gap-[10px] border-b-[2px] border-b-[#F1F1F1]">
        {TABS.map((tab: string, index: number) => (
          <Box
            key={`created_tab_${index}`}
            className={`px-[10px] py-[10px] text-[24px] font-bold mb-[-2px]`}
            style={activeTab === index ? { color: '#272727', borderBottom: 'solid 3px #272727' } : { color: '#A4A4A4' }}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </Box>
        ))}
      </Box>
      <Box className="flex justify-between items-center mt-[30px]">
        <Box className="flex gap-[10px]">
          <Box className="h-[20px] w-[20px] rounded-[4px] border-[1px] border-[#DEE2E6]" />
          <Box className="text-[16px] text-[#6B6B6B] font-medium">{`전체 ${totalVideo}개`}</Box>
        </Box>
        <Box className="flex gap-[10px]">
          <SelectCustom value={1} options={[{ value: 1, label: '종류' }]} />
          <SelectCustom value={1} options={[{ value: 1, label: '전체 기간' }]} />
          <SelectCustom value={1} options={[{ value: 1, label: '최신순' }]} />
        </Box>
      </Box>
      <div className="grid grid-flow-row grid-cols-4 gap-[60px] mt-[20px]">
        {videoList.map((video, index) => {
          return (
            <div
              key={index}
              onClick={() => router.push(`/analys?batchId=${video.id}`)}
              className="flex flex-col cursor-pointer"
            >
              <img src={video?.thumbnail} className="w-[315px] h-[559px] object-cover rounded-[20px]" />
              {/* <h1 className="mt-[20px] whitespace-nowrap text-ellipsis">{video?.content}</h1> */}
              <h1 className="mt-[20px] text-[#CBCBCB]">{video?.created_at}</h1>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

export default Created;

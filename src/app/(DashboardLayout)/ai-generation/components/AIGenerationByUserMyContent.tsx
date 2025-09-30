import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import CardLoading from './cards/CardLoading';
import CardFaild from './cards/CardFaild';
import { aiGenerationAPI } from '../api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import Image from 'next/image';
import { AiGenerationItem } from '../@type/interface';
import IconBell from '@/../public/images/generation/bell.png';
import DialogViewDetailByUser from './dialog/DialogViewDetailByUser';
import iconDownload from '@/../public/images/generation/iconDownload.png';
import iconRemove from '@/../public/images/generation/iconRemove.png';
import iconExpand from '@/../public/images/generation/iconExpand.png';

interface IAIAIGenerationByUserMyContent {}
const AIGenerationByUserMyContent = ({}: IAIAIGenerationByUserMyContent) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [openDetail, setOpenDetail] = useState<AiGenerationItem | null>(null);
  const [dataListByUser, setDataListByUser] = useState<any[]>([]);
  // Gom nhóm theo ngày
  const groupByDate = (data: any[]) => {
    const groupedData = _.groupBy(data, (item) => {
      const date = new Date(item.created_at);
      return date.toISOString().split('T')[0];
    });
    const sortedDates = _.orderBy(Object.keys(groupedData), (d) => new Date(d), 'desc');
    return sortedDates.map((date) => ({
      date,
      data: groupedData[date],
    }));
  };
  const fetchInitial = async (user_id: number) => {
    try {
      const [resList] = await Promise.all([aiGenerationAPI.getListAiGenerationByUser({ user_id })]);
      const list = resList.data.data || [];
      setDataListByUser(groupByDate(list));
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };
  useEffect(() => {
    if (!user?.id) return;
    fetchInitial(user.id);
  }, [user?.id]);
  const handleDelete = async (id: number) => {
    try {
      const res = await aiGenerationAPI.deleteListAiGenerationByUser({ id, user_id: user?.id as number });
      if (res.code == 200) {
        if (user?.id) {
          fetchInitial(user.id);
        }
      }
    } catch (error) {
      console.error('delete error:', error);
    }
  };

  return (
    <Box>
      {dataListByUser.length > 0 ? (
        dataListByUser?.map((group) => {
          const mergedData = group.data;
          return (
            <Box key={group.date} className="mb-10">
              {/* Label ngày */}
              <Typography className="text-[14px] text-[#A4A4A4] mb-[24px]">{group.date}</Typography>

              {/* Grid ảnh */}
              <Box className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
                {mergedData.map((item: any) => {
                  if (item.status === 'pending') {
                    return <CardLoading key={item.task_id} task={item} />;
                  }
                  if (item.status === 'failed') {
                    return <CardFaild key={item.id ?? item.task_id} task={item} handleDelete={handleDelete} />;
                  }
                  return (
                    <div
                      key={item.id}
                      className="group relative w-full h-[405px] rounded-[15px] overflow-hidden cursor-pointer"
                    >
                      {item?.type?.toLowerCase().includes('video') ? (
                        <video
                          onClick={() => {
                            setOpenDetail(item);
                          }}
                          src={item.url}
                          controls
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Image
                          onClick={() => {
                            setOpenDetail(item);
                          }}
                          fill
                          src={item?.thumbnail_url as string}
                          alt="img"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div
                        className="absolute right-[10px] top-[10px] flex gap-[4px] 
                                                                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <a href={item.url} download onClick={(e) => e.stopPropagation()}>
                          <Image className="cursor-pointer" src={iconDownload} alt="iconDownload" />
                        </a>
                        <Image
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="cursor-pointer"
                          src={iconRemove}
                          alt="iconRemove"
                        />
                        <Image
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDetail(item);
                          }}
                          className="cursor-pointer"
                          src={iconExpand}
                          alt="iconExpand"
                        />
                      </div>
                      <div
                        className="absolute inset-0 
                                        bg-[linear-gradient(180deg,rgba(0,0,0,0)_72.22%,#000000_100%)] 
                                        opacity-0 group-hover:opacity-70 transition-opacity duration-300 
                                        pointer-events-none"
                      />
                      <div
                        className="absolute inset-0 rounded-[15px] 
                                        border-0 group-hover:border-[2px] 
                                        group-hover:border-[#4776EF] 
                                        group-hover:shadow-[0_0_25px_0_#0000004D] 
                                        transition-all duration-300 pointer-events-none"
                      />
                    </div>
                  );
                })}
              </Box>
            </Box>
          );
        })
      ) : (
        <Box className="h-[500px] flex items-center justify-center mb-[24px] mt-[-60px] overflow-hidden">
          <Box>
            <Image src={IconBell} alt="img" />
            <Typography className="text-[21px] text-[#090909] mb-[2px] mt-[-60px] text-center font-semibold">
              생성된 콘텐츠가 없습니다.
            </Typography>
          </Box>
        </Box>
      )}

      <DialogViewDetailByUser
        open={Boolean(openDetail?.id)}
        task={openDetail}
        handleClose={() => {
          setOpenDetail(null);
        }}
      />
    </Box>
  );
};

export default AIGenerationByUserMyContent;

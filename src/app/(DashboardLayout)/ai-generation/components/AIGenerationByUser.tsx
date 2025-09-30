import { Box, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import CardLoading from './cards/CardLoading';
import CardFaild from './cards/CardFaild';
import { aiGenerationAPI } from '../api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/store/store';
import Image from 'next/image';
import { AiGenerationItem, AiGenerationPayload } from '../@type/interface';
import IconBell from '@/../public/images/generation/bell.png';
import iconDownload from '@/../public/images/generation/iconDownload.png';
import iconRemove from '@/../public/images/generation/iconRemove.png';
import iconExpand from '@/../public/images/generation/iconExpand.png';
import Loading from './Loading';

interface IAIGenerationByUser {
  setOpenDetail: Dispatch<SetStateAction<AiGenerationItem | null>>;
}
const AIGenerationByUser = ({ setOpenDetail }: IAIGenerationByUser) => {
  const needRefresh = useSelector((state: RootState) => state.generationAi.needRefresh);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log('needRefresh', needRefresh);
  const [dataListByUser, setDataListByUser] = useState<any[]>([]);
  const [dataQueryByUser, setDataQueryByUser] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const [resQuery, resList] = await Promise.all([
        aiGenerationAPI.queryAiGenerationByUser({ user_id }),
        aiGenerationAPI.getListAiGenerationByUser({ user_id }),
      ]);
      const now = Date.now();
      const list = resList.data.data || [];
      let query = normalizeQueryData(resQuery.data || []);

      setDataListByUser(groupByDate(list));
      query = query.map((item: any) => {
        const createdAt = new Date(item.created_at).getTime();
        if (item.status === 'pending' && now - createdAt >= 6 * 60 * 1000) {
          return { ...item, status: '', error: 'Timeout after 6 minutes' };
        }
        return item;
      });
      setDataQueryByUser(query);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };
  const normalizeQueryData = (data: any[]) => {
    return data.map((item) => {
      if (item.message) {
        // pending case
        return {
          task_id: item.message.task_id,
          user_id: Number(item.message.user_id),
          type: item.message.payload?.type,
          description: item.message.payload?.description,
          prompt: item.message.payload?.prompt,
          duration: item.message.payload?.duration,
          status: item.message.status,
          created_at: item.message.created_at || Date.now(),
        };
      }
      return item;
    });
  };
  useEffect(() => {
    if (!user?.id) return;
    fetchInitial(user.id);
    const interval = setInterval(async () => {
      try {
        const resQuery = await aiGenerationAPI.queryAiGenerationByUser({ user_id: user.id });
        let query = normalizeQueryData(resQuery.data || []);
        const now = Date.now();
        query = query.map((item: any) => {
          const createdAt = new Date(item.created_at).getTime();
          if (item.status === 'pending' && now - createdAt >= 6 * 60 * 1000) {
            return { ...item, status: '', error: 'Timeout after 6 minutes' };
          }
          return item;
        });
        const stillPending = query.filter((item: any) => item.status === 'pending');
        const finished = query.filter((item: any) => item.status !== 'pending');
        if (finished.length > 0) {
          const resList = await aiGenerationAPI.getListAiGenerationByUser({ user_id: user.id });
          setDataListByUser(groupByDate(resList.data.data || []));
        }
        setDataQueryByUser(stillPending);
        // chỉ dừng khi chắc chắn ko còn pending
        if (stillPending.length === 0) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user?.id, needRefresh]);

  const today = new Date().toISOString().split('T')[0];
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
  const handleUpdate = async (item: AiGenerationPayload) => {
    try {
      const res = await aiGenerationAPI.updateAiGenerationByUser({ ...item });
      if (res.code == 200) {
        if (user?.id) {
          fetchInitial(user.id);
        }
      }
    } catch (error) {
      console.error('delete error:', error);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <Box>
      {dataListByUser.length > 0 ? (
        dataListByUser?.map((group) => {
          // nếu là hôm nay thì merge thêm pending
          const mergedData = group.date === today ? [...dataQueryByUser, ...group.data] : group.data;
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
                    return (
                      <CardFaild
                        key={item.id ?? item.task_id}
                        task={item}
                        handleDelete={handleDelete}
                        handleUpdate={handleUpdate}
                      />
                    );
                  }
                  if (item.status === 'success' && !item.task_id) {
                    return (
                      <div
                        key={item.id}
                        className="group relative w-full h-[405px] rounded-[15px] overflow-hidden cursor-pointer"
                      >
                        {item?.type?.toLowerCase().includes('video') ? (
                          <video
                            onClick={() => setOpenDetail(item)}
                            src={item.url}
                            controls
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Image
                            onClick={() => setOpenDetail(item)}
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
                  }
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
    </Box>
  );
};

export default AIGenerationByUser;

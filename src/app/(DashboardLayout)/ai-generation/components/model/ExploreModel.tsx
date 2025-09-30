import { Box, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import iconBell from '@/../public/images/generation/bell.png';
import Image from 'next/image';
import { VideoImageAITemplate } from '../../@type/interface';
import { RootState } from '@/app/lib/store/store';
import { useSelector } from 'react-redux';
import { aiGenerationAPI } from '../../api/api';
import Loading from '../Loading';
interface IExploreModel {
  setFile: Dispatch<SetStateAction<File | null | string>>;
  onClose: () => void;
}
const ExploreModel = ({ setFile, onClose }: IExploreModel) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<VideoImageAITemplate[]>([]);
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await aiGenerationAPI.getListAiGenerationByUser({
        user_id: user?.id as number,
        type: 'prompt_to_image',
      });
      setTemplates(res?.data?.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.id) fetchTemplates();
  }, [user?.id]);
  // if (loading) {
  //   return <Loading />;
  // }
  return (
    <>
      {templates?.length > 0 ? (
        <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-10">
          {templates.map((item) => (
            <div
              onClick={() => {
                setFile(item.url as string);
                onClose();
              }}
              key={item.id}
              className="group relative w-full aspect-[3/5] rounded-[15px] overflow-hidden cursor-pointer"
            >
              <img
                src={item.thumbnail_url}
                alt={`Image ${item.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_72.22%,#000000_100%)] 
              opacity-0 group-hover:opacity-70 transition-opacity duration-300"
              />
              <div
                className="absolute inset-0 rounded-[15px] 
              border-0 group-hover:border-[5px] group-hover:border-[#4776EF] 
              group-hover:shadow-[0_0_25px_0_#0000004D] 
              transition-all duration-300 pointer-events-none"
              />
            </div>
          ))}
        </Box>
      ) : (
        <Box className="h-[600px] flex items-center justify-center text-gray-500 mt-10">
          <div className="relative">
            <Image src={iconBell} alt="iconBell" />
            <Typography className="w-[200px] text-center absolute bottom-[40px] left-1/2 transform -translate-x-1/2">
              생성된 콘텐츠가 없습니다.
            </Typography>
          </div>
        </Box>
      )}
    </>
  );
};

export default ExploreModel;

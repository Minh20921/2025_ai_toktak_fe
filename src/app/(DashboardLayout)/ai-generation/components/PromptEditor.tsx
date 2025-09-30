import { UpDownIcon } from '@/utils/icons/icons';
import { Box, Button, Popover, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import iconLight from '@/../public/images/generation/light.png';
import iconCreateMobile from '@/../public/images/generation/Create-Button.png';
import iconPhone from '@/../public/images/generation/Frame 1948757863.png';
import iconClock from '@/../public/images/generation/Frame.png';
import iconTemplate from '@/../public/images/generation/template.png';
import iconUploads from '@/../public/images/generation/uploads.png';
import icon9_16 from '@/../public/images/generation/9-16.png';
import icon1_1 from '@/../public/images/generation/1-1.png';
import icon16_9 from '@/../public/images/generation/16-9.png';
import iconRemove from '@/../public/images/generation/remove.png';
import Image, { StaticImageData } from 'next/image';
import DialogChangeFormEditor from './dialog/DialogChangeFormEditor';
import { RootState } from '@/app/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { aiGenerationAPI } from '../api/api';
import { AiGenerationPayload } from '../@type/interface';
import { refreshAi } from '@/app/lib/store/generationAiSlice';

interface IPromptEditor {
  className?: string;
  prompt: string | null;
  setPrompt: Dispatch<SetStateAction<string | null>>;
  changeTab?: Dispatch<SetStateAction<number>>;
  tab?: number;
}
const dataUpload = [
  { value: 1, icon: iconTemplate, label: 'AI 콘텐츠에서 선택하기' },
  { value: 2, icon: iconUploads, label: '내 기기에서 업로드하기' },
];
const dataChooseOption = [
  { value: 1, label: '이미지' },
  { value: 2, label: '비디오' },
];
const dataRatioOption = [
  { value: 1, icon: icon9_16, label: '9:16' },
  { value: 2, icon: icon1_1, label: '1:1' },
  { value: 3, icon: icon16_9, label: '16:9' },
];
const dataDuration = [
  { value: 1, label: '5s' },
  { value: 2, label: '8s' },
  { value: 3, label: '10s' },
];
const dataDurationV2 = [{ value: 1, label: '8s' }];
const PromptEditor = ({ className, prompt, setPrompt, changeTab = () => {}, tab = 0 }: IPromptEditor) => {
  const needRefresh = useSelector((state: RootState) => state.generationAi.needRefresh);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [anchorChoose, setAnchorChoose] = useState<HTMLButtonElement | null>(null);
  const [anchorRatio, setAnchorRatio] = useState<HTMLButtonElement | null>(null);
  const [anchorDuration, setAnchorDuration] = useState<HTMLButtonElement | null>(null);

  const [selectedUpload, setSelectedUpload] = useState<number | null>(null);
  const [selectedChoose, setSelectedChoose] = useState<number>(1);
  const [selectedRatio, setSelectedRatio] = useState<number>(1);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [file, setFile] = useState<File | null | string>(null);
  const [fileCheck, setFileCheck] = useState<boolean>(false);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  console.log('fileCheck', fileCheck);
  useEffect(() => {
    if (!file) {
      setFileCheck(false);
      return;
    }
    const img = new window.Image();
    if (typeof file === 'string') {
      img.src = file;
    } else {
      img.src = URL.createObjectURL(file);
    }
    img.onload = () => {
      if (img.width < 300 || img.height < 300) {
        setFileCheck(true);
      } else {
        setFileCheck(false);
      }
    };
    return () => {
      if (typeof file !== 'string') {
        URL.revokeObjectURL(img.src);
      }
    };
  }, [file]);

  const open = Boolean(selectedUpload);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseChoose = () => {
    setAnchorChoose(null);
  };
  const handleCloseRatio = () => {
    setAnchorRatio(null);
  };
  const handleCloseDuration = () => {
    setAnchorDuration(null);
  };
  useEffect(() => {
    if (file) {
      setSelectedChoose(2);
    }
  }, [file]);
  const handleCreateAI = async () => {
    try {
      let payload: AiGenerationPayload = {
        user_id: user?.id,
        type: 'prompt_to_image',
        prompt: '',
        description: 'prompt',
        ratio: '',
      };
      if (prompt && file && selectedChoose === 2) {
        payload = {
          user_id: user?.id,
          type: 'image_to_video',
          description: 'prompt',
          prompt: prompt,
          image: file,
          image_url: file,
          duration: selectedDuration === 1 ? 5 : 10,
        };
      } else if (prompt && !file && selectedChoose === 2) {
        payload = {
          user_id: user?.id,
          type: 'prompt_to_video',
          description: 'prompt',
          prompt: prompt,
          duration: 8,
        };
      } else if (prompt) {
        payload = {
          user_id: user?.id,
          type: 'prompt_to_image',
          description: 'prompt',
          ratio: dataRatioOption.find((item) => item.value === selectedRatio)?.label || '',
          prompt: prompt,
        };
      }
      console.log('payload', payload);
      if (tab === 0) {
        await aiGenerationAPI.createAiGenerationByUser(payload).then((res) => {
          console.log('res', res);
          changeTab(1);
          setPrompt('');
          setFile(null);
        });
      } else {
        await aiGenerationAPI.createAiGenerationByUser(payload).then((res) => {
          console.log('res', res);
          dispatch(refreshAi({ needRefresh: !needRefresh }));
          setPrompt('');
          setFile(null);
        });
      }
    } catch (error) {}
  };
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto'; // reset để tính lại
      el.style.height = el.scrollHeight + 'px'; // set theo nội dung
    }
    setPrompt(e.target.value);
  };
  return (
    <Box className={`${className}`}>
      <Box
        id="productUrl"
        className="bg-white mx-auto w-full max-w-[891px] px-3 py-[5px] rounded-[24px] sm:rounded-[24px] pb-3
         md:rounded-[24px] flex flex-col border-[1px] border-[#F5F5F5]"
        style={{ boxShadow: '0px 4.11px 30.84px 0px #0000001A' }}
      >
        <Box
          component="div"
          sx={{
            transform: { xs: 'scale(0.75)', sm: 'scale(1)' },
            transformOrigin: { xs: '0 0', sm: '0 0' },
            width: { xs: '133.33%', sm: '100%' },
          }}
        >
          {file && (
            <Box className="relative inline-block">
              <Image
                className="rounded-[15px] ml-[12px] mt-[18px]"
                width={100}
                height={100}
                src={
                  typeof file === 'string'
                    ? file // nếu là string URL thì dùng trực tiếp
                    : URL.createObjectURL(file) // nếu là File/Blob thì tạo objectURL
                }
                alt="img"
              />
              <Image
                className="absolute top-[24px] right-1 cursor-pointer"
                onClick={() => {
                  setFile(null);
                  setFileCheck(false);
                }}
                src={iconRemove}
                alt="iconRemove"
              />
            </Box>
          )}
          <textarea
            rows={1}
            ref={textareaRef}
            value={prompt || ''}
            onChange={handleChange}
            placeholder="프롬프트를 입력해주세요."
            className="w-full outline-none text-[16px] sm:text-[18px] font-medium text-[#5F5F5F] placeholder:text-[#C5CAD1] px-0 sm:px-3 border-none focus:ring-0 resize-none"
            style={{ minHeight: '40px', height: 'auto', overflowY: 'auto' }}
          />
          {fileCheck && (
            <Typography className="text-[12px] text-red-500">
              업로드한 이미지 크기가 너무 작아서 동영상을 생성할 수 없습니다. (최소 300x300px 필요)
            </Typography>
          )}
        </Box>

        <Box className="flex justify-between">
          <Box className="flex items-center gap-2">
            <Box
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                setAnchorEl(event.currentTarget);
              }}
              className="cursor-pointer"
            >
              <Image src={iconCreateMobile} alt="iconCreateMobile" />
            </Box>
            <Button
              color="primary"
              disableElevation
              variant="contained"
              className="relative flex w-24 h-[40px] flex-none !rounded-full !bg-transparent border-solid border-[1px] border-[#EEEEEE]  font-pretendard"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setAnchorChoose(event.currentTarget);
              }}
            >
              <Typography className=" text-sm font-bold text-[#232323] flex items-center gap-[10px] whitespace-nowrap">
                {dataChooseOption.find((opt) => opt.value === selectedChoose)?.label}
                <UpDownIcon
                  color="#232323"
                  className={`transition-all duration-500 ease-in-out ${anchorChoose ? 'rotate-180' : ''}`}
                />
              </Typography>
            </Button>
            {selectedChoose == 1 && (
              <Button
                color="primary"
                disableElevation
                variant="contained"
                className="relative flex w-24 h-[40px] flex-none !rounded-full !bg-transparent border-solid border-[1px] border-[#EEEEEE]  font-pretendard"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  setAnchorRatio(event.currentTarget);
                }}
              >
                <Typography className=" text-sm font-bold text-[#232323] flex items-center gap-[10px] whitespace-nowrap">
                  <Image src={iconPhone} alt="iconPhone" />

                  {dataRatioOption.find((opt) => opt.value === selectedRatio)?.label}
                  <UpDownIcon
                    color="#232323"
                    className={`transition-all duration-500 ease-in-out ${anchorRatio ? 'rotate-180' : ''}`}
                  />
                </Typography>
              </Button>
            )}

            {selectedChoose !== 1 && (
              <Button
                color="primary"
                disableElevation
                variant="contained"
                className="relative flex w-26 h-[40px] flex-none !rounded-full !bg-transparent border-solid border-[1px] border-[#EEEEEE]  font-pretendard"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  setAnchorDuration(event.currentTarget);
                }}
              >
                <Typography className=" text-sm font-bold text-[#232323] flex items-center gap-[10px] whitespace-nowrap lowercase">
                  <Image src={iconClock} alt="iconClock" />

                  {file
                    ? dataDuration.find((opt) => opt.value === selectedDuration)?.label
                    : dataDurationV2.find((opt) => opt.value === selectedDuration)?.label}
                  <UpDownIcon
                    color="#232323"
                    className={`transition-all duration-500 ease-in-out ${anchorDuration ? 'rotate-180' : ''}`}
                  />
                </Typography>
              </Button>
            )}
          </Box>

          <Button
            color="primary"
            disableElevation
            variant="contained"
            className="relative flex w-32 h-[40px] flex-none !rounded-full font-pretendard !cursor-pointer"
            onClick={handleCreateAI}
            disabled={!prompt && fileCheck}
            sx={{
              background: !prompt
                ? 'linear-gradient(112.75deg, #CCCCCC 18.67%, #AAAAAA 85.03%)'
                : 'linear-gradient(112.75deg, #6F7BF4 18.67%, #9B6BFB 85.03%)',
              cursor: !prompt ? 'not-allowed' : 'pointer',
              '&:hover': {
                background: !prompt
                  ? 'linear-gradient(112.75deg, #CCCCCC 18.67%, #AAAAAA 85.03%)'
                  : 'linear-gradient(112.75deg, #5F6BE0 18.67%, #8B5AFB 85.03%)',
              },
            }}
          >
            {
              <Typography className=" text-sm font-medium text-white flex items-center gap-[4px] !cursor-pointer">
                생성하기{' '}
                <span>
                  <Image src={iconLight} alt="iconLight" />
                </span>{' '}
                <span>6</span>
              </Typography>
            }
          </Button>
        </Box>

        <Popover
          id={'tooltip-popover'}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{ paper: { sx: { borderRadius: '10px', width: 215 } }, root: { sx: { mt: '-10px' } } }}
          className=""
        >
          <CreateOptions
            title="콘텐츠 추가"
            handleClose={handleClose}
            options={dataUpload}
            onChoose={(num: number) => {
              setSelectedUpload(num);
              setActiveTab(num - 1);
            }}
            fontOptions="medium"
            selectedValue={
              selectedUpload !== null ? dataUpload.find((opt) => opt.value === selectedUpload)?.value : undefined
            }
          />
        </Popover>
        <Popover
          id={'tooltip-popover-choose'}
          open={Boolean(anchorChoose)}
          anchorEl={anchorChoose}
          onClose={handleCloseChoose}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{ paper: { sx: { borderRadius: '10px', width: 85 } }, root: { sx: { mt: '-10px' } } }}
          className="hidden sm:block"
        >
          <CreateOptions
            handleClose={handleCloseChoose}
            options={dataChooseOption}
            onChoose={(num: number) => setSelectedChoose(num)}
            fontOptions="semibold"
            selectedValue={selectedChoose}
          />
        </Popover>
        <Popover
          id={'tooltip-popover-ratio'}
          open={Boolean(anchorRatio)}
          anchorEl={anchorRatio}
          onClose={handleCloseRatio}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{ paper: { sx: { borderRadius: '10px', width: 100 } }, root: { sx: { mt: '-10px' } } }}
          className="hidden sm:block"
        >
          <CreateOptions
            handleClose={handleCloseRatio}
            options={dataRatioOption}
            onChoose={(num: number) => setSelectedRatio(num)}
            selectedValue={selectedRatio}
          />
        </Popover>
        <Popover
          id={'tooltip-popover-duration'}
          open={Boolean(anchorDuration)}
          anchorEl={anchorDuration}
          onClose={handleCloseDuration}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{ paper: { sx: { borderRadius: '10px', width: 72 } }, root: { sx: { mt: '-10px' } } }}
          className="hidden sm:block"
        >
          <CreateOptions
            handleClose={handleCloseDuration}
            options={file ? dataDuration : dataDurationV2}
            onChoose={(num: number) => setSelectedDuration(num)}
            selectedValue={selectedDuration}
          />
        </Popover>
      </Box>
      {/* phần hiển thị model */}
      <DialogChangeFormEditor
        open={open}
        handleClose={handleClose}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        setFile={setFile}
        setSelectedUpload={setSelectedUpload}
      />
    </Box>
  );
};
interface OptionItem {
  label: string;
  value: number;
  icon?: string | StaticImageData;
}
interface CreateOptionsProps {
  handleClose: () => void;
  onChoose: (value: number) => void;
  options: OptionItem[];
  title?: string;
  fontOptions?: string;
  selectedValue?: number;
}
const CreateOptions = ({
  handleClose,
  onChoose,
  options,
  title,
  fontOptions = 'semibold',
  selectedValue,
}: CreateOptionsProps) => {
  return (
    <Box className="relative">
      <Box className="relative w-full py-[10px] overflow-hidden">
        {/* Header optional */}
        {title && (
          <>
            <Box className="px-[19px] py-[10px] text-[12px] font-semibold text-[#6A6A6A]">{title}</Box>
          </>
        )}

        {/* Render option list */}
        {options.map((opt, idx) => {
          const isSelected = opt.value === selectedValue;
          const isLast = idx === options.length - 1;
          return (
            <Box
              key={idx}
              className={`flex items-center justify-between px-[19px] py-[8px] cursor-pointer text-[16px] font-${fontOptions} rounded-full
                                ${isSelected ? 'bg-[#EEEEEE]' : 'hover:bg-[#EEEEEE]'} ${isLast ? 'mb-0' : 'mb-[3px]'}`}
              onClick={() => {
                onChoose(opt.value);
                handleClose();
              }}
            >
              {opt?.icon && <Image src={opt?.icon} alt="icon" />}
              <span>{opt.label}</span>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
export default PromptEditor;

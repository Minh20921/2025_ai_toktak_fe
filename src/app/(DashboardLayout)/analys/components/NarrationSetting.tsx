'use client';

import React, { useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Autocomplete,
  TextField,
} from '@mui/material';
import { IconPersonVoice } from '@/utils/icons/advanced';
import { SEX, voiceOptionsMale, voiceOptionsFMale } from '@/utils/constant';

export interface NarrationValue {
  gender: number;
  soundType: string;
}

interface NarrationSettingProps {
  value: NarrationValue;
  subscription: string;
  onChange: (newVal: NarrationValue) => void;
  onVoiceChange: () => void;
  narrationOptions: {
    [key in SEX]: {
      value: string;
      label: string;
      audio_url: string;
    }[];
  };
  disabled?: boolean;
}

export default function NarrationSetting({ value, subscription, onChange, onVoiceChange, narrationOptions, disabled = false, }: NarrationSettingProps) {
  const theme = useTheme();
  // mobile nếu < md
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // map voice options

  // phát thử âm thanh
  const handlePlaySound = (url: string) => {
    if (disabled) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const snd = new Audio(url);
    audioRef.current = snd;
    snd.play();
  };

  // cho Autocomplete
  const genderOptionsList = [
    { label: '여성', value: 1 },
    { label: '남성', value: 0 },
  ];

  const selectedGenderOption = genderOptionsList.find((o) => o.value === value.gender) || undefined;

  const soundOptionsList = narrationOptions[value.gender as SEX];
  const selectedSoundOption = soundOptionsList.find((o) => o.value === value.soundType) || undefined;
  return (
    <Paper elevation={0} sx={{ bgcolor: '#fff', borderRadius: 1, mt: 2.5 }}>
      {/* header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: { xs: 2.5, md: 3.25 },
          px: { xs: 2.5, md: 3.75 },
          borderBottom: { xs: 'none', sm: '2px solid #F1F1F1' },
        }}
      >
        <IconPersonVoice className="w-6 aspect-square md:w-[30px]" />
        <Box>
          <Typography
            sx={{
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 'bold',
              color: '#272727',
            }}
          >
            나레이션 설정
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#686868', mt: '6px' }}>
            검색에 맞는 AI 음성을 선택해 주세요.
          </Typography>
        </Box>
      </Box>

      {isMobile ? (
        // —— MOBILE: 2 Autocomplete ——
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: 3.75,
            px: { xs: 2.5, md: 11.25 },
          }}
        >
          <Autocomplete
            value={selectedGenderOption}
            options={genderOptionsList}
            getOptionLabel={(opt) => opt.label}
            onChange={(_, newGender) => {
              if (!newGender) return;
              onChange({
                gender: newGender.value,
                soundType: narrationOptions[newGender.value as SEX][0].value,
              });
            }}
            disableClearable
            renderInput={(params) => (
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    height: '40px',
                    '& .MuiOutlinedInput-input': {
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#686868',
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px',
                    borderColor: '#F1F1F1',
                  },
                  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#F1F1F1 !important',
                  },
                }}
                {...params}
                placeholder="성별 선택"
                fullWidth
              />
            )}
          />

          <Autocomplete
            value={selectedSoundOption}

            options={soundOptionsList}
            getOptionLabel={(opt) => opt.label}
            onChange={(_, newSound) => {
              if (!newSound) return;
              handlePlaySound(newSound.audio_url);
              onChange({ gender: value.gender, soundType: newSound.value });
            }}
            disableClearable
            renderInput={(params) => (
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    height: '40px',
                    '& .MuiOutlinedInput-input': {
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#686868',
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px',
                    borderColor: '#F1F1F1',
                  },
                  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#F1F1F1 !important',
                  },
                }}
                {...params}
                placeholder="음성 선택"
                fullWidth
              />
            )}
          />
        </Box>
      ) : (
        // —— DESKTOP: Radios + play icon ——
        <Box
          sx={{
            display: 'flex',
            py: 3.75,
            px: { xs: 2.5, md: 11.25 },
          }}
        >
          <FormControl component="fieldset">
            <RadioGroup
              row
              name="gender"
              value={value.gender}
              onChange={(e) => {
                onChange({
                  gender: Number(e.target.value),
                  soundType: narrationOptions[Number(e.target.value) as SEX][0].value,
                })
              }

              }

              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {genderOptionsList.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#4776EF' } }} />}
                  label={
                    <Typography
                      sx={{
                        color: value.gender === opt.value ? '#4776EF' : '#686868',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {opt.label}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Divider flexItem orientation="vertical" sx={{ mx: { sm: 2.5, md: 5, xl: 10 } }} />

          <FormControl component="fieldset">
            <RadioGroup
              row
              name="sound-type"
              value={value.soundType}
              sx={{
                display: 'flex',
                gap: '10px',
              }}
              onChange={(e) => {
                if (disabled) {
                  onVoiceChange();
                  return;
                }
                onChange({ ...value, soundType: e.target.value })
              }
              }
            >
              {soundOptionsList.map((opt) => (
                <Box key={opt.value} sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <FormControlLabel
                    value={opt.value}
                    control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#4776EF' } }} />}
                    label={
                      <Typography
                        sx={{
                          color: value.soundType === opt.value ? '#4776EF' : '#686868',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {opt.label}
                      </Typography>
                    }
                    sx={{ ml: 1 }}
                  />
                  <Box
                    component="svg"
                    width={17}
                    height={17}
                    viewBox="0 0 17 17"
                    onClick={() => handlePlaySound(opt.audio_url)}
                    sx={{ cursor: 'pointer', fill: '#A4A4A4' }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.4142 14.1756L12.3091 13.2914C14.7725 10.5994 14.7725 6.48422 12.309 3.79228L13.4142 2.90815C16.29 6.11929 16.2899 10.9644 13.4142 14.1756ZM10.6123 5.14966L9.50589 6.03482C10.8272 7.44821 10.8272 9.6355 9.50592 11.0489L10.6124 11.934C12.3457 10.0009 12.3457 7.08274 10.6123 5.14966ZM7.78467 2.83301L4.10397 5.72932H1.41797V11.396H4.10809L7.78467 14.2334V2.83301Z"
                    />
                  </Box>
                </Box>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      )}
    </Paper>
  );
}

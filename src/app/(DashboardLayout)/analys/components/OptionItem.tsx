'use client';

import React from 'react';
import {
  Autocomplete,
  Box,
  IconButton,
  Popover,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  Chip,
} from '@mui/material';
import { TooltipIcon } from '@/utils/icons/advanced';
import { CustomSwitch } from '@/app/components/common/CustomSwitch';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';

type OptionItemInputType = 'text' | 'hashtag' | undefined;

interface OptionItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  tooltipContainer?: React.ReactNode;

  switchValue?: boolean;
  onSwitchChange?: (checked: boolean) => void;
  hasSwitch?: boolean;

  inputType?: OptionItemInputType;
  inputValue?: string | string[];
  onInputChange?: (value: string | string[]) => void;
  placeholder?: string;
  maxLength?: number;
  inputGrow?: boolean;
  isLoading?: boolean;
}

const OptionItem: React.FC<OptionItemProps> = ({
  icon,
  title,
  description,
  tooltipContainer,
  hasSwitch = true,
  switchValue = false,
  onSwitchChange,
  inputType,
  inputValue,
  onInputChange,
  placeholder = '',
  maxLength = 10,
  inputGrow = false,
  isLoading = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [touched, setTouched] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  const [resetKey, setResetKey] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = Boolean(anchorEl);
  const id = open ? 'tooltip-popover' : undefined;

  React.useEffect(() => {
    if (!switchValue) {
      setTouched(false);
      setInputText('');
    }
  }, [switchValue]);

  // Focus input after reset
  React.useEffect(() => {
    if (resetKey > 0) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    }
  }, [resetKey]);

  const handleTooltipClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleTooltipClose = () => setAnchorEl(null);

  // Xác định error
  const isTextError =
    switchValue && inputType === 'text' && typeof inputValue === 'string' && touched && inputValue.trim() === '';

  const isHashtagError =
    switchValue && inputType === 'hashtag' && Array.isArray(inputValue) && touched && inputValue.length === 0;

  return (
    <Box className={`flex ${isMobile ? 'flex-col' : 'items-center'} w-full`}>
      {/* Icon + Title + Tooltip + Switch trên mobile */}
      <Box className={`flex items-center ${isMobile ? 'w-full' : ''}`}>
        <Box className="text-[#A4A4A4] box-border" sx={{ width: { xs: 24, sm: 30 } }}>
          {icon}
        </Box>
        <Box sx={{ ml: { xs: 1.5, md: 3.75 } }} className={`${!inputGrow && 'flex-grow'} flex items-center min-w-44`}>
          <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 'bold' }} color="#272727">
            {title}
          </Typography>
          {tooltipContainer && (
            <>
              <IconButton className="p-[6px]" onClick={handleTooltipClick} aria-describedby={id}>
                <TooltipIcon />
              </IconButton>
              {isMobile ? (
                <Drawer
                  anchor="bottom"
                  open={open}
                  onClose={handleTooltipClose}
                  PaperProps={{
                    sx: {
                      borderTopLeftRadius: '16px',
                      borderTopRightRadius: '16px',
                      maxHeight: '80vh',
                    },
                  }}
                >
                  <Box sx={{ p: 2 }}>{tooltipContainer}</Box>
                </Drawer>
              ) : (
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleTooltipClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  slotProps={{ paper: { sx: { borderRadius: '10px', overflow: 'hidden' } } }}
                >
                  {tooltipContainer}
                </Popover>
              )}
            </>
          )}
        </Box>

        {isMobile &&
          hasSwitch &&
          (isLoading ? (
            <CircularProgress size={28} color="primary" />
          ) : (
            <Box className="ml-auto">
              <CustomSwitch
                checked={switchValue}
                onChange={(e) => onSwitchChange?.(e.target.checked)}
                color="primary"
              />
            </Box>
          ))}
      </Box>

      {/* Phần input + switch (desktop) */}
      <Box className={`flex ${isMobile ? 'w-full' : 'items-center w-full justify-end'}`}>
        {inputType ? (
          <Box className={`${isMobile ? 'w-full mt-3' : 'flex-grow pr-30'}`}>
            {/* TEXT input */}
            {inputType === 'text' && typeof inputValue === 'string' && (
              <TextField
                multiline={false}
                rows={1}
                required={switchValue}
                error={isTextError}
                placeholder={placeholder}
                size="small"
                disabled={!switchValue}
                value={inputValue}
                onChange={(e) => {
                  const limited = Array.from(e.target.value).slice(0, maxLength).join('');
                  onInputChange?.(limited);
                }}
                onBlur={() => setTouched(true)}
                className={`${inputGrow || isMobile ? 'w-full' : 'w-[360px] mx-4'}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    height: { xs: '48px', sm: '40px' },
                    transform: { xs: 'scale(0.75)', sm: 'scale(1)' },
                    transformOrigin: { xs: '0 0', sm: '0 0' },
                    width: { xs: '133.33%', sm: '100%' },
                    '& .MuiOutlinedInput-input': {
                      fontSize: { xs: '16px', sm: '14px' },
                      fontWeight: 500,
                      color: '#686868',
                      '&:focus': { outline: 'none', boxShadow: 'none' },
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
              />
            )}

            {/* HASHTAG input */}
            {inputType === 'hashtag' && (
              <Box className={`flex items-center gap-4 ${isMobile ? 'w-full' : 'flex-grow'}`}>
                <Autocomplete
                  key={resetKey}
                  multiple
                  freeSolo
                  filterSelectedOptions
                  options={[]}
                  inputValue={inputText}
                  value={
                    Array.isArray(inputValue)
                      ? inputValue.map((tag) => ({
                          label: `#${tag.replace(/^#/, '')}`,
                          value: tag.replace(/^#/, ''),
                        }))
                      : []
                  }
                  disabled={!switchValue}
                  onChange={(e, newValue) => {
                    const tags = newValue
                      .map((item) =>
                        typeof item === 'string'
                          ? item.replace(/^#/, '')
                          : typeof item.value === 'string'
                            ? item.value
                            : '',
                      )
                      .filter(Boolean)
                      .slice(0, maxLength);
                    onInputChange?.(tags);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setInputText(newInputValue);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      const currentTags = Array.isArray(inputValue) ? inputValue : [];
                      // Nếu input trống hoặc chỉ có dấu #, xóa tag cuối cùng
                      if (inputText === '' || inputText === '#') {
                        if (currentTags.length > 0) {
                          e.preventDefault();
                          const newTags = currentTags.slice(0, -1);
                          onInputChange?.(newTags);
                          // Giữ lại dấu # nếu chưa đủ tag
                          if (newTags.length < maxLength) {
                            setInputText('#');
                          }
                          return;
                        }
                      }
                      // Nếu đã có đủ tag và input chỉ còn dấu #, cho phép xóa
                      if (currentTags.length >= maxLength && inputText === '#') {
                        return; // Cho phép xóa bình thường
                      }
                      // Nếu chưa đủ tag, luôn giữ lại dấu #
                      if (inputText === '#' || inputText === '') {
                        e.preventDefault();
                        setInputText('#');
                        return;
                      }
                    }

                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      const newTag = inputText.trim();
                      if (newTag) {
                        const currentTags = Array.isArray(inputValue) ? inputValue : [];
                        onInputChange?.([...currentTags, newTag.replace(/^#/, '')].slice(0, maxLength));
                        const currentTagsAfterAdd = [...currentTags, newTag.replace(/^#/, '')].slice(0, maxLength);
                        // Reset input về # nếu chưa đủ tag, ngược lại reset về trống
                        if (currentTagsAfterAdd.length < maxLength) {
                          setInputText('#');
                        } else {
                          setInputText('');
                        }
                        // Force clear input using ref with setTimeout
                        setTimeout(() => {
                          if (inputRef.current) {
                            inputRef.current.value = currentTagsAfterAdd.length < maxLength ? '#' : '';
                          }
                        }, 0);
                        // Force re-render Autocomplete
                        setResetKey((prev) => prev + 1);
                      }
                    }
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.label}
                        size="small"
                        sx={{
                          fontSize: { xs: '16px', sm: '14px' },
                          maxWidth: { xs: '80px !important', sm: '300px !important' },
                          backgroundColor: '#F5F5F5',
                          borderRadius: '99px',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal',
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={inputRef}
                      placeholder={placeholder}
                      size="small"
                      required={switchValue}
                      error={isHashtagError}
                      onBlur={() => {
                        setTouched(true);
                        setInputText('');
                      }}
                      onFocus={() => {
                        // Tự động thêm # khi focus vào input trống và chưa đủ tag
                        const currentTags = Array.isArray(inputValue) ? inputValue : [];
                        if (inputText === '' && currentTags.length < maxLength) {
                          setInputText('#');
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          fontSize: { xs: '16px', sm: '14px' },
                          height: { xs: '48px', sm: '40px' },
                          paddingY: '4px',
                          transform: { xs: 'scale(0.75)', sm: 'scale(1)' },
                          transformOrigin: { xs: '0 0', sm: '0 0' },
                          width: { xs: '133.33%', sm: '100%' },
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: { xs: '16px', sm: '14px' },
                          fontWeight: 500,
                          color: '#686868',
                          WebkitTextSizeAdjust: 'none',
                          '&:focus': { outline: 'none', boxShadow: 'none' },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '2px',
                          borderColor: '#F1F1F1',
                        },
                        '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#F1F1F1 !important',
                        },
                      }}
                    />
                  )}
                  sx={{
                    flex: 1,
                    width: '100%',
                    '.MuiInputBase-root': {
                      paddingRight: isMobile ? '16px' : '40px',
                      flexWrap: 'nowrap',
                      '& .MuiInputBase-input': {
                        whiteSpace: 'nowrap',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          ''
        )}

        {/* Switch trên desktop */}

        {!isMobile &&
          hasSwitch &&
          (isLoading ? (
            <CircularProgress size={28} color="primary" />
          ) : (
            <CustomSwitch checked={switchValue} onChange={(e) => onSwitchChange?.(e.target.checked)} color="primary" />
          ))}
      </Box>
    </Box>
  );
};

export default OptionItem;

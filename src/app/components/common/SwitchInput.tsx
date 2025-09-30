import React, { ChangeEvent, useState } from 'react';
import { Box, IconButton, SxProps, TextField, Theme, Typography } from '@mui/material';
import { IOSSwitch } from '@/app/components/common/CustomSwitch';
import { Icon } from '@iconify/react';

export interface SwitchInputProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  switchValue: boolean;
  onSwitchChange: (value: boolean) => void;
  inputValue: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  sx?: SxProps<Theme>;
}

const SwitchInput: React.FC<SwitchInputProps> = ({
  icon,
  title,
  switchValue,
  onSwitchChange,
  inputValue,
  onInputChange,
  placeholder = '',
  maxLength = 255,
  sx = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const limitedValue = Array.from(event.target.value).slice(0, maxLength).join('');
    const syntheticEvent = {
      ...event,
      target: {
        ...event.target,
        value: limitedValue,
      },
    } as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    onInputChange(syntheticEvent);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        ...sx,
      }}
    >
      <Box sx={{ color: '#A4A4A4' }}>{icon}</Box>

      <Typography
        sx={{
          fontSize: '1rem',
          fontFamily: 'var(--font-pretendard)',
          fontWeight: 'bold',
          color: '#272727',
        }}
      >
        {title}
      </Typography>
      <TextField
        variant="outlined"
        placeholder={placeholder}
        disabled={!switchValue}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{ ml: 1.5, mr: 2.5 }}
        rows={1}
        multiline={false}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onInputChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
                }}
                sx={{ visibility: inputValue && isFocused ? 'visible' : 'hidden' }}
              >
                <Icon icon={'tabler:x'} width={20} height={20} />
              </IconButton>
            ),
            sx: {
              px: 0,
              height: 40,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          },
        }}
      />

      <IOSSwitch checked={switchValue} onChange={(e) => onSwitchChange(e.target.checked)} />
    </Box>
  );
};

export default SwitchInput;

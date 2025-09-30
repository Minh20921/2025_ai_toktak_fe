import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Popover,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import { Icon } from '@iconify/react';

interface ColorPickerProps {
  label: string;
  initialColor: string;
  onChange?: (color: string) => void;
}

const predefinedColors = [
  // row 1
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#B7B7B7',
  '#CCCCCC',
  '#D9D9D9',
  '#EFEFEF',
  '#F3F3F3',
  '#FFFFFF',
  // row 2
  '#E6B8AF',
  '#F4CCCC',
  '#FCE5CD',
  '#FFF2CC',
  '#D9EAD3',
  '#D0E0E3',
  '#C9DAF8',
  '#CFE2F3',
  '#D9D2E9',
  '#EAD1DC',
  // row 3
  '#DD7E6B',
  '#EA9999',
  '#F9CB9C',
  '#FFE599',
  '#B6D7A8',
  '#A2C4C9',
  '#A4C2F4',
  '#9FC5E8',
  '#B4A7D6',
  '#D5A6BD',
  // row 4
  '#CC4125',
  '#E06666',
  '#F6B26B',
  '#FFD966',
  '#93C47D',
  '#76A5AF',
  '#6D9EEB',
  '#6FA8DC',
  '#8E7CC3',
  '#C27BA0',
  //row 5
  '#A61C00',
  '#CC0000',
  '#E69138',
  '#F1C232',
  '#6AA84F',
  '#45818E',
  '#3C78D8',
  '#3D85C6',
  '#674EA7',
  '#A64D79',
  //row 6
  '#85200C',
  '#990000',
  '#B45F06',
  '#BF9000',
  '#38761D',
  '#134F5C',
  '#1155CC',
  '#0B5394',
  '#351C75',
  '#741B47',
  //row 7
  '#5B0F00',
  '#660000',
  '#783F04',
  '#7F6000',
  '#274E13',
  '#0C343D',
  '#1C4587',
  '#073763',
  '#20124D',
  '#4C1130',
];

const defaultCustomColors = [
  '#E6B8AF',
  '#F4CCCC',
  '#FCE5CD',
  '#FFF2CC',
  '#D9EAD3',
  '#D0E0E3',
  '#C9DAF8',
  '#CFE2F3',
  '#D9D2E9',
];
const LOCAL_STORAGE_KEY = 'customColorPalette';

export default function ColorPicker({ label, initialColor, onChange }: ColorPickerProps) {
  const [color, setColor] = useState<string>(initialColor);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [customMode, setCustomMode] = useState<boolean>(false);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [tempColor, setTempColor] = useState<string>(initialColor);
  const [pendingColor, setPendingColor] = useState<string>(initialColor);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load customColors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setCustomColors(JSON.parse(saved));
    } else {
      setCustomColors(defaultCustomColors);
    }
    setPendingColor(initialColor);
  }, [initialColor]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (customMode) {
      updateCustomColors(tempColor);
    }
    setCustomMode(false);
    setAnchorEl(null);
  };

  const updateCustomColors = (newColor: string) => {
    setCustomColors((prev) => {
      if (prev.includes(newColor)) return prev;
      const updated = [newColor, ...prev].slice(0, 9);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleColorChangeFromHue = (newColor: string) => {
    setTempColor(newColor);
    if (isMobile) {
      setPendingColor(newColor);
    } else {
      setColor(newColor);
      onChange?.(newColor);
    }
  };

  const handleSelectColor = (selectedColor: string) => {
    if (isMobile) {
      setPendingColor(selectedColor);
      setTempColor(selectedColor);
    } else {
      setColor(selectedColor);
      setTempColor(selectedColor);
      onChange?.(selectedColor);
      handleClose();
    }
  };

  const renderColorBox = (color: string, isSelected: boolean, onClick: () => void) => (
    <Box
      key={color}
      onClick={onClick}
      sx={{
        width: 24,
        height: 24,
        borderRadius: 1,
        bgcolor: color,
        border: '1px solid #DEE7FF',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'scale(1.1)',
          transition: 'transform 0.2s',
        },
        ...(isSelected && {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 0 0 1px black',
          },
        }),
      }}
    />
  );

  const colorPickerContent = (
    <Box sx={{ p: 2.5 }}>
      {customMode ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <HexColorPicker color={isMobile ? pendingColor : tempColor} onChange={handleColorChangeFromHue} />
          <TextField
            variant="outlined"
            size="small"
            value={isMobile ? pendingColor : tempColor}
            onChange={(e) => handleColorChangeFromHue(e.target.value)}
            slotProps={{
              htmlInput: {
                maxLength: 7,
                style: {
                  textAlign: 'center',
                  fontSize: '16px',
                },
              },
              input: {
                sx: {
                  borderRadius: '10px',
                  height: '40px',
                },
              },
            }}
            sx={{
              width: '100%',
            }}
          />
        </Box>
      ) : (
        <Box>
          <Typography sx={{ mb: 1, fontSize: '18px', fontWeight: 500, color: '#6A6A6A' }}>Color Palette</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: 0.5,
            }}
          >
            {predefinedColors.map((col) =>
              renderColorBox(col, isMobile ? col === pendingColor : col === color, () => handleSelectColor(col)),
            )}
          </Box>

          <Typography
            sx={{
              mt: 2,
              mb: 1,
              fontSize: '18px',
              fontWeight: 500,
              color: '#6A6A6A',
            }}
          >
            Custom
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            {customColors.map((col) =>
              renderColorBox(col, isMobile ? col === pendingColor : col === color, () => handleSelectColor(col)),
            )}
            <IconButton
              size="small"
              onClick={() => {
                setTempColor(isMobile ? pendingColor : color);
                setCustomMode(true);
              }}
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                p: 0,
              }}
            >
              <Icon icon="gg:add-r" width={24} height={24} />
            </IconButton>
          </Box>
        </Box>
      )}
      {isMobile && (
        <Box sx={{ mt: 3 }}>
          <Button
            sx={{
              fontFamily: 'Pretendard',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '20px',
              letterSpacing: '0px',
              width: '100%',
              background: '#4776EF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '15px 0',
              height: '50px',
              '&:hover': {
                background: '#4776EF',
              },
            }}
            onClick={() => {
              setColor(pendingColor);
              onChange?.(pendingColor);
              handleClose();
            }}
          >
            임시저장
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
        <Typography component="div" color="#6A6A6A" fontSize="14.84px">
          {label}
        </Typography>
        <Box
          onClick={handleOpen}
          sx={{
            width: 33,
            height: 33,
            borderRadius: '50%',
            bgcolor: color,
            border: '1px solid #DEE7FF',
            cursor: 'pointer',
          }}
        />
      </Box>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                maxHeight: '80vh',
              },
            },
          }}
        >
          <Box
            sx={{
              pt: 2,
              px: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <IconButton onClick={handleClose} sx={{ p: 0.5 }}>
              <Icon icon="tabler:x" color="#000000" width={20} height={20} />
            </IconButton>
          </Box>
          {colorPickerContent}
        </Drawer>
      ) : (
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 5,
              },
            },
          }}
        >
          {colorPickerContent}
        </Popover>
      )}
    </>
  );
}

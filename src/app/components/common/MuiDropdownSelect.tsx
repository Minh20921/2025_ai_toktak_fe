'use client';

import * as React from 'react';
import { Box, Button, Menu, MenuItem, Radio, Typography, Drawer, useTheme, useMediaQuery } from '@mui/material';

export type DropdownOption = {
  id?: string;
  label: React.ReactNode;
  value: string;
};

export interface MuiDropdownSelectProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  buttonProps?: React.ComponentProps<typeof Button>;
  renderButton?: (props: {
    onClick: (e: any) => void;
    selectedOption?: DropdownOption;
    placeholder: string;
    isOpen: boolean;
  }) => React.ReactNode;
  className?: string;
  isRadio?: boolean;
  menuOrigin?: {
    transformOrigin?: { horizontal: 'left' | 'right' | 'center'; vertical: 'top' | 'bottom' | 'center' };
    anchorOrigin?: { horizontal: 'left' | 'right' | 'center'; vertical: 'top' | 'bottom' | 'center' };
  };
}

export default function MuiDropdownSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  buttonProps,
  renderButton,
  className,
  isRadio = true,
  menuOrigin,
}: MuiDropdownSelectProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    handleClose();
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className}>
      {renderButton ? (
        renderButton({
          onClick: handleClick,
          selectedOption,
          placeholder,
          isOpen: open,
        })
      ) : (
        <Button onClick={handleClick} variant="outlined" fullWidth {...buttonProps}>
          {selectedOption ? selectedOption.label : placeholder}
        </Button>
      )}

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          PaperProps={{ sx: { borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        >
          <Box sx={{ px: 2, pt: 3.75, pb: 3 }}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Box
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1.5,
                    px: 1,
                    cursor: 'pointer',
                  }}
                >
                  {isRadio && (
                    <Radio
                      checked={isSelected}
                      size="small"
                      sx={{
                        '&.Mui-checked': { color: '#4776EF' },
                        p: 0,
                        mr: 1,
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: isSelected ? '#4776EF' : '#686868',
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Drawer>
      ) : (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                mt: '6px',
                borderRadius: '6px',
                boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
                '& .MuiMenu-list': { py: '10px' },
              },
            },
          }}
          transformOrigin={menuOrigin?.transformOrigin ?? { horizontal: 'right', vertical: 'top' }}
          anchorOrigin={menuOrigin?.anchorOrigin ?? { horizontal: 'right', vertical: 'bottom' }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <MenuItem
                key={option.value}
                onClick={() => handleSelect(option.value)}
                sx={{ display: 'flex', alignItems: 'center', px: '12px', py: '10px' }}
              >
                {isRadio && (
                  <Radio
                    checked={isSelected}
                    size="small"
                    sx={{
                      '&.Mui-checked': { color: '#4776EF' },
                      p: 0,
                      mr: 1,
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: isSelected ? '#4776EF' : '#686868',
                  }}
                >
                  {option.label}
                </Typography>
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </div>
  );
}

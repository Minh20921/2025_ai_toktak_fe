'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button, FormControlLabel, Menu, Radio, RadioGroup } from '@mui/material';

interface DropdownProps {
  options: { label: string; value: string }[]; // Danh sách tùy chọn
  defaultOption?: string; // Mục được chọn ban đầu
  label: string; // Nhãn hiển thị trên button
  onSelect?: (value: string) => void; // Callback khi chọn
}

const CustomDropdown: React.FC<DropdownProps> = ({ options, defaultOption, label, onSelect }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedValue, setSelectedValue] = useState(defaultOption || options[0].value); // Mục active ban đầu
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect?.(value);
    handleClose();
  };

  return (
    <div className="flex flex-col justify-center">
      <Button
        onClick={handleClick}
        variant="text"
        endIcon={
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1.68945L5.5 5.68945L10 1.68945"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        className="text-[#6A6A6A] text-lg font-semibold"
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="shadow-lg rounded-md w-full mt-6"
        MenuListProps={{
          className: 'w-[140px] py-2.5',
        }}
      >
        <RadioGroup value={selectedValue} onChange={(e) => handleSelect(e.target.value)}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio color="primary" />}
              label={
                <span className={`text-base ${selectedValue == option.value ? 'text-[#4776EF]' : 'text-black'}`}>
                  {option.label}
                </span>
              }
              className="hover:bg-gray-100 !m-0 rounded-md transition duration-150"
            />
          ))}
        </RadioGroup>
      </Menu>
    </div>
  );
};

export default CustomDropdown;

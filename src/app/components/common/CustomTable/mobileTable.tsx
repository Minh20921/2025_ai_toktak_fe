// components/MobileTable.tsx
'use client';

import React from 'react';
import { Box, Checkbox, FormControlLabel, Typography, SxProps, Theme } from '@mui/material';
import { ContentItem } from '@/app/(DashboardLayout)/history/page';

interface MobileTableProps {
  items: ContentItem[];
  selectedRows: ContentItem[];
  onSelectedRowsChange: (rows: ContentItem[]) => void;
  /** style cho header container */
  headerSx?: SxProps<Theme>;
  /** style cho mỗi row container */
  rowSx?: SxProps<Theme>;
}

export default function MobileTable({ items, selectedRows, onSelectedRowsChange, headerSx, rowSx }: MobileTableProps) {
  // Select all / indeterminate logic
  const areAll = items.length > 0 && items.every((it) => selectedRows.some((s) => s.id === it.id));
  const some = items.some((it) => selectedRows.some((s) => s.id === it.id)) && !areAll;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const toAdd = items.filter((it) => !selectedRows.some((s) => s.id === it.id));
      onSelectedRowsChange([...selectedRows, ...toAdd]);
    } else {
      onSelectedRowsChange(selectedRows.filter((s) => !items.some((it) => it.id === s.id)));
    }
  };

  const toggleOne = (it: ContentItem) => {
    const exists = selectedRows.some((s) => s.id === it.id);
    if (exists) {
      onSelectedRowsChange(selectedRows.filter((s) => s.id !== it.id));
    } else {
      onSelectedRowsChange([...selectedRows, it]);
    }
  };

  return (
    <Box>
      {/* HEADER SELECT ALL */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          ...headerSx,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              indeterminate={some}
              checked={areAll}
              onChange={handleSelectAll}
              sx={{
                color: '#E7E7E7',
                '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#4776EF' },
                p: 0,
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{ color: '#6A6A6A', fontSize: '14px', fontWeight: 'bold', lineHeight: '17px', ml: 0.5 }}
            >
              <Box component="span" sx={{ color: '#4776EF', fontWeight: 600 }}>
                {selectedRows.length}개
              </Box>{' '}
              선택
            </Typography>
          }
        />
      </Box>

      {/* ROWS */}
      {items.map((item) => {
        const checked = selectedRows.some((s) => s.id === item.id);
        return (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              borderBottom: '1px solid #F9F9F9',
              ...rowSx,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Checkbox
                checked={checked}
                onChange={() => toggleOne(item)}
                sx={{
                  color: '#E7E7E7',
                  '&.Mui-checked': { color: '#4776EF' },
                  p: 0,
                }}
              />
              <Box sx={{ flex: 1 }}>{item.content}</Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

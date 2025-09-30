'use client';

import React from 'react';
import { Box, Checkbox, FormControlLabel, Paper, Skeleton, Typography } from '@mui/material';

export interface ColumnDef<T> {
  header: React.ReactNode;
  accessorKey: keyof T;
  cell?: (info: { getValue: () => any; row: T }) => React.ReactNode;
  className?: string;
}

interface CustomListProps<T extends { id: string | number }> {
  data: T[];
  columns: ColumnDef<T>[];
  select?: boolean;
  selectedRows?: T[];
  onSelectedRowsChange?: (selectedRows: T[]) => void;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  currentPage?: number;
  loading?: boolean;
  skeletonRowCount?: number;
}

export default function CustomList<T extends { id: string | number }>({
  data,
  columns,
  select = false,
  selectedRows = [],
  onSelectedRowsChange = () => {},
  tableClassName = '',
  headerClassName = '',
  bodyClassName = '',
  rowClassName = '',
  cellClassName = '',
  currentPage = 1,
  loading = false,
  skeletonRowCount = 10,
}: CustomListProps<T>) {
  const prevPageRef = React.useRef(currentPage);

  React.useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  const areAllCurrentPageItemsSelected = React.useMemo(() => {
    if (data.length === 0) return false;
    return data.every((item) => selectedRows.some((selected) => selected.id === item.id));
  }, [data, selectedRows]);

  const areSomeCurrentPageItemsSelected = React.useMemo(() => {
    if (data.length === 0) return false;
    const hasSelected = data.some((item) => selectedRows.some((selected) => selected.id === item.id));
    return hasSelected && !areAllCurrentPageItemsSelected;
  }, [data, selectedRows, areAllCurrentPageItemsSelected]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = [
        ...selectedRows,
        ...data.filter((item) => !selectedRows.some((selected) => selected.id === item.id)),
      ];
      onSelectedRowsChange(newSelected);
    } else {
      const newSelected = selectedRows.filter((item) => !data.some((row) => row.id === item.id));
      onSelectedRowsChange(newSelected);
    }
  };

  const handleRowSelect = (_event: React.ChangeEvent<HTMLInputElement>, row: T) => {
    const selectedIndex = selectedRows.findIndex((r) => r.id === row.id);
    let newSelected: T[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row);
    } else {
      newSelected = selectedRows.filter((r) => r.id !== row.id);
    }

    onSelectedRowsChange(newSelected);
  };

  const isSelected = (row: T) => selectedRows.some((r) => r.id === row.id);

  const SkeletonItem = () => (
    <Paper
      elevation={0}
      className={`${rowClassName} bg-white relative border-b-2 border-[#F9F9F9] overflow-hidden hover:bg-[#F8F8F8]`}
      sx={{ boxShadow: 'none' }}
    >
      <div className="flex items-stretch">
        {select && (
          <div className="flex items-center justify-center px-5">
            <Skeleton variant="rectangular" width={24} height={24} />
          </div>
        )}
        <Skeleton
          key={`skeleton-col`}
          className={`${cellClassName} w-full h-[140px] flex-1 flex items-center`}
        ></Skeleton>
      </div>
    </Paper>
  );

  return (
    <div
      className={`relative bg-white rounded-[11px] font-pretendard ${tableClassName}`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* Header */}
      <div className={`sticky top-0 z-10 ${headerClassName}`}>
        <Paper elevation={0} className="bg-[#F8F8F8] flex rounded-[11px] overflow-hidden" sx={{ boxShadow: 'none' }}>
          {select && (
            <div className="w-[50px] pl-5 flex items-center">
              <FormControlLabel
                className="gap-5 ml-0"
                label={
                  <Typography
                    color="#6A6A6A"
                    className="font-medium text-base font-pretendard min-w-[70px]"
                    style={{ inlineSize: 'max-content' }}
                  >
                    <span className="text-[#4776EF] font-pretendard">{selectedRows?.length}개</span> 선택
                  </Typography>
                }
                control={
                  <Checkbox
                    sx={{
                      color: '#E7E7E7',
                      p: 0,
                      '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                        color: '#4776EF',
                      },
                    }}
                    indeterminate={areSomeCurrentPageItemsSelected}
                    checked={areAllCurrentPageItemsSelected}
                    onChange={handleSelectAllClick}
                    disabled={loading}
                  />
                }
              />
            </div>
          )}
          <div className="flex-1 flex  max-h-[43px]">
            {columns.map((column, index) => (
              <Box
                key={column.accessorKey as string}
                className={`flex-1 font-pretendard text-sm font-bold text-[#6A6A6A] py-[13px] px-4 ${column.className || ''} ${
                  index === 0 ? 'rounded-l-[10px]' : ''
                } ${index === columns.length - 1 ? 'rounded-r-[10px]' : ''}`}
              >
                {column.header}
              </Box>
            ))}
          </div>
        </Paper>
      </div>

      {/* Content */}
      <div className={`${bodyClassName}`}>
        {loading ? (
          // Render skeleton items when loading
          Array(skeletonRowCount)
            .fill(0)
            .map((_, index) => <SkeletonItem key={`skeleton-item-${index}`} />)
        ) : (
          // Render actual data items when not loading
          <>
            {data.map((row) => {
              const isItemSelected = isSelected(row);
              return (
                <Paper
                  key={row.id}
                  elevation={0}
                  className={`${rowClassName} bg-white relative border-b-2 border-[#F9F9F9]  overflow-hidden hover:bg-[#F8F8F8]`}
                  sx={{
                    borderRadius: 0,
                    boxShadow: 'none',
                    position: 'relative',
                  }}
                >
                  <div className="flex">
                    {select && (
                      <div className="w-fit flex items-center pl-2.5 justify-center relative">
                        <Checkbox
                          sx={{
                            color: '#E7E7E7',
                            '& .PrivateSwitchBase-input': {
                              width: '100%',
                              height: '100%',
                            },
                            '&.Mui-checked': {
                              color: '#4776EF',
                            },
                          }}
                          checked={isItemSelected}
                          onChange={(event) => handleRowSelect(event, row)}
                          inputProps={{
                            'aria-labelledby': row.id.toString(),
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 flex">
                      {columns.map((column) => (
                        <div
                          key={column.accessorKey as string}
                          className={`${cellClassName} ${column.className || ''} flex-1  w-1/6 flex items-center p-2.5`}
                          style={{
                            wordBreak: 'break-word',
                          }}
                        >
                          {column.cell
                            ? column.cell({ getValue: () => row[column.accessorKey], row })
                            : (row[column.accessorKey] as React.ReactNode)}
                        </div>
                      ))}
                    </div>
                  </div>
                </Paper>
              );
            })}
            {data.length === 0 && (
              <Box className="text-center py-10">
                <Typography color="#686868" className="text-base">
                  데이터가 없습니다.
                </Typography>
              </Box>
            )}
          </>
        )}
      </div>
    </div>
  );
}

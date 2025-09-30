'use client';
import { IconButton } from '@mui/material';
import { NextSlideIcon, PreviousSlideIcon } from '@/utils/icons/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`w-8 h-8 flex items-center justify-center rounded-sm
          ${currentPage === 1 ? 'bg-[#F4F4F4] text-[#A4A4A4]' : 'text-[#A4A4A4] hover:bg-gray-100'}`}
      >
        1
      </button>,
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis1" className="px-1">
          ...
        </span>,
      );
    }

    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown

      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-sm
            ${currentPage === i ? 'bg-[#F4F4F4] text-[#A4A4A4]' : 'text-[#A4A4A4] hover:bg-gray-100'}`}
        >
          {i}
        </button>,
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis2" className="px-1">
          ...
        </span>,
      );
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-8 h-8 flex items-center justify-center rounded-sm
            ${currentPage === totalPages ? 'bg-[#F4F4F4] text-[#A4A4A4]' : 'text-[#A4A4A4] hover:bg-gray-100'}`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <IconButton
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="small"
        className="p-2"
      >
        <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 1L1 5.5L5 10" stroke="#6A6A6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </IconButton>

      <div className="flex items-center">{renderPageNumbers()}</div>

      <IconButton
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="small"
        className="p-2"
      >
        <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5.5L1 10" stroke="#6A6A6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </IconButton>
    </div>
  );
}

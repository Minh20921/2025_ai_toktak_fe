import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const Loading = () => {
  return (
    <Box className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <CircularProgress size={60} />
    </Box>
  );
};

export default Loading;

'use client';

import { Box } from '@mui/material';
import SeoHead from '@/app/components/SeoHead';
import { SEO_DATA_GUIDE } from '@/utils/constant';

const Guide = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        p: 3,
      }}
    >
      <SeoHead {...SEO_DATA_GUIDE} />
      <iframe
        src="https://lime-end-64b.notion.site/ebd/23fdc0173cbd81ef8d1be7392e5eb9c9"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        loading="lazy"
        allowFullScreen={false}
      />
    </Box>
  );
};

export default Guide;

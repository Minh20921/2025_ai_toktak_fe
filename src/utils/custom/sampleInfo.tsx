import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const ShowSampleInfo = ({ text = '' }: { text?: string }) => {
  return (
    <Box
      className=""
      sx={{
        position: 'fixed',
        zIndex: '1400',
        top: '140px',
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
        backgroundColor: '#292929',
        color: '#fff',
        borderRadius: '16px',
        width: { xs: 'calc(95vw)', sm: '649px' },
        height: { xs: '50px', sm: '80px' },
        fontSize: '16px',
        visibility: 'visible',
        WebkitAnimation: 'fadein 0.5s, fadeout 0.5s 3s',
        animation: 'fadein 0.5s, fadeout 0.5s 3s, ease-in 4s forwards',
        animationFillMode: 'forwards',
        textAlign: 'center',
        alignContent: 'center',
      }}
    >
      {text}
    </Box>
  );
};

export default ShowSampleInfo;

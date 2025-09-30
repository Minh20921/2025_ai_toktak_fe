'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function RedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract the 'url' parameter from the query string
    const urlParam = searchParams.get('url');
    
    if (urlParam) {
      // Store the URL in sessionStorage
      sessionStorage.setItem('DOMEGGOOK_URL', urlParam);
    }
    
    // Redirect to the root route
    router.push('/');
  }, [searchParams, router]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={48} color="primary" />
    </Box>
  );
}

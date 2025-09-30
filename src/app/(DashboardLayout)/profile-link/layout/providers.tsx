'use client';

import type React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#4776EF',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7B8CA8',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: 'var(--font-pretendard)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '16px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
        multiline: true,
        maxRows: 7,
        slotProps: {
          input: {
            disableUnderline: true,
          },
        },
      },
      styleOverrides: {
        root: {
          display: 'flex',
          flexGrow: 1,
          width: '100%',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '10px !important',
        },
        input: {
          '::placeholder': {
            color: '#C5CAD1',
          },
          '&:focus-visible': {
            boxShadow: 'none !important',
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          height: '100%',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#C5CAD1',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          padding: '12px 12px',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4776EF',
            },
          },
        },
        notchedOutline: {
          border: '2px solid #F1F1F1',
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

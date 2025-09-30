import { styled, Switch, SwitchProps, useMediaQuery } from '@mui/material';

export const CustomSwitch = styled(Switch)(({ theme }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    width: isMobile ? 36 : 45,
    height: isMobile ? 22 : 19,
    padding: 0,
    display: 'flex',
    alignItems: 'center',

    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: `translateX(${isMobile ? '13px' : '26px'})`,
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#4776EF',
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      
    },
    '& .MuiSwitch-thumb': {
      width: isMobile ? 18 : 15,
      height: isMobile ? 18 : 15,
      backgroundColor: '#C5CAD1',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
    },
    '& .MuiSwitch-track': {
      borderRadius: 15,
      backgroundColor: '#fff',
      opacity: 1,
      position: 'relative',
      border: '1px solid #C5CAD1',
      '&::before': {
        content: isMobile ? '""' : '"OFF"',
        position: 'absolute',
        right: 5,
        top: isMobile ? '14px' : '9px',
        transform: 'translateY(-50%)',
        fontSize: isMobile ? '12px' : '10px',
        fontWeight: '600',
        color: '#C5CAD1',
        transition: '0.3s',
      },
    },
    '& .Mui-checked .MuiSwitch-thumb': {
      backgroundColor: '#fff',
    },
    '& .Mui-checked + .MuiSwitch-track': {
      border: '1px solid #4776EF',
      '&::before': {
        content: isMobile ? '""' : '"ON"',
        color: '#FFFFFF',
        left: 5,
      },
    },
  };
});
export const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#4776EF',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#4776EF',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#4776EF',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

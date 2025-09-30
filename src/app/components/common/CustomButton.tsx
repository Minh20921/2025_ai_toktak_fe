// CustomButton.tsx
import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  /**
   * Chỉ hỗ trợ 2 variant:
   * - "outlined": viền xanh, nền trong suốt
   * - "contained": nền xanh, chữ trắng
   */
  variant?: 'outlined' | 'contained';
}

const StyledButton = styled(Button, {
  // loại bỏ forward prop 'variant' để nó không bị gửi xuống DOM
  shouldForwardProp: (prop) => prop !== 'variant',
})<CustomButtonProps>(({ variant }) => ({
  // common styles
  fontWeight: 600,
  borderRadius: 24,
  padding: '8px 16px',
  fontSize: 16,
  textTransform: 'none',
  // variant = outlined
  ...(variant === 'outlined' && {
    color: '#4776EF',
    border: '2px solid #4776EF',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(71, 118, 239, 0.1)',
    },
    '&:active': {
      backgroundColor: 'rgba(71, 118, 239, 0.2)',
    },
  }),
  // variant = contained
  ...(variant === 'contained' && {
    color: '#fff',
    backgroundColor: '#4776EF',
    '&:hover': {
      backgroundColor: '#488AFF',
    },
    '&:active': {
      backgroundColor: '#4664DC',
    },
    '&:disabled': {
      backgroundColor: '#E7E7E7',
      color: '#6A6A6A',
      opacity: 0.6,
    },
  }),
}));

const CustomButton: React.FC<CustomButtonProps> = ({ variant = 'outlined', children, ...props }) => {
  return (
    <StyledButton variant={variant} disableElevation {...props}>
      {children}
    </StyledButton>
  );
};

export default CustomButton;

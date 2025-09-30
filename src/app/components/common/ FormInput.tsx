'use client';

import { Box, Typography, TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface FormInputProps extends Omit<TextFieldProps, 'variant' | 'multiline' | 'rows'> {
  label: string;
  required?: boolean;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: '#fff',
    border: '1px solid #F1F1F1',
    borderRadius: 10,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 14,
    height: 40,

    overflow: 'hidden',
    '& textarea': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 0',
    color: '#111',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& input::placeholder': {
    color: '#C5CAD1',
    fontSize: 14,
  },
  '& .MuiInputLabel-root': {
    display: 'none',
  },
}));

export default function FormInput({ label, required, ...props }: FormInputProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography fontSize={{ xs: 12, md: 16 }} fontWeight={500} mb={0.5}>
        <Typography
          component="span"
          sx={{
            fontWeight: 700,
            color: '#272727',
            fontFamily: 'var(--font-pretendard)',
            fontSize: { xs: 12, md: 16 },
            lineHeight: { xs: '16px', md: '19px' },
            letterSpacing: '0px',
            verticalAlign: 'middle',
          }}
        >
          {label}
          {required && (
            <Typography component="span" color="#4776EF" fontWeight="bold" ml={0.3}>
              *
            </Typography>
          )}
        </Typography>
      </Typography>
      <StyledTextField fullWidth rows={1} multiline={false} {...props} />
    </Box>
  );
}

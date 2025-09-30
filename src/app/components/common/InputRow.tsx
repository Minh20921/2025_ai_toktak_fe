import React, { useEffect } from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';
import { IconError, IconSuccess, IconWarning } from '@/utils/icons/icons';

type Status = 'default' | 'error' | 'warning' | 'success';

interface Rule {
  required?: boolean;
  message?: string;
  type?: 'string' | 'number' | 'email';
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: string) => string | null;
}

interface InputRowProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rules?: Rule[];
  status?: Status;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  helperText?: string;
  sx?: TextFieldProps['sx'];
  onValidateError?: (error: string) => void;
  maxLength?: number;
}

const statusColors = {
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
};

const InputRow: React.FC<InputRowProps> = ({
  value,
  onChange,
  rules,
  status = 'default',
  iconStart,
  iconEnd,
  helperText,
  label,
  sx,
  onBlur,
  onValidateError,
  maxLength = 255,
  ...props
}) => {
  const [touched, setTouched] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const validate = (val: string): string | null => {
    if (!rules) return null;
    for (const rule of rules) {
      const msg = rule.message || 'Dữ liệu không hợp lệ';
      if (rule.required && val.trim() === '') return msg;
      if (rule.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return msg;
      }
      if (rule.min && val.length < rule.min) return msg;
      if (rule.max && val.length > rule.max) return msg;
      if (rule.pattern && !rule.pattern.test(val)) return msg;
      if (rule.validator) {
        const res = rule.validator(val);
        if (res) return res;
      }
    }
    return null;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    const error = validate(e.target.value);
    setInternalError(error);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Nếu vượt quá maxLength, không update
    if (maxLength && newValue.length > maxLength) return;

    onChange(e);

    if (touched) {
      setInternalError(validate(newValue));
    }
  };
  const errorState = !!internalError;
  const currentStatus: Status = errorState ? 'error' : status;
  useEffect(() => {
    if (errorState && onValidateError) {
      onValidateError(internalError);
    }
  }, [errorState]);

  const getStatusIcon = () => {
    if (currentStatus === 'success') {
      return <IconSuccess width={20} height={20} color={statusColors.success} />;
    }
    if (currentStatus === 'warning') {
      return <IconWarning width={20} height={20} color={statusColors.warning} />;
    }
    if (currentStatus === 'error') {
      return <IconError width={20} height={20} color={statusColors.error} />;
    }
    return null;
  };

  const showBorder = currentStatus === 'error' || currentStatus === 'warning';
  const borderColor = showBorder ? statusColors[currentStatus] : '#E0E0E0';

  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={errorState}
      helperText={internalError || helperText}
      variant="outlined"
      slotProps={{
        input: {
          startAdornment: iconStart && <InputAdornment position="start">{iconStart}</InputAdornment>,
          endAdornment: <InputAdornment position="end">{iconEnd || getStatusIcon()}</InputAdornment>,
        },
        htmlInput: {
          maxLength: maxLength || null,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 46,
          borderRadius: '10px',
          fontSize: 15,
          paddingX: 2,
          '& textarea': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          '& fieldset': {
            borderColor: borderColor,
          },
          '&:hover fieldset': {
            borderColor: showBorder ? statusColors[currentStatus] : '#4776EF',
          },
          '&.Mui-focused fieldset': {
            borderColor: showBorder ? statusColors[currentStatus] : '#4776EF',
          },
        },
        '& .MuiInputLabel-root': {
          top: '-3px',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default InputRow;

import React from 'react';
import { TextareaAutosize, TextareaAutosizeProps } from '@mui/material';

interface TextareaCustomProps extends TextareaAutosizeProps {
  maxLines?: number;
}

const TextareaCustom: React.FC<TextareaCustomProps> = ({ maxLines = 10, className, style, ...props }) => {
  return (
    <TextareaAutosize
      {...props}
      minRows={1}
      maxRows={maxLines}
      className={`w-full bg-white border-none focus:ring-0 focus:outline-none p-0 text-base font-normal resize-none ${className || ''}`}
      style={{
        lineHeight: '1.5',
        ...style,
      }}
    />
  );
};

export default TextareaCustom;

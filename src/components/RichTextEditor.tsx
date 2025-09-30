'use client';

import dynamic from 'next/dynamic';
import React from 'react';

export type RichTextEditorProps = {
  value: string;
  onChange: (value: string, delta?: any, source?: string, editor?: any) => void;
  height?: number | string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  theme?: string;
  modules?: any;
  formats?: string[];
  bounds?: string | HTMLElement;
  scrollingContainer?: string | HTMLElement;
  tabIndex?: number;
  preserveWhitespace?: boolean;
  onBlur?: (previousRange: any, source: string, editor: any) => void;
  onFocus?: (range: any, source: string, editor: any) => void;
  onChangeSelection?: (selection: any, source: string, editor: any) => void;
};

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false }) as any;

const defaultModules = {
  toolbar: null,
};

export default function RichTextEditor({
  value,
  onChange,
  height = 400,
  placeholder,
  readOnly = false,
  className,
  style,
  theme = 'snow',
  modules,
  formats,
  bounds,
  scrollingContainer,
  tabIndex,
  preserveWhitespace,
  onBlur,
  onFocus,
  onChangeSelection,
}: RichTextEditorProps) {
  const wrapperClassName = ['tok-rte', className].filter(Boolean).join(' ');

  return (
    <>
      <ReactQuill
        value={value}
        onChange={onChange}
        theme={theme}
        placeholder={placeholder}
        readOnly={readOnly}
        className={wrapperClassName}
        style={{ width: '100%', height, ...(style || {}), overflowY: 'hidden', marginBottom: '16px' }}
        modules={modules || defaultModules}
        formats={formats}
        bounds={bounds}
        scrollingContainer={scrollingContainer}
        tabIndex={tabIndex}
        preserveWhitespace={preserveWhitespace}
        onBlur={onBlur}
        onFocus={onFocus}
        onChangeSelection={onChangeSelection}
      />
      <style jsx>{`
        :global(.tok-rte) {
          height: ${typeof height === 'number' ? `${height}px` : height};
          max-height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

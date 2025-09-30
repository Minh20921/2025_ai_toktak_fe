'use client';

import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { uniqueId } from 'lodash';

interface SocialIconProps {
  status?: number;
  size?: number;
  duration?: number;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode; // Accept custom icon
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  status = 0,
  size = 40,
  duration = 2,
  onClick,
  className = '',
  icon, // Custom icon
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [gifSrc, setGifSrc] = useState('');
  // Colors based on status
  const color = status == -1 ? '#A4A4A4' : status == 1 ? 'white' : '#272727'; // Royal blue when true, gray when false
  const colorBG = status == 1 ? '#4169E1' : '#F4F4F4'; // Royal blue when true, gray when false
  const [key] = useState(uniqueId());
  // Handle animation start/stop based on status changes
  useEffect(() => {
    // Clear any existing timer
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }

    if (status == 1) {
      // Start animation
      setIsAnimating(true);

      // Set timer to stop animation after duration
      animationTimerRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, duration * 1000);
    } else {
      // Stop animation immediately when status becomes false
      setIsAnimating(false);
    }

    // Cleanup on unmount
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [status, duration]);

  // Create styles with dynamic values
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${size}px`,
    height: `${size}px`,
  };

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    color: color,
    backgroundColor: colorBG,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: isAnimating ? 5 : 3,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'background-color 0.3s ease',
  };

  // Default icon style (triangle) if no custom icon is provided
  const defaultIconStyle: React.CSSProperties = {
    width: 0,
    height: 0,
    borderTop: `${size * 0.2}px solid transparent`,
    borderBottom: `${size * 0.2}px solid transparent`,
    borderLeft: `${size * 0.3}px solid white`,
    marginLeft: `${size * 0.06}px`,
  };

  const pulseRingStyle = (opacity: number): React.CSSProperties => ({
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: colorBG,
    opacity: isAnimating ? opacity : 0,
    zIndex: isAnimating ? 4 : 2,
  });

  // Create animation keyframes dynamically
  const animationCSS = `
    @keyframes scale-${size}-${key} {
      0% { transform: scale(1); opacity: 1; }
      30% { transform: scale(1.2); opacity: 1; }
      50% { transform: scale(1.3); opacity: 1; }
      60% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse1-${size}-${key} {
      0% { transform: scale(1); opacity: 0; }
      30% { transform: scale(1.6); opacity: 0.2; }
      60% { transform: scale(1.6); opacity: 0.3; }
      100% { transform: scale(1); opacity: 0; }
    }
    
    @keyframes pulse2-${size}-${key} {
      0% { transform: scale(1); opacity: 0; }
      60% { transform: scale(2); opacity: 0.2; }
      90% { transform: scale(1.3); opacity: 0.05; }
      100% { transform: scale(1); opacity: 0; }
    }
    
    .scale-icon-${size}-${key} {
      animation: ${isAnimating ? `scale-${size}-${key} ${duration}s forwards` : 'none'};
    }
    .pulse-ring1-${size}-${key} {
      animation: ${isAnimating && status == 1 ? `pulse1-${size}-${key} ${duration}s forwards` : 'none'};
    }
    
    .pulse-ring2-${size}-${key} {
      animation: ${isAnimating && status == 1 ? `pulse2-${size}-${key} ${duration}s forwards` : 'none'};
    }
  `;
  useEffect(() => {
    if (isAnimating) {
      setGifSrc(`/images/upload/upload_success.gif?timestamp=${new Date().getTime()}`);
    } else {
      setGifSrc(''); // Ẩn GIF khi isAnimating = false
    }
  }, [isAnimating]);
  return (
    <div className={className} style={containerStyle} onClick={onClick}>
      <style dangerouslySetInnerHTML={{ __html: animationCSS }} />

      {/* Main button */}
      <div className={`scale-icon-${size}-${key}`} style={buttonStyle}>
        {/* Render custom icon if provided, otherwise use default triangle */}
        {icon ? <div>{icon}</div> : <div style={defaultIconStyle}></div>}
      </div>

      {/* Animated rings */}
      <div className={`pulse-ring1-${size}-${key}`} style={pulseRingStyle(0.3)}></div>
      <div className={`pulse-ring2-${size}-${key}`} style={pulseRingStyle(0.2)}></div>

      {/* GIF animation if needed */}
      {isAnimating && gifSrc && (
        <img
          src={gifSrc}
          className={`absolute aspect-square object-contain max-w-[150px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}
        />
      )}
      {status == 2 && (
        <img
          src={`/images/upload/upload_failed.gif?timestamp=${new Date().getTime()}`}
          className={`absolute opacity-20 aspect-square max-w-[${size * 2.35}px] -top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2`}
        />
      )}
    </div>
  );
};

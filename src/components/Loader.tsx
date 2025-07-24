'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { useLoadingStore } from '@store/loading';
import { fonts } from '@constants/theme';

// Chomp Logo Animation - reveals solid yellow text from left to right with straight clipping
const fillAnimation = keyframes`
  0% {
    clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
  }
  100% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
`;

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
`;

interface ChompLoadingLogoProps {
  size?: string;
}

const ChompLoadingLogo: React.FC<ChompLoadingLogoProps> = ({ size = '4rem' }) => (
  <Box
    sx={{
      position: 'relative',
      display: 'inline-block',
      overflow: 'visible',
      px: 4,
      py: 2
    }}
  >
    {/* Background chomp text (transparent yellow) */}
    <Typography
      sx={{
        fontFamily: fonts.logo,
        fontWeight: 'normal',
        fontSize: size,
        color: 'rgba(255, 193, 7, 0.3)', // Transparent yellow
        position: 'relative',
        zIndex: 1,
        animation: `${pulseAnimation} 3s ease-in-out infinite`,
        lineHeight: 1,
        userSelect: 'none',
        textTransform: 'lowercase'
      }}
    >
      chomp
    </Typography>

    {/* Foreground chomp text (solid yellow) with animated reveal from left to right */}
    <Typography
      sx={{
        fontFamily: fonts.logo,
        fontWeight: 'normal',
        fontSize: size,
        color: 'secondary.main', // Use brand yellow instead of blue
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        animation: `${fillAnimation} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
        lineHeight: 1,
        userSelect: 'none',
        textTransform: 'lowercase'
      }}
    >
      chomp
    </Typography>
  </Box>
);

// Full viewport Page Loader that stays under the header
export const PageLoader: React.FC = () => {
  const isLoading = useLoadingStore(state => state.isLoading);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme => theme.zIndex.appBar - 1, // Stay under header
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}
    >
      <ChompLoadingLogo size="6rem" />
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          textAlign: 'center',
          fontSize: '1.1rem',
          letterSpacing: '0.05em'
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

// Compact loader for inline use
export const InlineLoader: React.FC<{ size?: string }> = ({ size = '2rem' }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 1
    }}
  >
    <ChompLoadingLogo size={size} />
  </Box>
);

export default PageLoader;

'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigateWithLoading } from '@hooks/useNavigateWithLoading';
import { Header } from '@components/Header';
import { LAYOUT } from '@constants/theme';

export default function NotFound() {
  const navigateWithLoading = useNavigateWithLoading();

  return (
    <>
      {/* Header */}
      <Header />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: `calc(100vh - ${LAYOUT.headerHeight})`,
          width: '100%',
          backgroundColor: 'background.default',
          px: 3,
          py: 8,
          gap: 3
        }}
      >
        {/* Simple "Not Found" title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            color: 'text.primary',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
          }}
        >
          Not Found
        </Typography>

        {/* Simple "Got lost?" text */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            textAlign: 'center',
            fontSize: '1.1rem'
          }}
        >
          Got lost?
        </Typography>

        {/* Home button styled like navbar links */}
        <Button
          onClick={() => navigateWithLoading('/')}
          variant="outlined"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 600,
            fontStyle: 'italic',
            fontSize: '0.875rem',
            padding: '8px 16px',
            borderColor: 'primary.main',
            color: 'primary.main',
            borderRadius: 1,
            backgroundColor: 'transparent',
            '&:hover': {
              borderColor: 'primary.light',
              backgroundColor: 'primary.main',
              color: 'background.default'
            }
          }}
        >
          Return Home
        </Button>
      </Box>
    </>
  );
}

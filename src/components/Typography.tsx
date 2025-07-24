'use client';

import { Typography as MuiTypography, TypographyProps, useTheme } from '@mui/material';
import { forwardRef, ReactNode } from 'react';

// Base heading styles shared across components (risk project inspired)
const baseHeadingStyles = {
  fontWeight: 'bold',
  fontFamily: `var(--font-ibm-plex-mono), SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  textTransform: 'lowercase' as const,
  color: 'text.primary'
};

interface CustomTypographyProps extends Omit<TypographyProps, 'children'> {
  children: ReactNode;
  icon?: ReactNode;
}

export const SectionTitle = forwardRef<HTMLHeadingElement, CustomTypographyProps>(
  ({ children, sx = {}, ...props }, ref) => (
    <MuiTypography
      ref={ref}
      variant="h4"
      gutterBottom
      sx={{
        ...baseHeadingStyles,
        mb: 3,
        fontSize: '1.75rem',
        pb: 1.5,
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  )
);

export const CardTitle = forwardRef<HTMLHeadingElement, CustomTypographyProps>(
  ({ children, sx = {}, icon, ...props }, ref) => (
    <MuiTypography
      ref={ref}
      variant="h5"
      sx={{
        ...baseHeadingStyles,
        mb: 2.5,
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        ...sx
      }}
      {...props}
    >
      {icon && <span style={{ marginRight: '8px', fontSize: '1.25rem' }}>{icon}</span>}
      {children}
    </MuiTypography>
  )
);

export const PageTitle = forwardRef<HTMLHeadingElement, CustomTypographyProps>(
  ({ children, sx = {}, ...props }, ref) => (
    <MuiTypography
      ref={ref}
      variant="h1"
      sx={{
        ...baseHeadingStyles,
        fontSize: { xs: '2rem', sm: '2.9rem' },
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  )
);

export const ModalTitle = forwardRef<HTMLHeadingElement, CustomTypographyProps>(
  ({ children, sx = {}, ...props }, ref) => {
    const theme = useTheme();
    return (
      <MuiTypography
        ref={ref}
        variant="h4"
        sx={{
          ...baseHeadingStyles,
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          color: theme.palette.text.primary,
          ...sx
        }}
        {...props}
      >
        {children}
      </MuiTypography>
    );
  }
);

// Re-export MUI Typography for cases where custom variants aren't needed
export { Typography as MuiTypography } from '@mui/material';

SectionTitle.displayName = 'SectionTitle';
CardTitle.displayName = 'CardTitle';
PageTitle.displayName = 'PageTitle';
ModalTitle.displayName = 'ModalTitle';

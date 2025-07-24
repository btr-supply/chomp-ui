'use client';

import { Link, LinkProps, useTheme } from '@mui/material';
import { Launch as LaunchIcon } from '@mui/icons-material';
import { forwardRef, ReactNode } from 'react';

interface DocumentationLinkProps extends Omit<LinkProps, 'children'> {
  children: ReactNode;
  external?: boolean;
  showIcon?: boolean;
}

export const DocumentationLink = forwardRef<HTMLAnchorElement, DocumentationLinkProps>(
  ({ children, external = true, showIcon = true, sx, ...props }, ref) => {
    const theme = useTheme();

    return (
      <Link
        ref={ref}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          color: theme.palette.functional.link,
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          transition: 'color 0.2s ease',
          '&:hover': {
            color: theme.palette.functional.linkHover,
            textDecoration: 'underline'
          },
          ...sx
        }}
        {...props}
      >
        {children}
        {showIcon && external && (
          <LaunchIcon
            sx={{
              fontSize: 'small',
              ml: 0.25
            }}
          />
        )}
      </Link>
    );
  }
);

DocumentationLink.displayName = 'DocumentationLink';

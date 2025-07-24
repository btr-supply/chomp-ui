'use client';

import React, { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { IconButton, Dialog, Slide, Box, Typography, useMediaQuery, Stack } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { TelegramIcon, GitHubIcon } from '@components/CustomIcons';
import { useNavigateWithLoading } from '@hooks/useNavigateWithLoading';

interface NavigationLink {
  label: string;
  path: string;
}

interface NavigationProps {
  variant?: 'public' | 'admin';
}

// Navigation data based on variant
const PUBLIC_LINKS: NavigationLink[] = [
  { label: 'schema', path: '/resources' },
  { label: 'docs', path: '/docs' }
];

const ADMIN_LINKS: NavigationLink[] = [
  { label: 'dashboard', path: '/dashboard' },
  { label: 'nodes', path: '/dashboard/instances' },
  { label: 'schema', path: '/dashboard/resources' },
  { label: 'config', path: '/dashboard/config' }
];

const Transition = React.forwardRef<unknown, React.ComponentProps<typeof Slide>>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

// Utility function to check if a path is active
const isActivePath = (pathname: string, targetPath: string): boolean => {
  return pathname === targetPath || pathname.startsWith(targetPath + '/');
};

// Reusable NavLink component
interface NavLinkProps {
  label: string;
  path: string;
  onClick: (path: string) => void;
  isMobile?: boolean;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  label,
  path,
  onClick,
  isMobile = false,
  isActive = false
}) => (
  <Typography
    variant={isMobile ? 'h2' : 'button'}
    component="span"
    onClick={() => onClick(path)}
    sx={{
      color: isActive ? 'primary.main' : 'text.secondary',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      px: isMobile ? 0 : 2,
      py: isMobile ? 0 : 1,
      '&:hover': {
        color: 'primary.main'
      }
    }}
  >
    {label}
  </Typography>
);

// Social Links component
const SocialLinks: React.FC<{ size?: 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const iconSize = size === 'large' ? '2.5rem' : '1.6rem';
  const buttonPadding = size === 'large' ? 1.5 : 0.5;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <IconButton
        component="a"
        href="https://t.me/chomp_data"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'text.secondary',
          '&:hover': { color: 'primary.main' },
          transition: 'color 0.2s ease',
          p: buttonPadding
        }}
        aria-label="Telegram"
      >
        <TelegramIcon sx={{ fontSize: iconSize }} />
      </IconButton>
      <IconButton
        component="a"
        href="https://github.com/btr-supply/chomp"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'text.secondary',
          '&:hover': { color: 'primary.main' },
          transition: 'color 0.2s ease',
          p: buttonPadding
        }}
        aria-label="GitHub"
      >
        <GitHubIcon sx={{ fontSize: iconSize }} />
      </IconButton>
    </Stack>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ variant = 'public' }) => {
  const pathname = usePathname();
  const navigateWithLoading = useNavigateWithLoading();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const navigationLinks = variant === 'admin' ? ADMIN_LINKS : PUBLIC_LINKS;

  const handleMobileMenuOpen = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleMobileNavigation = useCallback(
    (path: string) => {
      navigateWithLoading(path);
      setMobileMenuOpen(false);
    },
    [navigateWithLoading]
  );

  const handleDesktopNavigation = useCallback(
    (path: string) => {
      navigateWithLoading(path);
    },
    [navigateWithLoading]
  );

  const handleHomeNavigation = useCallback(() => {
    const homePath = variant === 'admin' ? '/dashboard' : '/';
    navigateWithLoading(homePath);
    setMobileMenuOpen(false);
  }, [navigateWithLoading, variant]);

  if (isMobile) {
    return (
      <>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMobileMenuOpen}
          sx={{ mr: 1, p: 1 }}
        >
          <MenuIcon sx={{ fontSize: '2rem' }} />
        </IconButton>

        <Dialog
          fullScreen
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          TransitionComponent={Transition}
          sx={{
            '& .MuiDialog-paper': {
              bgcolor: 'background.default',
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
            <IconButton
              onClick={handleMobileMenuClose}
              sx={{
                color: 'text.primary',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                p: 1,
                '&:hover': {
                  bgcolor: 'background.paper',
                  borderColor: 'primary.main'
                }
              }}
            >
              <CloseIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
              px: 4
            }}
          >
            <NavLink
              label="home"
              path={variant === 'admin' ? '/dashboard' : '/'}
              onClick={handleHomeNavigation}
              isMobile={true}
              isActive={isActivePath(pathname, variant === 'admin' ? '/dashboard' : '/')}
            />

            {navigationLinks.map(link => (
              <NavLink
                key={link.path}
                label={link.label}
                path={link.path}
                onClick={handleMobileNavigation}
                isMobile={true}
                isActive={isActivePath(pathname, link.path)}
              />
            ))}
          </Box>

          <Box
            sx={{
              pb: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <SocialLinks size="large" />
          </Box>
        </Dialog>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
      {navigationLinks.map(link => (
        <NavLink
          key={link.path}
          label={link.label}
          path={link.path}
          onClick={handleDesktopNavigation}
          isMobile={false}
          isActive={isActivePath(pathname, link.path)}
        />
      ))}
    </Box>
  );
};

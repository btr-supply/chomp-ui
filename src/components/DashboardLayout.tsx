'use client';

import { Box, Stack, Typography, Button, Drawer, List, ListItem, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, SIDEBAR_WIDTH, LAYOUT } from '@constants/theme';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'dashboard', href: ROUTES.DASHBOARD },
  { label: 'nodes', href: ROUTES.INSTANCES },
  { label: 'schema', href: ROUTES.RESOURCES },
  { label: 'config', href: ROUTES.CONFIG }
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const SidebarContent = () => (
    <Stack spacing={0} sx={{ height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.palette.gray[700]}`
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Modak, cursive',
            color: theme.palette.brand[500],
            textTransform: 'uppercase'
          }}
        >
          CHOMP
        </Typography>
        <Typography variant="caption" color={theme.palette.gray[700]}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, p: 2 }}>
        <List sx={{ py: 1 }}>
          {navItems.map(item => (
            <ListItem key={item.href} sx={{ px: 1 }}>
              <Button
                href={item.href}
                component={Link}
                variant="text"
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  fontFamily: theme.typography.button.fontFamily,
                  textTransform: 'lowercase',
                  fontSize: '1.1rem',
                  fontWeight: isActive(item.href) ? 600 : 400,
                  color: isActive(item.href) ? theme.palette.brand[500] : theme.palette.gray[400],
                  '&:hover': {
                    bgcolor: theme.palette.brand[500],
                    color: theme.palette.dark.bg
                  }
                }}
              >
                {item.label}
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.gray[700]}`,
          textAlign: 'center'
        }}
      >
        <Typography variant="caption" color={theme.palette.gray[700]}>
          © 2024 BTR Supply
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: theme.palette.dark.bg, minHeight: '100vh', pt: LAYOUT.headerHeight }}>
      {/* Header */}
      <Header variant="admin" />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', minHeight: `calc(100vh - ${LAYOUT.headerHeight})` }}>
        {/* Desktop Sidebar */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: SIDEBAR_WIDTH,
            bgcolor: theme.palette.dark.surface,
            borderRight: `1px solid ${theme.palette.gray[700]}`
          }}
        >
          <SidebarContent />
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              bgcolor: theme.palette.dark.surface,
              borderRight: `1px solid ${theme.palette.gray[700]}`
            }
          }}
        >
          <SidebarContent />
        </Drawer>

        {/* Page Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>{children}</Box>
          {/* Footer */}
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Slide,
  useTheme,
  useMediaQuery,
  Backdrop
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { forwardRef, ReactNode } from 'react';
import type { SlideProps } from '@mui/material/Slide';

// Slide transition component
const Transition = forwardRef<HTMLDivElement, SlideProps>(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disableBackdropClick?: boolean;
}

export const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      maxWidth = 'sm',
      fullWidth = true,
      disableBackdropClick = false
    },
    ref
  ) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disableBackdropClick) {
        event.preventDefault();
        return;
      }
      onClose();
    };

    return (
      <Dialog
        ref={ref}
        open={open}
        onClose={onClose}
        fullScreen={isMobile}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        TransitionComponent={Transition}
        slots={{
          backdrop: Backdrop
        }}
        slotProps={{
          backdrop: {
            onClick: handleBackdropClick,
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark backdrop with blur effect
              backdropFilter: 'blur(4px)'
            }
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : 2, // No radius on mobile, 16px on desktop
            border: `1px solid ${theme.palette.functional.border}`,
            bgcolor: theme.palette.dark.surface,
            backgroundImage: 'none',
            boxShadow: 'none',
            overflow: 'hidden',
            ...(isMobile && {
              margin: 0,
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              maxWidth: '100%'
            })
          }
        }}
      >
        {/* Close button - always visible, positioned in top right */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.dark.surface,
              border: `1px solid ${theme.palette.functional.border}`,
              p: 1,
              '&:hover': {
                bgcolor: theme.palette.dark.surface,
                borderColor: theme.palette.functional.borderLight
              }
            }}
          >
            <CloseIcon sx={{ fontSize: isMobile ? '2rem' : '1.5rem' }} />
          </IconButton>
        </Box>

        {/* Title */}
        {title && (
          <DialogTitle
            sx={{
              pt: 3,
              pr: 8, // Account for close button
              pb: 2,
              px: 3,
              borderBottom: `1px solid ${theme.palette.functional.border}`,
              bgcolor: theme.palette.dark.surface,
              fontWeight: 700,
              fontSize: isMobile ? '1.5rem' : '1.25rem',
              textTransform: 'lowercase',
              color: theme.palette.text.primary
            }}
          >
            {title}
          </DialogTitle>
        )}

        {/* Content */}
        <DialogContent
          sx={{
            p: 3,
            bgcolor: theme.palette.dark.surface,
            color: theme.palette.text.primary,
            ...(isMobile && {
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            })
          }}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);

BaseModal.displayName = 'BaseModal';

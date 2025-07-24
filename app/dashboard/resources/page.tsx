'use client';

import {
  Box,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme
} from '@mui/material';
import { Refresh as RefreshIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { DashboardLayout } from '@components/DashboardLayout';

const resources = [
  {
    title: 'GitHub Repository',
    description: 'View the source code, report issues, and contribute to the project.',
    link: 'https://github.com/btr-supply/chomp'
  },
  {
    title: 'API Documentation',
    description: 'Detailed documentation for the Chomp REST API and WebSocket endpoints.',
    link: '/docs/api.md'
  },
  {
    title: 'Frontend Specification',
    description: 'Architectural overview and component guidelines for the frontend application.',
    link: '/docs/front-end.md'
  },
  {
    title: 'Deployment Guide',
    description: 'Instructions for deploying Chomp to production environments.',
    link: '/docs/deployment.md'
  },
  {
    title: 'Ingester Configuration',
    description: 'Learn how to configure data ingesters for various sources.',
    link: '/docs/ingesters.md'
  },
  {
    title: 'Telegram Community',
    description: 'Join the community chat for support and discussion.',
    link: 'https://t.me/chomp_ingester'
  }
];

export default function ResourcesPage() {
  const theme = useTheme();

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Resources
            </Typography>
            <Typography color={theme.palette.text.secondary}>
              Links to documentation and external resources
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            size="small"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {resources.map(resource => (
            <Grid
              key={resource.title}
              size={{
                xs: 12,
                md: 6,
                lg: 4
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" component="h2">
                      {resource.title}
                    </Typography>
                    <OpenInNewIcon
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: 20,
                        ml: 1,
                        flexShrink: 0
                      }}
                    />
                  </Stack>
                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {resource.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                  <Button
                    component="a"
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="text"
                    color="primary"
                    size="small"
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}

'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  Switch,
  Button,
  TextField,
  Select,
  MenuItem,
  useTheme,
  Alert,
  Chip,
  FormControlLabel
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useState } from 'react';
import { DashboardLayout } from '@components/DashboardLayout';

export default function ConfigPage() {
  const theme = useTheme();

  // Mock configuration state
  const [config, setConfig] = useState({
    // Rate Limiting
    rateLimitEnabled: true,
    rateLimitRequests: 1000,
    rateLimitWindow: 60,
    rateLimitBurst: 100,

    // API Settings
    apiTimeout: 30,
    maxConnections: 100,
    enableCors: true,
    corsOrigins: 'http://localhost:3000,https://chomp.btr.supply',

    // Data Sources
    enableBinance: true,
    enableCoinbase: true,
    enableKraken: false,
    dataRetention: 30,

    // Monitoring
    enableMetrics: true,
    metricsInterval: 60,
    enableAlerts: true,
    alertThreshold: 95,

    // Security
    jwtExpiry: 24,
    enableLogging: true,
    logLevel: 'info',

    // Performance
    cacheEnabled: true,
    cacheTtl: 300,
    compressionEnabled: true
  });

  const handleSave = () => {
    // In real app, this would save to API
    // For now just simulate success
    alert('Configuration Saved: Settings have been updated successfully');
  };

  const handleReset = () => {
    // Reset to defaults
    alert('Configuration Reset: Settings have been reset to defaults');
  };

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        {/* Page Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Configuration
            </Typography>
            <Typography color={theme.palette.text.secondary}>
              System settings and rate limiting
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              size="small"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              size="small"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>

        {/* Configuration Sections */}
        <Grid container spacing={3}>
          {/* Rate Limiting */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
          >
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6">Rate Limiting</Typography>
                  <Chip
                    label={config.rateLimitEnabled ? 'Enabled' : 'Disabled'}
                    color={config.rateLimitEnabled ? 'success' : 'error'}
                    size="small"
                  />
                </Stack>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.rateLimitEnabled}
                        onChange={e => setConfig({ ...config, rateLimitEnabled: e.target.checked })}
                      />
                    }
                    label="Enable Rate Limiting"
                  />

                  <TextField
                    label="Requests per Window"
                    type="number"
                    value={config.rateLimitRequests}
                    onChange={e =>
                      setConfig({ ...config, rateLimitRequests: parseInt(e.target.value) })
                    }
                    inputProps={{ min: 1, max: 10000 }}
                    size="small"
                    fullWidth
                  />

                  <TextField
                    label="Window Size (seconds)"
                    type="number"
                    value={config.rateLimitWindow}
                    onChange={e =>
                      setConfig({ ...config, rateLimitWindow: parseInt(e.target.value) })
                    }
                    inputProps={{ min: 1, max: 3600 }}
                    size="small"
                    fullWidth
                  />

                  <TextField
                    label="Burst Limit"
                    type="number"
                    value={config.rateLimitBurst}
                    onChange={e =>
                      setConfig({ ...config, rateLimitBurst: parseInt(e.target.value) })
                    }
                    inputProps={{ min: 1, max: 1000 }}
                    size="small"
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* API Settings */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  API Settings
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    label="Request Timeout (seconds)"
                    type="number"
                    value={config.apiTimeout}
                    onChange={e => setConfig({ ...config, apiTimeout: parseInt(e.target.value) })}
                    inputProps={{ min: 1, max: 300 }}
                    size="small"
                    fullWidth
                  />

                  <TextField
                    label="Maximum Connections"
                    type="number"
                    value={config.maxConnections}
                    onChange={e =>
                      setConfig({ ...config, maxConnections: parseInt(e.target.value) })
                    }
                    inputProps={{ min: 1, max: 1000 }}
                    size="small"
                    fullWidth
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableCors}
                        onChange={e => setConfig({ ...config, enableCors: e.target.checked })}
                      />
                    }
                    label="Enable CORS"
                  />

                  <TextField
                    label="CORS Origins"
                    value={config.corsOrigins}
                    onChange={e => setConfig({ ...config, corsOrigins: e.target.value })}
                    placeholder="https://example.com,https://app.example.com"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Sources */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Data Sources
                </Typography>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableBinance}
                        onChange={e => setConfig({ ...config, enableBinance: e.target.checked })}
                      />
                    }
                    label="Enable Binance"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableCoinbase}
                        onChange={e => setConfig({ ...config, enableCoinbase: e.target.checked })}
                      />
                    }
                    label="Enable Coinbase"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableKraken}
                        onChange={e => setConfig({ ...config, enableKraken: e.target.checked })}
                      />
                    }
                    label="Enable Kraken"
                  />

                  <TextField
                    label="Data Retention (days)"
                    type="number"
                    value={config.dataRetention}
                    onChange={e =>
                      setConfig({ ...config, dataRetention: parseInt(e.target.value) })
                    }
                    inputProps={{ min: 1, max: 365 }}
                    size="small"
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Monitoring */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Monitoring
                </Typography>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableMetrics}
                        onChange={e => setConfig({ ...config, enableMetrics: e.target.checked })}
                      />
                    }
                    label="Enable Metrics"
                  />

                  <TextField
                    label="Metrics Interval (seconds)"
                    type="number"
                    value={config.metricsInterval}
                    onChange={e =>
                      setConfig({ ...config, metricsInterval: parseInt(e.target.value) })
                    }
                    inputProps={{ min: 10, max: 3600 }}
                    size="small"
                    fullWidth
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableAlerts}
                        onChange={e => setConfig({ ...config, enableAlerts: e.target.checked })}
                      />
                    }
                    label="Enable Alerts"
                  />

                  <TextField
                    label="Alert Threshold (%)"
                    type="number"
                    value={config.alertThreshold}
                    onChange={e =>
                      setConfig({ ...config, alertThreshold: parseInt(e.target.value) })
                    }
                    inputProps={{ min: 1, max: 100 }}
                    size="small"
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Security */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Security
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    label="JWT Expiry (hours)"
                    type="number"
                    value={config.jwtExpiry}
                    onChange={e => setConfig({ ...config, jwtExpiry: parseInt(e.target.value) })}
                    inputProps={{ min: 1, max: 168 }}
                    size="small"
                    fullWidth
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableLogging}
                        onChange={e => setConfig({ ...config, enableLogging: e.target.checked })}
                      />
                    }
                    label="Enable Logging"
                  />

                  <FormControl size="small" fullWidth>
                    <FormLabel>Log Level</FormLabel>
                    <Select
                      value={config.logLevel}
                      onChange={e => setConfig({ ...config, logLevel: e.target.value })}
                    >
                      <MenuItem value="debug">Debug</MenuItem>
                      <MenuItem value="info">Info</MenuItem>
                      <MenuItem value="warning">Warning</MenuItem>
                      <MenuItem value="error">Error</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Performance
                </Typography>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.cacheEnabled}
                        onChange={e => setConfig({ ...config, cacheEnabled: e.target.checked })}
                      />
                    }
                    label="Enable Caching"
                  />

                  <TextField
                    label="Cache TTL (seconds)"
                    type="number"
                    value={config.cacheTtl}
                    onChange={e => setConfig({ ...config, cacheTtl: parseInt(e.target.value) })}
                    inputProps={{ min: 1, max: 3600 }}
                    size="small"
                    fullWidth
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.compressionEnabled}
                        onChange={e =>
                          setConfig({ ...config, compressionEnabled: e.target.checked })
                        }
                      />
                    }
                    label="Enable Compression"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Info Panel */}
        <Alert severity="info">
          Configuration changes will take effect after saving and may require a system restart for
          some settings.
        </Alert>
      </Stack>
    </DashboardLayout>
  );
}

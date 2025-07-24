'use client';

import { Box, Stack, Button, Typography, Container, Paper, useTheme } from '@mui/material';
import { logError, logWarning, logInfo } from '@store/logs';

export default function TestLogsPage() {
  const theme = useTheme();

  const generateTestError = () => {
    try {
      // Simulate an error
      throw new Error('This is a test error with stack trace');
    } catch (error) {
      logError(error as Error, {
        testContext: 'Error demonstration',
        severity: 'high',
        component: 'TestLogsPage'
      });
    }
  };

  const generateTestWarning = () => {
    logWarning('This is a test warning message', {
      testContext: 'Warning demonstration',
      severity: 'medium',
      component: 'TestLogsPage'
    });
  };

  const generateTestInfo = () => {
    logInfo('This is a test info message', {
      testContext: 'Info demonstration',
      severity: 'low',
      component: 'TestLogsPage'
    });
  };

  const generateMultipleErrors = () => {
    // Generate multiple of the same error to test deduplication
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        logError(new Error('Repeated error for deduplication test'), {
          iteration: i + 1,
          testType: 'deduplication'
        });
      }, i * 100);
    }
  };

  const generateMixedLogs = () => {
    const messages = [
      () => logError(new Error('Database connection failed'), { db: 'primary' }),
      () => logWarning('High memory usage detected', { memory: '85%' }),
      () => logInfo('User authentication successful', { user: 'test@example.com' }),
      () => logError(new Error('API rate limit exceeded'), { endpoint: '/api/data' }),
      () => logWarning('Slow query detected', { duration: '2.5s' }),
      () => logInfo('Cache cleared successfully', { cache: 'redis' })
    ];

    messages.forEach((logFn, index) => {
      setTimeout(logFn, index * 200);
    });
  };

  const simulateNetworkError = () => {
    // Simulate a network error that would normally be caught silently
    const error = new Error('Network request failed');
    error.name = 'NetworkError';
    logError(error, {
      url: 'https://api.example.com/data',
      method: 'GET',
      status: 500,
      timeout: 5000
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            NotificationStack Test Page
          </Typography>
          <Typography color={theme.palette.text.secondary}>
            This page demonstrates the NotificationStack functionality. Use the buttons below to
            generate different types of logs and test the features described in the specification.
          </Typography>
        </Box>

        <Paper sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Log Generation
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary} sx={{ mb: 2 }}>
            Test the time-ordered display, level filtering, and search functionality.
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button variant="contained" color="error" onClick={generateTestError}>
              Generate Error
            </Button>
            <Button variant="contained" color="warning" onClick={generateTestWarning}>
              Generate Warning
            </Button>
            <Button variant="contained" color="info" onClick={generateTestInfo}>
              Generate Info
            </Button>
            <Button variant="outlined" color="secondary" onClick={generateMultipleErrors}>
              Test Deduplication
            </Button>
            <Button variant="outlined" color="secondary" onClick={generateMixedLogs}>
              Generate Mixed Logs
            </Button>
            <Button variant="outlined" onClick={simulateNetworkError}>
              Simulate Network Error
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Feature Testing Guide
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                1. Time Ordering:
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Generate multiple logs and verify they appear in newest-first order within date
                groups.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                2. Search Functionality:
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Generate mixed logs, then use the search bar to filter by keywords like
                &quot;database&quot;, &quot;memory&quot;, etc.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                3. Level Filtering:
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Use the dropdown to filter by ERROR, WARNING, INFO, or ALL.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                4. Hover Controls:
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Hover over any log entry to see individual action buttons (Copy, Save, Report,
                Delete).
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                5. Single Log Mode:
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Click on any log to expand it. Notice how the top action bar changes to operate only
                on that log.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                6. JSON Export Format:
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Copy or download logs to see the structured JSON format with metadata (user agent,
                timestamp, etc.).
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                7. Date Grouping:
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Logs are automatically grouped by &quot;TODAY&quot;, &quot;YESTERDAY&quot;, or
                specific dates.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                8. Deduplication:
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Click &quot;Test Deduplication&quot; to see how identical errors are counted instead
                of repeated.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Expected Behaviors
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              ✅ Logs appear in time-ordered sequence (newest first)
            </Typography>
            <Typography variant="body2">
              ✅ Search filters logs by message content in real-time
            </Typography>
            <Typography variant="body2">✅ Level filtering works with search combined</Typography>
            <Typography variant="body2">✅ Hover shows individual log controls</Typography>
            <Typography variant="body2">
              ✅ Click expands log and changes action bar behavior
            </Typography>
            <Typography variant="body2">✅ Export includes user agent and metadata</Typography>
            <Typography variant="body2">
              ✅ All copy/download operations show toast notifications
            </Typography>
            <Typography variant="body2">✅ Log deduplication works for identical errors</Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

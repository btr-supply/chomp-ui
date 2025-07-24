'use client';

import {
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
  Collapse,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Paper,
  useTheme
} from '@mui/material';
import { BaseModal } from './BaseModal';
import {
  ContentCopy as ContentCopyIcon,
  Save as SaveIcon,
  BugReport as BugReportIcon,
  Notifications as NotificationsIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { useLogStore, type LogEntry } from '@store/logs';
import { copyNotify, saveAsNotify } from '@utils/clipboard';

interface NotificationRowProps {
  log: LogEntry;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onHover: (hovering: boolean) => void;
  showControls: boolean;
}

function NotificationRow({
  log,
  isExpanded,
  onToggleExpand,
  onHover,
  showControls
}: NotificationRowProps) {
  const { removeLog } = useLogStore();
  const theme = useTheme();

  const getIcon = () => {
    switch (log.level) {
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: 20 }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />;
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const logData = {
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      title: log.title,
      message: log.message,
      stack: log.stack,
      context: log.context
    };

    await copyNotify(logData, true, true, undefined);
  };

  const handleSave = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const logData = {
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      title: log.title,
      message: log.message,
      stack: log.stack,
      context: log.context
    };

    const filename = `chomp-log-${log.id}-${new Date().toISOString().split('T')[0]}.json`;
    const content = JSON.stringify(logData, null, 2);
    saveAsNotify(filename, content, true, undefined);
  };

  const handleReport = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const logData = {
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      title: log.title,
      message: log.message,
      stack: log.stack,
      context: log.context
    };

    const success = await copyNotify(logData, true, true, undefined);
    if (success) {
      window.open('https://t.me/chomp_ingester', '_blank');
      alert('Telegram opened: Paste the log data in the Telegram group');
    }
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    removeLog(log.id);
    alert('Log deleted');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: theme.palette.dark.surface,
        border: `1px solid ${theme.palette.functional.border}`,
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: theme.palette.functional.borderLight,
          backgroundColor: 'rgba(255, 255, 255, 0.03)'
        }
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onToggleExpand}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center" flex={1}>
          {getIcon()}
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontFamily: 'monospace'
            }}
          >
            {formatTime(log.timestamp)}
          </Typography>
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {log.title}
          </Typography>
          {log.count && log.count > 1 && (
            <Chip
              label={`${log.count}x`}
              color="error"
              size="small"
              sx={{ fontSize: '10px', height: 18 }}
            />
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          <Tooltip title="Copy">
            <IconButton size="small" onClick={handleCopy}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save as JSON">
            <IconButton size="small" onClick={handleSave}>
              <SaveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Report bug">
            <IconButton size="small" onClick={handleReport}>
              <BugReportIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              onToggleExpand();
            }}
          >
            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={isExpanded}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {log.message}
          </Typography>

          {log.stack && (
            <Box>
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ mb: 1, color: theme.palette.text.secondary }}
              >
                Stack Trace:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  backgroundColor: theme.palette.dark.formula,
                  border: `1px solid ${theme.palette.functional.border}`,
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}
              >
                {log.stack}
              </Paper>
            </Box>
          )}

          {log.context && Object.keys(log.context).length > 0 && (
            <Box>
              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{ mb: 1, color: theme.palette.text.secondary }}
              >
                Context:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  backgroundColor: theme.palette.dark.formula,
                  border: `1px solid ${theme.palette.functional.border}`,
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto',
                  maxHeight: '150px'
                }}
              >
                {JSON.stringify(log.context, null, 2)}
              </Paper>
            </Box>
          )}
        </Stack>
      </Collapse>
    </Paper>
  );
}

// NotificationGroup: groups logs by date and renders NotificationRow for each
function NotificationGroup({
  date,
  logs,
  expandedLog,
  setExpanded,
  hoveredLog,
  setHoveredLog
}: {
  date: string;
  logs: LogEntry[];
  expandedLog: string | null;
  setExpanded: (id: string | null) => void;
  hoveredLog: string | null;
  setHoveredLog: (id: string | null) => void;
}) {
  const theme = useTheme();
  return (
    <Box key={date}>
      <Typography
        variant="caption"
        fontWeight="bold"
        sx={{
          color: theme.palette.text.secondary,
          mb: 1,
          display: 'block',
          textTransform: 'uppercase'
        }}
      >
        {date}
      </Typography>
      <Stack spacing={1}>
        {logs.map(log => (
          <NotificationRow
            key={log.id}
            log={log}
            isExpanded={expandedLog === log.id}
            onToggleExpand={() => setExpanded(expandedLog === log.id ? null : log.id)}
            onHover={hovering => setHoveredLog(hovering ? log.id : null)}
            showControls={hoveredLog === log.id || expandedLog === log.id}
          />
        ))}
      </Stack>
    </Box>
  );
}

// Date grouping utility
function groupLogsByDate(logs: LogEntry[]): Array<{ date: string; logs: LogEntry[] }> {
  const groups = new Map<string, LogEntry[]>();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  logs.forEach(log => {
    const logDate = new Date(log.timestamp);
    let dateKey: string;

    if (logDate.toDateString() === today.toDateString()) {
      dateKey = 'TODAY';
    } else if (logDate.toDateString() === yesterday.toDateString()) {
      dateKey = 'YESTERDAY';
    } else {
      dateKey = logDate
        .toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })
        .toUpperCase();
    }

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(log);
  });

  // Sort groups by date (most recent first)
  const sortedGroups = Array.from(groups.entries())
    .map(([date, logs]) => ({ date, logs }))
    .sort((a, b) => {
      if (a.date === 'TODAY') return -1;
      if (b.date === 'TODAY') return 1;
      if (a.date === 'YESTERDAY') return -1;
      if (b.date === 'YESTERDAY') return 1;
      return 0; // Other dates maintain their relative order
    });

  return sortedGroups;
}

export function NotificationStack() {
  const {
    logs,
    isOpen,
    expandedLog,
    searchQuery,
    filterLevel,
    toggleNotifications,
    setExpanded,
    clearLogs,
    exportLogs,
    reportBug,
    setSearchQuery,
    setFilterLevel,
    getFilteredLogs
  } = useLogStore();

  const [hoveredLog, setHoveredLog] = useState<string | null>(null);
  const theme = useTheme();

  // Get filtered logs and group by date
  const filteredLogs = useMemo(() => getFilteredLogs(), [getFilteredLogs]);
  const groupedLogs = useMemo(() => groupLogsByDate(filteredLogs), [filteredLogs]);

  if (!isOpen) {
    return null;
  }

  // Check if we're in single log mode (when a log is expanded)
  const isInSingleLogMode = expandedLog !== null;
  const currentExpandedLog = isInSingleLogMode
    ? logs.find((log: LogEntry) => log.id === expandedLog)
    : null;

  const renderLogContent = (log: LogEntry) => {
    if (!log) return '';
    return typeof log.message === 'object' ? JSON.stringify(log.message, null, 2) : log.message;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const handleClear = () => {
    clearLogs();
    alert('Logs cleared');
  };

  const handleExport = () => {
    if (isInSingleLogMode && currentExpandedLog) {
      const exported = exportLogs('single', expandedLog);
      const filename = `chomp-log-${expandedLog}-${new Date().toISOString().split('T')[0]}.json`;
      saveAsNotify(filename, exported, true, undefined);
    } else {
      const exported = exportLogs('full');
      const filename = `chomp-logs-${new Date().toISOString().split('T')[0]}.json`;
      saveAsNotify(filename, exported, true, undefined);
    }
  };

  const handleBugReport = () => {
    if (isInSingleLogMode && expandedLog) {
      reportBug(expandedLog);
    } else {
      reportBug();
    }
    alert('Bug Report Created: A bug report has been opened on GitHub with the current logs.');
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={toggleNotifications}
      title="NOTIFICATIONS"
      maxWidth="md"
      disableBackdropClick={false}
    >
      {/* Header Actions */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: 2,
          p: 2,
          borderBottom: `1px solid ${theme.palette.functional.border}`,
          backgroundColor: theme.palette.dark.surface
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {logs.length > 0 && (
            <Chip label={`${filteredLogs.length}/${logs.length}`} size="small" variant="outlined" />
          )}
          {isInSingleLogMode && currentExpandedLog && (
            <Chip label="SINGLE LOG" size="small" color="primary" variant="outlined" />
          )}
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title={isInSingleLogMode ? 'Copy this log' : 'Copy all logs'}>
            <IconButton
              size="small"
              onClick={() => handleCopy(renderLogContent(currentExpandedLog!))}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={isInSingleLogMode ? 'Save this log' : 'Save all logs'}>
            <IconButton size="small" onClick={handleExport}>
              <SaveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={isInSingleLogMode ? 'Report this log' : 'Report all logs'}>
            <IconButton size="small" onClick={handleBugReport}>
              <BugReportIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear all">
            <IconButton size="small" onClick={handleClear}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Search and Filter */}
      {!isInSingleLogMode && (
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.functional.border}` }}>
          <Stack spacing={1}>
            <TextField
              size="small"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.dark.surface,
                  '& fieldset': {
                    borderColor: theme.palette.functional.border
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.functional.borderLight
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.functional.link
                  }
                }
              }}
            />
            <FormControl size="small" fullWidth>
              <Select
                value={filterLevel}
                onChange={e =>
                  setFilterLevel(e.target.value as 'all' | 'error' | 'warning' | 'info')
                }
                sx={{
                  bgcolor: theme.palette.dark.surface,
                  '& fieldset': {
                    borderColor: theme.palette.functional.border
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.functional.borderLight
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.functional.link
                  }
                }}
              >
                <MenuItem value="all">ALL</MenuItem>
                <MenuItem value="error">ERROR</MenuItem>
                <MenuItem value="warning">WARNING</MenuItem>
                <MenuItem value="info">INFO</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      )}

      {/* Content */}
      <Box sx={{ p: 2, maxHeight: '60vh', overflowY: 'auto' }}>
        {filteredLogs.length === 0 ? (
          <Stack
            spacing={2}
            alignItems="center"
            sx={{ py: 4, color: theme.palette.text.secondary }}
          >
            <NotificationsIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2" textAlign="center">
              {logs.length === 0 ? 'No notifications yet' : 'No logs match your search'}
            </Typography>
          </Stack>
        ) : isInSingleLogMode && currentExpandedLog ? (
          <NotificationRow
            key={currentExpandedLog.id}
            log={currentExpandedLog}
            isExpanded={true}
            onToggleExpand={() => setExpanded(null)}
            onHover={hovering => setHoveredLog(hovering ? currentExpandedLog.id : null)}
            showControls={true}
          />
        ) : (
          <Stack spacing={2}>
            {groupedLogs.map(group => (
              <NotificationGroup
                key={group.date}
                date={group.date}
                logs={group.logs}
                expandedLog={expandedLog}
                setExpanded={setExpanded}
                hoveredLog={hoveredLog}
                setHoveredLog={setHoveredLog}
              />
            ))}
          </Stack>
        )}
      </Box>
    </BaseModal>
  );
}

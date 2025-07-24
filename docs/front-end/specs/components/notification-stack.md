# Notification Stack & Log Viewer Specification

This document details the functionality of the `NotificationStack` component, which provides a comprehensive logging and notification system for the Chomp frontend application.

## 1. Overview

The NotificationStack is a sophisticated logging interface that captures, displays, and manages system messages, errors, and notifications. It consists of a floating notification button and an expandable panel that provides detailed log management capabilities with time-ordered display and comprehensive filtering options.

## 2. Component States

### 2.1. Collapsed State (Floating Button)

When closed, the component appears as:

- A floating notification bell icon button positioned at the top-right of the screen
- A red badge showing the count of unread notifications (if any exist)
- Clicking opens the full notification panel

### 2.2. Expanded State (Full Panel)

When open, displays a comprehensive notification management interface:

- **Dimensions**: Fixed width (400px), maximum height (80vh)
- **Position**: Top-right corner of the screen
- **Styling**: Dark theme with rounded corners and shadow

## 3. Panel Structure

### 3.1. Header Section

- **Title**: "NOTIFICATIONS" in bold text
- **Count Badge**: Shows total number of notifications
- **Action Icons** (right side):
  - Copy all logs to clipboard (as structured JSON)
  - Download all logs as JSON file
  - Report bug (copies logs and opens Telegram for manual reporting)
  - Clear all notifications
  - Close panel (X button)

### 3.2. Search and Filter Section

- **Search Bar**: "Search notifications..." input field with search icon for filtering by message content
- **Filter Dropdown**: "ALL" dropdown to filter by log level:
  - ALL (default - shows all log levels)
  - ERROR (shows only error logs)
  - WARNING (shows only warning logs)
  - INFO (shows only info logs)

### 3.3. Content Area

- **Default Ordering**: Logs are displayed in **time-ordered sequence** (newest first) by default
- **Empty State**: Shows notification icon with "No notifications yet" message
- **Log Entries**: Scrollable list of notification items grouped by date sections

## 4. Log Entry Structure & Behavior

### 4.1. Default Log Entry Display

Each log entry displays in collapsed state:

- **Status Icon**: Color-coded icon based on log level
  - Red circle with exclamation for errors
  - Yellow triangle with exclamation for warnings
  - Blue circle with "i" for info
- **Timestamp**: Time in HH:MM:SSPM format
- **Title/Message**: Main log message text (truncated if necessary)
- **Count Badge**: Red badge showing repetition count when logs are deduplicated (e.g., "190x", "13x")

### 4.2. Hover State Behavior

When hovering over a log entry:

- **Hover Controls Appear**: Action buttons specific to that log entry
  - Copy (copies individual log as JSON)
  - Download (downloads individual log as JSON file)
  - Report (copies individual log and opens Telegram)
  - Delete (removes this specific log entry)
- **Visual Feedback**: Subtle background highlight to indicate hover state

### 4.3. Clicked/Expanded State Behavior

When clicking on a log entry:

- **Message Expansion**: Full log message, stack trace, and context are displayed
- **Action Bar Transformation**: The top action bar now operates **only on this single expanded log**
  - Copy button: copies only this log entry
  - Download button: downloads only this log entry
  - Report button: reports only this log entry
  - Delete button: deletes only this log entry
- **Stack Trace Display**: Code stack trace in scrollable code block (if available)
- **Context Display**: Additional context data in formatted JSON (if available)
- **Collapse Option**: Click again or use collapse button to return to default view

### 4.4. Date Grouping

Log entries are organized by date sections:

- "TODAY" for current day entries
- "WEDNESDAY, JUNE 4" format for previous days
- **Time Ordering**: Within each date group, entries are ordered by timestamp (newest first)

## 5. Interactive Features & Controls

### 5.1. Top-Level Controls (All Logs)

**Default State** - operates on entire log stack:

- **Copy All**: Copies complete log stack as structured JSON to clipboard
- **Download All**: Downloads complete log stack as timestamped JSON file
- **Report All**: Copies complete log stack and opens Telegram for manual bug reporting
- **Clear All**: Removes all log entries from the stack
- **Search**: Real-time filtering by message content across all logs
- **Filter**: Show/hide logs by severity level (All, Error, Warning, Info)

**Single Log Focused State** - when a log is expanded, controls operate only on that log:

- **Copy**: Copies only the expanded log entry as JSON
- **Download**: Downloads only the expanded log entry as JSON file
- **Report**: Reports only the expanded log entry via Telegram
- **Delete**: Removes only the expanded log entry

### 5.2. Individual Log Hover Controls

Available when hovering over any log entry:

- **Copy**: Copies this specific log entry as JSON to clipboard
- **Download**: Downloads this specific log as JSON file
- **Report**: Copies this specific log and opens Telegram for bug reporting
- **Delete**: Removes this specific log entry from the stack

### 5.3. Search and Filter Functionality

- **Real-time Search**: Filters logs by message content as user types
- **Level Filtering**: Dropdown to show only specific log levels
- **Combined Filtering**: Search and level filters work together
- **Filter Persistence**: Selected filters remain active until changed

## 6. Data Management & Export Format

### 6.1. Log Entry Structure

```typescript
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  count?: number; // For deduplicated entries
}
```

### 6.2. Export JSON Format

When copying or downloading logs, the JSON structure includes metadata:

```typescript
interface LogExport {
  metadata: {
    userAgent: string;
    exportTimestamp: string; // ISO format
    totalLogs: number;
    exportType: 'full' | 'single'; // Indicates if all logs or single log
  };
  logs: LogEntry[];
}
```

### 6.3. State Management

- Uses Zustand store (`useLogStore`) for global state management
- **Time Ordering**: Maintains logs in chronological order (newest first)
- **Persistence**: Logs persist across page refreshes using local storage
- **Panel State**: Tracks open/closed state and currently expanded log
- **Deduplication**: Identical logs are counted rather than duplicated
- **Search State**: Maintains current search query and filter selection

## 7. External Integration Behavior

### 7.1. Telegram Integration

- **Manual Process**: Currently opens Telegram with copied log data for manual pasting
- **Future Enhancement**: Will directly report to backend with automatic notification system
- **Data Format**: Uses the same structured JSON export format
- **User Flow**:
  1. Click report button
  2. Log data automatically copied to clipboard
  3. Telegram opens in new tab/window
  4. User pastes the JSON data manually

### 7.2. File Operations

- **Download Naming**: Files named with timestamp format: `chomp-logs-YYYY-MM-DD-HH-MM-SS.json`
- **Clipboard Operations**: All copy operations provide user feedback via toast notifications
- **Error Handling**: Failed operations show appropriate error messages

## 8. Visual Design & User Experience

### 8.1. Color Scheme & Visual Hierarchy

- **Background**: Dark theme (gray.800) for reduced eye strain
- **Text**: White/light gray with proper contrast ratios
- **Status Colors**:
  - **Error Icons**: Red (#E53E3E) for critical issues
  - **Warning Icons**: Yellow (#D69E2E) for attention items
  - **Info Icons**: Blue (#3182CE) for informational messages
- **Interactive Elements**: Consistent hover states and button styling
- **Count Badges**: Red background with white text for visibility

### 8.2. Typography & Layout

- **Header**: Page title, larger font size for clear hierarchy
- **Timestamps**: Monospace font for alignment and readability
- **Code Blocks**: Monospace with syntax highlighting for stack traces
- **Messages**: Standard readable font with proper line height
- **Responsive Text**: Truncation with expand functionality for long messages

### 8.3. Animation & Interaction Feedback

- **Smooth Transitions**: Expand/collapse animations for better UX
- **Hover Effects**: Subtle background changes and control visibility
- **Loading States**: Clear indicators during copy/download operations
- **Success Feedback**: Toast notifications for completed actions
- **Error States**: Clear error messaging for failed operations

## 9. Responsive Design & Accessibility

### 9.1. Cross-Device Compatibility

- **Desktop**: Full functionality with hover states and keyboard shortcuts
- **Mobile**: Touch-friendly button sizes and simplified interactions
- **Tablet**: Adaptive layout maintaining usability across orientations

### 9.2. Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility for all controls
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **High Contrast**: Sufficient color contrast for visibility
- **Focus Management**: Clear focus indicators and logical tab order

## 10. Implementation Requirements

### 10.1. Core Functionality

- **Time-ordered display** as default sorting mechanism
- **Dual control modes**: All-logs vs single-log focused operations
- **Comprehensive search** through message content with real-time filtering
- **Level-based filtering** with persistent state management
- **Structured JSON export** with metadata for all copy/download operations

### 10.2. Performance Considerations

- **Virtualized scrolling** for large log volumes
- **Efficient search indexing** for fast content filtering
- **Debounced search input** to prevent excessive re-renders
- **Memory management** with configurable log retention limits

### 10.3. Future Enhancements

- **Direct backend reporting** to replace manual Telegram process
- **Log categorization** beyond basic severity levels
- **Advanced filtering** by date ranges and custom criteria
- **Export formats** beyond JSON (CSV, plain text)
- **Real-time log streaming** for live system monitoring

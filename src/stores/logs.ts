import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUserAgent } from '../utils/reflexion';
import { errorStackToTrace, getCurrentTrace } from '../utils/trace';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  count?: number;
}

export interface LogExport {
  metadata: {
    userAgent: ReturnType<typeof getUserAgent>;
    exportTimestamp: string;
    totalLogs: number;
    exportType: 'full' | 'single';
  };
  logs: LogEntry[];
}

interface LogState {
  logs: LogEntry[];
  isOpen: boolean;
  expandedLog: string | null;
  searchQuery: string;
  filterLevel: 'all' | 'error' | 'warning' | 'info';
}

interface LogActions {
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  removeLog: (id: string) => void;
  toggleNotifications: () => void;
  setExpanded: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterLevel: (level: 'all' | 'error' | 'warning' | 'info') => void;
  exportLogs: (exportType?: 'full' | 'single', logId?: string) => string;
  reportBug: (logId?: string) => void;
  getFilteredLogs: () => LogEntry[];
}

type LogStore = LogState & LogActions;

export const useLogStore = create<LogStore>()(
  persist(
    (set, get) => ({
      // Initial state
      logs: [],
      isOpen: false,
      expandedLog: null,
      searchQuery: '',
      filterLevel: 'all',

      // Actions
      addLog: log => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date();

        set(state => {
          // Check if similar error exists (same title and message)
          const existingLogIndex = state.logs.findIndex(
            existingLog => existingLog.title === log.title && existingLog.message === log.message
          );

          if (existingLogIndex !== -1) {
            // Update existing log with incremented count
            const updatedLogs = [...state.logs];
            const existingLog = updatedLogs[existingLogIndex];
            if (existingLog) {
              updatedLogs[existingLogIndex] = {
                ...existingLog,
                count: (existingLog.count || 1) + 1,
                timestamp // Update to latest timestamp
              };
            }
            // Re-sort to maintain time ordering (newest first)
            updatedLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            return { logs: updatedLogs };
          } else {
            // Add new log and maintain time ordering (newest first)
            const newLog: LogEntry = {
              ...log,
              id,
              timestamp,
              count: 1
            };
            const updatedLogs = [newLog, ...state.logs].slice(0, 100); // Keep only last 100 logs
            return { logs: updatedLogs };
          }
        });
      },

      clearLogs: () => set({ logs: [], expandedLog: null }),

      removeLog: id =>
        set(state => ({
          logs: state.logs.filter(log => log.id !== id),
          expandedLog: state.expandedLog === id ? null : state.expandedLog
        })),

      toggleNotifications: () =>
        set(state => ({
          isOpen: !state.isOpen,
          expandedLog: null
        })),

      setExpanded: id => set({ expandedLog: id }),

      setSearchQuery: query => set({ searchQuery: query }),

      setFilterLevel: level => set({ filterLevel: level }),

      getFilteredLogs: () => {
        const { logs, searchQuery, filterLevel } = get();
        let filtered = logs;

        // Filter by level
        if (filterLevel !== 'all') {
          filtered = filtered.filter(log => log.level === filterLevel);
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            log =>
              log.title.toLowerCase().includes(query) || log.message.toLowerCase().includes(query)
          );
        }

        return filtered;
      },

      exportLogs: (exportType = 'full', logId) => {
        const { logs } = get();
        let logsToExport: LogEntry[];

        if (exportType === 'single' && logId) {
          const singleLog = logs.find(log => log.id === logId);
          logsToExport = singleLog ? [singleLog] : [];
        } else {
          logsToExport = logs;
        }

        const exportData: LogExport = {
          metadata: {
            userAgent: getUserAgent(),
            exportTimestamp: new Date().toISOString(),
            totalLogs: logsToExport.length,
            exportType
          },
          logs: logsToExport.map(log => ({
            ...log,
            timestamp: log.timestamp
          }))
        };

        return JSON.stringify(exportData, null, 2);
      },

      reportBug: logId => {
        const exportType = logId ? 'single' : 'full';
        const exported = get().exportLogs(exportType, logId);
        const telegramUrl = `https://t.me/chomp_ingester`;

        // Copy to clipboard first
        if (navigator.clipboard) {
          navigator.clipboard.writeText(exported).then(() => {
            console.log('Log data copied to clipboard');
          });
        }

        // Open Telegram
        window.open(telegramUrl, '_blank');
      }
    }),
    {
      name: 'chomp-logs',
      partialize: state => ({
        logs: state.logs.slice(0, 50), // Persist only last 50 logs
        searchQuery: state.searchQuery,
        filterLevel: state.filterLevel
      })
    }
  )
);

// Helper function to log errors consistently
export const logError = (error: Error | string, context?: Record<string, unknown>) => {
  const { addLog } = useLogStore.getState();

  if (error instanceof Error) {
    addLog({
      level: 'error',
      title: error.name || 'Error',
      message: error.message,
      stack: errorStackToTrace(error),
      context: {
        ...context,
        trace: getCurrentTrace()
      }
    });
  } else {
    addLog({
      level: 'error',
      title: 'Error',
      message: error,
      context: {
        ...context,
        trace: getCurrentTrace()
      }
    });
  }
};

// Helper function to log warnings
export const logWarning = (message: string, context?: Record<string, unknown>) => {
  const { addLog } = useLogStore.getState();
  addLog({
    level: 'warning',
    title: 'Warning',
    message,
    context: {
      ...context,
      trace: getCurrentTrace()
    }
  });
};

// Helper function to log info
export const logInfo = (message: string, context?: Record<string, unknown>) => {
  const { addLog } = useLogStore.getState();
  addLog({
    level: 'info',
    title: 'Info',
    message,
    context: {
      ...context,
      trace: getCurrentTrace()
    }
  });
};

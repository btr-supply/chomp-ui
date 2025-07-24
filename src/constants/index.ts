// Export all constants from this directory
export * from './theme';

// Environment Constants
export const ENV = {
  // Directory URL - configurable via environment variable
  DIRECTORY_URL:
    process.env.NEXT_DIRECTORY_URL ||
    'https://raw.githubusercontent.com/btr-supply/chomp/refs/heads/main/directory.json',

  // Deployment detection - check if we're on the generic cho.mp frontend
  IS_GENERIC_DEPLOYMENT: typeof window !== 'undefined' && window.location.hostname === 'cho.mp',

  // Current hostname for deployment type detection
  HOSTNAME: typeof window !== 'undefined' ? window.location.hostname : 'localhost'
} as const;

// Directory Cache Configuration
export const DIRECTORY_CACHE = {
  // Infinite cache for local files
  LOCAL_TTL: Infinity,
  // 1 hour cache for remote files
  REMOTE_TTL: 60 * 60 * 1000 // 1 hour in milliseconds
} as const;

// Define ROUTES constant that's being imported
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DASHBOARD_CONFIG: '/dashboard/config',
  DASHBOARD_INSTANCES: '/dashboard/instances',
  DASHBOARD_RESOURCES: '/dashboard/resources',
  TEST_LOGS: '/test-logs'
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];

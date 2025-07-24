// ===== CHOMP FRONTEND - CONSOLIDATED THEME AND CONSTANTS =====
// All constants and theme definition in MUI-compatible structure
// Single source of truth for all styling, colors, and UI constants

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Font family constants using Next.js font variables
export const fonts = {
  heading: `var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  body: `var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  mono: `var(--font-ibm-plex-mono), SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  logo: `var(--font-modak), cursive`,
  math: `var(--font-tex-gyre-math), var(--font-ibm-plex-mono), SFMono-Regular, Menlo, Monaco, Consolas, monospace`
};

// ===== BORDER RADIUS SYSTEM =====
// Double border radius system for containers vs controls
export const BORDER_RADIUS = {
  // Container radius - for larger components like cards, modals, sections
  container: {
    sm: 8, // 8px - small containers
    md: 12, // 12px - standard containers (cards, panels)
    lg: 16, // 16px - large containers (modals, hero sections)
    xl: 20 // 20px - extra large containers
  },
  // Control radius - for smaller interactive elements
  control: {
    sm: 4, // 4px - small controls (chips, tags, small buttons)
    md: 6, // 6px - standard controls (buttons, inputs, selects)
    lg: 8 // 8px - larger controls (large buttons, search bars)
  },
  // Special cases
  round: '50%', // For circular elements (avatars, beacons)
  none: 0 // For elements that need no radius
};

// ===== SINGLE SOURCE OF TRUTH FOR ALL COLORS =====
const colors = {
  // Brand colors
  brand: {
    50: '#FFFBF0', // Very light yellow
    100: '#FFF4CC', // Light yellow
    200: '#FFED99', // Lighter yellow
    300: '#FFE666', // Light yellow
    400: '#FFDF33', // Medium yellow
    500: '#FCCF0D', // Main brand yellow (vivid yellow from mockup)
    600: '#E6B800', // Darker yellow
    700: '#CC9F00', // Dark yellow
    800: '#B38600', // Darker yellow
    900: '#996D00' // Darkest yellow
  },

  // Core system colors
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#a82ee6',
  yellow: '#FFCC00',
  red: '#FF3B30',

  // Light variants
  lightBlue: '#5AC8FA',
  lightGreen: '#60eb83',
  lightOrange: '#ffb340',
  lightPurple: '#BF5AF2',
  lightYellow: '#fae05c',
  lightRed: '#FF6B6B',

  // Dark variants
  darkBlue: '#0051D5',
  darkGreen: '#11822d',
  darkOrange: '#d66a00',
  darkPurple: '#6441a5',
  darkRed: '#bd1323',
  darkYellow: '#d6b100',

  // Grey scale (Apple-inspired)
  white: '#f7f7f7',
  grey50: '#F2F2F7',
  grey100: '#E5E5EA',
  grey200: '#D1D1D6',
  grey300: '#C7C7CC',
  grey400: '#AEAEB2',
  grey500: '#8E8E93',
  grey600: '#636366',
  grey700: '#48484A',
  grey800: '#3A3A3C',
  grey900: '#242424', // Updated to match risk-ui color scheme
  black: '#171717', // Updated to softer greyish black (matching risk-ui)

  // Dark theme backgrounds
  dark: {
    bg: '#171717', // Softer greyish black (matching risk-ui) instead of pure black
    surface: '#242424', // Nice grey surface (matching risk-ui grey900) instead of Apple dark gray
    formula: '#1a1a1a' // Slightly darker than surface for formula/simulation containers
  }
};

// Chart colors - comprehensive palette optimized for data visualization
const chartColors = [
  colors.blue,
  colors.green,
  colors.orange,
  colors.purple,
  colors.yellow,
  colors.red,
  colors.lightBlue,
  colors.lightGreen,
  colors.lightOrange,
  colors.lightPurple,
  colors.lightYellow,
  colors.lightRed,
  colors.darkBlue,
  colors.darkGreen,
  colors.darkOrange,
  colors.darkPurple,
  colors.darkYellow,
  colors.darkRed
];

// Augment the Material-UI theme interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    dark: {
      bg: string;
      surface: string;
      formula: string;
    };
    chart: string[];
    functional: {
      link: string;
      linkHover: string;
      focus: string;
      border: string;
      borderLight: string;
      surface: string;
      surfaceVariant: string;
      overlay: string;
    };
    sentiment: {
      bullish: string;
      bearish: string;
      neutral: string;
      caution: string;
    };
    alert: {
      success: {
        background: string;
        border: string;
        text: string;
      };
      warning: {
        background: string;
        border: string;
        text: string;
      };
      error: {
        background: string;
        border: string;
        text: string;
      };
      info: {
        background: string;
        border: string;
        text: string;
      };
    };
    status: {
      online: string;
      offline: string;
      away: string;
      busy: string;
      warning: string;
      running: string;
      stopped: string;
      error: string;
      ping: {
        good: string;
        medium: string;
        slow: string;
      };
    };
  }

  interface PaletteOptions {
    brand?: Partial<Palette['brand']>;
    gray?: Partial<Palette['gray']>;
    dark?: Partial<Palette['dark']>;
    chart?: string[];
    functional?: Partial<Palette['functional']>;
    sentiment?: Partial<Palette['sentiment']>;
    alert?: Partial<Palette['alert']>;
    status?: Partial<Palette['status']>;
  }

  interface Theme {
    colors: {
      chart: string[];
      functional: Palette['functional'];
      washedOff: {
        blue: string;
        green: string;
        orange: string;
        purple: string;
        yellow: string;
        red: string;
      };
      sentiment: Palette['sentiment'];
    };
  }

  interface ThemeOptions {
    colors?: {
      chart?: string[];
      functional?: Partial<Palette['functional']>;
      washedOff?: {
        blue?: string;
        green?: string;
        orange?: string;
        purple?: string;
        yellow?: string;
        red?: string;
      };
      sentiment?: Partial<Palette['sentiment']>;
    };
  }
}

// ===== MUI THEME WITH INTEGRATED CONSTANTS =====
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: colors.blue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
      contrastText: colors.white
    },
    secondary: {
      main: colors.brand[500], // Keep brand yellow as secondary
      light: colors.brand[400],
      dark: colors.brand[600]
    },
    background: {
      default: colors.dark.bg,
      paper: colors.dark.surface
    },
    text: {
      primary: colors.white,
      secondary: colors.grey300
    },
    divider: colors.grey700,
    error: {
      main: colors.red,
      light: colors.lightRed,
      dark: colors.darkRed
    },
    warning: {
      main: colors.orange,
      light: colors.lightOrange,
      dark: colors.darkOrange
    },
    success: {
      main: colors.green,
      light: colors.lightGreen,
      dark: colors.darkGreen
    },
    info: {
      main: colors.lightBlue,
      light: colors.lightBlue,
      dark: colors.darkBlue
    },
    grey: {
      50: colors.grey50,
      100: colors.grey100,
      200: colors.grey200,
      300: colors.grey300,
      400: colors.grey400,
      500: colors.grey500,
      600: colors.grey600,
      700: colors.grey700,
      800: colors.grey800,
      900: colors.grey900
    },
    // Custom color extensions
    brand: colors.brand,
    gray: {
      50: colors.grey50,
      100: colors.grey100,
      200: colors.grey200,
      300: colors.grey300,
      400: colors.grey400,
      500: colors.grey500,
      600: colors.grey600,
      700: colors.grey700,
      800: colors.grey800,
      900: colors.grey900
    },
    dark: colors.dark,
    chart: chartColors,
    functional: {
      link: colors.blue,
      linkHover: colors.lightBlue,
      focus: colors.blue,
      border: colors.grey700,
      borderLight: colors.grey500,
      surface: colors.dark.surface,
      surfaceVariant: colors.dark.surface, // Use consistent surface color
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    sentiment: {
      bullish: colors.green,
      bearish: colors.red,
      neutral: colors.grey500,
      caution: colors.orange
    },
    alert: {
      success: {
        background: 'rgba(52, 199, 89, 0.15)',
        border: colors.green,
        text: colors.green
      },
      warning: {
        background: 'rgba(255, 149, 0, 0.15)',
        border: colors.orange,
        text: colors.orange
      },
      error: {
        background: 'rgba(255, 59, 48, 0.15)',
        border: colors.red,
        text: colors.red
      },
      info: {
        background: 'rgba(90, 200, 250, 0.15)',
        border: colors.lightBlue,
        text: colors.lightBlue
      }
    },
    status: {
      online: colors.green,
      offline: colors.grey500,
      away: colors.orange,
      busy: colors.red,
      warning: colors.orange,
      running: colors.green,
      stopped: colors.red,
      error: colors.red,
      ping: {
        good: colors.green, // Green < 150ms
        medium: colors.orange, // Orange 150-500ms
        slow: colors.red // Red > 500ms
      }
    }
  },

  typography: {
    fontFamily: fonts.body,
    h1: {
      fontSize: '3.25rem',
      fontWeight: 'bold',
      fontFamily: fonts.mono,
      textTransform: 'lowercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: colors.white
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 'bold',
      fontFamily: fonts.mono,
      textTransform: 'lowercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: colors.white
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      fontFamily: fonts.mono,
      textTransform: 'lowercase',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: colors.white
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 'bold',
      fontFamily: fonts.mono,
      textTransform: 'lowercase',
      lineHeight: 1.2,
      color: colors.white,
      marginBottom: '0.75rem !important'
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      fontFamily: fonts.mono,
      textTransform: 'lowercase',
      lineHeight: 1.2,
      color: colors.white
    },
    h6: {
      fontSize: '1.375rem',
      fontWeight: 'bold',
      fontFamily: fonts.mono,
      textTransform: 'lowercase',
      lineHeight: 1.2,
      color: colors.white
    },
    body1: {
      fontSize: '1.125rem',
      fontWeight: 300,
      lineHeight: 1.6,
      color: colors.white
    },
    body2: {
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.6,
      color: colors.grey300
    },
    button: {
      textTransform: 'lowercase',
      fontWeight: 'bold',
      fontSize: '1.4rem',
      fontFamily: fonts.mono,
      letterSpacing: '0.02em',
      lineHeight: 1.2
    },
    caption: {
      fontSize: '0.6875rem',
      fontWeight: 300,
      lineHeight: 1.4,
      color: colors.grey300
    }
  },

  shape: {
    borderRadius: BORDER_RADIUS.container.md // Use container radius for default shape
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflowY: 'scroll'
        },
        body: {
          fontFeatureSettings: '"kern"',
          overflowX: 'hidden',
          margin: '0',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: colors.grey900,
            borderRadius: BORDER_RADIUS.control.sm
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.grey700,
            borderRadius: BORDER_RADIUS.control.sm,
            '&:hover': {
              background: colors.grey500
            }
          },
          '&::-webkit-scrollbar-corner': {
            background: colors.grey900
          },
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.grey700} ${colors.grey900}`
        }
      }
    },
    MuiButton: {
      defaultProps: {
        size: 'medium' // Ensure medium is the default size
      },
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.control.md, // Use control radius for buttons
          textTransform: 'lowercase',
          fontWeight: 'bold',
          fontFamily: fonts.mono,
          boxShadow: 'none',
          lineHeight: 1.2,
          '&:hover': {
            boxShadow: 'none'
          }
        },
        sizeSmall: {
          padding: '4px 12px',
          minHeight: '28px',
          fontSize: '0.95rem'
        },
        sizeMedium: {
          padding: '8px 18px',
          minHeight: '36px',
          fontSize: '1.2rem'
        },
        sizeLarge: {
          padding: '10px 22px',
          minHeight: '38px',
          fontSize: '1.6rem',
          borderRadius: BORDER_RADIUS.control.lg // Larger radius for large buttons
        },
        contained: {
          backgroundColor: colors.green,
          color: colors.white,
          '&:hover': {
            backgroundColor: colors.lightGreen
          }
        },
        outlined: {
          borderColor: colors.grey700,
          color: colors.white,
          '&:hover': {
            borderColor: colors.grey500,
            backgroundColor: 'rgba(255, 255, 255, 0.03)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: BORDER_RADIUS.container.md, // Use container radius for cards
          backgroundImage: 'none',
          backgroundColor: colors.dark.surface,
          border: `1px solid ${colors.grey700}`,
          boxShadow: 'none',
          padding: theme.spacing(2), // Force 16px padding on Card root
          '&:hover': {
            borderColor: colors.grey500
          },
          // Use higher specificity to override MUI defaults
          '&&': {
            padding: theme.spacing(2)
          }
        })
      }
    },
    MuiCardContent: {
      defaultProps: {
        // Remove any default padding
      },
      styleOverrides: {
        root: ({ theme: _theme }) => ({
          // When used inside a Card that already has padding, remove CardContent padding
          padding: 0,
          '&:last-child': {
            paddingBottom: 0
          },
          // Use higher specificity to override MUI defaults
          '&&': {
            padding: 0,
            '&:last-child': {
              paddingBottom: 0
            }
          }
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.container.md, // Use container radius for papers
          backgroundImage: 'none',
          backgroundColor: colors.dark.surface,
          border: `1px solid ${colors.grey700}`,
          boxShadow: 'none'
        },
        elevation0: {
          boxShadow: 'none'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.control.md, // Use control radius for chips
          fontWeight: 500,
          backgroundColor: colors.grey900,
          color: colors.grey300,
          border: `1px solid ${colors.grey700}`,
          height: 24,
          boxShadow: 'none'
        },
        outlined: {
          borderWidth: '1px',
          borderColor: colors.grey700,
          color: colors.white,
          backgroundColor: 'transparent'
        },
        sizeSmall: {
          height: 20,
          fontSize: '0.75rem'
        },
        label: {
          paddingLeft: 8,
          paddingRight: 8
        },
        labelSmall: {
          paddingLeft: 6,
          paddingRight: 6
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: BORDER_RADIUS.control.md, // Use control radius for text fields
            '& fieldset': {
              borderColor: colors.grey700
            },
            '&:hover fieldset': {
              borderColor: colors.grey500
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.blue,
              borderWidth: '1px'
            }
          },
          '& .MuiInputLabel-root': {
            color: colors.grey300,
            '&.Mui-focused': {
              color: colors.blue
            }
          },
          '& .MuiInputBase-input': {
            color: colors.white
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderBottom: 'none'
        },
        indicator: {
          display: 'none'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'lowercase',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 48,
          padding: '8px 16px',
          color: colors.grey500,
          transition: 'color 0.2s ease-in-out',

          '&.Mui-selected': {
            color: `${colors.white} !important`,
            fontWeight: 700
          },

          '&:hover': {
            color: colors.white
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid ${colors.grey700}`,
          borderBottom: `1px solid ${colors.grey700}`,
          backgroundColor: colors.grey900
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px !important',
          paddingLeft: `${2 * 8}px !important`, // 16px padding for toolbar
          paddingRight: `${2 * 8}px !important`,
          paddingTop: '0 !important',
          paddingBottom: '0 !important'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1200px !important',
          paddingLeft: `${1.5 * 8}px !important`, // Reduced to 12px for consistent app padding
          paddingRight: `${1.5 * 8}px !important`,
          marginLeft: 'auto',
          marginRight: 'auto',
          boxSizing: 'border-box'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.grey900,
          color: colors.white,
          border: `1px solid ${colors.grey700}`,
          borderRadius: BORDER_RADIUS.control.sm, // Small radius for tooltips
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 8px',
          boxShadow: 'none'
        },
        arrow: {
          color: colors.grey900,
          '&:before': {
            border: `1px solid ${colors.grey700}`
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: fonts.mono,
          fontSize: '1.5rem',
          fontWeight: 700,
          textTransform: 'lowercase',
          letterSpacing: '0.02em',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          '&:hover': {
            color: 'primary.main'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: `${1.5 * 8}px`, // Consistent 12px padding for dialog content
          border: `1px solid ${colors.grey700}`,
          borderRadius: BORDER_RADIUS.container.lg, // Large radius for modal containers
          backgroundColor: colors.dark.surface
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.grey900,
          border: `1px solid ${colors.grey700}`,
          borderRadius: 0,
          '& .MuiList-root': {
            padding: `${1.5 * 8}px` // Consistent 12px padding for drawer content
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          padding: `${1 * 8}px`, // Consistent 8px padding for menu items
          border: `1px solid ${colors.grey700}`,
          borderRadius: BORDER_RADIUS.control.lg, // Large control radius for menus
          backgroundColor: colors.dark.surface,
          boxShadow: 'none'
        }
      }
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          padding: `${1 * 8}px`, // Consistent 8px padding for popover content
          border: `1px solid ${colors.grey700}`,
          borderRadius: BORDER_RADIUS.control.lg, // Large control radius for popovers
          backgroundColor: colors.dark.surface,
          boxShadow: 'none'
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.container.md, // Container radius for accordions
          backgroundColor: colors.dark.surface,
          border: `1px solid ${colors.grey700}`,
          boxShadow: 'none',
          '&:before': {
            display: 'none'
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.container.md, // Container radius for tables
          border: `1px solid ${colors.grey700}`,
          backgroundColor: colors.dark.surface
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.container.md, // Container radius for table containers
          border: `1px solid ${colors.grey700}`,
          backgroundColor: colors.dark.surface
        }
      }
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: BORDER_RADIUS.container.md, // Container radius for snackbars
            backgroundColor: colors.dark.surface,
            border: `1px solid ${colors.grey700}`
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: BORDER_RADIUS.control.md, // Control radius for selects
          '&:focus': {
            borderRadius: BORDER_RADIUS.control.md
          }
        }
      }
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          margin: '0 4px'
        }
      }
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          '& .MuiPaginationItem-root': {
            borderRadius: BORDER_RADIUS.control.sm, // Small control radius for pagination items
            border: `1px solid ${colors.grey700}`,
            backgroundColor: colors.dark.surface,
            color: colors.white,
            '&:hover': {
              backgroundColor: colors.grey800
            },
            '&.Mui-selected': {
              backgroundColor: colors.brand[500],
              color: colors.black
            }
          }
        }
      }
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiStep: {
      styleOverrides: {
        root: {
          '& .MuiStepLabel-iconContainer .MuiSvgIcon-root': {
            borderRadius: BORDER_RADIUS.round, // Circular for step icons
            backgroundColor: colors.dark.surface,
            border: `1px solid ${colors.grey700}`
          }
        }
      }
    }
  },

  // Custom theme extensions
  colors: {
    // Chart colors - optimized for data visualization
    chart: chartColors,

    // Functional colors
    functional: {
      border: colors.grey700,
      borderLight: colors.grey500,
      focus: colors.blue,
      link: colors.blue,
      linkHover: colors.lightBlue,
      surface: colors.dark.surface,
      surfaceVariant: colors.dark.surface, // Use consistent surface color
      overlay: 'rgba(0, 0, 0, 0.5)'
    },

    // Washed off colors for reference lines
    washedOff: {
      blue: colors.lightBlue,
      green: colors.lightGreen,
      orange: colors.lightOrange,
      purple: colors.lightPurple,
      yellow: colors.lightYellow,
      red: colors.lightRed
    },

    // Sentiment colors for financial data
    sentiment: {
      bullish: colors.green,
      bearish: colors.red,
      neutral: colors.grey300,
      caution: colors.orange
    }
  }
};

export const theme = createTheme(themeOptions);

// ===== APPLICATION CONSTANTS =====

// API Configuration
export const API_BASE_URL =
  typeof window !== 'undefined'
    ? (window as { NEXT_PUBLIC_API_URL?: string }).NEXT_PUBLIC_API_URL || 'http://localhost:40004'
    : 'http://localhost:40004';
export const WS_BASE_URL =
  typeof window !== 'undefined'
    ? (window as { NEXT_PUBLIC_WS_URL?: string }).NEXT_PUBLIC_WS_URL || 'ws://localhost:40004/ws'
    : 'ws://localhost:40004/ws';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication (modern unified auth)
  AUTH_METHODS: '/auth/methods',
  AUTH_CHALLENGE: '/auth/challenge',
  AUTH_VERIFY: '/auth/verify',
  AUTH_DIRECT: '/auth/direct',
  AUTH_STATUS: '/auth/status',
  AUTH_LOGOUT: '/auth/logout',

  // System
  PING: '/ping',
  LIMITS: '/limits',
  SCHEMA: '/schema',

  // Data
  LAST: '/last',
  HISTORY: '/history',
  CONVERT: '/convert',
  PEGCHECK: '/pegcheck',

  // Analysis
  ANALYSIS: '/analysis',
  VOLATILITY: '/volatility',
  TREND: '/trend',
  MOMENTUM: '/momentum',
  OPRANGE: '/oprange',

  // Configuration endpoints
  CONFIG_INGESTER: '/config/ingester',
  CONFIG_SERVER: '/config/server',
  CONFIG_HISTORY: '/config/history',
  CONFIG_ROLLBACK: '/config/rollback',

  // Admin
  ADMIN_TEST: '/admin/test',
  ADMIN_INGESTERS: '/admin/ingesters',
  ADMIN_DATABASE: '/admin/database/status',
  ADMIN_CACHE: '/admin/cache/status',
  ADMIN_REGISTRY: '/admin/registry'
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  INSTANCES: '/dashboard/instances',
  INSTANCE_DETAIL: '/dashboard/instances/[id]',
  RESOURCES: '/dashboard/resources',
  CONFIG: '/dashboard/config'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'chomp_auth_token',
  USER_ID: 'chomp_user_id',
  THEME_MODE: 'chomp_theme_mode',
  DASHBOARD_PREFERENCES: 'chomp_dashboard_prefs'
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  PING: ['ping'],
  AUTH_STATUS: ['auth', 'status'],
  SCHEMA: ['schema'],
  INGESTERS: ['admin', 'ingesters'],
  DATABASE_STATUS: ['admin', 'database', 'status'],
  CACHE_STATUS: ['admin', 'cache', 'status'],
  INSTANCES: ['instances'],
  INSTANCE_DETAIL: (id: string) => ['instances', id],
  RESOURCES: ['resources'],
  HISTORY: (resource: string, params: Record<string, unknown>) => ['history', resource, params],
  ANALYSIS: (type: string, resource: string, params: Record<string, unknown>) => [
    'analysis',
    type,
    resource,
    params
  ]
} as const;

// ===== LAYOUT AND SPACING CONSTANTS =====

// Layout constants
export const LAYOUT = {
  maxWidth: '1200px',
  containerPadding: { xs: 2, sm: 3, md: 4 },
  sectionSpacing: 4,
  cardSpacing: 3,
  fieldSpacing: 2,
  headerHeight: '76px',
  sidebarFooterHeight: '144px',
  mobileDrawerWidth: 250,
  footerMinHeight: '56px',
  toolbarMinHeight: '56px'
};

// Layout constants for components
export const SIDEBAR_WIDTH = 240;
export const HEADER_HEIGHT = 76;
export const MOBILE_BREAKPOINT = 768;

// Typography constants
export const TYPOGRAPHY = {
  BRAND_FONT: 'Modak, cursive',
  BUTTON_FONT_WEIGHT: 500,
  BUTTON_TEXT_TRANSFORM: 'lowercase' as const
} as const;

// Comprehensive spacing system
export const SPACING = {
  // Base unit spacing (MUI units)
  xs: 0.5, // 4px
  sm: 1, // 8px
  md: 1.5, // 12px
  lg: 2, // 16px
  xl: 2.5, // 20px
  xxl: 3, // 24px
  xxxl: 4, // 32px
  huge: 5, // 40px

  // Container and component padding system - consistent app-wide
  container: {
    xs: 1, // 8px - mobile, very tight
    sm: 1.5, // 12px - tablet and standard app padding
    md: 1.5, // 12px - keep consistent across breakpoints
    lg: 1.5 // 12px - consistent large screens
  },

  // Component-specific spacing - minimal, consistent values
  card: {
    padding: 1, // Further reduced to 8px for tighter design
    margin: 1, // Reduced to 8px for consistent spacing
    headerMargin: 1.5 // Reduced to 12px
  },

  section: {
    margin: 3, // Further reduced for tighter layout
    titleMargin: 2, // Reduced
    padding: { xs: 1, sm: 1.5, md: 1.5 } // Consistent with container padding
  },

  button: {
    padding: '6px 12px', // Keep button padding
    margin: 1,
    groupGap: 1.5
  },

  form: {
    fieldSpacing: 1.5,
    groupSpacing: 2,
    labelMargin: 1
  },

  layout: {
    container: { xs: 1, sm: 1.5, md: 1.5 }, // Match container system
    itemGap: 1,
    gridGap: 1.5,
    listItemGap: 1
  },

  chart: {
    padding: 1, // Reduced to match card padding
    margin: 1, // Reduced to match card margin
    legendGap: 1.5
  },

  // Component compatibility
  cardPadding: 1,
  sectionMargin: 1.5,
  itemGap: 1.5,
  borderRadius: BORDER_RADIUS.container.md
};

// Icon sizes
export const ICON_SIZES = {
  XS: 3,
  SM: 4,
  MD: 5,
  LG: 6,
  XL: 8,
  XXL: 12
} as const;

// Z-index values
export const Z_INDEX = {
  NOTIFICATION: 1000,
  MODAL: 1500,
  TOOLTIP: 2000
} as const;

// Component dimensions
export const DIMENSIONS = {
  NOTIFICATION_WIDTH: '400px',
  NOTIFICATION_MAX_HEIGHT: '80vh',
  HEADER_HEIGHT: '64px',
  LOGO_SIZE: '40px'
} as const;

// Animation durations (in milliseconds)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
} as const;

// Performance constants
export const PERFORMANCE = {
  throttleDelay: 100, // ms
  debounceDelay: 300, // ms
  animationDuration: 200 // ms
};

// WebSocket Configuration
export const WS_CONFIG = {
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 10,
  PING_INTERVAL: 30000
} as const;

// Data Refresh Intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  FAST: 5000, // 5 seconds
  NORMAL: 30000, // 30 seconds
  SLOW: 60000, // 1 minute
  VERY_SLOW: 300000 // 5 minutes
} as const;

// Default Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  COLORS: chartColors,
  TIME_FORMATS: {
    MINUTE: 'HH:mm',
    HOUR: 'HH:mm',
    DAY: 'MMM dd',
    WEEK: 'MMM dd',
    MONTH: 'MMM yyyy'
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Welcome to Chomp's admin dashboard",
  LOGOUT_SUCCESS: 'Successfully logged out',
  CONFIG_SAVED: 'Configuration saved successfully',
  ACTION_COMPLETED: 'Action completed successfully'
} as const;

// ===== STYLING UTILITIES =====

// Common SX patterns - reusable across components
export const COMMON_SX = {
  // Card content layout - used by multiple card types
  cardContent: {
    p: SPACING.card.padding, // Uses refined 1.5 (12px) padding
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },

  // Card header with title and action - common pattern
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: SPACING.card.headerMargin // Uses refined 2 (16px) margin
  },

  // Full height card - common pattern
  fullHeightCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },

  // Common paper/container styling with consistent minimal padding
  paperContainer: {
    borderRadius: BORDER_RADIUS.container.md, // Use container radius for paper containers
    border: `1px solid ${colors.grey700}`,
    borderColor: colors.grey700,
    bgcolor: 'background.paper',
    boxShadow: 'none',
    p: SPACING.container.sm // Use standard 12px padding
  },

  // Container padding variants for different use cases
  containerPadding: {
    xs: { p: SPACING.container.xs }, // 8px
    sm: { p: SPACING.container.sm }, // 12px - standard
    md: { p: SPACING.container.md }, // 12px - consistent
    lg: { p: SPACING.container.lg } // 12px - consistent
  },

  // Monospace text styling - repeated pattern
  monospace: {
    fontFamily: 'monospace',
    fontWeight: 600
  },

  // Chart container centering - repeated pattern
  chartCenter: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Responsive text patterns
  responsiveText: {
    small: {
      fontSize: { xs: '0.65rem', sm: '0.75rem' }
    },
    mono: {
      fontFamily: 'monospace',
      fontSize: { xs: '0.65rem', sm: '0.75rem' }
    }
  }
};

// Utility functions for common patterns
export const createFlexColumnSx = (gap = SPACING.layout.itemGap) => ({
  display: 'flex',
  flexDirection: 'column',
  gap
});

export const createFlexRowSx = (gap = SPACING.layout.itemGap) => ({
  display: 'flex',
  flexDirection: 'row',
  gap
});

export const createGridSx = (gap = SPACING.layout.gridGap) => ({
  display: 'grid',
  gap
});

export const createButtonGroupSx = (gap = SPACING.button.groupGap) => ({
  display: 'flex',
  gap,
  alignItems: 'center'
});

export const createFormGroupSx = (spacing = SPACING.form.fieldSpacing) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing
});

// Create consistent card variant styles
export const createCardVariantSx = (
  variant: 'parameter' | 'simulation' | 'description' = 'parameter',
  customSx = {}
) => {
  const baseCard = {
    ...COMMON_SX.paperContainer,
    ...COMMON_SX.fullHeightCard
  };

  const variants = {
    parameter: baseCard,
    simulation: {
      ...baseCard,
      '& .MuiCardContent-root': {
        ...COMMON_SX.cardContent
      }
    },
    description: baseCard
  };

  return {
    ...variants[variant],
    ...customSx
  };
};

// Create consistent content wrapper styles
export const createContentWrapperSx = (
  variant: 'simulation' | 'parameter' | 'description' = 'parameter'
) => {
  const base = {
    ...COMMON_SX.cardContent
  };

  const variants = {
    simulation: {
      ...base,
      ...COMMON_SX.chartCenter
    },
    parameter: base,
    description: base
  };

  return variants[variant];
};

// ===== UTILITY EXPORTS FOR DIRECT ACCESS =====
// BORDER_RADIUS is already exported above, no need to re-export

// Export common sx objects that use the border radius system
export const SX_BORDER_RADIUS = {
  // Container variants
  containerSm: { borderRadius: BORDER_RADIUS.container.sm },
  containerMd: { borderRadius: BORDER_RADIUS.container.md },
  containerLg: { borderRadius: BORDER_RADIUS.container.lg },
  containerXl: { borderRadius: BORDER_RADIUS.container.xl },

  // Control variants
  controlSm: { borderRadius: BORDER_RADIUS.control.sm },
  controlMd: { borderRadius: BORDER_RADIUS.control.md },
  controlLg: { borderRadius: BORDER_RADIUS.control.lg },

  // Special cases
  round: { borderRadius: BORDER_RADIUS.round },
  none: { borderRadius: BORDER_RADIUS.none }
};

export { chartColors };

// Export theme as default
export default theme;

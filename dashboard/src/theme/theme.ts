import { createTheme } from '@mui/material/styles';

export const steamNexusTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#EA580C',
      light: '#FB923C',
      dark: '#C2410C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#18181B',
      light: '#3F3F46',
      dark: '#09090B',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#16A34A',
      light: '#DCFCE7',
      dark: '#15803D',
    },
    background: {
      default: '#F4F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E6E8EC',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontSize: '1.65rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontSize: '1.05rem',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
    },
    subtitle2: {
      fontWeight: 600,
    },
    overline: {
      fontSize: '0.68rem',
      fontWeight: 700,
      letterSpacing: '0.09em',
      lineHeight: 1.4,
      color: '#6B7280',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          backgroundColor: '#F4F5F7',
          color: '#111827',
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #E6E8EC',
          boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#E2E5EB',
          color: '#111827',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            borderColor: '#CBD2DC',
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
        sizeSmall: {
          height: 24,
          fontSize: '0.72rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#F9FAFB',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E1',
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#EA580C',
          height: 6,
        },
        rail: {
          backgroundColor: '#E5E7EB',
          opacity: 1,
        },
        track: {
          border: 'none',
          background: 'linear-gradient(90deg, #EA580C 0%, #18181B 100%)',
        },
        thumb: {
          width: 16,
          height: 16,
          backgroundColor: '#FFFFFF',
          border: '2px solid #EA580C',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: '0 0 0 6px rgba(234, 88, 12, 0.14)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: '#EEF0F3',
        },
        head: {
          color: '#6B7280',
          fontWeight: 600,
          fontSize: '0.75rem',
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
});

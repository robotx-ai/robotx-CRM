import { ThemeOptions } from '@mui/material';

export const footerTheme: ThemeOptions = {
  // type: 'light',
  palette: {
    primary: {
      main: '#111111',
      light: '#4B4B4B',
      dark: '#000000',
      contrastText: '#FFF',
    },
    secondary: {
      main: '#6B7280',
      light: '#9CA3AF',
      dark: '#4B5563',
      contrastText: '#FFF',
    },
    error: {
      main: '#E73145',
      light: '#FF6A70',
      dark: '#AD001E',
      contrastText: '#FFF',
    },
    warning: {
      main: '#F39711',
      light: '#FFC84C',
      dark: '#BB6900',
      contrastText: '#FFF',
    },
    info: {
      main: '#2EB5C9',
      light: '#6FE7FC',
      dark: '#008598',
      contrastText: '#FFF',
    },
    success: {
      main: '#3BD2A2',
      light: '#78FFD3',
      dark: '#00A073',
      contrastText: '#FFF',
    },
    text: {
      primary: '#475259',
      secondary: '#8595A6',
      disabled: '#A2B2C3',
    },
    divider: '#DEE2E6',
    background: {
      paper: '#FFFFFF',
      default: '#F5F7FA',
    },
    action: {
      active: '#475259',
      hover: '#F5F7FA',
    },
  },
};

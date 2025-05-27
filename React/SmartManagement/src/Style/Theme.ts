import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    direction: 'rtl',
    palette: {
        primary: {
            main: '#2C3E50',
            light: '#A8DADC',
            dark: '#1A252F',
        },
        secondary: {
            main: '#FFFFFF',
            light: '#F5F5F5',
            dark: '#4A4A4A',
        },
        success: {
            main: '#27AE60',
            light: '#58D68D',
            dark: '#1E8449',
        },
        warning: {
            main: '#F39C12',
            light: '#F8C471',
            dark: '#B7950B',
        },
        error: {
            main: '#E74C3C',
            light: '#EC7063',
            dark: '#C0392B',
        },
        info: {
            main: '#3498DB',
            light: '#85C1E9',
            dark: '#2471A3',
        },
        background: {
            default: '#FAFAFA',
            paper: '#FFFFFF',
            accent: '#F8F9FA',
        },
        surfaces: {
            glass: 'rgba(255, 255, 255, 0.1)',
            frosted: 'rgba(255, 255, 255, 0.8)',
            elevated: 'rgba(255, 255, 255, 0.95)',
        },
        shadows: {
            soft: '0 4px 20px rgba(0, 0, 0, 0.08)',
            medium: '0 8px 32px rgba(0, 0, 0, 0.12)',
            strong: '0 12px 48px rgba(0, 0, 0, 0.15)',
        },
        interactions: {
            hover: 'rgba(44, 62, 80, 0.04)',
            pressed: 'rgba(44, 62, 80, 0.08)',
            focus: 'rgba(168, 218, 220, 0.2)',
        },
        text: {
            primary: '#2C3E50',
            secondary: '#566573',
            disabled: '#BDC3C7',
        },
    },
    typography: {
        fontFamily: 'Assistant, Rubik, Arial, sans-serif',
    }
});
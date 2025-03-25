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
    },
    typography: {
        fontFamily: 'Assistant, Rubik, Arial, sans-serif',
    },
});
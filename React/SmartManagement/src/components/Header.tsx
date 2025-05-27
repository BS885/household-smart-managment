import { SyntheticEvent, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import { HDate } from "@hebcal/core";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const routes = ['/graphs', '/income-management', '/expense-management', '/reports'];

    const routeToTabIndex = routes.reduce((acc, route, index) => {
        acc[route] = index;
        return acc;
    }, {} as { [key: string]: number });

    const [value, setValue] = useState(routeToTabIndex[location.pathname] || 0);

    const formatHebrewLoginDate = (dateString: string): string => {
        const date = new Date(dateString);
        const hDate = new HDate(date);
        const hebrewDate = hDate.renderGematriya();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;

        return `כניסתך האחרונה הייתה ב־${hebrewDate} בשעה ${time}`;
    };
    // Use effect to update tab when route changes (including browser back/forward)
    useEffect(() => {
        const currentTabIndex = routeToTabIndex[location.pathname];
        if (currentTabIndex !== undefined) {
            setValue(currentTabIndex);
        }
    }, [location.pathname]);

    const user = useSelector((state: RootState) => state.auth.user);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
        navigate(routes[newValue]);
    };

    const StyledTabs = styled(Tabs)(() => ({
        backgroundColor: '#2C3E52',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        '& .MuiTab-root': {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: '1rem',
        },
    }));

    const StyledTab = styled(Tab)(() => ({
        '&.Mui-selected': {
            backgroundColor: "#A8DADC",
            color: '#1A252F',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        '&:hover': {
            backgroundColor: '#C0C0C0',
            opacity: 0.9,
        },
    }));

    return (
        <AppBar position="fixed"
            sx={{ top: 0, left: 0, width: '100%', background: 'linear-gradient(45deg, #2C3E50 30%, #A8DADC 90%)' }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    <Box>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                            {user?.name} שלום!
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {user?.lastLogin && formatHebrewLoginDate(user.lastLogin.toString())}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="inherit"
                        sx={{ color: '#2C3E50' }}
                        endIcon={<LogoutIcon />}
                        onClick={() => dispatch(logout())}
                    > התנתק

                    </Button>
                </Toolbar>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    sx={{ mt: 2 }}>
                    <StyledTab label="גרפים" />
                    <StyledTab label="ניהול הכנסות" />
                    <StyledTab label="ניהול הוצאות" />
                    <StyledTab label="דוחות" />

                </StyledTabs>
            </Container>
        </AppBar>
    );
};

export default Header;
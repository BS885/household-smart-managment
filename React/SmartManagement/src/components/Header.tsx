import{ SyntheticEvent, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/userSlice';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    // Map routes to tab indices
    const routeToTabIndex: { [key: string]: number } = {
        '/reports': 0,
        '/income-management': 1,
        '/expense-management': 2,
        '/graphs': 3
    };

    // Determine initial tab value based on current route
    const [value, setValue] = useState(routeToTabIndex[location.pathname] || 0);
    
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
        
        // Navigate based on tab selection
        const routes = ['/reports', '/income-management', '/expense-management', '/graphs'];
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
                            {user?.name} ברוך הבאה
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            כניסתך האחרונה הייתה בי"ב שבט תשפ"ה בשעה 17:00
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
                    <StyledTab label="דוחות" />
                    <StyledTab label="ניהול הכנסות" />
                    <StyledTab label="ניהול הוצאות" />
                    <StyledTab label="גרפים" />
                </StyledTabs>
            </Container>
        </AppBar>
    );
};

export default Header;
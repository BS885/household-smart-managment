// import  { SyntheticEvent, useState } from 'react';
// import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, Container } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import LogoutIcon from '@mui/icons-material/Logout';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
// const Header = () => {
//     const [value, setValue] = useState(0);
//     const user = useSelector((state: RootState) => state.auth.user);

//     const handleChange = (_event: SyntheticEvent, newValue: number) => {
//         setValue(newValue);
//     };

//     const StyledTabs = styled(Tabs)(({ theme }) => ({
//         backgroundColor: theme.palette.secondary.light,
//         borderTopLeftRadius: 8,
//         borderTopRightRadius: 8,
//         '& .MuiTab-root': {
//             color: theme.palette.primary.dark,
//             fontWeight: 'bold',
//             fontSize: '1rem',
//         },
//     }));

//     const StyledTab = styled(Tab)(({ theme }) => ({
//         '&.Mui-selected': {
//             backgroundColor: theme.palette.primary.main,
//             color: theme.palette.secondary.main,
//             borderTopLeftRadius: 8,
//             borderTopRightRadius: 8,
//         },
//         '&:hover': {
//             backgroundColor: theme.palette.primary.light,
//             opacity: 0.9,
//         },
//     }));

//     return (
//             <AppBar position="fixed"
//                 sx={{ top: 0, left: 0, width: '100%', background: 'linear-gradient(45deg,rgb(57, 81, 104) 30%, #A8DADC 90%)' }}>
//                 <Container maxWidth="lg">
//                     <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
//                         <Box>
//                             <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
//                                 {user?.name}
//                             </Typography>
//                             <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
//                                 כניסתך האחרונה הייתה בי"ב שבט תשפ"ה בשעה 17:00
//                             </Typography>
//                         </Box>
//                         <Button
//                             variant="contained"
//                             color="inherit"
//                             sx={{ color: '#2C3E50' }}
//                             endIcon={<LogoutIcon />}> התנתק
//                         </Button>
//                     </Toolbar>

//                     <StyledTabs
//                         value={value}
//                         onChange={handleChange}
//                         variant="fullWidth"
//                         sx={{ mt: 2 }}>
//                         <StyledTab label="דוחות" />
//                         <StyledTab label="ניהול הכנסות" />
//                         <StyledTab label="ניהול הוצאות" />
//                         <StyledTab label="גרפים" />
//                     </StyledTabs>
//                 </Container>
//             </AppBar>
//     );
// };

// export default Header;
import { SyntheticEvent, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Header = () => {
    const [value, setValue] = useState(0);
    const user = useSelector((state: RootState) => state.auth.user);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const StyledTabs = styled(Tabs)(() => ({
        backgroundColor: '#2C3E52', // כהה
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        '& .MuiTab-root': {
            color: '#FFFFFF', // לבן
            fontWeight: 'bold',
            fontSize: '1rem',
        },
    }));

    const StyledTab = styled(Tab)(() => ({
        '&.Mui-selected': {
            backgroundColor: "#A8DADC", // טאב נבחר - צבע בהיר
            color: '#1A252F', // טקסט כהה בטאב נבחר
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
                        endIcon={<LogoutIcon />}> התנתק
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

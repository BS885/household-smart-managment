// import { ChangeEvent, FormEvent, useState } from 'react';
// import {
//     Box, Container, Typography, TextField, Button, Paper, Divider, InputAdornment, IconButton, Alert
// } from '@mui/material';
// import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
// import { useDispatch } from "react-redux";
// import { loginUser } from "../redux/userSlice";
// import { AppDispatch } from "../redux/store";
// import { NavLink, useNavigate } from 'react-router-dom';
// const LoginForm = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     const dispatch: AppDispatch = useDispatch();
//     const navigator = useNavigate();
//     const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//     const [showPassword, setShowPassword] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [loginError, setLoginError] = useState<string | null>(null);

//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };

//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value, checked } = e.target;
//         setFormData({
//             ...formData,
//             [name]: name === 'rememberMe' ? checked : value
//         });
//         if (errors[name as keyof typeof errors]) {
//             setErrors({
//                 ...errors,
//                 [name]: undefined
//             });
//         }

//         if (loginError) {
//             setLoginError(null);
//         }
//     };

//     const validateForm = () => {
//         const newErrors = { email: '', password: '' };
//         if (!formData.email) {
//             newErrors.email = 'שדה חובה';
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'כתובת אימייל לא תקינה';
//         }

//         if (!formData.password) {
//             newErrors.password = 'שדה חובה';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length > 1;
//     };
//     const handleSubmit = async (e: FormEvent) => {
//         console.log("enter handleSubmit");
//         e.preventDefault();
//         console.log(validateForm());
//         if (validateForm()) {
//             setIsSubmitting(true);
//             try {
//                 const result = await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
//                 console.log("✅ התחברות מוצלחת:", result);
//                 // history.push('/dashboard');
//                 setLoginError(null);
//                 navigator('/graphs');
//                 setFormData({ email: '', password: '' });
                
//             } catch (error: any) {
//                 setLoginError("פרטי ההתחברות שהזנת שגויים. אנא נסה שוב.");
//                 console.log("❌ שגיאת התחברות:", error.message);
//             } finally {
//                 setIsSubmitting(false);
//             }
//         };
//         if (loginError) {
//             setLoginError(null);
//         }
//     };

//     return (
//         <Container maxWidth="sm">
//             <Paper
//                 elevation={3}
//                 sx={{ p: 4, mt: 8, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }} >
//                 <Box sx={{ textAlign: 'center', mb: 3 }}>
//                     <Typography
//                         variant="h4"
//                         component="h1"
//                         color="primary.main"
//                         sx={{ fontWeight: 'bold' }}
//                     >
//                         התחברות למערכת
//                     </Typography>
//                     <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//                         ברוכים הבאים! אנא הזינו את פרטי הכניסה שלכם
//                     </Typography>
//                 </Box>

//                 <Divider sx={{ mb: 4 }} />

//                 {loginError && (
//                     <Alert severity="error" sx={{ mb: 3 }}>
//                         {loginError}
//                     </Alert>
//                 )}

//                 <Box component="form" onSubmit={handleSubmit}>
//                     <TextField
//                         fullWidth
//                         required
//                         label="דואר אלקטרוני"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         error={!!errors.email}
//                         helperText={errors.email}
//                         slotProps={{
//                             input: {
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Email color="primary" />
//                                     </InputAdornment>
//                                 ),
//                             }
//                         }}
//                         variant="outlined"
//                         margin="normal"
//                     />

//                     <TextField
//                         fullWidth
//                         required
//                         label="סיסמה"
//                         name="password"
//                         type={showPassword ? 'text' : 'password'}
//                         value={formData.password}
//                         onChange={handleChange}
//                         error={!!errors.password}
//                         helperText={errors.password}
//                         slotProps={{
//                             input: {
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Lock color="primary" />
//                                     </InputAdornment>
//                                 ),
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             aria-label="toggle password visibility"
//                                             onClick={handleClickShowPassword}
//                                             edge="end"
//                                         >
//                                             {showPassword ? <VisibilityOff /> : <Visibility />}
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ),
//                             }
//                         }}
//                         variant="outlined"
//                         margin="normal"
//                     />
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
//                         <NavLink
//                             to="#"
//                             style={{ textDecoration: "underline", color: "inherit" }}
//                         >
//                             שכחת סיסמה?
//                         </NavLink>
//                     </Box>

//                     <Button
//                         type="submit"
//                         fullWidth
//                         variant="contained"
//                         color="primary"
//                         size="large"
//                         disabled={isSubmitting}
//                         endIcon={<LoginIcon />}
//                         sx={{
//                             mt: 2,
//                             mb: 2,
//                             height: '48px',
//                             fontWeight: 'bold',
//                             gap: 1.5 // מוסיף רווח בין האייקון לטקסט
//                         }}
//                     >
//                         {isSubmitting ? 'מתחבר...' : 'התחבר'}
//                     </Button>
//                 </Box>

//                 <Box sx={{ mt: 4, textAlign: 'center' }}>
//                     <Typography variant="body2" color="text.secondary">
//                         אין לך חשבון עדיין?{' '}
//                         <NavLink to="/register" style={{ textDecoration: "none", color: "inherit" }}>
//                             הירשם עכשיו
//                         </NavLink >
//                     </Typography>
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default LoginForm;


import { ChangeEvent, FormEvent, useState } from 'react';
import {
    Box, Container, Typography, TextField, Button, Paper, Divider, InputAdornment, IconButton, Alert
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/userSlice";
import { AppDispatch } from "../redux/store";
import { NavLink, useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const dispatch: AppDispatch = useDispatch();
    const navigator = useNavigate();
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'rememberMe' ? checked : value
        });
        if (errors[name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [name]: undefined
            });
        }

        if (loginError) {
            setLoginError(null);
        }
    };

    const validateForm = () => {
        const newErrors = { email: '', password: '' };
        if (!formData.email) {
            newErrors.email = 'שדה חובה';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'כתובת אימייל לא תקינה';
        }

        if (!formData.password) {
            newErrors.password = 'שדה חובה';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length > 1;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const result = await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
                console.log("✅ התחברות מוצלחת:", result);
                setLoginError(null);
                navigator('/graphs');
                setFormData({ email: '', password: '' });
            } catch (error: any) {
                // בדוק סוג השגיאה
                if (error?.response?.status === 500) {
                    setLoginError("שגיאה בשרת. אנא נסה מאוחר יותר.");
                } else if (error?.response?.status === 401) {
                    setLoginError("פרטי ההתחברות לא תקינים. אנא נסה שוב.");
                } else {
                    setLoginError("שגיאה לא צפויה. אנא נסה שוב.");
                }
                console.log("❌ שגיאת התחברות:", error?.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={3}
                sx={{ p: 4, mt: 8, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }} >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        color="primary.main"
                        sx={{ fontWeight: 'bold' }}
                    >
                        התחברות למערכת
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        ברוכים הבאים! אנא הזינו את פרטי הכניסה שלכם
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {loginError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {loginError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        required
                        label="דואר אלקטרוני"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="primary" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        variant="outlined"
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        required
                        label="סיסמה"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                        variant="outlined"
                        margin="normal"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                        <NavLink
                            to="#"
                            style={{ textDecoration: "underline", color: "inherit" }}
                        >
                            שכחת סיסמה?
                        </NavLink>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting}
                        endIcon={<LoginIcon />}
                        sx={{
                            mt: 2,
                            mb: 2,
                            height: '48px',
                            fontWeight: 'bold',
                            gap: 1.5 // מוסיף רווח בין האייקון לטקסט
                        }}
                    >
                        {isSubmitting ? 'מתחבר...' : 'התחבר'}
                    </Button>
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        אין לך חשבון עדיין?{' '}
                        <NavLink to="/register" style={{ textDecoration: "none", color: "inherit" }}>
                            הירשם עכשיו
                        </NavLink >
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginForm;

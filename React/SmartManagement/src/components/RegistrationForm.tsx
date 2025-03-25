import { ChangeEvent, useState } from 'react';
import {
    Box, Container, Typography, TextField, Button, Paper, Divider, FormControlLabel, Checkbox,
    FormHelperText, Stepper, Step, StepLabel, Stack, Alert, InputAdornment, IconButton, Snackbar,
    Link
} from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle, Email, Phone, Lock, ArrowBack, ArrowForward, Home, LocationOn } from '@mui/icons-material';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/userSlice';
import { Link as RouterLink } from 'react-router-dom';
const RegistrationForm = () => {
    const dispatch: AppDispatch = useDispatch();
    // ניהול שלבי הרשמה
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['פרטים אישיים', 'פרטי חשבון', 'אימות ואישור'];

    // ניהול הודעות מהשרת
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // ניהול תצוגת סיסמה
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // ניהול השדות
    const [formData, setFormData] = useState({
        Name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const [errors, setErrors] = useState({ Name: '', email: '', phone: '', address: '', city: '', password: '', confirmPassword: '', agreeTerms: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'agreeTerms' ? checked : value
        });

        // נקה שגיאות בעת שינוי
        if (errors[name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }

        // נקה הודעות שגיאה מהשרת בעת שינוי
        if (serverError) {
            setServerError('');
        }
    };

    const validateForm = () => {
        const newErrors = { Name: '', email: '', phone: '', address: '', city: '', password: '', confirmPassword: '', agreeTerms: '' };
        let isValid = true;

        // בדיקת תקינות לפי שלב
        if (activeStep === 0) {
            if (!formData.Name) {
                newErrors.Name = 'שדה חובה';
                isValid = false;
            }
            if (!formData.phone) {
                newErrors.phone = 'שדה חובה';
                isValid = false;
            }
            else if (formData.phone.length < 10 || formData.phone.length > 13) {
                newErrors.phone = 'מספר הטלפון צריך להכיל 10-13 ספרות';
                isValid = false;
            } else if (!/^(\+972|0)([5][0-9])[0-9]{7}$/.test(formData.phone)) {
                newErrors.phone = 'מספר טלפון לא תקין';
                isValid = false;
            }
            if (!formData.address) {
                newErrors.address = 'שדה חובה';
                isValid = false;
            }
            if (!formData.city) {
                newErrors.city = 'שדה חובה';
                isValid = false;
            }
        } else if (activeStep === 1) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|gov|edu|co\.il|ac\.il)$/i;
            if (!formData.email) {
                newErrors.email = 'שדה חובה';
                isValid = false;
            }
            else if (!emailRegex.test(formData.email)) {
                newErrors.email = 'כתובת אימייל לא תקינה';
                isValid = false;
            }
            if (!formData.password) {
                newErrors.password = 'שדה חובה';
                isValid = false;
            }
            else if (formData.password.length < 8) {
                newErrors.password = 'הסיסמה חייבת להכיל לפחות 8 תווים';
                isValid = false;
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'שדה חובה';
                isValid = false;
            }
            else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
                isValid = false;
            }
        } else if (activeStep === 2) {
            if (!formData.agreeTerms) {
                newErrors.agreeTerms = 'עליך לאשר את תנאי השימוש';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            if (activeStep < steps.length - 1) {
                handleNext();
            } else {
                try {
                    setServerError('');
                    const result = await dispatch(registerUser({
                        name: formData.Name,
                        email: formData.email,
                        password: formData.password,
                        address: formData.address,
                        city: formData.city,
                        phone: formData.phone
                    })).unwrap();

                    console.log("✅ הרשמה מוצלחת:", result);
                    // הצגת הודעת הצלחה
                    setSuccessMessage('ההרשמה הושלמה בהצלחה!');
                    setOpenSnackbar(true);

                    // איפוס טופס לאחר הרשמה מוצלחת
                    setFormData({
                        Name: '', email: '', phone: '', address: '', city: '', password: '', confirmPassword: '', agreeTerms: false
                    });
                    setActiveStep(0);
                }
                catch (error: any) {
                    console.error("❌ שגיאת הרשמה:", error);
                    setServerError(typeof error === 'string' ? error : 'שגיאה בתהליך ההרשמה, אנא נסה שנית');
                }
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // תצוגת תוכן לפי שלב
    const getStepContent = (step: number) => {
        switch (step) {
            case 0: // פרטים אישיים
                return (
                    <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                label="שם מלא"
                                name="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                error={!!errors.Name}
                                helperText={errors.Name}
                                InputProps={{ // Using for backward compatibility 
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </Stack>
                        <TextField
                            fullWidth
                            label="טלפון נייד"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            InputProps={{ // Using for backward compatibility
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="כתובת"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            error={!!errors.address}
                            helperText={errors.address}
                            InputProps={{ // Using for backward compatibility
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Home color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="עיר"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            error={!!errors.city}
                            helperText={errors.city}
                            InputProps={{ // Using for backward compatibility
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOn color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                        />
                    </Stack>
                );
            case 1:
                return (
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="דואר אלקטרוני"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            InputProps={{ // Using for backward compatibility
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="סיסמה"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{ // Using for backward compatibility
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
                            }}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="אימות סיסמה"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{ // Using for backward compatibility
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                        />
                    </Stack>
                );
            case 2: // אימות ואישור
                return (
                    <Stack spacing={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                backgroundColor: 'primary.light',
                                borderRadius: 2,
                                color: 'primary.dark'
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                סיכום פרטים
                            </Typography>
                            <Typography variant="body1">
                                שם מלא: {formData.Name}
                            </Typography>
                            <Typography variant="body1">
                                טלפון: {formData.phone}
                            </Typography>
                            <Typography variant="body1">
                                כתובת: {formData.address}
                            </Typography>
                            <Typography variant="body1">
                                עיר: {formData.city}
                            </Typography>
                            <Typography variant="body1">
                                דואר אלקטרוני: {formData.email}
                            </Typography>
                        </Paper>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="agreeTerms"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label="קראתי ואני מסכים לתנאי השימוש ומדיניות הפרטיות"
                        />
                        {errors.agreeTerms && (
                            <FormHelperText error>{errors.agreeTerms}</FormHelperText>
                        )}
                    </Stack>
                );
            default:
                return 'שלב לא ידוע';
        }
    };

    return (
        <Container maxWidth="lg"> {/* שינוי ל-lg להרחבה */}
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mt: 4,
                    mb: 4,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'primary.light',
                    width: '100%', // מאפשר ניצול מלא של הקונטיינר
                    maxWidth: '900px', // מגביל גודל מקסימלי
                    mx: 'auto' // ממרכז את ה-Paper
                }}
            >
                <Typography

                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                    color="primary.main"
                    sx={{ fontWeight: 'bold' }}
                >
                    הרשמה למערכת
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* הצגת שגיאות מהשרת */}
                {serverError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {serverError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    {getStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            startIcon={<ArrowForward />}
                            sx={{ mr: 1 }}
                        >
                            חזרה
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={activeStep === steps.length - 1 ? null : <ArrowBack />}
                        >
                            {activeStep === steps.length - 1 ? 'סיום הרשמה' : 'המשך'}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        כבר יש לך חשבון?{' '}
                        <Link component={RouterLink} to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                            התחבר כאן
                        </Link>
                    </Typography>
                </Box>
            </Paper>

            {/* Snackbar להודעות הצלחה */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RegistrationForm;
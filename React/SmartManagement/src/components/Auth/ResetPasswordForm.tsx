import { ChangeEvent, FormEvent, useState } from "react";
import {
    Box, Container, Typography, TextField, Button, Paper, InputAdornment, IconButton, Alert, LinearProgress
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, VpnKey as ResetIcon, CheckCircle } from '@mui/icons-material';
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../redux/userSlice";
import { NavLink, useNavigate } from 'react-router-dom';
import BackgroundAuth from "./BackgroundAuth";

const ResetPassword = () => {
    // const params = new URLSearchParams(window.location.search);
    // const token = params.get("token");
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
        email: ""
    });
    const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetError, setResetError] = useState<string | null>(null);
    const [resetSuccess, setResetSuccess] = useState(false);

    const extractTokenFromHash = () => {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return null;
    const query = hash.substring(queryIndex);
    const params = new URLSearchParams(query);
    return params.get("token");
};
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;
        return { strength, checks };
    };

    const getStrengthColor = (strength: number) => {
        if (strength <= 2) return 'error';
        if (strength <= 3) return 'warning';
        if (strength <= 4) return 'info';
        return 'success';
    };

    const getStrengthText = (strength: number) => {
        if (strength <= 2) return 'חלשה';
        if (strength <= 3) return 'בינונית';
        if (strength <= 4) return 'טובה';
        return 'חזקה';
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // ניקוי שגיאות
        if (errors[name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [name]: undefined
            });
        }

        if (resetError) {
            setResetError(null);
        }
    };

    const validateForm = () => {
        const newErrors: { newPassword?: string; confirmPassword?: string } = {};

        // בדיקת סיסמה
        if (!formData.newPassword) {
            newErrors.newPassword = 'שדה חובה';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'הסיסמה חייבת להכיל לפחות 8 תווים';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
            newErrors.newPassword = 'הסיסמה חייבת להכיל אות גדולה, אות קטנה ומספר';
        }

        // בדיקת אישור סיסמה
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'שדה חובה';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        const token=extractTokenFromHash();
        if (!token) {
            console.log("לא נמצא טוקן");
            console.log(token);
            setResetError("קישור לא תקין או פג תוקף");
            return;
        }

        setIsSubmitting(true);
        try {
            console.log("איפוס סיסמה עבור:", formData.email, "עם טוקן:", token);

            await dispatch(resetPassword({
                email: formData.email,
                token: token,
                newPassword: formData.newPassword
            })).unwrap();

            setResetSuccess(true);
            setResetError(null);

            // ניווט למסך התחברות אחרי 3 שניות
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error: any) {
            console.log("error", error);
            if (error?.response?.status === 400) {
                setResetError("קישור לא תקין או פג תוקף");
            } else if (error?.response?.status === 404) {
                setResetError("המשתמש לא נמצא");
            } else if (error?.response?.status === 500) {
                setResetError("שגיאה בשרת. אנא נסה מאוחר יותר");
            } else {
                setResetError("איפוס סיסמה נכשל, אנא נסה שוב");
            }
            console.error("איפוס סיסמה נכשל:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    if (resetSuccess) {
        return (
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{ p: 4, mt: 8, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'success.light' }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
                        <Typography
                            variant="h4"
                            component="h1"
                            color="success.main"
                            sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                            הסיסמה אופסה בהצלחה!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            הסיסמה שלך שונתה בהצלחה. אתה מועבר למסך ההתחברות...
                        </Typography>
                        <LinearProgress color="success" sx={{ mb: 2 }} />
                        <NavLink to="/login" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="success">
                                עבור להתחברות
                            </Button>
                        </NavLink>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <BackgroundAuth
            title="איפוס סיסמה"
            subtitle="אנא הזן את הסיסמה החדשה שלך כדי לאפס את הסיסמה."
            showLogo={true}
            logoIcon={<ResetIcon />}
            maxWidth="sm"
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{ p: 4, mt: 8, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}
                >
                    {resetError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {resetError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            required
                            label="אימייל"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            required
                            label="סיסמה חדשה"
                            name="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleChange}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
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

                        {formData.newPassword && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        חוזק הסיסמה:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color={`${getStrengthColor(passwordStrength.strength)}.main`}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {getStrengthText(passwordStrength.strength)}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={(passwordStrength.strength / 5) * 100}
                                    color={getStrengthColor(passwordStrength.strength)}
                                    sx={{ height: 6, borderRadius: 3 }}
                                />
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        דרישות: {passwordStrength.checks.length ? '✓' : '✗'} לפחות 8 תווים, {' '}
                                        {passwordStrength.checks.uppercase ? '✓' : '✗'} אות גדולה, {' '}
                                        {passwordStrength.checks.lowercase ? '✓' : '✗'} אות קטנה, {' '}
                                        {passwordStrength.checks.numbers ? '✓' : '✗'} מספר
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            required
                            label="אישור סיסמה"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
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
                                                aria-label="toggle confirm password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                            variant="outlined"
                            margin="normal"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={isSubmitting || passwordStrength.strength < 3}
                            endIcon={<ResetIcon />}
                            sx={{
                                mt: 3,
                                mb: 2,
                                height: '48px',
                                fontWeight: 'bold',
                                gap: 1.5
                            }}
                        >
                            {isSubmitting ? 'מאפס סיסמה...' : 'איפוס סיסמה'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            זכרת את הסיסמה?{' '}
                            <NavLink to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                                חזור להתחברות
                            </NavLink>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </BackgroundAuth>
    );
}

export default ResetPassword;
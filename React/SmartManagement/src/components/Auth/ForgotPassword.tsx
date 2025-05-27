import { ChangeEvent, FormEvent, useState } from "react";
import {
    Box,
    Container,
    TextField,
    Button,
    InputAdornment,
    Alert,
} from "@mui/material";
import { Email, Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import BackgroundAuth from "./BackgroundAuth";
import SecurityIcon from '@mui/icons-material/Security';


const ForgotPassword = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((s: any) => s.auth);

    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("כתובת אימייל לא תקינה");
            return;
        }

        try {
            await dispatch(forgotPassword(email)).unwrap();
            setSent(true);
        } catch {
            setError("שליחת המייל נכשלה. נסה שוב.");
        }
    };

    return (
        <BackgroundAuth
        title="שחזור סיסמה"
        subtitle="אנא הזן את כתובת האימייל שלך כדי לקבל קישור לאיפוס סיסמה."
        showLogo={true}
        logoIcon={<SecurityIcon/>}
        maxWidth="sm"
    >
        <Container maxWidth="sm">
                {sent ? (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        אם האימייל קיים, נשלח קישור לאיפוס סיסמה.
                    </Alert>
                ) : (
                    <>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                required
                                label="דואר אלקטרוני"
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email color="primary" />
                                            </InputAdornment>
                                        ),
                                    },
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
                                disabled={loading}
                                endIcon={<Send />}
                                sx={{ mt: 2, mb: 2, height: "48px", fontWeight: "bold", gap: 1.5 }}
                            >
                                {loading ? "שולח..." : "שלח קישור"}
                            </Button>

                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => navigate(-1)}
                            >
                                חזרה להתחברות
                            </Button>
                        </Box>
                    </>
                )}
        </Container>
        </BackgroundAuth>
    );
};

export default ForgotPassword;

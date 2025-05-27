import React, { ReactNode } from 'react';
import {
    Box,
    Container,
    Paper,
    useTheme,
    alpha,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const AnimatedBackground = styled(Box)(({ theme }) => ({
    position: 'relative',
    minHeight: '100vh',
    background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.1)} 0%, 
        ${alpha(theme.palette.secondary.main, 0.05)} 50%, 
        ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 60%)`,
        zIndex: 0,
    }
}));

const FloatingElement = styled(Box)(({ theme }) => ({
    position: 'absolute',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
    filter: 'blur(1px)',
    animation: 'float 6s ease-in-out infinite',
    '@keyframes float': {
        '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
        },
        '50%': {
            transform: 'translateY(-20px) rotate(180deg)',
        },
    },
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    background: `${alpha(theme.palette.background.paper, 0.95)}`,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        margin: theme.spacing(2),
    },
}));

const LogoSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    '& .logo-icon': {
        fontSize: '3rem',
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1),
        display: 'block',
    }
}));

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    showLogo?: boolean;
    logoIcon?: ReactNode;
    customStyles?: {
        paper?: object;
        container?: object;
        background?: object;
    };
}

const BackgroundAuth: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    maxWidth = 'sm',
    showLogo = true,
    logoIcon,
    customStyles = {}
}) => {
    const theme = useTheme();

    return (
        <AnimatedBackground sx={customStyles.background}>
            {/* Floating decorative elements */}
            <FloatingElement
                sx={{
                    width: 60,
                    height: 60,
                    top: '10%',
                    left: '15%',
                    animationDelay: '0s',
                }}
            />
            <FloatingElement
                sx={{
                    width: 80,
                    height: 80,
                    top: '70%',
                    right: '10%',
                    animationDelay: '2s',
                }}
            />
            <FloatingElement
                sx={{
                    width: 40,
                    height: 40,
                    top: '20%',
                    right: '20%',
                    animationDelay: '4s',
                }}
            />
            <FloatingElement
                sx={{
                    width: 100,
                    height: 100,
                    bottom: '15%',
                    left: '5%',
                    animationDelay: '1s',
                }}
            />

            <Container
                sx={{
                    minHeight: '100vh',
                    width: '60vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    position: 'relative',
                    zIndex: 1,
                    ...customStyles.container
                }}
            >
                <AuthPaper
                    elevation={0}
                    sx={{
                        width: '100vw',
                        maxWidth: maxWidth === 'lg' ? 600 : undefined,
                        ...customStyles.paper
                    }}
                >
                    {showLogo && (
                        <LogoSection>
                            {logoIcon && <Box className="logo-icon">{logoIcon}</Box>}
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1,
                                }}
                            >
                                {title || 'ברוכים הבאים'}
                            </Typography>
                            {subtitle && (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ fontSize: '1.1rem' }}
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </LogoSection>
                    )}

                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                        {children}
                    </Box>
                </AuthPaper>
            </Container>
        </AnimatedBackground>
    );
};

export default BackgroundAuth;
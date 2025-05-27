import { alpha, Theme } from "@mui/material";


export const getAdvancedFilterCardStyles = (theme: Theme) => ({
    mb: 4,
    borderRadius: 3,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    position: 'relative',
});

export const getButtonPlayDataStyles = (theme: Theme) => ({
    minWidth: 180,
        px: 4,
            py: 1.5,
                borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        boxShadow: '0 6px 20px rgba(44, 62, 80, 0.3)',
                            fontWeight: 600,
                                fontSize: '1rem',
                                    '&:hover': {
        transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(44, 62, 80, 0.4)',
        },
    '&:disabled': {
        background: theme.palette.secondary.dark,
            transform: 'none',
        },
    transition: 'all 0.3s ease',
});  

export const getSummaryCardStyles = (theme: Theme) => ({
    mb: 4,
    borderRadius: 3,
    background: `linear-gradient(135deg, 
        rgba(255,255,255,0.9) 0%, 
        rgba(255,255,255,0.95) 100%
    )`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
});
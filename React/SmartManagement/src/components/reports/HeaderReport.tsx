import { Fade, Paper, alpha, Box, Grid, Typography, Zoom, Button } from "@mui/material"
import { theme } from "../../Style/Theme"
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Tooltip as MuiTooltip } from "@mui/material"
import { JSX } from "react";

export type actionFile = {
    name: string,
    icon: JSX.Element,
    onClick: () => void
}

const HeaderReport = ({ handleDownloadFile, handlePrintFile,handleSendEmailFile, isDownload, title }: { 
    handleDownloadFile: () => void, 
    handlePrintFile: () => void, 
    handleSendEmailFile:()=> void,
    isDownload: boolean, 
    title: string 
}) => {

    const actions: actionFile[] = [
        {
            name: 'הורד דוח מפורט בפורמט CSV',
            icon: <DownloadIcon />,
            onClick: handleDownloadFile
        },
        {
            name: 'שלח דוח בדוא"ל',
            icon: <EmailIcon />,
            onClick: handleSendEmailFile
        },
        {
            name: 'הדפס דוח',
            icon: <PrintIcon />,
            onClick: handlePrintFile
        }
    ];

    return (
        <Fade in timeout={800}>
            <Paper
                elevation={12}
                sx={{
                    background: `
                        linear-gradient(135deg, 
                            ${theme.palette.primary.main} 0%, 
                            ${theme.palette.primary.dark} 50%,
                            ${alpha(theme.palette.primary.dark, 0.9)} 100%
                        )`,
                    borderRadius: 6,
                    p: 4,
                    mb: 4,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `${alpha(theme.palette.primary.main, 0.3)} 0 20px 40px, inset 0 0 0 1px ${alpha('#ffffff', 0.1)}`,

                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-60%',
                        right: '-60%',
                        width: '220%',
                        height: '220%',
                        background: `
                            radial-gradient(ellipse at center, 
                                ${alpha(theme.palette.primary.light, 0.15)} 0%, 
                                ${alpha(theme.palette.primary.light, 0.05)} 40%,
                                transparent 70%
                            )
                        `,
                        transform: 'rotate(25deg)',
                        animation: 'pulse 4s ease-in-out infinite',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: `
                            linear-gradient(45deg, 
                                transparent 0%, 
                                ${alpha('#ffffff', 0.03)} 50%, 
                                transparent 100%
                            )
                        `,
                    },
                    '@keyframes pulse': {
                        '0%, 100%': {
                            opacity: 0.8,
                            transform: 'rotate(25deg) scale(1)',
                        },
                        '50%': {
                            opacity: 1,
                            transform: 'rotate(25deg) scale(1.05)',
                        },
                    },
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container alignItems="center" spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Zoom in timeout={1000}>
                                    <Box
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 4,
                                            background: `
                                                linear-gradient(135deg, 
                                                    ${alpha(theme.palette.primary.light, 0.25)} 0%, 
                                                    ${alpha(theme.palette.primary.light, 0.15)} 100%
                                                )
                                            `,
                                            backdropFilter: 'blur(10px)',
                                            border: `2px solid ${alpha('#ffffff', 0.2)}`,
                                            mr: 3,
                                            boxShadow: `
                                                0 8px 32px ${alpha(theme.palette.primary.dark, 0.3)},
                                                0 0 0 1px ${alpha('#ffffff', 0.1)} inset
                                            `,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05) rotate(2deg)',
                                                boxShadow: `
                                                    0 12px 40px ${alpha(theme.palette.primary.dark, 0.4)},
                                                    0 0 0 1px ${alpha('#ffffff', 0.2)} inset
                                                `,
                                            }
                                        }}
                                    >
                                        <AssessmentIcon 
                                            sx={{ 
                                                fontSize: 32,
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                            }} 
                                        />
                                    </Box>
                                </Zoom>
                                <Box>
                                    <Typography 
                                        variant="h4" 
                                        component="h1" 
                                        fontWeight="bold" 
                                        gutterBottom
                                        sx={{
                                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                            background: `linear-gradient(45deg, white 30%, ${alpha('#ffffff', 0.8)} 100%)`,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontSize: { xs: '1.8rem', md: '2.125rem' }
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            opacity: 0.95,
                                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                            fontWeight: 400,
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        נתח והבן את הוצאותיך בצורה מפורטת
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {isDownload && (
                                <Zoom in timeout={600}>
                                    <Box 
                                        sx={{ 
                                            display: 'flex', 
                                            gap: 2, 
                                            justifyContent: { xs: 'center', md: 'flex-end' },
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        {actions.map((action, index) => (
                                            <Zoom in timeout={800 + (index * 200)} key={index}>
                                                <MuiTooltip 
                                                    title={action.name}
                                                    placement="top"
                                                    arrow
                                                    componentsProps={{
                                                        tooltip: {
                                                            sx: {
                                                                bgcolor: 'rgba(0,0,0,0.9)',
                                                                fontSize: '0.875rem',
                                                                backdropFilter: 'blur(10px)',
                                                                border: `1px solid ${alpha('#ffffff', 0.2)}`
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        startIcon={action.icon}
                                                        onClick={() => action.onClick()}
                                                        sx={{
                                                            minWidth: 'auto',
                                                            width: 56,
                                                            height: 56,
                                                            borderRadius: 4,
                                                            background: `
                                                                linear-gradient(135deg, 
                                                                    ${alpha('#ffffff', 0.25)} 0%, 
                                                                    ${alpha('#ffffff', 0.15)} 100%
                                                                )
                                                            `,
                                                            backdropFilter: 'blur(20px)',
                                                            border: `2px solid ${alpha('#ffffff', 0.3)}`,
                                                            boxShadow: `
                                                                0 8px 32px ${alpha('#000000', 0.2)},
                                                                0 0 0 1px ${alpha('#ffffff', 0.1)} inset
                                                            `,
                                                            '&:hover': {
                                                                background: `
                                                                    linear-gradient(135deg, 
                                                                        ${alpha('#ffffff', 0.35)} 0%, 
                                                                        ${alpha('#ffffff', 0.25)} 100%
                                                                    )
                                                                `,
                                                                transform: 'translateY(-4px) scale(1.05)',
                                                                boxShadow: `
                                                                    0 12px 40px ${alpha('#000000', 0.25)},
                                                                    0 0 0 1px ${alpha('#ffffff', 0.2)} inset
                                                                `,
                                                                border: `2px solid ${alpha('#ffffff', 0.4)}`,
                                                            },
                                                            '&:active': {
                                                                transform: 'translateY(-2px) scale(1.02)',
                                                            },
                                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            '& .MuiButton-startIcon': {
                                                                margin: 0,
                                                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                                            }
                                                        }}
                                                    >
                                                    </Button>
                                                </MuiTooltip>
                                            </Zoom>
                                        ))}
                                    </Box>
                                </Zoom>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Fade>
    )
}

export default HeaderReport
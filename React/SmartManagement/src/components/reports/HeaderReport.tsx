import { Fade, Paper, alpha, Box, Grid, Typography, Zoom, Button } from "@mui/material"
import { theme } from "../../Style/Theme"
import DownloadIcon from "@mui/icons-material/Download";
import{ Tooltip as MuiTooltip} from "@mui/material"
const HeaderReport = ({handleDownloadFile,isDownload,title}:{handleDownloadFile:()=>void,isDownload:boolean,title:string}) => {

    
    return(
        <Fade in timeout={800}>
        <Paper
            elevation={0}
            sx={{
                background: `
                        linear-gradient(135deg, ${theme.palette.primary.main} 0%,  ${theme.palette.primary.dark} 100%)`,
                borderRadius: 4,
                p: 4,
                mb: 4,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `
                            radial-gradient(circle, 
                                ${alpha(theme.palette.primary.light, 0.1)} 0%, 
                                transparent 70%
                            )
                        `,
                    transform: 'rotate(45deg)',
                },
            }}
        >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: alpha(theme.palette.primary.light, 0.2),
                                    mr: 3,
                                }}
                            >
                            </Box>
                            <Box>
                                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                    {title}
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    נתח והבן את הוצאותיך בצורה מפורטת
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {isDownload && (
                            <Zoom in timeout={600}>
                                <Box display="flex" justifyContent="flex-end">
                                    <MuiTooltip title="הורד דוח מפורט בפורמט CSV">
                                        <Button
                                            variant="contained"
                                            startIcon={<DownloadIcon />}
                                            onClick={handleDownloadFile}
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                borderRadius: 3,
                                                px: 3,
                                                py: 1.5,
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.3)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                        </Button>
                                    </MuiTooltip>
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

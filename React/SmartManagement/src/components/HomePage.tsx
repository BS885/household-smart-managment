import { Box, Button, Container, Typography, Grid, Paper, Divider, ThemeProvider, CssBaseline } from '@mui/material';
import { AttachMoney as MoneyIcon, TrendingUp as TrendingUpIcon, Receipt as ReceiptIcon, Savings as SavingsIcon, } from '@mui/icons-material';
import { theme } from '../Style/Theme';
import Login from './Auth/Login';
import { useNavigate } from 'react-router-dom';


// סגנון לכרטיסי תכונות
const featureCardStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 3,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  }
};

// סגנון לאייקונים של התכונות
const featureIconStyle = {
  fontSize: 50,
  color: theme.palette.primary.main,
  marginBottom: 2,
};

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        direction: 'rtl',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}30 0%, ${theme.palette.primary.main}20 100%)`,
      }}>
        {/* כותרת ותפריט */}
        <Box sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 1.5,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                משק בית מאוזן
              </Typography>
              <Box component="img"
                src={"../../public/logo.png"}
                alt="logo"
                sx={{
                  height: 40,
                  maxHeight: 90,
                  mr: 2,
                }} />
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" fontWeight="bold" color="primary.dark" gutterBottom>
                נהלו את התקציב המשפחתי שלכם בקלות
              </Typography>
              <Typography variant="h5" color="primary.dark" sx={{ mb: 4, opacity: 0.9 }}>
                פתרון פשוט וחכם לניהול הוצאות והכנסות, מעקב אחר חסכונות ותכנון תקציבי
              </Typography>
              <Box sx={{ display: 'flex', mt: 3, justifyContent: 'center', }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                  onClick={() => navigate('/register')}
                >
                  הירשמו עכשיו
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Login />
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ py: 8, bgcolor: theme.palette.secondary.light }}>
          <Container>
            <Typography variant="h3" align="center" color="primary.dark" fontWeight="bold" gutterBottom>
              היתרונות שלנו
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
              מערכת מושלמת לניהול התקציב המשפחתי, מותאמת בדיוק לצרכים שלכם
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={featureCardStyle} elevation={2}>
                  <MoneyIcon sx={featureIconStyle} />
                  <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                    ניהול הוצאות
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    תיעוד ומעקב אחר כל ההוצאות בקטגוריות שונות
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={featureCardStyle} elevation={2}>
                  <TrendingUpIcon sx={featureIconStyle} />
                  <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                    מעקב הכנסות
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    תיעוד הכנסות ממקורות שונים וניתוח מגמות
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={featureCardStyle} elevation={2}>
                  <ReceiptIcon sx={featureIconStyle} />
                  <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                    תקציב חכם
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    תכנון תקציב חכם והתראות על חריגות
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={featureCardStyle} elevation={2}>
                  <SavingsIcon sx={featureIconStyle} />
                  <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                    יעדי חיסכון
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    הגדרת יעדי חיסכון ומעקב אחר התקדמות
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* קטע סיום - קריאה לפעולה */}
        <Box sx={{ py: 10, bgcolor: theme.palette.primary.main, color: 'white', textAlign: 'center' }}>
          <Container>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              מוכנים להתחיל?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
              הצטרפו אלינו היום והתחילו לנהל את התקציב המשפחתי שלכם בצורה חכמה ויעילה
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                px: 6,
                py: 2,
                fontWeight: 'bold',
                fontSize: '1.2rem',
                '&:hover': {
                  bgcolor: theme.palette.secondary.light
                }
              }}
              onClick={() => navigate('/register')}
            >
              הרשמו עכשיו - חינם!
            </Button>
          </Container>
        </Box>

        {/* פוטר */}
        <Box sx={{ py: 4, bgcolor: theme.palette.primary.dark, color: 'white' }}>
          <Container>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  משק בית מאוזן
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  המערכת המובילה לניהול תקציב משפחתי חכם ופשוט
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  ניווט מהיר
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>אודות</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>שירותים</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>יצירת קשר</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>שאלות נפוצות</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  צרו קשר
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  info@homebudget.co.il
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                  טלפון: 03-1234567
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Typography variant="body2" align="center" sx={{ opacity: 0.6 }}>
              © כל הזכויות שמורות למשק בית מאוזן {new Date().getFullYear()}
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;


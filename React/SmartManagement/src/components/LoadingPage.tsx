import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      minWidth="100vw"
      dir="rtl"
    >
      <CircularProgress color="primary" size={64} thickness={4} />
      <Typography variant="h6" color="textSecondary" mt={2}>
        טוען נתונים
      </Typography>
      <Typography color="textSecondary">אנא המתן...</Typography>
    </Box>
  );
}

export default LoadingPage;

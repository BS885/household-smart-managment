import { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography, Fade, useTheme } from '@mui/material';
import { DateRange, CalendarToday } from '@mui/icons-material';
import DateRangeReport from './DateRangeReport';
import YearlyReport from './YearlyReport';
const ReportsScreen = () => {
  const theme = useTheme();

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, marginTop: '10%' }}>
        <Box
          sx={{
            background: `linear-gradient(90deg, 
                ${theme.palette.primary.main}05 0%, 
                ${theme.palette.primary.light}10 50%, 
                $theme.palette.primary.main}05 100%)`,
            borderBottom: `2px solid ${theme.palette.primary.light}40`,
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme => theme.palette.primary.main,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                minHeight: 72,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                color: theme => theme.palette.secondary.dark,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme => theme.palette.primary.main,
                  backgroundColor: theme => `${theme.palette.primary.light}15`,
                }
              },
            }}
          >
            <Tab
              icon={<DateRange sx={{ mb: 1 }} />}
              label="דוח לפי טווח תאריכים"
              iconPosition="top"
            />
            <Tab
              icon={<CalendarToday sx={{ mb: 1 }} />}
              label="דוח שנתי"
              iconPosition="top"
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 4 }}>
          <Fade in={true} timeout={500}>
            <Box>
              {tabIndex === 0 && (
                <DateRangeReport />
              )}
              {tabIndex === 1 && (
                <YearlyReport />
              )}
            </Box>
          </Fade>
        </Box>

      <Box
        sx={{
          mt: 6,
          textAlign: 'center',
          opacity: 0.6,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          מערכת דוחות מתקדמת • עיצוב מודרני
        </Typography>
      </Box>
    </Container>
  );
};

export default ReportsScreen;

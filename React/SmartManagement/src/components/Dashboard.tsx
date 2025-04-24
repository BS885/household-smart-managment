import { Box, Typography, Paper, Tabs, Tab, Card, Grid, Container } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadExpenses } from '../redux/ExpenseSlice';
import { AppDispatch, RootState } from '../redux/store';
import PageInBuild from './PageInBuild';
import CakeGraph from './Graphs/cakeGragph';
import CategoryMonthComparisonChart from './Graphs/CategoryMonthComparisonChartProps';
import { generateCategoryPieData } from './Graphs/chartHelpers';
import { Transaction } from '../models/Expense&Income';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, status } = useSelector((state: RootState) => state.expenses);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if (status === 'idle') dispatch(loadExpenses());
  }, [status, dispatch]);

  if (status === 'loading') return <PageInBuild />;

  // Data processing
  const monthlyData: Record<string, Transaction[]> = {};
  expenses.forEach((exp) => {
    const month = exp.date.split('-')[1];
    if (!monthlyData[month]) monthlyData[month] = [];
    monthlyData[month].push(exp);
  });

  const pieChartDataPerMonth = Object.fromEntries(
    Object.entries(monthlyData).map(([month, data]) => [month, generateCategoryPieData(data)])
  );

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthStr = currentMonth.toString().padStart(2, '0');
  const prevMonthStr = (currentMonth === 1 ? 12 : currentMonth - 1).toString().padStart(2, '0');

  const currentMonthExpenses = monthlyData[currentMonthStr] || [];
  const prevMonthExpenses = monthlyData[prevMonthStr] || [];

  const totalCurrentMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.sum, 0);
  const totalPrevMonth = prevMonthExpenses.reduce((sum, exp) => sum + exp.sum, 0);

  const topCategoryCurrentMonth: [string, number] = currentMonthExpenses.length > 0
    ? Object.entries(currentMonthExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.sum;
      return acc;
    }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]
    : ['אין נתונים', 0];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const cardBaseStyle = {
    p: 3,
    borderRadius: 3,
    position: 'relative',
    overflow: 'visible',
    height: '80%',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.12)'
    }
  };

  const cardAccentStyle = (color: string) => ({
    ...cardBaseStyle,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '6px',
      backgroundColor: color,
      borderRadius: '4px 0 0 4px',
    }
  });

  const iconBoxStyle = (color: string) => ({
    mr: 2,
    p: 1.5,
    backgroundColor: `${color}22`, // 13% opacity
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    marginLeft:'3%'
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4, marginTop: '20%' }}>
      <Box sx={{ direction: "rtl" }}>

        <Paper
          elevation={1}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            mb: 5,
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            centered
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.05rem',
                fontWeight: 500,
                py: 2
              }
            }}
          >
            <Tab label="סקירה כללית" />
            <Tab label="השוואה חודשית" />
          </Tabs>
        </Paper>

        {activeTab === 0 && (
          <>
            {/* שלושת הקלפים בראש הדף */}
            <Grid container spacing={4} sx={{ mb: 5 }}>
              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={cardAccentStyle('primary.main')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{...iconBoxStyle('rgba(25, 118, 210, 0.1)') }}>
                      <ReceiptIcon color="primary" sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                      סך הוצאות החודש
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ my: 2, letterSpacing: -0.5 }}>
                    ₪{totalCurrentMonth.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                    {totalCurrentMonth > totalPrevMonth ? (
                      <TrendingUpIcon color="error" sx={{ mr: 0.5, fontSize: 20 }} />
                    ) : (
                      <TrendingDownIcon color="success" sx={{ mr: 0.5, fontSize: 20 }} />
                    )}
                    <Typography
                      variant="body2"
                      color={totalCurrentMonth > totalPrevMonth ? 'error' : 'success'}
                      fontWeight="medium"
                    >
                      {Math.abs(
                        Math.round((totalCurrentMonth - totalPrevMonth) / Math.max(totalPrevMonth, 1) * 100)
                      )}
                      % {totalCurrentMonth > totalPrevMonth ? 'יותר' : 'פחות'} מהחודש הקודם
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={cardAccentStyle('#f44336')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={iconBoxStyle('rgba(244, 67, 54, 0.1)')}>
                      <CategoryIcon sx={{ color: '#f44336', fontSize: 24 }} />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                      קטגוריה מובילה
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ my: 2, letterSpacing: -0.5 }}>
                    {topCategoryCurrentMonth[0]}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, fontWeight: 500 }}>
                    ₪{topCategoryCurrentMonth[1].toLocaleString()} (
                    {totalCurrentMonth > 0
                      ? Math.round((topCategoryCurrentMonth[1] / totalCurrentMonth) * 100)
                      : 0}
                    % מסך ההוצאות)
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={cardAccentStyle('#4caf50')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={iconBoxStyle('rgba(76, 175, 80, 0.1)')}>
                      <CalendarTodayIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                      ממוצע יומי
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ my: 2, letterSpacing: -0.5 }}>
                    ₪{Math.round(totalCurrentMonth / 30).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, fontWeight: 500 }}>
                    מבוסס על 30 יום בחודש
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* גרף Pie מתחת לקלפים */}
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      p: 4,
                      pb: 2,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: 'text.primary',
                      borderBottom: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    התפלגות הוצאות לפי קטגוריה
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CakeGraph monthlyData={pieChartDataPerMonth} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}


        {activeTab === 1 && (
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
              minHeight: 500,
              width: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'text.primary',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                pb: 3
              }}
            >
              השוואת הוצאות לפי קטגוריה בין חודשים
            </Typography>
            <Box sx={{ height: 'calc(100% - 80px)' }}>
              <CategoryMonthComparisonChart data={expenses} />
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
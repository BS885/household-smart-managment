import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  alpha,
  Box,
  Fade,
  Card,
  CardContent,
  Skeleton,
  Chip,
  TableContainer,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchExpenseCategories } from '../../redux/categoriesSlice';
import { TransactionToSave } from '../../models/Expense&Income';
import { filterExpensesByYearAsync } from '../../redux/ExpenseSlice';
import HeaderReport from './HeaderReport';
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const getCurrentYear = () => new Date().getFullYear();
const getYearsList = (range = 5) =>
  Array.from({ length: range }, (_, i) => getCurrentYear() - i);

const monthNames = [
  '', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

const shortMonthNames = [
  '', 'ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ',
  'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'
];

interface YearlyCategoryReportProps {
  handleDownloadCSV: (rows: string[][], headers: string[], filename: string) => void;
}

const YearlyCategoryReport = ({ handleDownloadCSV }: YearlyCategoryReportProps) => {
  const [year, setYear] = useState(getCurrentYear());
  const [dataByMonthAndCategory, setDataByMonthAndCategory] = useState<Record<string, Record<string, number>>>({});
  const [categoriesUsed, setCategoriesUsed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.categories.expenseStatus);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenseCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(filterExpensesByYearAsync({ year }))
      .unwrap()
      .then((transactions: TransactionToSave[]) => {
        const monthCategoryMap: Record<string, Record<string, number>> = {};
        const usedCats = new Set<string>();

        // Initialize months
        for (let i = 1; i <= 12; i++) {
          const key = i.toString().padStart(2, '0');
          monthCategoryMap[key] = {};
        }

        // Process transactions
        transactions.forEach((t) => {
          const month = dayjs(t.date).format('MM');
          const cat = t.category || 'ללא קטגוריה';
          usedCats.add(cat);
          monthCategoryMap[month][cat] = (monthCategoryMap[month][cat] || 0) + t.sum;
        });

        setCategoriesUsed(Array.from(usedCats));
        setDataByMonthAndCategory(monthCategoryMap);
      })
      .finally(() => setIsLoading(false));
  }, [year, dispatch]);

  const calculateMonthTotals = () => {
    const totals: number[] = [];
    for (let i = 1; i <= 12; i++) {
      const monthKey = i.toString().padStart(2, '0');
      const total = categoriesUsed.reduce((sum, cat) => {
        return sum + (dataByMonthAndCategory[monthKey]?.[cat] || 0);
      }, 0);
      totals.push(total);
    }
    return totals;
  };

  const handleDownloadFile = () => {
    const headers = ['קטגוריה', ...monthNames.slice(1), 'סה"כ'];
    const rows: string[][] = categoriesUsed.map((cat) => {
      const row: string[] = [cat];
      let total = 0;
      for (let i = 1; i <= 12; i++) {
        const monthKey = i.toString().padStart(2, '0');
        const val = dataByMonthAndCategory[monthKey]?.[cat] || 0;
        total += val;
        row.push(val.toFixed(2));
      }
      row.push(total.toFixed(2));
      return row;
    });

    const monthTotalsRow = ['סה"כ לחודש', ...monthTotals.map(val => val.toFixed(2)), monthTotals.reduce((a, b) => a + b, 0).toFixed(2)];
    rows.push(monthTotalsRow);
    handleDownloadCSV(rows, headers, `דוח_קטגוריות_${year}.csv`);
  };

  const monthTotals = calculateMonthTotals();
  const yearTotal = monthTotals.reduce((a, b) => a + b, 0);

  const renderSkeleton = () => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
      }}
    >
      <Box sx={{ p: 3 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={60}
            sx={{ mb: 2, borderRadius: 2 }}
          />
        ))}
      </Box>
    </Paper>
  );

  const renderEmptyState = () => (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <SearchOffIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, opacity: 0.6 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          לא נמצאו נתונים לשנת {year}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
          נסה לבחור שנה אחרת או בדוק שיש לך הוצאות רשומות
        </Typography>
      </Paper>
    </Fade>
  );

  const renderMobileTable = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {categoriesUsed.map((cat) => {
        const rowData = Array.from({ length: 12 }, (_, i) => {
          const monthKey = (i + 1).toString().padStart(2, '0');
          return dataByMonthAndCategory[monthKey]?.[cat] || 0;
        });
        const total = rowData.reduce((a, b) => a + b, 0);

        return (
          <Card
            key={cat}
            elevation={0}
            sx={{
              borderRadius: 3,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={cat}
                  sx={{
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                  }}
                >
                  ₪{total.toLocaleString('he-IL', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {rowData.map((val, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      textAlign: 'center',
                      p: 1,
                      borderRadius: 2,
                      background: val > 0 ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                      {shortMonthNames[idx + 1]}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: val > 0 ? 600 : 400 }}>
                      {val > 0 ? `₪${val.toFixed(0)}` : '-'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );

  const renderDesktopTable = () => (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      <Table sx={{ '& .MuiTableCell-root': { borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}` } }}>
        <TableHead>
          <TableRow
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(theme.palette.secondary.main, 0.03)})`,
            }}
          >
            <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              קטגוריה
            </TableCell>
            {Array.from({ length: 12 }, (_, i) => (
              <TableCell
                key={i}
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  fontSize: isTablet ? '0.8rem' : '0.875rem',
                  px: isTablet ? 1 : 2,
                }}
              >
                {isTablet ? shortMonthNames[i + 1] : monthNames[i + 1]}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              סה"כ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categoriesUsed.map((cat, _index) => {
            const rowData = Array.from({ length: 12 }, (_, i) => {
              const monthKey = (i + 1).toString().padStart(2, '0');
              return dataByMonthAndCategory[monthKey]?.[cat] || 0;
            });
            const total = rowData.reduce((a, b) => a + b, 0);

            return (
              <TableRow
                key={cat}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: alpha(theme.palette.grey[50], 0.3),
                  }
                }}
              >
                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  {cat}
                </TableCell>
                {rowData.map((val, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: val > 0 ? 600 : 400,
                      color: val > 0 ? theme.palette.text.primary : theme.palette.text.disabled,
                      fontSize: isTablet ? '0.8rem' : '0.875rem',
                      px: isTablet ? 1 : 2,
                    }}
                  >
                    {val > 0 ? `₪${val.toLocaleString('he-IL', { minimumFractionDigits: 2 })}` : '-'}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontSize: '1rem',
                  }}
                >
                  ₪{total.toLocaleString('he-IL', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              '& .MuiTableCell-root': {
                borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                fontWeight: 700,
              }
            }}
          >
            <TableCell sx={{ color: theme.palette.text.primary, fontSize: '1rem' }}>
              סה"כ לחודש
            </TableCell>
            {monthTotals.map((total, idx) => (
              <TableCell
                key={idx}
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: isTablet ? '0.85rem' : '0.95rem',
                  px: isTablet ? 1 : 2,
                }}
              >
                ₪{total.toLocaleString('he-IL', { minimumFractionDigits: 2 })}
              </TableCell>
            ))}
            <TableCell
              sx={{
                color: theme.palette.primary.main,
                fontSize: '1.1rem',
                fontWeight: 800,
              }}
            >
              ₪{yearTotal.toLocaleString('he-IL', { minimumFractionDigits: 2 })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <HeaderReport
        handleDownloadFile={handleDownloadFile}
        isDownload={categoriesUsed.length > 0}
        title="דוח קטגוריות לשנה"
      />

      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
        <TextField
          select
          label="בחר שנה"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          sx={{
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
              '&.Mui-focused': {
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
              }
            }
          }}
          InputProps={{
            startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
          }}
        >
          {getYearsList().map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>

        {categoriesUsed.length > 0 && (
          <Fade in timeout={600}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.info.main, 0.1)})`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <TrendingUpIcon sx={{ color: theme.palette.success.main }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {categoriesUsed.length} קטגוריות • סה"כ ₪{yearTotal.toLocaleString('he-IL', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>

      {isLoading ? (
        renderSkeleton()
      ) : categoriesUsed.length > 0 ? (
        <Fade in timeout={800}>
          <Box>
            {isMobile ? renderMobileTable() : renderDesktopTable()}
          </Box>
        </Fade>
      ) : (
        renderEmptyState()
      )}
    </Container>
  );
};

export default YearlyCategoryReport;
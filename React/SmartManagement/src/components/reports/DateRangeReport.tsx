import {
    Box, Container, Button, alpha, Card, CardContent, Grid, Typography, TextField, MenuItem, CircularProgress, Paper, Chip, Fade, useTheme
} from "@mui/material";
import { DateRangeIcon } from "@mui/x-date-pickers/icons";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmptyStateIcon from "@mui/icons-material/SearchOff";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransactionToSave } from "../../models/Expense&Income";
import { fetchExpenseCategories } from "../../redux/categoriesSlice";
import { filterExpensesByRngeDateAndCategoryAsync } from "../../redux/ExpenseSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { getAdvancedFilterCardStyles, getButtonPlayDataStyles, getSummaryCardStyles } from "./ThemReports";
import ReportTable from "./ReportTable";
import HeaderReport from "./HeaderReport";

const DateRangeReport = ({ handleDownloadCSV }: { handleDownloadCSV: (rows: string[][], headers: string[], filename: string) => void }) => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [category, setCategory] = useState('');
    const [transactions, setTransactions] = useState<TransactionToSave[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const expenseCategories = useSelector((state: RootState) => state.categories.expenseCategories);
    const status = useSelector((state: RootState) => state.categories.expenseStatus);
    const theme = useTheme();
    const columns = [
        { key: 'date', header: 'תאריך', icon: <CalendarTodayIcon fontSize="small" /> },
        { key: 'category', header: 'קטגוריה', icon: <CategoryIcon fontSize="small" /> },
        { key: 'sum', header: 'סכום', icon: <AttachMoneyIcon fontSize="small" /> },
        { key: 'description', header: 'תיאור', icon: <ReceiptIcon fontSize="small" /> },
    ];

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchExpenseCategories()).unwrap().catch(console.error);
        }
    }, [dispatch, status]);

    const handleFetch = async () => {
        if (!fromDate || !toDate) return;

        setLoading(true);
        setHasSearched(true);

        try {
            const response = await dispatch(filterExpensesByRngeDateAndCategoryAsync({
                from: fromDate,
                to: toDate,
                category
            })).unwrap();

            setTransactions(response);
        } catch (error) {
            console.error('שגיאה בשליפת הדוח', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadFile = () => {
        const headers = ['תאריך', 'קטגוריה', 'סכום', 'תיאור'];
        const rows = transactions.map((t) => [
            dayjs(t.date).format('YYYY-MM-DD') + "\t",
            t.category,
            t.sum.toFixed(2),
            t.description?.replace(/"/g, '""') || ''
        ]);

        const totalAmount = transactions.reduce((sum, t) => sum + t.sum, 0);
        rows.push([]);
        rows.push(['', 'סה"כ:', totalAmount.toFixed(2), '']);

        const filename = `דוח_תנועות_${fromDate}_עד_${toDate}_${category ? 'קטגוריה_' + category : 'כל_הקטגוריות'}.csv`;
        handleDownloadCSV(rows, headers, filename);
    };

    const getTotalAmount = () => {
        return transactions.reduce((sum, transaction) => sum + transaction.sum, 0).toFixed(2);
    };

    const isFormValid = Boolean(fromDate && toDate);

    const getCategoryColor = (categoryName: string) => {
        const colors = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12', '#9B59B6', '#1ABC9C'];
        const index = expenseCategories.indexOf(categoryName) % colors.length;
        return colors[index];
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>

            <HeaderReport handleDownloadFile={handleDownloadFile} isDownload={transactions.length > 0} title="דוח תנועות לפי טווח תאריכים" />

            <Fade in timeout={1000}>
                <Card
                    sx={getAdvancedFilterCardStyles(theme)}
                >
                    <Box sx={{
                        height: 4,
                        background: `linear-gradient(90deg, 
                                    ${theme.palette.primary.main} 0%, 
                                    ${theme.palette.primary.light} 50%, 
                                    ${theme.palette.primary.main} 100%
                                )`
                    }} />

                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" alignItems="center" mb={3}>
                            <FilterListIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                            <Typography variant="h6" fontWeight="600" color={theme.palette.primary.dark}>
                                סינון מתקדם
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: theme.palette.primary.dark,
                                            fontWeight: 600,
                                            mb: 2
                                        }}
                                    >
                                        <DateRangeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        מתאריך
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: theme.palette.secondary.main,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    '& fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(44, 62, 80, 0.15)',
                                                }
                                            },
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: theme.palette.primary.dark,
                                            fontWeight: 600,
                                            mb: 2
                                        }}
                                    >
                                        <DateRangeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        עד תאריך
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: theme.palette.secondary.main,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    '& fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(44, 62, 80, 0.15)',
                                                }
                                            },
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: theme.palette.primary.dark,
                                            fontWeight: 600,
                                            mb: 2
                                        }}
                                    >
                                        <CategoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        קטגוריה
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: theme.palette.secondary.main,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    '& fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: '0 4px 20px rgba(44, 62, 80, 0.15)',
                                                }
                                            },
                                        }}
                                    >
                                        <MenuItem value="">כל הקטגוריות</MenuItem>
                                        {expenseCategories.map((cat) => (
                                            <MenuItem key={cat} value={cat}>
                                                <Box display="flex" alignItems="center">
                                                    <Box
                                                        sx={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            backgroundColor: getCategoryColor(cat),
                                                            mr: 2
                                                        }}
                                                    />
                                                    {cat}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                onClick={handleFetch}
                                disabled={!isFormValid || loading}
                                sx={getButtonPlayDataStyles(theme)}
                            >
                                {loading ? 'מעבד נתונים...' : 'הצג דוח מפורט'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>

            {hasSearched && !loading && (
                <Fade in timeout={700}>
                    <Box>
                        {transactions.length > 0 ? (
                            <>
                                {/* Summary Card */}
                                <Card sx={getSummaryCardStyles(theme)}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Grid container spacing={4} alignItems="center">
                                            <Grid item xs={12} md={8}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="600" color={theme.palette.primary.dark} gutterBottom>
                                                        סיכום התקופה
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                                                        <Chip
                                                            icon={<CalendarTodayIcon />}
                                                            label={`${dayjs(fromDate).format('DD/MM/YYYY')} - ${dayjs(toDate).format('DD/MM/YYYY')}`}
                                                            sx={{
                                                                backgroundColor: alpha(theme.palette.primary.light, 0.15),
                                                                color: theme.palette.primary.dark,
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                        {category && (
                                                            <Chip
                                                                icon={<CategoryIcon />}
                                                                label={category}
                                                                sx={{
                                                                    backgroundColor: alpha(getCategoryColor(category), 0.15),
                                                                    color: getCategoryColor(category),
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                        )}
                                                        <Chip
                                                            icon={<ReceiptIcon />}
                                                            label={`${transactions.length} תנועות`}
                                                            sx={{
                                                                backgroundColor: alpha(theme.palette.secondary.dark, 0.1),
                                                                color: theme.palette.secondary.dark,
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} md={4}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: 3,
                                                        background: `linear-gradient(135deg, 
                                                                    ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                                                                    ${alpha(theme.palette.primary.light, 0.15)} 100%
                                                                )`,
                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color={theme.palette.primary.dark} mb={1}>
                                                        סה"כ הוצאות
                                                    </Typography>
                                                    <Typography variant="h4" fontWeight="bold" color={theme.palette.primary.main}>
                                                        ₪{getTotalAmount()}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Data Table */}
                                <Paper sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(20px)',
                                }}>
                                    <ReportTable columns={columns} transactions={transactions} expenseCategories={expenseCategories} />

                                </Paper>
                            </>
                        ) : (
                            <Paper sx={{
                                borderRadius: 3,
                                p: 6,
                                textAlign: 'center',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(20px)',
                                border: `1px solid ${alpha(theme.palette.secondary.dark, 0.1)}`,
                            }}>
                                <EmptyStateIcon sx={{
                                    fontSize: 80,
                                    color: theme.palette.secondary.dark,
                                    mb: 2,
                                    opacity: 0.5,
                                }} />
                                <Typography variant="h6" color={theme.palette.secondary.dark} gutterBottom>
                                    לא נמצאו תוצאות
                                </Typography>
                                <Typography variant="body2" color={theme.palette.secondary.dark} sx={{ opacity: 0.7 }}>
                                    נסה לשנות את קריטריוני החיפוש או הרחב את טווח התאריכים
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                </Fade>
            )}
        </Container>
    );
};

export default DateRangeReport;
// import { useEffect, useState } from 'react';
// import {
//     Box,
//     Container,
//     TextField,
//     Button,
//     MenuItem,
//     Typography,
//     Card,
//     CardContent,
//     Tooltip,
//     CircularProgress,
//     Grid,
//     alpha,
//     ThemeProvider
// } from '@mui/material';
// import {
//     DateRange as DateRangeIcon,
//     Category as CategoryIcon,
//     Download as DownloadIcon,
//     Search as SearchIcon,
//     Receipt as ReceiptIcon,
//     Summarize as SummarizeIcon
// } from '@mui/icons-material';
// import dayjs from 'dayjs';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../redux/store';
// import { fetchExpenseCategories } from '../../redux/categoriesSlice';
// import { TransactionToSave } from '../../models/Expense&Income';
// import { filterExpensesByRngeDateAndCategoryAsync } from '../../redux/ExpenseSlice';
// import { theme } from '../Theme';
// import GenericTable from './TableReport';

import { ThemeProvider } from "@emotion/react";
import { Box, Container, Button, alpha, Card, CardContent, Grid, Typography, TextField, MenuItem, CircularProgress, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { DateRangeIcon } from "@mui/x-date-pickers/icons";
import { Category as CategoryIcon, AttachMoney as AttachMoneyIcon, Download as DownloadIcon, Search as SearchIcon } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransactionToSave } from "../../models/Expense&Income";
import { fetchExpenseCategories } from "../../redux/categoriesSlice";
import { filterExpensesByRngeDateAndCategoryAsync } from "../../redux/ExpenseSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { theme } from "../Theme";

// const DateRangeReport = ({ handleDownloadCSV }: {
//     handleDownloadCSV: (rows: string[][], headers: string[], filename: string) => void
// }) => {
//     const [fromDate, setFromDate] = useState('');
//     const [toDate, setToDate] = useState('');
//     const [category, setCategory] = useState('');
//     const [transactions, setTransactions] = useState<TransactionToSave[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);

//     const dispatch = useDispatch<AppDispatch>();
//     const expenseCategories = useSelector((state: RootState) => state.categories.expenseCategories);
//     const status = useSelector((state: RootState) => state.categories.expenseStatus);
//     const columns = [
//         { key: 'date', header: 'תאריך' },
//         { key: 'category', header: 'קטגוריה' },
//         { key: 'sum', header: 'סכום' },
//         { key: 'description', header: 'תיאור' },
//     ];
//     useEffect(() => {
//         if (status === 'idle') {
//             dispatch(fetchExpenseCategories()).unwrap().catch(console.error);
//         }
//     }, [dispatch, status]);

//     const handleFetch = async () => {
//         if (!fromDate || !toDate) return;

//         setLoading(true);
//         setHasSearched(true);

//         try {
//             const response = await dispatch(filterExpensesByRngeDateAndCategoryAsync({
//                 from: fromDate,
//                 to: toDate,
//                 category
//             })).unwrap();

//             setTransactions(response);
//         } catch (error) {
//             console.error('שגיאה בשליפת הדוח', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDownloadFile = () => {
//         const headers = ['תאריך', 'קטגוריה', 'סכום', 'תיאור'];
//         const rows = transactions.map((t) => [
//             dayjs(t.date).format('YYYY-MM-DD') + "\t",
//             t.category,
//             t.sum.toFixed(2),
//             t.description?.replace(/"/g, '""') || ''
//         ]);

//         // Add empty row and summary row at the end
//         const totalAmount = transactions.reduce((sum, t) => sum + t.sum, 0);
//         rows.push([]);  // Empty row for spacing
//         rows.push(['', 'סה"כ:', totalAmount.toFixed(2), '']);

//         const filename = `דוח_תנועות_${fromDate}_עד_${toDate}_${category ? 'קטגוריה_' + category : 'כל_הקטגוריות'}.csv`;
//         handleDownloadCSV(rows, headers, filename);
//     };

//     const getTotalAmount = () => {
//         return transactions.reduce((sum, transaction) => sum + transaction.sum, 0).toFixed(2);
//     };

//     const isFormValid = Boolean(fromDate && toDate);

//     return (
//         <ThemeProvider theme={theme}>
//             <Box sx={{
//                 minHeight: '100vh',
//                 direction: 'rtl',
//                 background: `linear-gradient(160deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
//                 pb: 6
//             }}>
//                 <Container maxWidth="lg" sx={{ py: 5 }}>
//                     {/* Elegant Header */}
//                     <Box sx={{
//                         mb: 5,
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center'
//                     }}>

//                         {transactions.length > 0 && (
//                             <Tooltip title="הורד דוח CSV">
//                                 <Button
//                                     variant="outlined"
//                                     startIcon={<DownloadIcon />}
//                                     onClick={handleDownloadFile}
//                                     sx={{
//                                         borderRadius: 1.5,
//                                         borderColor: theme.palette.primary.main,
//                                         color: theme.palette.primary.main,
//                                         px: 2,
//                                         '&:hover': {
//                                             borderColor: theme.palette.primary.dark,
//                                             backgroundColor: alpha(theme.palette.primary.main, 0.04)
//                                         }
//                                     }}
//                                 >
//                                     הורד CSV
//                                 </Button>
//                             </Tooltip>
//                         )}
//                     </Box>

//                     {/* Filter Card - Minimalist & Elegant */}
//                     <Card
//                         sx={{
//                             mb: 4,
//                             borderRadius: 2,
//                             backgroundColor: theme.palette.secondary.light,
//                             border: 'none',
//                             boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
//                             overflow: 'hidden'
//                         }}
//                     >
//                         <Box sx={{
//                             height: 8,
//                             backgroundColor: theme.palette.primary.main,
//                             backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
//                         }} />

//                         <CardContent sx={{ py: 3 }}>
//                             <Grid container spacing={3}>
//                                 <Grid item xs={12} md={4}>
//                                     <Typography variant="subtitle1" gutterBottom sx={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         color: theme.palette.primary.dark,
//                                         fontSize: '0.95rem',
//                                         fontWeight: 500
//                                     }}>
//                                         <DateRangeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
//                                         מתאריך
//                                     </Typography>
//                                     <TextField
//                                         fullWidth
//                                         type="date"
//                                         value={fromDate}
//                                         onChange={(e) => setFromDate(e.target.value)}
//                                         InputLabelProps={{ shrink: true }}
//                                         size="small"
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 borderRadius: 1.5,
//                                                 backgroundColor: theme.palette.secondary.main,
//                                                 '&:hover fieldset': {
//                                                     borderColor: theme.palette.primary.main,
//                                                 },
//                                                 '& fieldset': {
//                                                     borderColor: theme.palette.secondary.dark,
//                                                 }
//                                             },
//                                         }}
//                                     />
//                                 </Grid>

//                                 <Grid item xs={12} md={4}>
//                                     <Typography variant="subtitle1" gutterBottom sx={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         color: theme.palette.primary.dark,
//                                         fontSize: '0.95rem',
//                                         fontWeight: 500
//                                     }}>
//                                         <DateRangeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
//                                         עד תאריך
//                                     </Typography>
//                                     <TextField
//                                         fullWidth
//                                         type="date"
//                                         value={toDate}
//                                         onChange={(e) => setToDate(e.target.value)}
//                                         InputLabelProps={{ shrink: true }}
//                                         size="small"
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 borderRadius: 1.5,
//                                                 backgroundColor: theme.palette.secondary.main,
//                                                 '&:hover fieldset': {
//                                                     borderColor: theme.palette.primary.main,
//                                                 },
//                                                 '& fieldset': {
//                                                     borderColor: theme.palette.secondary.dark,
//                                                 }
//                                             },
//                                         }}
//                                     />
//                                 </Grid>

//                                 <Grid item xs={12} md={4}>
//                                     <Typography variant="subtitle1" gutterBottom sx={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         color: theme.palette.primary.dark,
//                                         fontSize: '0.95rem',
//                                         fontWeight: 500
//                                     }}>
//                                         <CategoryIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
//                                         קטגוריה
//                                     </Typography>
//                                     <TextField
//                                         fullWidth
//                                         select
//                                         value={category}
//                                         onChange={(e) => setCategory(e.target.value)}
//                                         size="small"
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 borderRadius: 1.5,
//                                                 backgroundColor: theme.palette.secondary.main,
//                                                 '&:hover fieldset': {
//                                                     borderColor: theme.palette.primary.main,
//                                                 },
//                                                 '& fieldset': {
//                                                     borderColor: theme.palette.secondary.dark,
//                                                 }
//                                             },
//                                         }}
//                                     >
//                                         <MenuItem value="">כל הקטגוריות</MenuItem>
//                                         {expenseCategories.map((cat) => (
//                                             <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//                                         ))}
//                                     </TextField>
//                                 </Grid>
//                             </Grid>

//                             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                                 <Button
//                                     variant="contained"
//                                     startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
//                                     onClick={handleFetch}
//                                     disabled={!isFormValid || loading}
//                                     sx={{
//                                         minWidth: 140,
//                                         px: 3.5,
//                                         py: 1,
//                                         borderRadius: 1.5,
//                                         boxShadow: '0 4px 12px rgba(44, 62, 80, 0.2)',
//                                         bgcolor: theme.palette.primary.main,
//                                         fontWeight: 500,
//                                         '&:hover': {
//                                             bgcolor: theme.palette.primary.dark,
//                                             boxShadow: '0 6px 16px rgba(44, 62, 80, 0.3)',
//                                         }
//                                     }}
//                                 >
//                                     {loading ? 'טוען...' : 'הצג דוח'}
//                                 </Button>
//                             </Box>
//                         </CardContent>
//                     </Card>

//                     {/* Results Section */}
//                     {hasSearched && !loading && (
//                         <>
//                             {transactions.length > 0 ? (
//                                 <>
//                                     {/* Summary Card - Minimalist */}
//                                     <Card sx={{
//                                         mb: 4,
//                                         borderRadius: 2,
//                                         backgroundColor: theme.palette.secondary.main,
//                                         boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
//                                     }}>
//                                         <CardContent>
//                                             <Grid container spacing={2} alignItems="center">
//                                                 <Grid item xs={12} sm={7}>
//                                                     <Box>
//                                                         <Typography variant="body2" sx={{ color: theme.palette.secondary.dark }}>
//                                                             {fromDate && toDate && `${dayjs(fromDate).format('DD/MM/YYYY')} - ${dayjs(toDate).format('DD/MM/YYYY')}`}
//                                                             {category && ` • קטגוריה: ${category}`}
//                                                         </Typography>
//                                                         <Typography variant="body1" sx={{ mt: 0.7, fontWeight: 500, color: theme.palette.primary.dark }}>
//                                                             נמצאו {transactions.length} תנועות
//                                                         </Typography>
//                                                     </Box>
//                                                 </Grid>

//                                                 <Grid item xs={12} sm={5}>
//                                                     <Box sx={{
//                                                         p: 2,
//                                                         borderRadius: 1.5,
//                                                         bgcolor: alpha(theme.palette.primary.light, 0.12),
//                                                         border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
//                                                         display: 'flex',
//                                                         alignItems: 'center',
//                                                         justifyContent: 'space-between'
//                                                     }}>
//                                                         <Typography variant="subtitle2" sx={{ color: theme.palette.primary.dark, display: 'flex', alignItems: 'center' }}>
//                                                             <SummarizeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
//                                                             סכום כולל
//                                                         </Typography>
//                                                         <Typography variant="h6" component="div" sx={{
//                                                             fontWeight: 600,
//                                                             color: theme.palette.primary.dark,
//                                                         }}>
//                                                             ₪{getTotalAmount()}
//                                                         </Typography>
//                                                     </Box>
//                                                 </Grid>
//                                             </Grid>
//                                         </CardContent>
//                                     </Card>

//                                     <GenericTable<TransactionToSave> data={transactions} columns={columns} />
// }
//                                     ) : (
//                                     <Card sx={{
//                                         textAlign: 'center',
//                                         py: 6,
//                                         px: 3,
//                                         borderRadius: 2,
//                                         boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
//                                         bgcolor: theme.palette.secondary.main
//                                     }}>
//                                         <ReceiptIcon sx={{
//                                             fontSize: 60,
//                                             color: alpha(theme.palette.secondary.dark, 0.5),
//                                             mb: 2
//                                         }} />
//                                         <Typography variant="h6" sx={{ color: theme.palette.primary.dark, fontWeight: 500, mb: 1 }}>
//                                             לא נמצאו תנועות
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ color: theme.palette.secondary.dark }}>
//                                             נסה לשנות את הגדרות החיפוש או בחר קטגוריה אחרת
//                                         </Typography>
//                                     </Card>
//                             )}
//                                 </>
//                             )}
//                         </Container>
//             </Box>
//         </ThemeProvider>
//     );
// };

// export default DateRangeReport;




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

    const columns = [
        { key: 'date', header: 'תאריך' },
        { key: 'category', header: 'קטגוריה' },
        { key: 'sum', header: 'סכום' },
        { key: 'description', header: 'תיאור' },
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

        // Add empty row and summary row at the end
        const totalAmount = transactions.reduce((sum, t) => sum + t.sum, 0);
        rows.push([]);  // Empty row for spacing
        rows.push(['', 'סה"כ:', totalAmount.toFixed(2), '']);

        const filename = `דוח_תנועות_${fromDate}_עד_${toDate}_${category ? 'קטגוריה_' + category : 'כל_הקטגוריות'}.csv`;
        handleDownloadCSV(rows, headers, filename);
    };

    const getTotalAmount = () => {
        return transactions.reduce((sum, transaction) => sum + transaction.sum, 0).toFixed(2);
    };

    const isFormValid = Boolean(fromDate && toDate);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                minHeight: '100vh',
                direction: 'rtl',
                background: `linear-gradient(160deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                pb: 6
            }}>
                <Container maxWidth="lg" sx={{ py: 5 }}>
                    {/* Elegant Header */}
                    <Box sx={{
                        mb: 5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>

                        {transactions.length > 0 && (
                            <Tooltip title="הורד דוח CSV">
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownloadFile}
                                    sx={{
                                        borderRadius: 1.5,
                                        borderColor: theme.palette.primary.main,
                                        color: theme.palette.primary.main,
                                        px: 2,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.dark,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                        }
                                    }}
                                >
                                    הורד CSV
                                </Button>
                            </Tooltip>
                        )}
                    </Box>

                    {/* Filter Card - Minimalist & Elegant */}
                    <Card
                        sx={{
                            mb: 4,
                            borderRadius: 2,
                            backgroundColor: theme.palette.secondary.light,
                            border: 'none',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{
                            height: 8,
                            backgroundColor: theme.palette.primary.main,
                            backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                        }} />

                        <CardContent sx={{ py: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: theme.palette.primary.dark,
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }}>
                                        <DateRangeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        מתאריך
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: theme.palette.secondary.main,
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                                '& fieldset': {
                                                    borderColor: theme.palette.secondary.dark,
                                                }
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: theme.palette.primary.dark,
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }}>
                                        <DateRangeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        עד תאריך
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: theme.palette.secondary.main,
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                                '& fieldset': {
                                                    borderColor: theme.palette.secondary.dark,
                                                }
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: theme.palette.primary.dark,
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }}>
                                        <CategoryIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        קטגוריה
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                backgroundColor: theme.palette.secondary.main,
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                },
                                                '& fieldset': {
                                                    borderColor: theme.palette.secondary.dark,
                                                }
                                            },
                                        }}
                                    >
                                        <MenuItem value="">כל הקטגוריות</MenuItem>
                                        {expenseCategories.map((cat) => (
                                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                    onClick={handleFetch}
                                    disabled={!isFormValid || loading}
                                    sx={{
                                        minWidth: 140,
                                        px: 3.5,
                                        py: 1,
                                        borderRadius: 1.5,
                                        boxShadow: '0 4px 12px rgba(44, 62, 80, 0.2)',
                                        bgcolor: theme.palette.primary.main,
                                        fontWeight: 500,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                            boxShadow: '0 6px 16px rgba(44, 62, 80, 0.3)',
                                        }
                                    }}
                                >
                                    {loading ? 'טוען...' : 'הצג דוח'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Results Section */}
                    {hasSearched && !loading && (
                        <>
                            {transactions.length > 0 ? (
                                <>
                                    {/* Summary Card - Minimalist */}
                                    <Card sx={{
                                        mb: 4,
                                        borderRadius: 2,
                                        backgroundColor: theme.palette.secondary.main,
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                                    }}>
                                        <CardContent>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={7}>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: theme.palette.secondary.dark }}>
                                                            {fromDate && toDate && `${dayjs(fromDate).format('DD/MM/YYYY')} - ${dayjs(toDate).format('DD/MM/YYYY')}`}
                                                            {category && ` • קטגוריה: ${category}`}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ mt: 0.7, fontWeight: 500, color: theme.palette.primary.dark }}>
                                                            נמצאו {transactions.length} תנועות
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12} sm={5}>
                                                    <Box sx={{
                                                        p: 2,
                                                        borderRadius: 1.5,
                                                        bgcolor: alpha(theme.palette.primary.light, 0.12),
                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{ color: theme.palette.primary.dark, display: 'flex', alignItems: 'center' }}>
                                                            <AttachMoneyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                                            סה"כ
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                                                            ₪ {getTotalAmount()}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    {/* Data Table */}
                                    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                        <TableContainer>
                                            <Table sx={{ minWidth: 650 }}>
                                                <TableHead>
                                                    <TableRow>
                                                        {columns.map(col => (
                                                            <TableCell key={col.key} sx={{ fontWeight: 600 }}>
                                                                {col.header}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {transactions.map((transaction) => (
                                                        <TableRow key={transaction.date}>
                                                            <TableCell>{dayjs(transaction.date).format('DD/MM/YYYY')}</TableCell>
                                                            <TableCell>{transaction.category}</TableCell>
                                                            <TableCell>{transaction.sum.toFixed(2)}</TableCell>
                                                            <TableCell>{transaction.description}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                    <Typography variant="body1" sx={{ color: theme.palette.secondary.dark }}>
                                        לא נמצאו תוצאות עבור קריטריונים אלו.
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
};
export default DateRangeReport;
// import { useState, useEffect } from "react";
// import {
//   Paper, Table, TableBody, TableCell, TableContainer, TableHead,
//   TableRow, IconButton, Button, Dialog, Box, Typography, Container, Grid
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import CloseIcon from "@mui/icons-material/Close";
// import DownloadIcon from '@mui/icons-material/Download';
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../redux/store";
// import useSortedTransactions from "../../CustemHooks/useSortedTransactions";
// import { Transaction } from "../../models/Expense&Income";
// import { downloadFile } from "../../redux/FileSlice";

// interface TransactionActions {
//   load: Function; // עדכון טיפוס הפעולה
//   delete: Function; // עדכון טיפוס למחיקה
// }

// interface TransactionTrackerProps {
//   type: "expense" | "income";
//   actions: TransactionActions;
//   AddComponent: React.FC<{ onClose: () => void }>;
//   EditComponent: React.FC<{ transaction: Transaction, onClose: () => void }>;
//   transactionsSelector: (state: RootState) => any[];
//   statusSelector: (state: RootState) => string;
// }

// const TransactionTracker: React.FC<TransactionTrackerProps> = ({
//   type, actions, AddComponent, EditComponent, transactionsSelector, statusSelector
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const transactions = useSelector(transactionsSelector) || [];
//   const status = useSelector(statusSelector);
//   const sortedTransactions = useSortedTransactions(transactions);

//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [transactionToDelete, setTransactionToDelete] = useState<any | null>(null);
//   const [isAdding, setIsAdding] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

//   useEffect(() => {
//     if (status === "idle") {
//       actions.load();
//     }
//   }, [status, dispatch, actions.load]);

//   const handleOpenDeleteDialog = (transaction: any) => {
//     setTransactionToDelete(transaction);
//     setOpenDeleteDialog(true);
//   };

//   // 🔹 אישור מחיקה
//   const handleConfirmDelete = async () => {
//     if (transactionToDelete) {
//     await actions.delete(transactionToDelete.id)
//       setOpenDeleteDialog(false);
//     actions.load();
//     }
//   };

//   // 🔹 פתיחת עריכה
//   const handleOpenEditDialog = (transaction: any) => {
//     setTransactionToEdit(transaction);
//     setIsEditing(true);
//   };

//   return (
//     <Container maxWidth="md" sx={{ direction: "rtl", py: 3, marginTop: "15%" }}>
//       <Paper elevation={3} sx={{ overflow: "hidden" }}>
//         <Box sx={{ p: 3 }}>
//           <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//             <Typography variant="h4">{type === "expense" ? "מעקב הוצאות" : "מעקב הכנסות"}</Typography>
//             <Button
//               variant={isAdding ? "outlined" : "contained"}
//               color="primary"
//               startIcon={isAdding ? <CloseIcon /> : <AddIcon />}
//               onClick={() => setIsAdding(!isAdding)}
//             >
//               {isAdding ? "סגור" : type === "expense" ? "הוסף הוצאה חדשה" : "הוסף הכנסה חדשה"}
//             </Button>
//           </Grid>
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   {["תאריך", "סכום", "קטגוריה", "תיאור", "פעולות", "קובץ"].map((header) => (
//                     <TableCell key={header} align="right" sx={{ fontWeight: "bold" }}>
//                       {header}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sortedTransactions.map((transaction) => (
//                   <TableRow key={transaction.id} hover>
//                     <TableCell align="right">{transaction.date}</TableCell>
//                     <TableCell align="right">₪{transaction.sum}</TableCell>
//                     <TableCell align="right">{transaction.category}</TableCell>
//                     <TableCell align="right">{transaction.description}</TableCell>
//                     <TableCell align="center">
//                       <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(transaction)}>
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(transaction)}>
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </TableCell>
//                       { transaction.fileName && (
//                           <TableCell align="right">
//                             <a
//                               href="#"
//                               onClick={async (e) => {
//                                 e.preventDefault(); 
//                                 try {
//                                   const downloadUrl = await dispatch(downloadFile(transaction.fileType || "")).unwrap();
//                                   window.open(downloadUrl, "_blank");
//                                 } catch (error) {
//                                   console.error("שגיאה בהורדה", error);
//                                 }
//                               }}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {/* השתמש באייקון הורדה */}
//                               <DownloadIcon style={{ width: "20px", height: "20px", color: "#2C3E50" }} />
//                             </a>
//                           </TableCell>
//                         )
//                       }
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </Paper>

//       <Dialog open={isAdding} onClose={() => setIsAdding(false)} dir="rtl">
//         <Box sx={{ p: 2 }}>
//           <AddComponent onClose={() => setIsAdding(false)} />
//         </Box>
//       </Dialog>

//       <Dialog open={isEditing} onClose={() => setIsEditing(false)} dir="rtl">
//         <Box sx={{ p: 2 }}>
//           {transactionToEdit && <EditComponent transaction={transactionToEdit} onClose={() => setIsEditing(false)} />}
//         </Box>
//       </Dialog>

//       <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} dir="rtl" maxWidth="xs" fullWidth>
//         <Box sx={{ p: 2 }}>
//           <Typography>האם אתה בטוח שברצונך למחוק {type === "expense" ? "הוצאה" : "הכנסה"}?</Typography>
//           <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
//             <Button onClick={() => setOpenDeleteDialog(false)} color="primary">ביטול</Button>
//             <Button onClick={handleConfirmDelete} color="error" variant="contained">מחק</Button>
//           </Grid>
//         </Box>
//       </Dialog>
//     </Container>
//   );
// };

// export default TransactionTracker;




// import { useState, useEffect, useMemo } from "react";
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead,
//   TableRow, IconButton, Button, Dialog, Box, Typography, Container, Grid,
//   TextField, MenuItem, Select, FormControl, InputLabel, TablePagination,
//   Chip, Card, CardContent, InputAdornment, Fade,
//   Stack, Divider, Avatar
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import CloseIcon from "@mui/icons-material/Close";
// import DownloadIcon from '@mui/icons-material/Download';
// import SearchIcon from '@mui/icons-material/Search';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import ClearIcon from '@mui/icons-material/Clear';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import TrendingDownIcon from '@mui/icons-material/TrendingDown';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import CategoryIcon from '@mui/icons-material/Category';
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../redux/store";
// import useSortedTransactions from "../../CustemHooks/useSortedTransactions";
// import { Transaction } from "../../models/Expense&Income";
// import { downloadFile } from "../../redux/FileSlice";
// import Transition from "../Transition";

// interface TransactionActions {
//   load: Function;
//   delete: Function;
// }

// interface TransactionTrackerProps {
//   type: "expense" | "income";
//   actions: TransactionActions;
//   AddComponent: React.FC<{ onClose: () => void }>;
//   EditComponent: React.FC<{ transaction: Transaction, onClose: () => void }>;
//   transactionsSelector: (state: RootState) => any[];
//   statusSelector: (state: RootState) => string;
// }

// const TransactionTracker: React.FC<TransactionTrackerProps> = ({
//   type, actions, AddComponent, EditComponent, transactionsSelector, statusSelector
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const transactions = useSelector(transactionsSelector) || [];
//   const status = useSelector(statusSelector);
//   const sortedTransactions = useSortedTransactions(transactions);

//   // State for dialogs
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [transactionToDelete, setTransactionToDelete] = useState<any | null>(null);
//   const [isAdding, setIsAdding] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

//   // State for filters and pagination
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [dateFilter, setDateFilter] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   useEffect(() => {
//     if (status === "idle") {
//       actions.load();
//     }
//   }, [status, dispatch, actions.load]);

//   // Get unique categories for filter
//   const categories = useMemo(() => {
//     const uniqueCategories = [...new Set(sortedTransactions.map(t => t.category))];
//     return uniqueCategories.filter(Boolean);
//   }, [sortedTransactions]);

//   // Filter and paginate transactions
//   const filteredTransactions = useMemo(() => {
//     return sortedTransactions.filter(transaction => {
//       const matchesSearch = !searchTerm || 
//         transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         transaction.sum?.toString().includes(searchTerm);

//       const matchesCategory = !categoryFilter || transaction.category === categoryFilter;

//       const matchesDate = !dateFilter || transaction.date?.includes(dateFilter);

//       return matchesSearch && matchesCategory && matchesDate;
//     });
//   }, [sortedTransactions, searchTerm, categoryFilter, dateFilter]);

//   const paginatedTransactions = useMemo(() => {
//     const start = page * rowsPerPage;
//     const end = start + rowsPerPage;
//     return filteredTransactions.slice(start, end);
//   }, [filteredTransactions, page, rowsPerPage]);

//   // Calculate totals
//   const totalAmount = useMemo(() => {
//     return filteredTransactions.reduce((sum, transaction) => sum + (transaction.sum || 0), 0);
//   }, [filteredTransactions]);

//   const handleOpenDeleteDialog = (transaction: any) => {
//     setTransactionToDelete(transaction);
//     setOpenDeleteDialog(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (transactionToDelete) {
//       await actions.delete(transactionToDelete.id);
//       setOpenDeleteDialog(false);
//       actions.load();
//     }
//   };

//   const handleOpenEditDialog = (transaction: any) => {
//     setTransactionToEdit(transaction);
//     setIsEditing(true);
//   };

//   const handleChangePage = (_event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setCategoryFilter("");
//     setDateFilter("");
//     setPage(0);
//   };

//   const isExpense = type === "expense";

//   return (
//     <Container maxWidth="lg" sx={{ direction: "rtl", py: 4, marginTop: "10%" }}>
//       {/* Header Card with Summary */}
//       <Card 
//         elevation={0}
//         sx={{ 
//           mb: 3,
//           background: `linear-gradient(135deg, ${isExpense ? '#E74C3C' : '#27AE60'} 0%, ${isExpense ? '#C0392B' : '#1E8449'} 100%)`,
//           color: 'white',
//           borderRadius: '16px',
//           overflow: 'hidden'
//         }}
//       >
//         <CardContent sx={{ p: 3 }}>
//           <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} md={8}>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <Avatar 
//                   sx={{ 
//                     bgcolor: 'rgba(255,255,255,0.2)', 
//                     width: 56, 
//                     height: 56,
//                     backdropFilter: 'blur(10px)'
//                   }}
//                 >
//                   {isExpense ? <TrendingDownIcon fontSize="large" /> : <TrendingUpIcon fontSize="large" />}
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
//                     {isExpense ? "מעקב הוצאות" : "מעקב הכנסות"}
//                   </Typography>
//                   <Typography variant="body1" sx={{ opacity: 0.9 }}>
//                     סה"כ: ₪{totalAmount.toLocaleString()} • {filteredTransactions.length} פריטים
//                   </Typography>
//                 </Box>
//               </Stack>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Stack direction="row" spacing={1} justifyContent="flex-end">
//                 <Button
//                   variant="contained"
//                   size="large"
//                   startIcon={isAdding ? <CloseIcon /> : <AddIcon />}
//                   onClick={() => setIsAdding(!isAdding)}
//                   sx={{
//                     bgcolor: 'rgba(255,255,255,0.2)',
//                     backdropFilter: 'blur(10px)',
//                     border: '1px solid rgba(255,255,255,0.3)',
//                     '&:hover': {
//                       bgcolor: 'rgba(255,255,255,0.3)',
//                     }
//                   }}
//                 >
//                   {isAdding ? "סגור" : `הוסף ${isExpense ? "הוצאה" : "הכנסה"}`}
//                 </Button>
//               </Stack>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* Filters Section */}
//       <Card elevation={0} sx={{ mb: 3, borderRadius: '12px', bgcolor: '#FAFAFA' }}>
//         <CardContent sx={{ p: 2 }}>
//           <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: showFilters ? 2 : 0 }}>
//             <TextField
//               placeholder="חיפוש..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               size="small"
//               sx={{ 
//                 flexGrow: 1,
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '8px',
//                   bgcolor: 'white'
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <Button
//               variant={showFilters ? "contained" : "outlined"}
//               startIcon={<FilterListIcon />}
//               onClick={() => setShowFilters(!showFilters)}
//               sx={{ borderRadius: '8px' }}
//             >
//               פילטרים
//             </Button>
//             {(searchTerm || categoryFilter || dateFilter) && (
//               <Button
//                 variant="outlined"
//                 startIcon={<ClearIcon />}
//                 onClick={clearFilters}
//                 sx={{ borderRadius: '8px' }}
//               >
//                 נקה
//               </Button>
//             )}
//           </Stack>

//           <Fade in={showFilters}>
//             <Grid container spacing={2} sx={{ display: showFilters ? 'flex' : 'none' }}>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel>קטגוריה</InputLabel>
//                   <Select
//                     value={categoryFilter}
//                     label="קטגוריה"
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                     sx={{ borderRadius: '8px', bgcolor: 'white' }}
//                   >
//                     <MenuItem value="">הכל</MenuItem>
//                     {categories.map((category) => (
//                       <MenuItem key={category} value={category}>
//                         {category}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="סינון לפי תאריך"
//                   value={dateFilter}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                   placeholder="YYYY-MM-DD"
//                   sx={{ 
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '8px',
//                       bgcolor: 'white'
//                     }
//                   }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <CalendarTodayIcon color="action" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Fade>
//         </CardContent>
//       </Card>

//       {/* Main Table */}
//       <Card elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ bgcolor: '#F8F9FA' }}>
//                 {[
//                   { label: "תאריך", icon: <CalendarTodayIcon fontSize="small" /> },
//                   { label: "סכום", icon: <AttachMoneyIcon fontSize="small" /> },
//                   { label: "קטגוריה", icon: <CategoryIcon fontSize="small" /> },
//                   { label: "תיאור", icon: null },
//                   { label: "פעולות", icon: null },
//                   { label: "קובץ", icon: <DownloadIcon fontSize="small" /> }
//                 ].map((header) => (
//                   <TableCell 
//                     key={header.label} 
//                     align="right" 
//                     sx={{ 
//                       fontWeight: "bold",
//                       color: '#2C3E50',
//                       py: 2,
//                       borderBottom: '2px solid #E8E8E8'
//                     }}
//                   >
//                     <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
//                       {header.icon}
//                       <Typography variant="subtitle2" fontWeight="bold">
//                         {header.label}
//                       </Typography>
//                     </Stack>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedTransactions.map((transaction, _index) => (
//                 <TableRow 
//                   key={transaction.id} 
//                   hover
//                   sx={{
//                     '&:hover': {
//                       bgcolor: 'rgba(44, 62, 80, 0.04)',
//                       transform: 'translateY(-1px)',
//                       transition: 'all 0.2s ease'
//                     },
//                     '&:nth-of-type(even)': {
//                       bgcolor: 'rgba(248, 249, 250, 0.5)'
//                     }
//                   }}
//                 >
//                   <TableCell align="right" sx={{ py: 2 }}>
//                     <Chip 
//                       label={transaction.date} 
//                       size="small" 
//                       variant="outlined"
//                       sx={{ borderRadius: '6px' }}
//                     />
//                   </TableCell>
//                   <TableCell align="right" sx={{ py: 2 }}>
//                     <Typography 
//                       variant="body2" 
//                       fontWeight="bold"
//                       color={isExpense ? 'error.main' : 'success.main'}
//                     >
//                       ₪{transaction.sum?.toLocaleString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="right" sx={{ py: 2 }}>
//                     <Chip 
//                       label={transaction.category} 
//                       size="small"
//                       sx={{ 
//                         bgcolor: isExpense ? 'error.light' : 'success.light',
//                         color: isExpense ? 'error.dark' : 'success.dark',
//                         borderRadius: '6px'
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell align="right" sx={{ py: 2, maxWidth: 200 }}>
//                     <Typography variant="body2" noWrap>
//                       {transaction.description}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center" sx={{ py: 2 }}>
//                     <Stack direction="row" spacing={1} justifyContent="center">
//                       <IconButton 
//                         size="small" 
//                         onClick={() => handleOpenEditDialog(transaction)}
//                         sx={{
//                           bgcolor: 'info.light',
//                           color: 'info.dark',
//                           '&:hover': { bgcolor: 'info.main', color: 'white' }
//                         }}
//                       >
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         onClick={() => handleOpenDeleteDialog(transaction)}
//                         sx={{
//                           bgcolor: 'error.light',
//                           color: 'error.dark',
//                           '&:hover': { bgcolor: 'error.main', color: 'white' }
//                         }}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                   <TableCell align="center" sx={{ py: 2 }}>
//                     {transaction.fileName ? (
//                       <IconButton
//                         size="small"
//                         onClick={async (e) => {
//                           e.preventDefault(); 
//                           try {
//                             const downloadUrl = await dispatch(downloadFile(transaction.fileType || "")).unwrap();
//                             window.open(downloadUrl, "_blank");
//                           } catch (error) {
//                             console.error("שגיאה בהורדה", error);
//                           }
//                         }}
//                         sx={{
//                           bgcolor: 'primary.light',
//                           color: 'primary.dark',
//                           '&:hover': { bgcolor: 'primary.main', color: 'white' }
//                         }}
//                       >
//                         <DownloadIcon fontSize="small" />
//                       </IconButton>
//                     ) : (
//                       <Typography variant="body2" color="text.disabled">
//                         אין קובץ
//                       </Typography>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {paginatedTransactions.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
//                     <Typography variant="body1" color="text.secondary">
//                       לא נמצאו תוצאות
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Pagination */}
//         <Divider />
//         <TablePagination

//           component="div"
//           count={filteredTransactions.length}
//           page={page}
//           onPageChange={handleChangePage}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           labelRowsPerPage="פריטים בעמוד:"
//           labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
//           sx={{ 
//             borderTop: '1px solid #E8E8E8',
//             '& .MuiTablePagination-toolbar': {
//               direction: 'rtl',
//             }
//           }}
//         />
//       </Card>

//       {/* Add Dialog */}
//       <Dialog 
//         open={isAdding} 
//         onClose={() => setIsAdding(false)} 
//         dir="rtl"
//         maxWidth="md"
//         fullWidth
//         TransitionComponent={Transition}
//         PaperProps={{
//           sx: {
//             borderRadius: '16px',
//             boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
//           }
//         }}
//       >
//         <Box sx={{ p: 3 }}>
//           <AddComponent onClose={() => setIsAdding(false)} />
//         </Box>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog 
//         open={isEditing} 
//         onClose={() => setIsEditing(false)} 
//         dir="rtl"
//         maxWidth="md"
//         fullWidth
//         TransitionComponent={Transition}
//         PaperProps={{
//           sx: {
//             borderRadius: '16px',
//             boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
//           }
//         }}
//       >
//         <Box sx={{ p: 3 }}>
//           {transactionToEdit && <EditComponent transaction={transactionToEdit} onClose={() => setIsEditing(false)} />}
//         </Box>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog 
//         open={openDeleteDialog} 
//         onClose={() => setOpenDeleteDialog(false)} 
//         dir="rtl" 
//         maxWidth="xs" 
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '16px',
//             boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
//           }
//         }}
//       >
//         <Box sx={{ p: 3 }}>
//           <Stack spacing={2} alignItems="center">
//             <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
//               <DeleteIcon fontSize="large" color="error" />
//             </Avatar>
//             <Typography variant="h6" textAlign="center">
//               האם אתה בטוח?
//             </Typography>
//             <Typography variant="body2" color="text.secondary" textAlign="center">
//               פעולה זו תמחק את ה{isExpense ? "הוצאה" : "הכנסה"} לצמיתות
//             </Typography>
//           </Stack>
//           <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//             <Button 
//               fullWidth
//               variant="outlined" 
//               onClick={() => setOpenDeleteDialog(false)}
//               sx={{ borderRadius: '8px' }}
//             >
//               ביטול
//             </Button>
//             <Button 
//               fullWidth
//               variant="contained" 
//               color="error"
//               onClick={handleConfirmDelete}
//               sx={{ borderRadius: '8px' }}
//             >
//               מחק
//             </Button>
//           </Stack>
//         </Box>
//       </Dialog>
//     </Container>
//   );
// };

// export default TransactionTracker;


import { useState, useEffect, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, Dialog, Box, Typography, Container, Grid,
  TextField, MenuItem, Select, FormControl, InputLabel, TablePagination,
  Chip, Card, CardContent, InputAdornment, Fade,
  Stack, Divider, Avatar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import useSortedTransactions from "../../CustemHooks/useSortedTransactions";
import { Transaction } from "../../models/Expense&Income";
import { downloadFile } from "../../redux/FileSlice";
import Transition from "../Transition";

interface TransactionActions {
  load: Function;
  delete: Function;
}

interface TransactionTrackerProps {
  type: "expense" | "income";
  actions: TransactionActions;
  AddComponent: React.FC<{ onClose: () => void }>;
  EditComponent: React.FC<{ transaction: Transaction, onClose: () => void }>;
  transactionsSelector: (state: RootState) => any[];
  statusSelector: (state: RootState) => string;
}

const TransactionTracker: React.FC<TransactionTrackerProps> = ({
  type, actions, AddComponent, EditComponent, transactionsSelector, statusSelector
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector(transactionsSelector) || [];
  const status = useSelector(statusSelector);
  const sortedTransactions = useSortedTransactions(transactions);

  // State for dialogs
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (status === "idle") {
      actions.load();
    }
  }, [status, dispatch, actions.load]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(sortedTransactions.map(t => t.category))];
    return uniqueCategories.filter(Boolean);
  }, [sortedTransactions]);

  // Filter and paginate transactions
  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter(transaction => {
      const matchesSearch = !searchTerm ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.sum?.toString().includes(searchTerm);

      const matchesCategory = !categoryFilter || transaction.category === categoryFilter;

      const matchesDate = !dateFilter || transaction.date?.includes(dateFilter);

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [sortedTransactions, searchTerm, categoryFilter, dateFilter]);

  const paginatedTransactions = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, page, rowsPerPage]);

  // Calculate totals
  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => sum + (transaction.sum || 0), 0);
  }, [filteredTransactions]);

  const handleOpenDeleteDialog = (transaction: any) => {
    setTransactionToDelete(transaction);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      await actions.delete(transactionToDelete.id);
      setOpenDeleteDialog(false);
      actions.load();
    }
  };

  const handleOpenEditDialog = (transaction: any) => {
    setTransactionToEdit(transaction);
    setIsEditing(true);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setDateFilter("");
    setPage(0);
  };

  const isExpense = type === "expense";

  return (
    <Container maxWidth="lg" sx={{ direction: "rtl", py: 4, marginTop: "10%" }}>
      {/* Header Card with Summary */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${isExpense ? '#5D7E9B' : '#6B9B9E'} 0%, ${isExpense ? '#4A6B7A' : '#5A8A8D'} 100%)`,
          color: 'white',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    width: 56,
                    height: 56,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {isExpense ? <TrendingDownIcon fontSize="large" /> : <TrendingUpIcon fontSize="large" />}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    {isExpense ? "מעקב הוצאות" : "מעקב הכנסות"}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    סה"כ: ₪{totalAmount.toLocaleString()} • {filteredTransactions.length} פריטים
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isAdding ? <CloseIcon /> : <AddIcon />}
                  onClick={() => setIsAdding(!isAdding)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                    }
                  }}
                >
                  {isAdding ? "סגור" : `הוסף ${isExpense ? "הוצאה" : "הכנסה"}`}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <Card elevation={0} sx={{ mb: 3, borderRadius: '12px', bgcolor: '#F8FAFB' }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: showFilters ? 2 : 0 }}>
            <TextField
              placeholder="חיפוש..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: 'white'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ borderRadius: '8px' }}
            >
              פילטרים
            </Button>
            {(searchTerm || categoryFilter || dateFilter) && (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{ borderRadius: '8px' }}
              >
                נקה
              </Button>
            )}
          </Stack>

          <Fade in={showFilters}>
            <Grid container spacing={2} sx={{ display: showFilters ? 'flex' : 'none' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>קטגוריה</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="קטגוריה"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    sx={{ borderRadius: '8px', bgcolor: 'white' }}
                  >
                    <MenuItem value="">הכל</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="סינון לפי תאריך"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: 'white'
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Fade>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F1F5F7' }}>
                {[
                  { label: "תאריך", icon: <CalendarTodayIcon fontSize="small" /> },
                  { label: "סכום", icon: <AttachMoneyIcon fontSize="small" /> },
                  { label: "קטגוריה", icon: <CategoryIcon fontSize="small" /> },
                  { label: "תיאור", icon: null },
                  { label: "פעולות", icon: null },
                  { label: "קובץ", icon: <DownloadIcon fontSize="small" /> }
                ].map((header) => (
                  <TableCell
                    key={header.label}
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: '#4A6B7A',
                      py: 2,
                      borderBottom: '2px solid #E1E8EB'
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                      {header.icon}
                      <Typography variant="subtitle2" fontWeight="bold">
                        {header.label}
                      </Typography>
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction, _index) => (
                <TableRow
                  key={transaction.id}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(107, 155, 158, 0.08)',
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease'
                    },
                    '&:nth-of-type(even)': {
                      bgcolor: 'rgba(241, 245, 247, 0.5)'
                    }
                  }}
                >
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Chip
                      label={transaction.date}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: '6px' }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={isExpense ? '#7B8FA3' : '#6B9B9E'}
                    >
                      ₪{transaction.sum?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Chip
                      label={transaction.category}
                      size="small"
                      sx={{
                        bgcolor: isExpense ? '#E8EDF1' : '#E8F4F5',
                        color: isExpense ? '#5D7E9B' : '#6B9B9E',
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2, maxWidth: 200 }}>
                    <Typography variant="body2" noWrap>
                      {transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(transaction)}
                        sx={{
                          bgcolor: '#E8F4F5',
                          color: '#5A8A8D',
                          '&:hover': { bgcolor: '#6B9B9E', color: 'white' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(transaction)}
                        sx={{
                          bgcolor: '#F2E8E8',
                          color: '#7B8FA3',
                          '&:hover': { bgcolor: '#A8B5C4', color: 'white' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    {transaction.fileName ? (
                      <IconButton
                        size="small"
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            const downloadUrl = await dispatch(downloadFile(transaction.fileType || "")).unwrap();
                            window.open(downloadUrl, "_blank");
                          } catch (error) {
                            console.error("שגיאה בהורדה", error);
                          }
                        }}
                        sx={{
                          bgcolor: '#E8F4F5',
                          color: '#5A8A8D',
                          '&:hover': { bgcolor: '#6B9B9E', color: 'white' }
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        אין קובץ
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      לא נמצאו תוצאות
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Divider sx={{ bgcolor: '#E1E8EB' }} />
        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="פריטים בעמוד:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} מתוך ${count}`}
          sx={{
            borderTop: '1px solid #E1E8EB',
            '& .MuiTablePagination-toolbar': {
              direction: 'ltr'
            }
          }}
        />
      </Card>

      {/* Add Dialog */}
      <Dialog
        open={isAdding}
        onClose={() => setIsAdding(false)}
        dir="rtl"
        maxWidth="md"
        fullWidth

        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <AddComponent onClose={() => setIsAdding(false)} />
        </Box>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        dir="rtl"
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          {transactionToEdit && <EditComponent transaction={transactionToEdit} onClose={() => setIsEditing(false)} />}
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        dir="rtl"
        maxWidth="xs"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#F2E8E8', width: 56, height: 56 }}>
              <DeleteIcon fontSize="large" sx={{ color: '#7B8FA3' }} />
            </Avatar>
            <Typography variant="h6" textAlign="center">
              האם אתה בטוח?
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              פעולה זו תמחק את ה{isExpense ? "הוצאה" : "הכנסה"} לצמיתות
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpenDeleteDialog(false)}
              sx={{ borderRadius: '8px' }}
            >
              ביטול
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirmDelete}
              sx={{
                borderRadius: '8px',
                bgcolor: '#A8B5C4',
                '&:hover': { bgcolor: '#7B8FA3' }
              }}
            >
              מחק
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Container>
  );
};

export default TransactionTracker;
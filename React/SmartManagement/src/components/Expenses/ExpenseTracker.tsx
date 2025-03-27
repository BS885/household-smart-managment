import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  Box,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpenseAsync, loadExpenses } from "../../redux/ExpenseSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { Expense, ExpenseToSave } from "../../models/Expense";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import useSortedExpenses from "../../CustemHooks/useSortedExpenses ";
import { downloadFile } from "../../redux/FileSlice";
import DownloadIcon from '@mui/icons-material/Download';

const ExpenseTracker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.expenses || []);
  const status = useSelector((state: RootState) => state.expenses.status);
  const sortedExpenses = useSortedExpenses(expenses); // שימוש ב-Hook

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseToSave | null>(null);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isEditExpense, setIsEditExpense] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadExpenses());
    }
  }, [status, dispatch]);

  const handleOpenDeleteDialog = (expense: ExpenseToSave) => {
    setExpenseToDelete(expense);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      dispatch(deleteExpenseAsync(expenseToDelete.id))
        .unwrap()
        .then(() => {
          setOpenDeleteDialog(false);
          dispatch(loadExpenses());
        })
        .catch((error) => {
          console.error("Error deleting expense:", error);
        });
    }
  };

  const handleOpenEditDialog = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsEditExpense(true);
  };

  return (
    <Container maxWidth="md" sx={{ direction: "rtl", py: 3, marginTop: "15%" }}>
      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4">מעקב הוצאות</Typography>
            <Button
              variant={isAddingExpense ? "outlined" : "contained"}
              color="primary"
              startIcon={isAddingExpense ? <CloseIcon /> : <AddIcon />}
              onClick={() => setIsAddingExpense(!isAddingExpense)}
            >
              {isAddingExpense ? "סגור" : "הוסף הוצאה חדשה"}
            </Button>
          </Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["תאריך", "סכום", "קטגוריה", "תיאור", "פעולות", "קובץ"].map((header) => (
                    <TableCell key={header} align="right" sx={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedExpenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell align="right">{expense.date}</TableCell>
                    <TableCell align="right">₪{expense.sum}</TableCell>
                    <TableCell align="right">{expense.category}</TableCell>
                    <TableCell align="right">{expense.description}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(expense)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(expense)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    {
                      expense.fileName && (
                        <TableCell align="right">
                          <a
                            href="#"
                            onClick={async (e) => {
                              e.preventDefault();  // למנוע את הפעולה הבסיסית של הקישור
                              try {
                                const downloadUrl = await dispatch(downloadFile(expense.fileType || "")).unwrap();
                                window.open(downloadUrl, "_blank");  // פתח את הקישור בהצלחה
                              } catch (error) {
                                console.error("שגיאה בהורדה", error);
                              }
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {/* השתמש באייקון הורדה */}
                            <DownloadIcon style={{ width: "20px", height: "20px", color: "#2C3E50" }} />
                          </a>
                        </TableCell>
                      )
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* דיאלוג הוספת הוצאה */}
      <Dialog open={isAddingExpense} onClose={() => setIsAddingExpense(false)} dir="rtl">
        <Box sx={{ p: 2 }}>
          <AddExpense onClose={() => setIsAddingExpense(false)} />
        </Box>
      </Dialog>

      {/* דיאלוג עריכת הוצאה */}
      <Dialog open={isEditExpense} onClose={() => setIsEditExpense(false)} dir="rtl">
        <Box sx={{ p: 2 }}>
          {expenseToEdit && <EditExpense expense={expenseToEdit} onClose={() => setIsEditExpense(false)} />}
        </Box>
      </Dialog>

      {/* דיאלוג מחיקת הוצאה */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} dir="rtl" maxWidth="xs" fullWidth>
        <Box sx={{ p: 2 }}>
          <Typography>האם אתה בטוח שברצונך למחוק את ההוצאה?</Typography>
          <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">ביטול</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">מחק</Button>
          </Grid>
        </Box>
      </Dialog>
    </Container>
  );
};

export default ExpenseTracker;
import { useState, useEffect } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Button, Dialog, Box, Typography, Container, Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import useSortedTransactions from "../../CustemHooks/useSortedTransactions";
import { Transaction } from "../../models/Expense&Income";
import { downloadFile } from "../../redux/FileSlice";

interface TransactionActions {
  load: Function; // עדכון טיפוס הפעולה
  delete: Function; // עדכון טיפוס למחיקה
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

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  useEffect(() => {
    if (status === "idle") {
      actions.load();
    }
  }, [status, dispatch, actions.load]);

  const handleOpenDeleteDialog = (transaction: any) => {
    setTransactionToDelete(transaction);
    setOpenDeleteDialog(true);
  };

  // 🔹 אישור מחיקה
  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
    await actions.delete(transactionToDelete.id)
      setOpenDeleteDialog(false);
    actions.load();
    }
  };

  // 🔹 פתיחת עריכה
  const handleOpenEditDialog = (transaction: any) => {
    setTransactionToEdit(transaction);
    setIsEditing(true);
  };

  return (
    <Container maxWidth="md" sx={{ direction: "rtl", py: 3, marginTop: "15%" }}>
      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4">{type === "expense" ? "מעקב הוצאות" : "מעקב הכנסות"}</Typography>
            <Button
              variant={isAdding ? "outlined" : "contained"}
              color="primary"
              startIcon={isAdding ? <CloseIcon /> : <AddIcon />}
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? "סגור" : type === "expense" ? "הוסף הוצאה חדשה" : "הוסף הכנסה חדשה"}
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
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell align="right">{transaction.date}</TableCell>
                    <TableCell align="right">₪{transaction.sum}</TableCell>
                    <TableCell align="right">{transaction.category}</TableCell>
                    <TableCell align="right">{transaction.description}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(transaction)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(transaction)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                      { transaction.fileName && (
                          <TableCell align="right">
                            <a
                              href="#"
                              onClick={async (e) => {
                                e.preventDefault(); 
                                try {
                                  const downloadUrl = await dispatch(downloadFile(transaction.fileType || "")).unwrap();
                                  window.open(downloadUrl, "_blank");
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

      <Dialog open={isAdding} onClose={() => setIsAdding(false)} dir="rtl">
        <Box sx={{ p: 2 }}>
          <AddComponent onClose={() => setIsAdding(false)} />
        </Box>
      </Dialog>

      <Dialog open={isEditing} onClose={() => setIsEditing(false)} dir="rtl">
        <Box sx={{ p: 2 }}>
          {transactionToEdit && <EditComponent transaction={transactionToEdit} onClose={() => setIsEditing(false)} />}
        </Box>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} dir="rtl" maxWidth="xs" fullWidth>
        <Box sx={{ p: 2 }}>
          <Typography>האם אתה בטוח שברצונך למחוק {type === "expense" ? "הוצאה" : "הכנסה"}?</Typography>
          <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">ביטול</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">מחק</Button>
          </Grid>
        </Box>
      </Dialog>
    </Container>
  );
};

export default TransactionTracker;

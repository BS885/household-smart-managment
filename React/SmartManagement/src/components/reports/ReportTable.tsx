import { TableContainer, Table, TableHead, TableRow, alpha, TableCell, Box, TableBody, Typography, Chip } from "@mui/material";
import dayjs from "dayjs";
import { theme } from "../../Style/Theme";
import { Transaction } from "../../models/Expense&Income";
interface ReportTableProps {
    columns: { key: string; header: string; icon?: React.ReactNode }[];
    transactions: Transaction[];
    expenseCategories: string[];
}
const ReportTable = ({ columns, transactions, expenseCategories }: ReportTableProps) => {

    const getCategoryColor = (categoryName: string) => {
        const colors = ['#E74C3C', '#3498DB', '#27AE60', '#F39C12', '#9B59B6', '#1ABC9C'];
        const index = expenseCategories.indexOf(categoryName) % colors.length;
        return colors[index];
    };


    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}>
                    {columns.map(col => (
                        <TableCell
                            key={col.key}
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.primary.dark,
                                fontSize: '0.95rem',
                                py: 2.5,
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                {col.icon}
                                {col.header}
                            </Box>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {transactions.map((transaction, index) => (
                    <TableRow
                        key={`${transaction.date}-${index}`}
                        sx={{
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.light, 0.05),
                            },
                            '&:nth-of-type(even)': {
                                backgroundColor: alpha(theme.palette.secondary.light, 0.3),
                            }
                        }}
                    >
                        <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" fontWeight="500">
                                {dayjs(transaction.date).format('DD/MM/YYYY')}
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                            <Chip
                                label={transaction.category}
                                size="small"
                                sx={{
                                    backgroundColor: alpha(getCategoryColor(transaction.category), 0.15),
                                    color: getCategoryColor(transaction.category),
                                    fontWeight: 500,
                                }}
                            />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" fontWeight="600" color={theme.palette.primary.main}>
                                ₪{transaction.sum.toFixed(2)}
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" color={theme.palette.secondary.dark}>
                                {transaction.description || 'אין תיאור'}
                            </Typography>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>;
};

export default ReportTable;

import { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, MenuItem, TextField,
  Tooltip,
  Button
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import dayjs from 'dayjs';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchExpenseCategories } from '../../redux/categoriesSlice';
import { TransactionToSave } from '../../models/Expense&Income';
import { filterExpensesByYearAsync } from '../../redux/ExpenseSlice';

const getCurrentYear = () => new Date().getFullYear();
const getYearsList = (range = 5) =>
  Array.from({ length: range }, (_, i) => getCurrentYear() - i);

const monthNames = [
  '', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

const YearlyCategoryReport = ({ handleDownloadCSV }: { 
    handleDownloadCSV: (rows: string[][], headers: string[], filename: string) => void }) => {
  const [year, setYear] = useState(getCurrentYear());
  const [dataByMonthAndCategory, setDataByMonthAndCategory] = useState<Record<string, Record<string, number>>>({});
  const [categoriesUsed, setCategoriesUsed] = useState<string[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.categories.expenseStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenseCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    dispatch(filterExpensesByYearAsync({ year }))
      .unwrap()
      .then((transactions: TransactionToSave[]) => {
        const monthCategoryMap: Record<string, Record<string, number>> = {};
        const usedCats = new Set<string>();

        for (let i = 1; i <= 12; i++) {
          const key = i.toString().padStart(2, '0');
          monthCategoryMap[key] = {};
        }

        transactions.forEach((t) => {
          const month = dayjs(t.date).format('MM');
          const cat = t.category || 'ללא קטגוריה';
          usedCats.add(cat);
          monthCategoryMap[month][cat] = (monthCategoryMap[month][cat] || 0) + t.sum;
        });

        setCategoriesUsed(Array.from(usedCats));
        setDataByMonthAndCategory(monthCategoryMap);
      });
  }, [year, dispatch]);

//   const calculateCategoryTotals = () => {
//     const totals: Record<string, number> = {};
//     for (const month in dataByMonthAndCategory) {
//       for (const cat of categoriesUsed) {
//         totals[cat] = (totals[cat] || 0) + (dataByMonthAndCategory[month][cat] || 0);
//       }
//     }
//     return totals;
//   };


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

  // שורת סיכום סופית (סה"כ לחודש)
  const monthTotalsRow = ['סה"כ לחודש', ...monthTotals.map(val => val.toFixed(2)), monthTotals.reduce((a, b) => a + b, 0).toFixed(2)];
  rows.push(monthTotalsRow);

  handleDownloadCSV(rows, headers, `דוח_קטגוריות_${year}.csv`);
};

  const monthTotals = calculateMonthTotals();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>דוח לפי קטגוריה לשנת {year}</Typography>
      {categoriesUsed.length > 0 && (
          <Tooltip title="הורד דוח CSV">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadFile}
              sx={{ borderRadius: 2 }}
            >
              הורד CSV
            </Button>
          </Tooltip>
        )}
      <TextField
        select
        label="בחר שנה"
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value))}
        sx={{ mb: 3 }}
      >
        {getYearsList().map((y) => (
          <MenuItem key={y} value={y}>{y}</MenuItem>
        ))}
      </TextField>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>קטגוריה</TableCell>
              {Array.from({ length: 12 }, (_, i) => (
                <TableCell key={i}>{monthNames[i + 1]}</TableCell>
              ))}
              <TableCell><b>סה"כ</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriesUsed.map((cat) => {
              const rowData = Array.from({ length: 12 }, (_, i) => {
                const monthKey = (i + 1).toString().padStart(2, '0');
                return dataByMonthAndCategory[monthKey]?.[cat] || 0;
              });

              const total = rowData.reduce((a, b) => a + b, 0);

              return (
                <TableRow key={cat}>
                  <TableCell>{cat}</TableCell>
                  {rowData.map((val, idx) => (
                    <TableCell key={idx}>{val.toFixed(2)}</TableCell>
                  ))}
                  <TableCell><b>{total.toFixed(2)}</b></TableCell>
                </TableRow>
              );
            })}

            {/* שורת סה"כ לכל חודש */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>סה"כ לחודש</TableCell>
              {monthTotals.map((total, idx) => (
                <TableCell key={idx} sx={{ fontWeight: 'bold' }}>
                  {total.toFixed(2)}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>
                {monthTotals.reduce((a, b) => a + b, 0).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default YearlyCategoryReport;

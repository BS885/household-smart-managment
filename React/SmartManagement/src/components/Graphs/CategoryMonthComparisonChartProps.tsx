// import { useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartOptions,
//   ChartData,
// } from 'chart.js';
// import { Transaction } from '../../models/Expense&Income';
// import {
//   Box,
//   Grid,
//   MenuItem,
//   Select,
//   Typography,
//   IconButton,
//   Button,
//   Paper,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { getMonthFromDate, getMonthName } from './chartHelpers';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// interface CategoryMonthComparisonChartProps {
//   data: Transaction[];
// }

// const CategoryMonthComparisonChart = ({ data }: CategoryMonthComparisonChartProps) => {
//   const [selectedMonths, setSelectedMonths] = useState<string[]>(['01', '02']);

//   const uniqueMonths = [...new Set(data.map(item => getMonthFromDate(item.date)))].sort();
//   const uniqueCategories = [...new Set(data.map(item => item.category))];

//   const prepareChartData = (): ChartData<'bar', number[], string> => {
//     const expensesByCategory: Record<string, Record<string, number>> = {};

//     uniqueCategories.forEach(category => {
//       expensesByCategory[category] = {};
//       selectedMonths.forEach(month => {
//         expensesByCategory[category][month] = 0;
//       });
//     });

//     data
//       .filter(item => selectedMonths.includes(getMonthFromDate(item.date)))
//       .forEach(item => {
//         const month = getMonthFromDate(item.date);
//         const category = item.category;
//         const amount = item.sum;

//         if (expensesByCategory[category]?.[month] !== undefined) {
//           expensesByCategory[category][month] += amount;
//         }
//       });

//     const totalByCategory: Record<string, number> = {};
//     uniqueCategories.forEach(category => {
//       totalByCategory[category] = Object.values(expensesByCategory[category]).reduce((sum, val) => sum + val, 0);
//     });

//     const sortedCategories = Object.keys(totalByCategory)
//       .sort((a, b) => totalByCategory[b] - totalByCategory[a])
//       .slice(0, 8);

//     const colors = [
//       { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
//       { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
//       { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
//       { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgba(255, 206, 86, 1)' },
//     ];

//     const datasets = selectedMonths.map((month, index) => ({
//       label: getMonthName(month),
//       data: sortedCategories.map(category => expensesByCategory[category][month]),
//       backgroundColor: colors[index % colors.length].bg,
//       borderColor: colors[index % colors.length].border,
//       borderWidth: 1,
//     }));

//     return {
//       labels: sortedCategories,
//       datasets,
//     };
//   };

//   const chartData = prepareChartData();

//   const options: ChartOptions<'bar'> = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => `₪${(context.raw as number).toLocaleString()}`,
//         },
//       },
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: (value) => `₪${Number(value).toLocaleString()}`,
//         },
//       },
//     },
//   };

//   const handleMonthChange = (index: number, value: string) => {
//     const newSelectedMonths = [...selectedMonths];
//     newSelectedMonths[index] = value;
//     setSelectedMonths(newSelectedMonths);
//   };

//   const addMonth = () => {
//     if (selectedMonths.length < 4) {
//       const available = uniqueMonths.filter(m => !selectedMonths.includes(m));
//       if (available.length > 0) {
//         setSelectedMonths([...selectedMonths, available[0]]);
//       }
//     }
//   };

//   const removeMonth = (index: number) => {
//     if (selectedMonths.length > 2) {
//       const newSelected = [...selectedMonths];
//       newSelected.splice(index, 1);
//       setSelectedMonths(newSelected);
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 2 }}>
//       <Grid container spacing={2} justifyContent="center" alignItems="flex-end">
//         {selectedMonths.map((month, index) => (
//           <Grid item key={`month-${index}`}>
//             <Box display="flex" alignItems="center" gap={1}>
//               <Box>
//                 <Typography variant="subtitle2">חודש {index + 1}</Typography>
//                 <Select
//                   value={month}
//                   onChange={(e) => handleMonthChange(index, e.target.value)}
//                   size="small"
//                   fullWidth
//                 >
//                   {uniqueMonths.map((m) => (
//                     <MenuItem key={m} value={m}>
//                       {getMonthName(m)}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </Box>
//               {selectedMonths.length > 2 && (
//                 <IconButton onClick={() => removeMonth(index)} size="small" color="error">
//                   <CloseIcon />
//                 </IconButton>
//               )}
//             </Box>
//           </Grid>
//         ))}

//         {selectedMonths.length < 4 && (
//           <Grid item>
//             <Button variant="contained" color="primary" onClick={addMonth}>
//               + הוסף חודש להשוואה
//             </Button>
//           </Grid>
//         )}
//       </Grid>

//       <Box mt={4}>
//         <Bar data={chartData} options={options} />
//       </Box>
//     </Paper>
//   );
// };

// export default CategoryMonthComparisonChart;
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Transaction } from '../../models/Expense&Income';
import {
  Box,
  Grid,
  MenuItem,
  Select,
  IconButton,
  Button,
  Paper,
  FormControl,
  InputLabel,
  useMediaQuery,
  Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { getMonthFromDate, getMonthName } from './chartHelpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CategoryMonthComparisonChartProps {
  data: Transaction[];
}

const CategoryMonthComparisonChart = ({ data }: CategoryMonthComparisonChartProps) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['01', '02']);

  const uniqueMonths = [...new Set(data.map(item => getMonthFromDate(item.date)))].sort();
  const uniqueCategories = [...new Set(data.map(item => item.category))];

  const prepareChartData = (): ChartData<'bar', number[], string> => {
    const expensesByCategory: Record<string, Record<string, number>> = {};

    uniqueCategories.forEach(category => {
      expensesByCategory[category] = {};
      selectedMonths.forEach(month => {
        expensesByCategory[category][month] = 0;
      });
    });

    data
      .filter(item => selectedMonths.includes(getMonthFromDate(item.date)))
      .forEach(item => {
        const month = getMonthFromDate(item.date);
        const category = item.category;
        const amount = item.sum;

        if (expensesByCategory[category]?.[month] !== undefined) {
          expensesByCategory[category][month] += amount;
        }
      });

    const totalByCategory: Record<string, number> = {};
    uniqueCategories.forEach(category => {
      totalByCategory[category] = Object.values(expensesByCategory[category]).reduce((sum, val) => sum + val, 0);
    });

    const sortedCategories = Object.keys(totalByCategory)
      .sort((a, b) => totalByCategory[b] - totalByCategory[a])
      .slice(0, 8);

    // Custom vibrant colors with good contrast for better visual appeal
    const colors = [
      { bg: 'rgba(54, 162, 235, 0.7)', border: 'rgba(54, 162, 235, 1)' },
      { bg: 'rgba(255, 99, 132, 0.7)', border: 'rgba(255, 99, 132, 1)' },
      { bg: 'rgba(75, 192, 192, 0.7)', border: 'rgba(75, 192, 192, 1)' },
      { bg: 'rgba(255, 159, 64, 0.7)', border: 'rgba(255, 159, 64, 1)' },
    ];

    const datasets = selectedMonths.map((month, index) => ({
      label: getMonthName(month),
      data: sortedCategories.map(category => expensesByCategory[category][month]),
      backgroundColor: colors[index % colors.length].bg,
      borderColor: colors[index % colors.length].border,
      borderWidth: 1,
    }));

    return {
      labels: sortedCategories,
      datasets,
    };
  };

  const chartData = prepareChartData();

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: !isMobile,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        callbacks: {
          label: (context) => `${context.dataset.label}: ₪${(context.raw as number).toLocaleString()}`,
        },
      },
      title: {
        display: true,
        text: 'השוואת הוצאות לפי קטגוריה בין חודשים',
        font: { size: 16, weight: 'bold' },
        padding: { bottom: 20 }
      }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: {
          font: { size: 13 }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 13 },
          callback: (value) => `₪${Number(value).toLocaleString()}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
    },
  };

  const handleMonthChange = (index: number, value: string) => {
    const newSelectedMonths = [...selectedMonths];
    newSelectedMonths[index] = value;
    setSelectedMonths(newSelectedMonths);
  };

  const addMonth = () => {
    if (selectedMonths.length < 4) {
      const available = uniqueMonths.filter(m => !selectedMonths.includes(m));
      if (available.length > 0) {
        setSelectedMonths([...selectedMonths, available[0]]);
      }
    }
  };

  const removeMonth = (index: number) => {
    if (selectedMonths.length > 2) {
      const newSelected = [...selectedMonths];
      newSelected.splice(index, 1);
      setSelectedMonths(newSelected);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, direction: 'rtl', width: '90%' }}>
      
      <Grid container spacing={2} justifyContent="center" alignItems="flex-end" mb={4}>
        {selectedMonths.map((month, index) => (
          <Grid item key={`month-${index}`} xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <FormControl fullWidth size="small">
                <InputLabel id={`month-label-${index}`}>חודש {index + 1}</InputLabel>
                <Select
                  labelId={`month-label-${index}`}
                  value={month}
                  label={`חודש ${index + 1}`}
                  onChange={(e) => handleMonthChange(index, e.target.value as string)}
                >
                  {uniqueMonths.map((m) => (
                    <MenuItem key={m} value={m}>
                      {getMonthName(m)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedMonths.length > 2 && (
                <IconButton 
                  onClick={() => removeMonth(index)} 
                  size="small" 
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
        ))}

        {selectedMonths.length < 4 && (
          <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={addMonth}
              startIcon={<AddIcon />}
              fullWidth
            >
              הוסף חודש להשוואה
            </Button>
          </Grid>
        )}
      </Grid>

      <Box sx={{ height: isMobile ? '400px' : 'auto', mt: 2 }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default CategoryMonthComparisonChart;
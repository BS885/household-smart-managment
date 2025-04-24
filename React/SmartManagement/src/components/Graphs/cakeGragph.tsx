import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Paper, Typography, Box, FormControl, Select, MenuItem, InputLabel, useTheme, useMediaQuery } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const getMonthName = (monthStr: string) => {
  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  return months[parseInt(monthStr) - 1] || monthStr;
};

interface CakeGraphProps {
  monthlyData: { [month: string]: any };
}

const CakeGraph = ({ monthlyData }: CakeGraphProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const availableMonths = Object.keys(monthlyData).sort();
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[availableMonths.length - 1] || '');

  const chartData = monthlyData[selectedMonth];
  
  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: isMobile ? false : true,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
        labels: { 
          font: { size: 14 },
          boxWidth: 15,
          padding: 15
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        callbacks: {
          label: (tooltipItem: any) =>
            `${tooltipItem.label}: ₪${tooltipItem.raw.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl' 
      }}
    >
      
      <Box mb={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="month-select-label">בחר חודש</InputLabel>
          <Select
            labelId="month-select-label"
            value={selectedMonth}
            label="בחר חודש"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map((month) => (
              <MenuItem key={month} value={month}>
                {getMonthName(month)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '300px'
      }}>
        {chartData?.labels && chartData?.datasets ? (
         <Pie data={chartData} options={{ ...options, maintainAspectRatio: false }} />
      
        ) : (
          <Typography color="text.secondary" align="center">
            אין נתונים להצגה לחודש זה
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CakeGraph;





// import { useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   ChartOptions,
// } from 'chart.js';
// import { FormControl, Select, MenuItem, Typography, Box } from '@mui/material';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const getMonthName = (monthStr: string) => {
//   const months = [
//     'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
//     'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
//   ];
//   return months[parseInt(monthStr) - 1] || monthStr;
// };

// interface CakeGraphProps {
//   monthlyData: { [month: string]: any };
//   title?: string;
// }

// const CakeGraph = ({ monthlyData, title }: CakeGraphProps) => {
//   const availableMonths = Object.keys(monthlyData).sort();
//   const [selectedMonth, setSelectedMonth] = useState(
//     availableMonths.length > 0 ? availableMonths[availableMonths.length - 1] : ''
//   );

//   const chartData = monthlyData[selectedMonth];
  
//   const options: ChartOptions<'pie'> = {
//     responsive: true,
//     maintainAspectRatio: true,
//     plugins: {
//       legend: {
//         position: 'right',
//         labels: { 
//           font: { size: 13 },
//           boxWidth: 12,
//           padding: 15
//         },
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0,0,0,0.75)',
//         padding: 10,
//         titleFont: { size: 13 },
//         bodyFont: { size: 13 },
//         callbacks: {
//           label: (tooltipItem: any) =>
//             `${tooltipItem.label}: ₪${tooltipItem.raw.toLocaleString()}`,
//         },
//       },
//     },
//   };

//   return (
//     <Box sx={{ width: '100%', height: '100%' }}>
//       <Box mb={2} sx={{ display: 'flex', justifyContent: 'center' }}>
//         <FormControl size="small" sx={{ minWidth: 120 }}>
//           <Select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value as string)}
//             displayEmpty
//             sx={{ fontSize: '0.9rem' }}
//           >
//             <MenuItem value="" disabled>בחר חודש</MenuItem>
//             {availableMonths.map((month) => (
//               <MenuItem key={month} value={month}>
//                 {getMonthName(month)}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>
      
//       <Box sx={{ 
//         height: '3000px',  
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center' 
//       }}>
//         {chartData?.labels && chartData?.datasets ? (
//           <Pie data={chartData} options={options} />
//         ) : (
//           <Typography color="text.secondary" align="center">
//             אין נתונים להצגה לחודש זה
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default CakeGraph;
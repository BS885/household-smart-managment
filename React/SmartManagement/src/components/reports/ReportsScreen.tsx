import { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import DateRangeReport from './DateRangeReport';
import YearlyReport from './YearlyReport';

const ReportsScreen=()=> {
  const [tabIndex, setTabIndex] = useState(0);

   const downloadCSV = (rows: string[][], headers: string[], filename: string) => {
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
  
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  // const handleDownloadCSV = ({rows: string[][], headers: string[], filename: string) => {
  //   const headers = ['תאריך', 'קטגוריה', 'סכום', 'תיאור'];
  //   const rows = transactions.map((t) => [
  //     dayjs(t.date).format('YYYY-MM-DD')+"\t",
  //     t.category,
  //     t.sum.toFixed(2),
  //     t.description?.replace(/"/g, '""') || ''
  //   ]);
  
  //   const csvContent = [headers, ...rows]
  //     .map((row) => row.map((cell) => `"${cell}"`).join(','))
  //     .join('\n');
  
  //   // הוספת BOM לתחילת הקובץ כדי ש-Excel יזהה עברית נכון
  //   const bom = '\uFEFF';
  //   const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  //   const filename = `דוח_תנועות_${fromDate}_עד_${toDate}_קטגוריה_${category}.csv`;

  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', filename);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  return (
    <Container sx={{ mt: 4,marginTop:'30%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)}>
          <Tab label="לפי טווח תאריכים" />
          <Tab label="לפי שנה" />
        </Tabs>
      </Box>

      {tabIndex === 0 && <DateRangeReport handleDownloadCSV={downloadCSV} />}
      {tabIndex === 1 && <YearlyReport handleDownloadCSV={downloadCSV} />}
    </Container>
  );
}

export default ReportsScreen;

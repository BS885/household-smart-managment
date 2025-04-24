// import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
// import { getMonthName } from "./chartHelpers";

// interface Props {
//     availableMonths: string[];
//     selectedMonth: string;
//     onChange: (value: string) => void;
//     label?: string;
// }

// const MonthSelector = ({ availableMonths, selectedMonth, onChange, label = 'בחר חודש' }: Props) => (
//     <FormControl fullWidth sx={{ mb: 2 }}>
//         <InputLabel id="month-select-label">{label}</InputLabel>
//         <Select
//             labelId="month-select-label"
//             value={selectedMonth}
//             label={label}
//             onChange={(e) => onChange(e.target.value)}
//         >
//             {availableMonths.map((month) => (
//                 <MenuItem key={month} value={month}>
//                     {getMonthName(month)}
//                 </MenuItem>
//             ))}
//         </Select>
//     </FormControl>
// );
// export default MonthSelector;
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface MonthSelectorProps {
  availableMonths: string[];
  selectedMonth: string;
  onChange: (month: string) => void;
}

const getMonthName = (monthStr: string) => {
  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  return months[parseInt(monthStr) - 1] || monthStr;
};

const MonthSelector = ({ availableMonths, selectedMonth, onChange }: MonthSelectorProps) => {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="month-selector-label">בחר חודש</InputLabel>
      <Select
        labelId="month-selector-label"
        value={selectedMonth}
        label="בחר חודש"
        onChange={(e) => onChange(e.target.value as string)}
      >
        {availableMonths.map((month) => (
          <MenuItem key={month} value={month}>
            {getMonthName(month)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MonthSelector;
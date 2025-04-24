import { Transaction } from "../../models/Expense&Income";

export const getMonthName = (monthNumber: string): string => {
    const months: Record<string, string> = {
        '01': 'ינואר', '02': 'פברואר', '03': 'מרץ', '04': 'אפריל',
        '05': 'מאי', '06': 'יוני', '07': 'יולי', '08': 'אוגוסט',
        '09': 'ספטמבר', '10': 'אוקטובר', '11': 'נובמבר', '12': 'דצמבר',
    };
    return months[monthNumber] || monthNumber;
};
export const generateCategoryPieData = (expenses: Transaction[]) => {
    const totalsByCategory: Record<string, number> = {};
  
    expenses.forEach(({ category, sum }) => {
      totalsByCategory[category] = (totalsByCategory[category] || 0) + sum;
    });
  
    const labels = Object.keys(totalsByCategory);
    const data = Object.values(totalsByCategory);
  
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#F67019', '#00A896', '#B388EB', '#FFD166', '#EF476F'
    ];
  
    return {
      labels,
      datasets: [
        {
          label: 'סך הכל לפי קטגוריה',
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: ['#fff'],
          borderWidth: 2,
        },
      ],
    };
  };

export const getMonthFromDate = (dateString: string): string => dateString.split('-')[1];

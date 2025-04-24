import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import { Transaction } from '../../models/Expense&Income';
  
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  
  type Props = {
    expenses: Transaction[];
  };
  
  const BarGraph = ({ expenses }: Props) => {
    const totalsByCategory: Record<string, number> = {};
  
    expenses.forEach((expense) => {
      const { category, sum } = expense;
      totalsByCategory[category] = (totalsByCategory[category] || 0) + sum;
    });
  
    const labels = Object.keys(totalsByCategory);
    const data = {
      labels,
      datasets: [
        {
          label: 'סך הכל לפי קטגוריה',
          data: Object.values(totalsByCategory),
          backgroundColor: '#36A2EB',
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              return tooltipItem.raw + ' ₪';
            },
          },
        },
      },
      scales: {
        x: {
          type: 'category' as const,
        },
        y: {
          beginAtZero: true,
        },
      },
    };
  
    return (
      <div style={{ maxWidth: 700, margin: 'auto' }}>
        <Bar data={data} options={options} />
      </div>
    );
  };
  
  export default BarGraph;
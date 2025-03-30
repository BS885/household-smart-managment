import { useMemo } from 'react';
import {  ExpenseAndIncomeToSave } from '../models/Expense&Income';

const useSortedTransactions = (expenses: ExpenseAndIncomeToSave[]): ExpenseAndIncomeToSave[] => {
  const sortedExpenses = useMemo(() => {
    if (!expenses) return [];
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  return sortedExpenses;
};

export default useSortedTransactions;
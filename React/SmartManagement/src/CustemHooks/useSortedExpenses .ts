import { useMemo } from 'react';
import {  ExpenseToSave } from '../models/Expense';

const useSortedExpenses = (expenses: ExpenseToSave[]): ExpenseToSave[] => {
  const sortedExpenses = useMemo(() => {
    if (!expenses) return [];
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  return sortedExpenses;
};

export default useSortedExpenses;
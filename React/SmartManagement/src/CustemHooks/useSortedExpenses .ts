import { useMemo } from 'react';
import { Expense } from '../models/Expense';

const useSortedExpenses = (expenses: Expense[]): Expense[] => {
  const sortedExpenses = useMemo(() => {
    if (!expenses) return [];
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  return sortedExpenses;
};

export default useSortedExpenses;
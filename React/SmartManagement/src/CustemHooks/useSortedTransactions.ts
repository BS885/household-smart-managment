import { useMemo } from 'react';
import {  TransactionToSave } from '../models/Expense&Income';

const useSortedTransactions = (expenses: TransactionToSave[]): TransactionToSave[] => {
  const sortedExpenses = useMemo(() => {
    if (!expenses) return [];
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  return sortedExpenses;
};

export default useSortedTransactions;
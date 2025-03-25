import { useDispatch, useSelector } from 'react-redux';
import ExpenseForm from './ExpenseForm';
import { AppDispatch, RootState } from '../../redux/store';
import { useEffect } from 'react';
import { fetchCategories } from '../../redux/categoriesSlice';
import { addExpenseAsync, loadExpenses } from '../../redux/ExpenseSlice';
import { Expense } from '../../models/Expense';
import { uploadFile } from '../../redux/FileSlice';

const AddExpense = ({ onClose }: { onClose: Function }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const status = useSelector((state: RootState) => state.categories.status);

  // טוען את הקטגוריות כאשר הקומפוננטה נטענת
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);


  const handleAddExpense = (expenseData: any) => {
    console.log('Adding expense:', expenseData);

    const newExpense: Omit<Expense, 'id'> = {
      date: expenseData.date,
      sum: expenseData.sum,
      category: expenseData.category,
      description: expenseData.description,
    };
    if(expenseData.file) {
      console.log('File:', expenseData.file);
      dispatch(uploadFile(expenseData.file));
    }

    return dispatch(addExpenseAsync(newExpense)) // כאן הוספנו return
      .unwrap()
      .then(() => {
        dispatch(loadExpenses());
        onClose();
      })
      .catch((error) => {
        console.error("Failed to add expense:", error);
      });
  };

  return <ExpenseForm onSubmit={handleAddExpense} categories={categories} />;
};

export default AddExpense;
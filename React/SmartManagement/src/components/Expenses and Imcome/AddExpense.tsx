import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { addExpenseAsync, addWithFileExpenseAsync, loadExpenses } from '../../redux/ExpenseSlice';
import { Transaction } from '../../models/Expense&Income';
import { uploadFile } from '../../redux/FileSlice';
import ExpenseOrIncomeForm from './ExpenseOrIncomeForm';
import { fetchExpenseCategories } from '../../redux/categoriesSlice';

interface ExpenseData {
  date: string;
  sum: number;
  category?: string;
  description: string;
  file?: File;
}

const AddExpense = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.expenseCategories);
  const status = useSelector((state: RootState) => state.categories.expenseStatus);

  // טוען את הקטגוריות כאשר הקומפוננטה נטענת
  useEffect(() => {
    console.log("status add expense: ", status);

    if (status === 'idle') {
      dispatch(fetchExpenseCategories()).unwrap().catch(console.error);
    }
  }, [dispatch, status]);

  const handleAddExpense = async (expenseData: ExpenseData) => {
    console.log('Adding expense:', expenseData);

    if (expenseData.file) {
      let fileData = null;

      if (expenseData.file instanceof File) {
        const s3Key = `${uuidv4()}_${expenseData.file.name}`;
        try {
          // Upload the file and get file information
          const uploadedFile = await dispatch(uploadFile({
            file: expenseData.file,
            s3Key: s3Key
          })).unwrap();
          console.log('File uploaded successfully:', uploadedFile);

          fileData = {
            fileName: expenseData.file.name, // Name as returned from the server
            fileType: expenseData.file.type, // File type
            fileSize: expenseData.file.size, // File size
          };

          const newExpense: Omit<Transaction, 'id' | 'file' | 'category'> = {
            date: expenseData.date,
            sum: expenseData.sum,
            description: expenseData.description,
          };

          try {
            await dispatch(addWithFileExpenseAsync({ expense: newExpense, file: fileData, s3Key: s3Key })).unwrap();
            await dispatch(loadExpenses()).unwrap();
            onClose();
          } catch (error) {
            console.error('Failed to add expense:', error);
          }

        } catch (error) {
          console.error('File upload failed:', error);
          return;
        }
      }

    } else {
      const newExpense: Omit<Transaction, 'id' | 'file' | 'category'> = {
        date: expenseData.date,
        sum: expenseData.sum,
        description: expenseData.description,
      };

      try {

        await dispatch(addExpenseAsync(newExpense)).unwrap();
        await dispatch(loadExpenses()).unwrap();
        onClose();
      } catch (error) {
        console.error('Failed to add expense:', error);
        throw error;
      }
    }
  };


  // החזרת טופס הוצאה
  return <ExpenseOrIncomeForm onSubmit={handleAddExpense} categories={categories} />;
};

export default AddExpense;

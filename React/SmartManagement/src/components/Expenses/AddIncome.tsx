import { useDispatch, useSelector } from 'react-redux';
import ExpenseOrIncomeForm from './ExpenseOrIncomeForm';
import { AppDispatch, RootState } from '../../redux/store';
import { useEffect } from 'react';
import { fetchIncomeCategories } from '../../redux/categoriesSlice';
import { ExpenseAndIncome } from '../../models/Expense&Income';
import { uploadFile } from '../../redux/FileSlice';
import { addIncomeAsync, addWithFileIncomeAsync, loadIncomes } from '../../redux/IncomeSlices';

interface IncomeData {
  date: string;
  sum: number;
  category: string;
  description: string;
  file?: File;
}

const AddIncome = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.incomeCategories);
  const status = useSelector((state: RootState) => state.categories.incomeStatus);

  // טוען את הקטגוריות כאשר הקומפוננטה נטענת
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIncomeCategories()).unwrap().catch(console.error); 
    }
  }, [dispatch, status]);

  const handleAddIncome = async (incomeData: IncomeData) => {
    console.log('Adding Income:', incomeData);
  
    if (incomeData.file) {
      let fileData;
  
      if (incomeData.file instanceof File) {
        try {
          // Upload the file and get file information
          const uploadedFile = await dispatch(uploadFile(incomeData.file)).unwrap();
          console.log('File uploaded successfully:', uploadedFile);
  
          fileData = {
            fileName: incomeData.file.name, // Name as returned from the server
            fileType: incomeData.file.type, // File type
            fileSize: incomeData.file.size, // File size
          };
  
          const newExpense: Omit<ExpenseAndIncome, 'id' | 'file'> = {
            date: incomeData.date,
            sum: incomeData.sum,
            category: incomeData.category,
            description: incomeData.description,
          };
  
          // Wrap the newExpense inside an object with the 'expense' property
          try {
            await dispatch(addWithFileIncomeAsync({ Income: newExpense, file: fileData })).unwrap();
            await dispatch(loadIncomes()).unwrap();
            onClose();
          } catch (error) {
            console.error('Failed to add expense:', error);
          }
  
        } catch (error) {
          console.error('File upload failed:', error);
          return; // If the upload fails, we do not proceed
        }
      }
  
    } else {
      const newExpense: Omit<ExpenseAndIncome, 'id' | 'file'> = {
        date: incomeData.date,
        sum: incomeData.sum,
        category: incomeData.category,
        description: incomeData.description,
      };
  
      try {
        await dispatch(addIncomeAsync(newExpense)).unwrap();
        await dispatch(loadIncomes()).unwrap();
        onClose();
      } catch (error) {
        console.error('Failed to add expense:', error);
      }
    }
  };
  

  // החזרת טופס הוצאה
  return <ExpenseOrIncomeForm onSubmit={handleAddIncome} categories={categories} isExpense={false} />
};
export default AddIncome;

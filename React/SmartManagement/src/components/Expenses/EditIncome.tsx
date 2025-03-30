import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { ExpenseAndIncome } from "../../models/Expense&Income";
import { fetchIncomeCategories } from "../../redux/categoriesSlice";
import { AppDispatch } from "../../redux/store";
import ExpenseForm from "./ExpenseOrIncomeForm";
import { uploadFile } from "../../redux/FileSlice";
import { loadIncomes, updateIncomeAsync, updateWithFileIncomeAsync } from "../../redux/IncomeSlices";

interface IncomeData {
    id: number;
    date: string;
    sum: number;
    category: string;
    description: string;
    file?: File;
}

const EditIncome = ({ onClose, transaction }: { onClose: Function, transaction: ExpenseAndIncome }) => {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.categories.incomeCategories);
    const status = useSelector((state: RootState) => state.categories.incomeStatus);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchIncomeCategories());
        }
    }, [dispatch, status]);

    const handleEditIncome = async (incomeData: IncomeData) => {
        console.log('Updating Income:', incomeData);
    
        let fileData = null;
    
        // אם יש קובץ חדש
        if (incomeData.file && incomeData.file instanceof File) {
            try {
                // העלאת הקובץ ולקבל פרטי קובץ
                const uploadedFile = await dispatch(uploadFile(incomeData.file)).unwrap();
                console.log('File uploaded successfully:', uploadedFile);
    
                fileData = {
                    fileName: incomeData.file.name,
                    fileType: incomeData.file.type,
                    fileSize: incomeData.file.size,
                };
            } catch (error) {
                console.error('File upload failed:', error);
                return; // אם ההעלאה נכשלת, לא נמשיך בעדכון
            }
        }
    
        // יצירת אובייקט ההוצאה לעדכון
        const updatedIncome: ExpenseAndIncome = {
            id: incomeData.id,
            date: incomeData.date,
            sum: incomeData.sum,
            category: incomeData.category,
            description: incomeData.description,
        };
    
        if (fileData) {
            try {
                await dispatch(updateWithFileIncomeAsync({ Income: updatedIncome, file: fileData })).unwrap();
                await dispatch(loadIncomes()).unwrap();
                onClose();
            } catch (error) {
                console.error('Failed to update income with file:', error);
            }
        } else {
            try {
                await dispatch(updateIncomeAsync(updatedIncome)).unwrap();
                await dispatch(loadIncomes()).unwrap();
                onClose();
            } catch (error) {
                console.error('Failed to update income without file:', error);
            }
        }
    };
    



    return (
        <ExpenseForm onSubmit={handleEditIncome} categories={categories} isEdit={true} initialValues={transaction} isExpense={false} />
    );
}
export default EditIncome;
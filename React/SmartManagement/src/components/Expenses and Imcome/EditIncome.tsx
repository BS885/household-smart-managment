import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { Transaction } from "../../models/Expense&Income";
import { fetchIncomeCategories } from "../../redux/categoriesSlice";
import { AppDispatch } from "../../redux/store";
import ExpenseForm from "./ExpenseOrIncomeForm";
import { uploadFile } from "../../redux/FileSlice";
import { loadIncomes, updateIncomeAsync, updateWithFileIncomeAsync } from "../../redux/IncomeSlices";
import { v4 as uuidv4 } from 'uuid';

interface IncomeData {
    id: number;
    date: string;
    sum: number;
    category: string;
    description: string;
    file?: File;
}

const EditIncome = ({ onClose, transaction }: { onClose: Function, transaction: Transaction }) => {
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
            const s3Key = `${uuidv4()}_${incomeData.file.name}`;
            try {
                // העלאת הקובץ ולקבל פרטי קובץ
                const uploadedFile = await dispatch(uploadFile({file: incomeData.file, s3Key:s3Key})).unwrap();
                console.log('File uploaded successfully:', uploadedFile);
    
                fileData = {
                    fileName: incomeData.file.name,
                    fileType: incomeData.file.type,
                    fileSize: incomeData.file.size,
                };
            } catch (error) {
                console.error('File upload failed:', error);
                throw error;
            }
        }
    
        const updatedIncome: Transaction = {
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
                throw error;
            }
        } else {
            try {
                await dispatch(updateIncomeAsync(updatedIncome)).unwrap();
                await dispatch(loadIncomes()).unwrap();
                onClose();
            } catch (error) {
                console.error('Failed to update income without file:', error);
                throw error;
            }
        }
    };
    



    return (
        <ExpenseForm onSubmit={handleEditIncome} categories={categories} isEdit={true} initialValues={transaction} isExpense={false} />
    );
}
export default EditIncome;
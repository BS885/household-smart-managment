import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { Expense } from "../../models/Expense";
import { fetchCategories } from "../../redux/categoriesSlice";
import { updateExpenseAsync, loadExpenses, updateWithFileExpenseAsync } from "../../redux/ExpenseSlice";
import { AppDispatch } from "../../redux/store";
import ExpenseForm from "./ExpenseForm";
import { uploadFile } from "../../redux/FileSlice";

interface ExpenseData {
    id: number;
    date: string;
    sum: number;
    category: string;
    description: string;
    file?: File;
}

const EditExpense = ({ onClose, expense }: { onClose: Function, expense: Expense }) => {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.categories.categories);
    const status = useSelector((state: RootState) => state.categories.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [dispatch, status]);


    // const handleEditExpense = (expenseData: ExpenseData) => {
    //     console.log('updating expense:', expenseData);

    //     const newExpense: Expense = {
    //         id: expenseData.id,
    //         date: expenseData.date,
    //         sum: expenseData.sum,
    //         category: expenseData.category,
    //         description: expenseData.description,
    //     };

    //    return dispatch(updateExpenseAsync(newExpense))
    //         .unwrap()
    //         .then(() => {
    //             dispatch(loadExpenses());
    //             onClose();
    //         })
    //         .catch((error) => {
    //             console.error("Failed to add expense:", error);
    //         });
    // };
    const handleEditExpense = async (expenseData: ExpenseData) => {
        console.log('Updating expense:', expenseData);
    
        let fileData = null;
    
        // אם יש קובץ חדש
        if (expenseData.file && expenseData.file instanceof File) {
            try {
                // העלאת הקובץ ולקבל פרטי קובץ
                const uploadedFile = await dispatch(uploadFile(expenseData.file)).unwrap();
                console.log('File uploaded successfully:', uploadedFile);
    
                fileData = {
                    fileName: expenseData.file.name,
                    fileType: expenseData.file.type,
                    fileSize: expenseData.file.size,
                };
            } catch (error) {
                console.error('File upload failed:', error);
                return; // אם ההעלאה נכשלת, לא נמשיך בעדכון
            }
        }
    
        // יצירת אובייקט ההוצאה לעדכון
        const updatedExpense: Expense = {
            id: expenseData.id,
            date: expenseData.date,
            sum: expenseData.sum,
            category: expenseData.category,
            description: expenseData.description,
        };
    
        // אם יש קובץ, נשלח את הבקשה עם הקובץ
        if (fileData) {
            try {
                await dispatch(updateWithFileExpenseAsync({ expense: updatedExpense, file: fileData })).unwrap();
                await dispatch(loadExpenses()).unwrap();
                onClose();
            } catch (error) {
                console.error('Failed to update expense with file:', error);
            }
        } else {
            // אם אין קובץ, נשלח את הבקשה ללא קובץ
            try {
                await dispatch(updateExpenseAsync(updatedExpense)).unwrap();
                await dispatch(loadExpenses()).unwrap();
                onClose();
            } catch (error) {
                console.error('Failed to update expense without file:', error);
            }
        }
    };
    



    return (
        <ExpenseForm onSubmit={handleEditExpense} categories={categories} isEdit={true} initialValues={expense} />
    );
}
export default EditExpense;
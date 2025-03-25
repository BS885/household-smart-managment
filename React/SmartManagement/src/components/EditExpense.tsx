import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect } from "react";
import { fetchCategories } from "../redux/categoriesSlice";
import { Expense } from "../models/Expense";
import { loadExpenses, updateExpenseAsync } from "../redux/ExpenseSlice";
import ExpenseForm from "./ExpenseForm";

const EditExpense = ({ onClose, expense }: { onClose: Function, expense: Expense }) => {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.categories.categories);
    const status = useSelector((state: RootState) => state.categories.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [dispatch, status]);


    const handleAddExpense = (expenseData: Expense) => {
        console.log('updating expense:', expenseData);

        const newExpense: Expense = {
            id: expenseData.id,
            date: expenseData.date,
            sum: expenseData.sum,
            category: expenseData.category,
            description: expenseData.description,
        };

       return dispatch(updateExpenseAsync(newExpense))
            .unwrap()
            .then(() => {
                dispatch(loadExpenses());
                onClose();
            })
            .catch((error) => {
                console.error("Failed to add expense:", error);
            });
    };



    return (
        <ExpenseForm onSubmit={handleAddExpense} categories={categories} isEdit={true} initialValues={expense} />
    );
}
export default EditExpense;
import { useDispatch } from "react-redux";
import { loadExpenses, deleteExpenseAsync } from "../../redux/ExpenseSlice";
import { AppDispatch } from "../../redux/store";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import TransactionTracker from "./TransactionTracker";


const ExpenseTracker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const load = () => {
    dispatch(loadExpenses());
  };

  const deleteExpense = async (id: number) => {
   await dispatch(deleteExpenseAsync(id)).unwrap();
    load();
  };

  // הגדרת אובייקט הפעולות
  const actions = {
    load: load,
    delete: deleteExpense
  };

  return (
    <div>
      <TransactionTracker
        type="expense" // או "income"
        actions={actions}
        AddComponent={AddExpense}
        EditComponent={EditExpense}
        transactionsSelector={(state) => state.expenses.expenses}
        statusSelector={(state) => state.expenses.status}
      />
    </div>
  );
};

export default ExpenseTracker;


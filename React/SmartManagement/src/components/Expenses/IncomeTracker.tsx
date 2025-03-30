import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import TransactionTracker from "./TransactionTracker";
import AddIncome from "./AddIncome";
import EditIncome from "./EditIncome";
import { deleteIncomeAsync, loadIncomes } from "../../redux/IncomeSlices";


const IncomeTracker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const load = () => {
    dispatch(loadIncomes());
  };

  const deleteIncome = async (id: number) => {
   await dispatch(deleteIncomeAsync(id)).unwrap();
    load();
  };

  // הגדרת אובייקט הפעולות
  const actions = {
    load: load,
    delete: deleteIncome
  };

  return (
    <div>
      <TransactionTracker
        type="income"
        actions={actions}
        AddComponent={AddIncome}
        EditComponent={EditIncome}
        transactionsSelector={(state) => state.incomes.incomes}
        statusSelector={(state) => state.incomes.status}
      />
    </div>
  );
};

export default IncomeTracker;


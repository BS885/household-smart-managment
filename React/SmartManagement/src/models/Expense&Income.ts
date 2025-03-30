export type ExpenseAndIncome = {
  id: number;
  date: string;
  category: string;
  description: string;
  sum: number;

};
export type ExpenseAndIncomeToSave = {
  id: number;
  date: string;
  category: string;
  description: string;
  sum: number;
  fileName?: string;
  fileType?: string;
  filesize?: string;
}

export interface ExpenseFormProps {
  onSubmit: (data: any) => {};
  categories: string[];
  initialValues?: { 
    date?: string | Date;
    sum?: number | string;
    category?: string;
    description?: string;
    file?: FileState | null;
  };
  isEdit?: boolean;
}

export interface FileState {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export enum TransactionType{
  Expense = "Expense",
  Income = "Income"
}

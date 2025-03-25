export type Expense = {
    id: number
    date: string
    category: string
    description: string
    sum: number
}
export interface ExpenseFormProps {
    onSubmit: (data: any) =>{};
    categories: string[];
    initialValues?: { 
      date?: string | Date;
      sum?: number | string;
      category?: string;
      description?: string;
      file?: File | string | null;
    };
    isEdit?: boolean;
  }
  
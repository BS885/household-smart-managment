export type Expense = {
  id: number;
  date: string;
  category: string;
  description: string;
  sum: number;

};
export type ExpenseToSave = {
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

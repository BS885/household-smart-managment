import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Divider,
  InputAdornment,
  Alert,
  IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';

interface ExpenseAndIncomeFormProps {
  onSubmit: (data: any) => Promise<void>;
  categories: string[];
  initialValues?: any;
  isEdit?: boolean;
  isExpense?: boolean;
}

const ExpenseOrIncomeForm: FC<ExpenseAndIncomeFormProps> = ({ onSubmit, categories, initialValues = null, isEdit = false, isExpense=true }) => {
  const [formData, setFormData] = useState({
    date: new Date() as Date | null, // מאפשר גם null
    sum: "",
    category: "",
    description: "",
    file: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        ...initialValues,
        date: initialValues.date ? new Date(initialValues.date) : new Date(),
        sum: initialValues.sum ? String(initialValues.sum) : '',
        file: initialValues.file || null,
      }));
    }
  }, [initialValues]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
  };

  const handleReset = () => {
    setFormData({
      date: new Date(),
      sum: '',
      category: '',
      description: '',
      file: null,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.sum) newErrors.sum = 'שדה חובה';
    else if (parseFloat(formData.sum) <= 0) newErrors.sum = 'הסכום חייב להיות גדול מאפס';

    if (!formData.category) newErrors.category = 'שדה חובה';

    if (formData.file instanceof File && formData.file.size > 5 * 1024 * 1024) {
      newErrors.general = 'גודל הקובץ חייב להיות קטן מ-5MB';
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!isEdit) handleReset();
      setErrors({ general: 'ההוצאה נשמרה בהצלחה' });
    } catch (error: any) {
      setErrors({ general: error.message || 'אירעה שגיאה בשמירת ההוצאה.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary.main" sx={{ fontWeight: 'bold' }}>
          {isEdit ? (isExpense ? 'עריכת הוצאה' : 'עריכת הכנסה') : (isExpense ? 'הוספת הוצאה חדשה' : 'הוספת הכנסה חדשה')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {isEdit ? `ערוך את פרטי ה ${isExpense ? 'הוצאה' : 'הכנסה'} שלך` : `הזן את פרטי ה${isExpense ? 'הוצאה' : 'הכנסה'} החדשה`}
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {errors.general && (
        <Alert severity={errors.general.includes('הצלחה') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {errors.general}
          <IconButton size="small" onClick={() => setErrors({})}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Alert>
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <DatePicker label="תאריך" value={formData.date} onChange={handleDateChange} />

          <TextField
            fullWidth
            required
            label="סכום"
            name="sum"
            type="number"
            value={formData.sum}
            onChange={handleInputChange}
            error={!!errors.sum}
            helperText={errors.sum}
            InputProps={{ startAdornment: <InputAdornment position="start">₪</InputAdornment> }}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            select
            label="קטגוריה"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            error={!!errors.category}
            helperText={errors.category}
            margin="normal"
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="תיאור"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={3}
            margin="normal"
          />

          <Button variant="outlined" component="label" fullWidth startIcon={<AttachFileIcon />}>
            {formData.file ? 'החלף קובץ' : 'העלאת קובץ'}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {formData.file && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="body2">{typeof formData.file === 'string' ? formData.file : formData.file.name}</Typography>
              <IconButton onClick={handleRemoveFile} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          <Button type="submit" fullWidth variant="contained" color="primary" startIcon={<SaveIcon />} disabled={isSubmitting} sx={{ mt: 2 }}>
            {isSubmitting ? 'שומר...' : isEdit ? 'עדכון' : 'שמירה'}
          </Button>
        </Box>
      </LocalizationProvider>
    </Paper>
  );
};

export default ExpenseOrIncomeForm;
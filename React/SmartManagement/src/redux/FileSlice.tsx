import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "./api";

interface FileStatus {
  file: File | null;
  progress: number;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  downloadUrl: string | null;  // הוספת משתנה לשמירת ה-URL להורדה
}

const initialState: FileStatus = {
  file: null,
  progress: 0,
  status: "idle",
  error: null,
  downloadUrl: null,  // התחל עם URL ריק
};

// Async thunk לקבלת Presigned URL והעלאת קובץ
export const uploadFile = createAsyncThunk(
  "file/upload",
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
        console.log(file.name);
        console.log(file.type);
        console.log("uploadFile executed");

      // שלב 1: קבלת Presigned URL
      const response = await api.get("/s3/upload-url", {
        params: {
          fileName: file.name,
          contentType: file.type,
        },
      });

      const presignedUrl = response.data.url;
      console.log(presignedUrl);

      // שלב 2: העלאת קובץ ל-S3
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          dispatch(updateProgress(percent)); // ✅ עדכון progress בזמן אמת
        },
      });

      alert("הקובץ הועלה בהצלחה!");
      return "success";
    } catch (error: any) {
      console.error("שגיאה בהעלאה:", error);
      return rejectWithValue(error.response?.data || "שגיאה בהעלאה");
    }
  }
);

// Async thunk להורדת קובץ
export const downloadFile = createAsyncThunk(
  "file/download",
  async (fileName: string, { rejectWithValue }) => {
    try {
      console.log("downloadFile executed");

      // שלב 1: קבלת Presigned URL להורדה
      const response = await api.get(`/s3/download-url/${fileName}`);

      const presignedUrl = response.data.downloadUrl;
      console.log("Download URL:", presignedUrl);

      // שלב 2: הורדת הקובץ בעזרת axios
      const responseDownload = await axios.get(presignedUrl, {
        responseType: "blob",  // אנחנו מצפים לקבל את הקובץ כ-BLOB
      });

      // יצירת אובייקט URL להורדת הקובץ
      const url = window.URL.createObjectURL(new Blob([responseDownload.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;  // שם הקובץ לשמירה
      document.body.appendChild(a);
      a.click();
      a.remove();

      return presignedUrl;  // החזרת ה-URL להורדה למעקב אם צריך
    } catch (error: any) {
      console.error("שגיאה בהורדה:", error);
      return rejectWithValue(error.response?.data || "שגיאה בהורדה");
    }
  }
);

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFile: (state, action) => {
      state.file = action.payload;
      state.progress = 0;
      state.status = "idle";
      state.error = null;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.status = "loading";
        state.progress = 0;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.status = "success";
        state.progress = 100;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      // טיפול במצבים של הורדה
      .addCase(downloadFile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.status = "success";
        state.downloadUrl = action.payload;  // שמור את ה-URL להורדה
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      });
  },
});

export const { setFile, updateProgress } = fileSlice.actions;
export default fileSlice.reducer;

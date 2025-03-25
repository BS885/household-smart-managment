import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "./api";

interface FileState {
    file: File | null;
    progress: number;
    status: "idle" | "loading" | "success" | "error";
    error: string | null;
}

const initialState: FileState = {
    file: null,
    progress: 0,
    status: "idle",
    error: null,
};

// Async thunk לקבלת Presigned URL והעלאת קובץ
export const uploadFile = createAsyncThunk(
    "file/upload",
    async (file: File, { rejectWithValue, dispatch }) => {
        try {
            console.log('uploadFile executed');
            // שלב 1: קבלת Presigned URL

            const response = await api.get("/s3/upload-url", {
                params: {
                    fileName: file.name,
                    contentType: file.type,
                }
            });
            const presignedUrl = response.data.url;
            console.log(response.data.url);

              await axios.put(presignedUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: (progressEvent) => {
                  const percent = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total || 1)
                  );
                  dispatch(updateProgress(percent));
                },
              });

            return "success";
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "שגיאה בהעלאה");
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
            })
            .addCase(uploadFile.fulfilled, (state) => {
                state.status = "success";
                state.progress = 100;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload as string;
            });
    },
});

export const { setFile, updateProgress } = fileSlice.actions;
export default fileSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase"; 
import { ref, get, set, remove, onValue } from "firebase/database"; 

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch tasks using Firebase onValue for real-time updates
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const tasksRef = ref(db, "tasks"); 
  return new Promise((resolve, reject) => {
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const tasksArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      resolve(tasksArray);
    }, (error) => {
      reject(error);
    });
  });
});

export const updateTaskInFirebase = createAsyncThunk(
  "tasks/updateTaskInFirebase",
  async (task) => {
    const taskRef = ref(db, `tasks/${task.id}`); 
    await set(taskRef, task); 
    return task; 
  }
);

export const deleteTaskFromFirebase = createAsyncThunk(
  "tasks/deleteTaskFromFirebase",
  async (taskId) => {
    const taskRef = ref(db, `tasks/${taskId}`); 
    await remove(taskRef); 
    return taskId; 
  }
);

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Log error if needed
      })
      .addCase(updateTaskInFirebase.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload; 
        }
      })
      .addCase(deleteTaskFromFirebase.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const { addTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;

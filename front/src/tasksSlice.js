import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: { arrayTasks: [] },

  reducers: {
    setTasks: (state, action) => {
      return {
        ...state,
        arrayTasks: action.payload,
      };
    },

    addTask: (state, action) => {
      const newTask = {
        id: action.payload.id,
        description: action.payload.description,
        completed: false,
      };
      return {
        ...state,
        arrayTasks: [...state.arrayTasks, newTask],
      };
    },

    toggleTask: (state, action) => {
      const taskId = action.payload;
      const taskIndex = state.arrayTasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex !== -1) {
        const updatedTask = { ...state.arrayTasks[taskIndex] };
        updatedTask.completed = !updatedTask.completed;
        state.arrayTasks[taskIndex] = updatedTask;
      }
    },
    editTask: (state, action) => {
      const { taskId, newDescription } = action.payload;
      const taskIndex = state.arrayTasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex !== -1) {
        const updatedTask = { ...state.arrayTasks[taskIndex] };
        updatedTask.description = newDescription;
        state.arrayTasks[taskIndex] = updatedTask;
      }
    },
    deleteTask: (state, action) => {
      const taskId = action.payload;
      state.arrayTasks = state.arrayTasks.filter((task) => task.id !== taskId);
    },
    deleteTaskCompleted: (state) => {
      const incompleteTasks = state.arrayTasks.filter(
        (task) => !task.completed
      );
      state.arrayTasks = incompleteTasks;
    },
  },
});

export const {
  setTasks,
  addTask,
  toggleTask,
  deleteTask,
  editTask,
  deleteTaskCompleted,
} = tasksSlice.actions;
export default tasksSlice.reducer;

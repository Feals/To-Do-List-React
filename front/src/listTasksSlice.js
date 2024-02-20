import { createSlice } from "@reduxjs/toolkit";

const listTasksSlice = createSlice({
  name: "listTasks",
  initialState: { arrayListTasks: [] },

  reducers: {
    setToDoLists: (state, action) => {
      return {
        ...state,
        arrayListTasks: action.payload,
      };
    },

    addListTask: (state, action) => {
      const newListTask = {
        id: action.payload.id,
        name: action.payload.name,
      };

      return {
        ...state,
        arrayListTasks: [...state.arrayListTasks, newListTask],
      };
    },

    deleteListTask: (state, action) => {
      const listTasksId = action.payload;
      state.arrayListTasks = state.arrayListTasks.filter(
        (task) => task.id !== listTasksId
      );
    },

    changeNameListTasks: (state, action) => {
      const { listTasksId, newName } = action.payload;
      const listTasksIndex = state.arrayListTasks.findIndex(
        (task) => task.id === listTasksId
      );
      if (listTasksIndex !== -1) {
        const updatedListTasks = { ...state.arrayListTasks[listTasksIndex] };
        updatedListTasks.name = newName;
        state.arrayListTasks[listTasksIndex] = updatedListTasks;
      }
    },
  },
});

export const {
  setToDoLists,
  addListTask,
  deleteListTask,
  changeNameListTasks,
} = listTasksSlice.actions;
export default listTasksSlice.reducer;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import listTasksReducer from "./listTasksSlice";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  listTasks: listTasksReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

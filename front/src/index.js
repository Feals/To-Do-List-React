import { Provider } from "react-redux";

import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import ToDoList from "./components/pages/ToDoList";

import store from "./store";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/toDoList/:id",
    element: <ToDoList />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

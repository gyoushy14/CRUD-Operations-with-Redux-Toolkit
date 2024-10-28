import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./features/taskSlice";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <div style={{ padding: "20px" }}>
        <div className=" bg-slate-100 p-5 rounded-2xl">
        <h1 className=" font-semibold text-2xl">Task Management App</h1>
        </div>

        <br /><br />
        <TaskForm />
        <TaskList />
      </div>
      
    </Provider>
  );
};

export default App;

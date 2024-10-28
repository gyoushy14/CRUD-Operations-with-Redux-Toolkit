import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTaskFromFirebase, updateTaskInFirebase } from "../features/taskSlice";
import EditTaskForm from "./EditTaskForm";
import { debounce } from "lodash";

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  // Debounced version of the search function
  const debouncedFetchTasks = debounce(() => {
    dispatch(fetchTasks());
  }, 300);

  useEffect(() => {
    debouncedFetchTasks();
    return debouncedFetchTasks.cancel; // Clean up on unmount
  }, [dispatch]);

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = (data) => {
    dispatch(updateTaskInFirebase(data));
    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  if (loading) return <h2 className="text-center text-3xl my-5">Loading...</h2>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((task) => (selectedPriority ? task.priority === selectedPriority : true));

  const tasksByState = {
    todo: filteredTasks.filter((task) => task.state === "todo"),
    doing: filteredTasks.filter((task) => task.state === "doing"),
    done: filteredTasks.filter((task) => task.state === "done"),
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-2xl rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Search Tasks</h2>

      <input
        type="text"
        placeholder="Search by Task Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      />

      <select
        value={selectedPriority}
        onChange={(e) => setSelectedPriority(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <hr className="my-3 border border-zinc-600 rounded-3xl" />

      <h2 className="text-2xl text-center font-bold my-4">Kanban Board</h2>

      <div className="flex justify-between">
        {Object.keys(tasksByState).map((state) => (
          <div key={state} className="bg-gray-100 rounded-lg p-4 w-1/3 mr-4">
            <h3 className="text-xl font-semibold mb-2 capitalize">{state}</h3>
            {tasksByState[state].length === 0 ? (
              <p>No tasks available</p>
            ) : (
              tasksByState[state].map((task) => (
                <div key={task.id} className="p-4 mb-4 border border-gray-300 bg-white rounded-lg shadow-sm">
                  {editingTask?.id === task.id ? (
                    <EditTaskForm
                      task={editingTask}
                      onUpdate={handleUpdate}
                      onCancel={handleCancel}
                    />
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold my-2">{task.title}</h3>
                      <div className="flex justify-center items-center">
                        <img src={task.image} alt={task.title} className="w-80 rounded-lg mb-2" />
                      </div>
                      <p className="text-gray-700">{task.description}</p>
                      <p className="text-gray-600">Priority: {task.priority}</p>
                      <p className="text-gray-600">Status: {task.state}</p>
                      <div className="mt-4">
                        <button
                          onClick={() => dispatch(deleteTaskFromFirebase(task.id))}
                          className="mr-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(task)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

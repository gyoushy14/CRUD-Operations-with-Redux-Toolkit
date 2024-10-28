import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { ref, set } from "firebase/database";
import { addTask } from "../features/taskSlice";
import { db } from "../../firebase"; // استيراد إعداد Firebase

const schema = yup.object().shape({
  imageUrl: yup.string().optional(), // حقل الصورة كـ URL (اختياري)
  imageFile: yup.mixed().optional(), // حقل الصورة كملف (اختياري)
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  priority: yup.string().required("Priority is required"),
  state: yup.string().required("State is required"),
});

const TaskForm = () => {
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(""); // عرض الصورة
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const saveToLocalStorage = useCallback((task) => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, []);

  const loadFromLocalStorage = useCallback(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => dispatch(addTask(task)));
  }, [dispatch]);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const onSubmit = async (data) => {
    const imageSrc = imagePreview || data.imageUrl; // استخدام رابط الصورة النهائي
    const newTask = {
      id: Date.now(),
      ...data,
      image: imageSrc, // تعيين الصورة النهائية
    };

    const taskRef = ref(db, "/tasks/" + newTask.id);
    try {
      await set(taskRef, newTask);
      console.log("Task added successfully!");
      dispatch(addTask(newTask));
      saveToLocalStorage(newTask);
    } catch (e) {
      console.error("Error adding task: ", e);
    }
  };

  // متابعة تغيير حقل الملف لتحديث `imagePreview`
  const watchImageFile = watch("imageFile");
  useEffect(() => {
    if (watchImageFile && watchImageFile.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result); // تعيين المعاينة
      reader.readAsDataURL(watchImageFile[0]);
    }
  }, [watchImageFile]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Task</h2>

      <div>
        <input
          {...register("imageUrl")}
          placeholder="Enter Image URL"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="my-2 font-semibold">
        <p>OR</p>
      </div>

      <div className="mb-4">
        <input
          type="file"
          {...register("imageFile")}
          accept="image/*"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.imageFile && (
          <p className="text-red-500 text-sm">{errors.imageFile.message}</p>
        )}
      </div>

      {imagePreview && (
        <div className="mb-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="mb-4">
        <input
          {...register("title")}
          placeholder="Title"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-4">
        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          rows="4"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="mb-4">
        <select
          {...register("priority")}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && (
          <p className="text-red-500 text-sm">{errors.priority.message}</p>
        )}
      </div>

      <div className="mb-4">
        <select
          {...register("state")}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">Select State</option>
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        {errors.state && (
          <p className="text-red-500 text-sm">{errors.state.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;

import React, { useState, useEffect, useCallback } from "react";

const EditTaskForm = React.memo(({ task, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    state: "todo",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        state: task.state,
        image: task.image,
      });
      setImagePreview(task.image);
    }
  }, [task]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...task, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Title"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Description"
        rows="2"
      />
      <input
        type="text"
        name="imageUrl"
        value={formData.image}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Image URL"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      {imagePreview && (
        <div className="mb-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        name="state"
        value={formData.state}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="todo">Todo</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
});

export default EditTaskForm;

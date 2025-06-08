import React, { useState, useEffect } from 'react';
import TaskTable from './components/TaskTable';
import { getTasks, addTask, deleteTask, toggleTask } from './api';
import { Task } from './types/Task';
import './App.css'; // Make sure this is imported
import pencilIcon from './pencil.svg'; // Assuming you put an icon named pencil.png in src/

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState(''); // State for deadline

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await getTasks();
    setTasks(fetchedTasks);
  };

  const handleAddTask = async () => {
    if (newTaskTitle.length <= 10) {
      alert('Task must be longer than 10 characters.');
      return;
    }
    if (tasks.some((task) => task.title === newTaskTitle)) {
      alert('Task already exists.');
      return;
    }

    const taskToAdd: Partial<Task> = {
        title: newTaskTitle,
        isDone: false,
        deadline: newTaskDeadline || undefined // Add deadline if present, otherwise undefined
    };

    await addTask(taskToAdd);
    setNewTaskTitle('');
    setNewTaskDeadline(''); // Clear deadline input after adding
    fetchTasks();
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleToggleTask = async (id: number) => {
    await toggleTask(id);
    fetchTasks();
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Make sure you have a pencil.png in your src folder or replace with an SVG/another icon */}
        <img src={pencilIcon} className="App-logo" alt="pencil icon" />
        ToDo App
      </header>

      {/* Task Input Section */}
      <div className="task-input-section">
        <input
          type="text"
          placeholder="Task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type="date"
          value={newTaskDeadline}
          onChange={(e) => setNewTaskDeadline(e.target.value)}
        />
        <button onClick={handleAddTask}>➕ Add Task</button>
      </div>

      {/* This section now contains the TaskTable which has its own search/filter */}
      <TaskTable
        tasks={tasks}
        onDelete={handleDeleteTask}
        onToggle={handleToggleTask}
      />
    </div>
  );
}

export default App;
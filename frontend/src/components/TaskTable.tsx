import React, { useState } from "react";
import { Task } from "../types/Task";

// Props accepted by the component
interface Props {
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

// Helper to format date as "dd MMM YYYY"
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Reusable component that displays the task list in a table with filter and search
export default function TaskTable({ tasks, onDelete, onToggle }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'completed'

  // Filter and search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !task.isDone) ||
      (filter === "completed" && task.isDone);
    return matchesSearch && matchesFilter;
  });

  // If no tasks exist, show a friendly message
  if (tasks.length === 0 && searchTerm === "" && filter === "all") {
    return <p className="no-tasks-message">No to-do task list available. Add a new task above!</p>;
  }

  return (
    <div>
      {/* Search input and filter buttons */}
      <div className="filter-section"> {/* Use new class for centering */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task table */}
      {filteredTasks.length === 0 ? (
        <p className="no-tasks-message">No tasks found matching your criteria.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Done</th>
              <th>Title</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                const taskDeadline = task.deadline ? new Date(task.deadline) : null;
                if (taskDeadline) {
                    taskDeadline.setHours(0, 0, 0, 0);
                }

                const isOverdue = taskDeadline && taskDeadline < now && !task.isDone;

                let rowClass = "";
                if (task.isDone) {
                    rowClass = "task-completed";
                } else if (isOverdue) {
                    rowClass = "task-overdue";
                } else {
                    rowClass = "task-pending";
                }

                return (
                    <tr key={task.id} className={rowClass}>
                        <td>
                            <input
                            type="checkbox"
                            checked={task.isDone}
                            onChange={() => onToggle(task.id)}
                            />
                        </td>
                        <td>{task.title}</td>
                        <td>{formatDate(task.deadline)}</td>
                        <td>
                            <button onClick={() => onDelete(task.id)}>🗑️ Delete</button>
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
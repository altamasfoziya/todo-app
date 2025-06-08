import { Task } from "./types/Task";

// Base URL of the backend API
const API_BASE = "http://localhost:5026/api/todos";

// Fetch all tasks from the backend
export const getTasks = async (): Promise<Task[]> => {
    try {
        const response = await fetch(API_BASE);
        return response.json(); // Convert response to JSON array
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Add a new task (title and optional deadline)
export const addTask = async (task: Partial<Task>) => {
    try {
        const response = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        return response.json(); // Return the newly created task
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Delete task by ID
export const deleteTask = async (id: number) => {
    try {
        await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Toggle task completion status
export const toggleTask = async (id: number) => {
    try {
        await fetch(`${API_BASE}/${id}/toggle`, { method: "PUT" });
    } catch (error) {
        console.error(error);
        return [];
    }
};
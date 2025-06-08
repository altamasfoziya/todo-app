// This defines the structure of a Task object used in the app
export interface Task {
  id: number;           // Unique identifier for the task
  title: string;        // Title or description of the task
  isDone: boolean;      // Boolean flag to show if task is completed
  deadline?: string;    // Optional due date (ISO date string)
}
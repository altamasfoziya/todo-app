namespace ToDoApp.Api.Models
{
    // Represents a single ToDo task
    public class TodoItem
    {
        public int Id { get; set; } // Primary Key
        public string Title { get; set; } = string.Empty; // Task title (min 10 chars)
        public DateTime? Deadline { get; set; } // Optional due date
        public bool IsDone { get; set; } = false; // Task completion status
    }
}
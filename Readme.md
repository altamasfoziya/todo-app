# 📝 Fullstack ToDo App

A simple fullstack ToDo list application built using:
- 🧠 **.NET 8 Web API** (C#)
- 🎨 **React with TypeScript**
- 🧪 **XUnit Tests** for backend
- 💾 **EF Core In-Memory Database** for demo persistence

---

## 📁 Project Structure
```
todo-app/
├── backend/
│   ├── ToDoApp.Api/         # ASP.NET Core Web API
│   ├── ToDoApp.Tests/       # XUnit-based backend tests
│   ├── ToDoApp.sln          # Backend solution file
├── frontend/                # React + TypeScript frontend
├── README.md
└── .gitignore
```

---

## 🚀 Frontend Overview (React + TypeScript)

### ✅ Features:
- Add new tasks with validation (minimum 10 characters)
- Optional deadline support
- Search and filter tasks (all / pending / completed)
- Tasks are shown in a table with visual deadline indicators:
  - ✅ Green for done
  - ⏰ Red for overdue
- Toggle completion status
- Delete tasks

### 📂 Location: `frontend/`

### 📦 Run Locally:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Backend Overview (.NET 8 Web API)

### ✅ Features:
- CRUD operations on tasks
- Validation for task title length
- In-memory DB using EF Core (no external setup needed)
- Simple model with:
  - `Id` (int)
  - `Title` (string, required)
  - `Deadline` (optional DateTime)
  - `IsDone` (bool)

### 📂 Location: `backend/ToDoApp.Api`

### ▶ Run Locally:
```bash
cd backend
# Run API at http://localhost:5026
dotnet run --project ToDoApp.Api
```

---

## 🧪 Backend Test Coverage

### 📂 Location: `backend/ToDoApp.Tests`

### ✅ Tested Scenarios:
- ✔ GET: Retrieve all tasks
- ✔ POST: Create valid task
- ❌ POST: Reject short titles
- ✔ POST: Accept null deadline
- ✔ PUT: Toggle task (IsDone)
- ❌ PUT: Toggle non-existent task (404)
- ✔ DELETE: Remove task
- ❌ DELETE: Handle invalid ID

### ▶ Run Tests:
```bash
cd backend
dotnet test ToDoApp.sln
```

> Code coverage tools like `coverlet` are configured in the `.csproj`. Reports are written to `TestResults/coverage.xml`.

---

## 🔍 Creating the Solution File (Optional but Recommended)

```bash
cd backend
# Build all backend projects
dotnet build ToDoApp.sln

# Run all backend tests with coverage
dotnet test ToDoApp.sln
```
```bash
dotnet build ToDoApp.sln
dotnet test ToDoApp.sln
```

---

## 🌐 API Endpoint Summary
| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | `/api/todos`       | Fetch all tasks           |
| POST   | `/api/todos`       | Create new task           |
| PUT    | `/api/todos/{id}/toggle` | Toggle task completion |
| DELETE | `/api/todos/{id}`  | Delete task               |

---

## 🔒 CORS
CORS is enabled for all origins/methods in development:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
```

---

## ✅ Summary
This app demonstrates how to:
- Build a fullstack app with modern technologies
- Validate and persist tasks in memory
- Add robust backend testing
- Maintain clean modular code (React + C#)

🧠 Use this as a starter for production apps by switching to a real DB (e.g., SQLite, PostgreSQL).

---

## 📌 Author
Built with ❤️ by Altamas.

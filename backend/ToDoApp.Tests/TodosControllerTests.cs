// File: TodosControllerTests.cs
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using ToDoApp.Api.Controllers;
using ToDoApp.Api.Models;
using ToDoApp.Api.Data;

namespace ToDoApp.Tests
{
    public class TodosControllerTests
    {
        private TodoContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<TodoContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new TodoContext(options);
        }

        [Fact]
        public async Task GetAll_ReturnsAllTasks()
        {
            var context = GetInMemoryDbContext();
            context.TodoItems.Add(new TodoItem { Title = "Test Task 1" });
            context.TodoItems.Add(new TodoItem { Title = "Test Task 2" });
            await context.SaveChangesAsync();

            var controller = new TodosController(context);
            var result = await controller.GetAll();

            Assert.Equal(2, result.Value.Count());
        }

        [Fact]
        public async Task Create_RejectsShortTitle()
        {
            var controller = new TodosController(GetInMemoryDbContext());
            var result = await controller.Create(new TodoItem { Title = "short" });

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Create_AddsValidTask()
        {
            var context = GetInMemoryDbContext();
            var controller = new TodosController(context);

            var result = await controller.Create(new TodoItem { Title = "This is a valid task" });

            Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Single(context.TodoItems);

            var created = (result.Result as CreatedAtActionResult)?.Value as TodoItem;
            Assert.NotNull(created);
            Assert.Equal("This is a valid task", created?.Title);
        }

        [Fact]
        public async Task Create_AllowsOptionalDeadline()
        {
            var context = GetInMemoryDbContext();
            var controller = new TodosController(context);

            var result = await controller.Create(new TodoItem {
                Title = "Deadline test",
                Deadline = null
            });

            var created = (result.Result as CreatedAtActionResult)?.Value as TodoItem;
            Assert.Null(created?.Deadline);
        }

        [Fact]
        public async Task Toggle_TogglesIsDone()
        {
            var context = GetInMemoryDbContext();
            var todo = new TodoItem { Title = "Toggle me", IsDone = false };
            context.TodoItems.Add(todo);
            await context.SaveChangesAsync();

            var controller = new TodosController(context);
            var toggleResult = await controller.Toggle(todo.Id);
            var updated = context.TodoItems.First();

            Assert.True(updated.IsDone);
        }

        [Fact]
        public async Task Toggle_ReturnsNotFound_WhenIdInvalid()
        {
            var controller = new TodosController(GetInMemoryDbContext());
            var result = await controller.Toggle(999);
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Delete_RemovesTask()
        {
            var context = GetInMemoryDbContext();
            var task = new TodoItem { Title = "Delete me" };
            context.TodoItems.Add(task);
            await context.SaveChangesAsync();

            var controller = new TodosController(context);
            var result = await controller.Delete(task.Id);

            Assert.IsType<NoContentResult>(result);
            Assert.Empty(context.TodoItems);
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenIdInvalid()
        {
            var controller = new TodosController(GetInMemoryDbContext());
            var result = await controller.Delete(999);
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
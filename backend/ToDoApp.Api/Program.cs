using Microsoft.EntityFrameworkCore;
using ToDoApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔒 Fix the ports (HTTP: 5026, HTTPS: 5027)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5026); // HTTP
    serverOptions.ListenAnyIP(5027, listenOptions =>
    {
        listenOptions.UseHttps(); // HTTPS
    });
});


// Register EF Core with in-memory database
builder.Services.AddDbContext<TodoContext>(options =>
    options.UseInMemoryDatabase("TodoDb"));

// Register controller services (API)
builder.Services.AddControllers();

// Register Swagger for API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 👇 Add this CORS config BEFORE calling builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddControllers(); // or services if using MVC
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 👇 Use the policy BEFORE routing
app.UseCors("AllowAll");

// Enable Swagger UI in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Optional: force HTTPS if available

app.UseAuthorization();

// Map controller endpoints like [Route("api/todos")]
app.MapControllers();

app.Run();
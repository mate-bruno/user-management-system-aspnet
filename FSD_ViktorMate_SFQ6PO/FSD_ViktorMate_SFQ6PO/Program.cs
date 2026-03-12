using FSD_ViktorMate_SFQ6PO.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// IoC setup
builder.Services.AddDbContext<UserDbContext>();
builder.Services.AddScoped<IUserRepository, UserRepository>();


var app = builder.Build();

app.UseCors("AllowVSCodeFrontend");
app.UseCors(x => x
    .AllowCredentials()
    .AllowAnyMethod()
    .AllowAnyHeader()
    .WithOrigins("http://localhost:5500",
                 "http://127.0.0.1:5500"));

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

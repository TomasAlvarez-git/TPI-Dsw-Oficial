using Dsw2025Tpi.Api.Helpers;
using Dsw2025Tpi.Application.Helpers;
using Dsw2025Tpi.Application.Services;
using Dsw2025Tpi.Data;
using Dsw2025Tpi.Data.Helpers;
using Dsw2025Tpi.Data.Repositories;
using Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Domain.Interfaces;
using Dsw2025Tpi.Api.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog.Extensions.Logging;
using System.Text;

namespace Dsw2025Tpi.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddLoggingService(builder.Configuration); // Configura el servicio de logging

        // Agrega servicios b�sicos para controladores
        builder.Services.AddControllers();

        // Agrega servicios para documentar la API (Swagger/OpenAPI)
        builder.Services.AddEndpointsApiExplorer();

        // Configura Swagger para documentar la API y definir el esquema de seguridad
        builder.Services.AddSwaggerDocumentation();

        // Agrega soporte para health checks
        builder.Services.AddHealthChecks();

        // Configura la autenticaci�n y autorizaci�n con JWT
        builder.Services.AddAuthenticationAndAuthorization(builder.Configuration);

        // Configuraci�n de la base de datos y el contexto
        builder.Services.AddDbContexts(builder.Configuration);
        
        // Inyecci�n de dependencias para servicios y repositorios
        builder.Services.AddAplicationServices();

        // Pol�tica CORS para permitir frontend en localhost:3000
        builder.Services.AddCustomCors();

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<Dsw2025TpiContext>();
                
                // Asegura que la BD exista y carga datos si es necesario
                context.Database.EnsureCreated(); 
                
                // Ejecuta la carga de datos desde los JSON
                context.Seedwork<Customer>("Sources\\customers.json");
                context.Seedwork<Product>("Sources\\products.json");
                context.Seedwork<Order>("Sources\\orders.json");
                context.Seedwork<OrderItem>("Sources\\orderitems.json");
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Ocurrió un error durante el seeding de la base de datos.");
            }
        }

        // Middleware para entorno de desarrollo: habilita Swagger
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Middlewares
        app.UseCustomMiddlewares();

        // Mapeo de los controladores a rutas HTTP
        app.MapControllers();

        // Endpoint para health check
        app.MapHealthChecks("/healthcheck");

        // Inicia la aplicaci�n
        app.Run();
    }
}


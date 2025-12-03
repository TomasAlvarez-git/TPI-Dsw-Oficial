using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Services;
using Dsw2025Tpi.Data;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Dsw2025Tpi.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JwtTokenService _jwtTokenService;
        private readonly Dsw2025TpiContext _context;

        public AuthenticateController(UserManager<IdentityUser> userManager,
                                      SignInManager<IdentityUser> signInManager,
                                      JwtTokenService jwtTokenService,
                                      RoleManager<IdentityRole> roleManager,
                                      Dsw2025TpiContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
            _roleManager = roleManager;
            _context = context;
        }

        // Endpoint para login de usuario (POST /api/auth/login)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel request)
        {
            // Buscar el usuario por nombre
            var user = await _userManager.FindByNameAsync(request.Username);
            
            if (user == null) 
            {
                 throw new UnauthorizedException("Usuario o contraseña incorrectos");
            }

            // Verificar la contraseña del usuario
            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
            {
                throw new UnauthorizedException("Usuario o contraseña incorrectos");
            }

            // Obtener los roles asociados al usuario
            var roles = await _userManager.GetRolesAsync(user);
            var userRole = roles.FirstOrDefault() ?? "Customer"; 

            // CAMBIO: Pasamos el user.Email al servicio de tokens
            // El email viene de la base de datos (user.Email), no del request (por si el usuario loguea con Username)
            var token = _jwtTokenService.GenerateToken(request.Username, user.Email, userRole);

            // Devolver el token al cliente
            return Ok(new { token, role = userRole });
        }

    [HttpPost("registerAdmin")]
    public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Email))
            throw new BadRequestException("El nombre de usuario y el email son obligatorios.");

        var existingUserByEmail = await _userManager.FindByEmailAsync(model.Email);
        if (existingUserByEmail != null)
            throw new BadRequestException("Ya existe un usuario registrado con ese email.");

        var existingUserByUsername = await _userManager.FindByNameAsync(model.Username);
        if (existingUserByUsername != null)
            throw new BadRequestException("El nombre de usuario ya está en uso.");

        // ✅ AGREGADO: asignar PhoneNumber
        var user = new IdentityUser
        {
            UserName = model.Username,
            Email = model.Email,
            PhoneNumber = model.PhoneNumber   // ← ESTA ERA LA CLAVE
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BadRequestException(errors);
        }

        var roleResult = await _userManager.AddToRoleAsync(user, "Admin");

        if (!roleResult.Succeeded)
        {
            var errors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
            throw new BadRequestException(errors);
        }

        return Ok("Usuario registrado correctamente con rol de administrador.");
    }


        [HttpPost("registerCustomer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Email))
                throw new BadRequestException("El nombre de usuario y el email son obligatorios.");

            var existingUserByEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingUserByEmail != null)
                throw new BadRequestException("Ya existe un usuario registrado con ese email."); 

            var existingUserByUsername = await _userManager.FindByNameAsync(model.Username);
            if (existingUserByUsername != null)
                throw new BadRequestException("El nombre de usuario ya está en uso.");

            var user = new IdentityUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new BadRequestException(errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, "Customer");
            if (!roleResult.Succeeded)
            {
                var errors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
                throw new BadRequestException(errors);
            }

            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                Name = model.Username,
                Email = model.Email,
                Phone = model.PhoneNumber,
                UserEmail = model.Email 
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado correctamente con rol de cliente.");
        }
    }
}
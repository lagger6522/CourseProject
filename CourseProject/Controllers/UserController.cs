using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using CourseProject.Model;
using Store.Domain.Model;

namespace Store.controllers
{
	public class UserController : Controller
	{

		private readonly QueuedbContext _context;

		public UserController(QueuedbContext context)
		{
			_context = context;
		}


		[Authorize]
		[HttpGet]
		public IActionResult Check()
		{
			if (User.Identity == null || !User.Identity.IsAuthenticated) return Problem("Пользователь не авторизован.");
			var claim = User.Claims.FirstOrDefault(n => n.Type == "ClaimTypes.UserId");
			if (claim == null)
				return Problem("Пользователь не авторизован.");
			int UserId = -1;
			if (int.TryParse(claim.Value, out UserId))
			{
				var user = _context.Users.FirstOrDefault(u => u.UserId == UserId);
				if (user == null)
					return Problem("Пользователя не существует");
				return Ok(new { role = user.Role, email = user.Email, userId = user.UserId });
			}
			return Problem("Пользователь не авторизован.");
		}

		[Authorize]
		[HttpPost]
		public async Task<IActionResult> singOut()
		{
			await HttpContext.SignOutAsync();
			
			return Ok();
		}

		[HttpPost]
		public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
		{
			
			var user = _context.Users.FirstOrDefault(u => u.Email == model.Email && u.Password == HashPassword(model.Password));

			if (user == null)
			{
				return Unauthorized(new { message = "Неправильные email или пароль." });
			}

			var token = GenerateToken(user);
			
			ClaimsIdentity identity = new ClaimsIdentity(new Claim[]
			{
				new Claim("ClaimTypes.UserId", user.UserId.ToString()),
				new Claim(ClaimTypes.Role, user.Role),
			},
			CookieAuthenticationDefaults.AuthenticationScheme);
			ClaimsPrincipal principal = new ClaimsPrincipal(identity);
			await HttpContext.SignInAsync(
			  CookieAuthenticationDefaults.AuthenticationScheme, principal);
			return Ok(new { token, role = user.Role, userId = user.UserId });
		}

		private string GenerateToken(User user)
		{
			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes("SecretKey-%666666666%");
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
				new Claim("ClaimTypes.UserId", user.UserId.ToString()),
					new Claim(ClaimTypes.Role, user.Role),
				}),
				Expires = DateTime.UtcNow.AddDays(1), // Время жизни токена
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};
			var token = tokenHandler.CreateToken(tokenDescriptor);
			return tokenHandler.WriteToken(token);
		}

		[HttpPost]
		public async Task<IActionResult> Register([FromBody] RegisterModel model)
		{
			// Проверка, не существует ли уже пользователь с таким email
			if (_context.Users.Any(u => u.Email == model.Email))
			{
				// Добавьте отладочный вывод, чтобы увидеть, какие email уже существуют
				Console.WriteLine($"Пользователь с email '{model.Email}' уже существует.");

				ModelState.AddModelError("Email", "Пользователь с таким email уже существует.");
				return Problem("Пользователь с таким email уже существует.");
			}

			// Создание нового пользователя
			var user = new User
			{
				Email = model.Email,
				Password = HashPassword(model.Password)
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return Json(new { message = "Регистрация успешна." });
		}


		private string HashPassword(string password)
		{
			return password;
		}

		public async Task<IEnumerable<User>> GetUsersAsync()
		{
			return await _context.Users.ToListAsync();
		}
	}
}	

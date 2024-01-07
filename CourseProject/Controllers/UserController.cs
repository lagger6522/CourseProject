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
using System.Numerics;

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
				Password = HashPassword(model.Password),
				FirstName = model.FirstName,
				LastName = model.LastName,
				MiddleName = model.MiddleName
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return Json(new { message = "Регистрация успешна." });
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<ChiefDoctorModel>>> GetAllChiefDoctors()
		{
			return await _context.Users
				.Where(u => u.Role == "Chief Medical Officer")
				.Select(u => new ChiefDoctorModel
				{
					FirstName = u.FirstName,
					LastName = u.LastName,
					MiddleName = u.MiddleName,
					Email = u.Email
				})
				.ToListAsync();
		}

		[HttpPost]
		public async Task<IActionResult> UpdateChiefDoctor([FromBody] ChiefDoctorUpdateModel model)
		{
			var chiefDoctor = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.OriginalEmail);

			if (chiefDoctor == null)
			{
				return NotFound();
			}

			chiefDoctor.FirstName = model.FirstName;
			chiefDoctor.LastName = model.LastName;
			chiefDoctor.MiddleName = model.MiddleName;
			chiefDoctor.Email = model.Email;

			try
			{
				await _context.SaveChangesAsync();
				return Ok(new { message = "Данные главврача обновлены успешно." });
			}
			catch (DbUpdateConcurrencyException)
			{
				return BadRequest("Ошибка при сохранении данных.");
			}
		}

		[HttpPost]
		public async Task<IActionResult> DeleteChiefDoctor(string email)
		{
			try
			{
				var chiefDoctor = await _context.Users
					.FirstOrDefaultAsync(u => u.Email == email && u.Role == "Chief Medical Officer");

				if (chiefDoctor == null)
				{
					return NotFound("Главврач не найден.");
				}

				_context.Users.Remove(chiefDoctor);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Главврач успешно удален." });
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
			}
		}

		[HttpPost]
		public async Task<IActionResult> AddDoctor([FromBody] DoctorRegisterModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (_context.Users.Any(u => u.Email == model.Email))
			{
				ModelState.AddModelError("Email", "User with this email already exists.");
				return BadRequest(ModelState);
			}

			var doctor = new User
			{
				Email = model.Email,
				Password = HashPassword(model.Password),
				FirstName = model.FirstName,
				LastName = model.LastName,
				MiddleName = model.MiddleName,
				Role = "Doctor",
				Specialization = model.Specialization
			};

			_context.Users.Add(doctor);
			await _context.SaveChangesAsync();

			return Json(new { message = "Doctor added successfully." });
		}

		[HttpDelete]
		public async Task<IActionResult> DeleteDoctor(string email)
		{
			var doctor = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Role == "Doctor");

			if (doctor == null)
			{
				return NotFound(new { message = "Doctor not found." });
			}

			try
			{
				_context.Users.Remove(doctor);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Doctor deleted successfully." });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
			}
		}

		[HttpGet]
		public IActionResult GetDoctors()
		{
			try
			{
				var doctors = _context.Users
					.Where(u => u.Role == "Doctor")
					.Select(u => new
					{
						UserId = u.UserId,
						FirstName = u.FirstName,
						LastName = u.LastName,
						MiddleName = u.MiddleName,
						Email = u.Email,
						Specialization = u.Specialization
					})
					.ToList();

				if (doctors.Any())
				{
					Console.WriteLine("Doctors:", doctors);
					return Ok(doctors);
				}
				else
				{
					Console.WriteLine("No doctors found.");
					return NotFound("No doctors found.");
				}
			}
			catch (Exception ex)
			{
				// Log the exception or handle it as needed
				Console.Error.WriteLine($"Error retrieving doctors: {ex.Message}");
				return StatusCode(500, "Internal Server Error");
			}
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

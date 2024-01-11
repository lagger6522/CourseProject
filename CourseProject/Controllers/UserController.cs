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
using CourseProject.Utils;

namespace Store.controllers
{
	public class UserController : Controller
	{

		private readonly QueuedbContext _context;
		private static Dictionary<string, (string code, DateTime expireTime)> codes = new Dictionary<string, (string code, DateTime expireTime)>();
		private static Random random = new Random();

		public UserController(QueuedbContext context)
		{
			_context = context;
        }

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
                return Json(new { role = user.Role, email = user.Email, user.FirstName, user.LastName, user.MiddleName, user.Specialization, userId = user.UserId, hospitalId = user.HospitalId });
            }
			return Problem("Пользователь не авторизован.");
		}

		[Authorize]
		[HttpPost]
		public async Task<IActionResult> singOut()
		{
			await HttpContext.SignOutAsync();
			
			return Json(new { });
		}

		[HttpPost]
		public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
		{
			
			var user = _context.Users.FirstOrDefault(u => u.Email == model.Email && u.Password == HashPassword(model.Password));

			if (user == null)
			{
				return Unauthorized(new { message = "Неправильные email или пароль." });
			}

			//var token = GenerateToken(user);
			
			ClaimsIdentity identity = new ClaimsIdentity(new Claim[]
			{
				new Claim("ClaimTypes.UserId", user.UserId.ToString()),
				new Claim(ClaimTypes.Role, user.Role),
			},
			CookieAuthenticationDefaults.AuthenticationScheme);
			ClaimsPrincipal principal = new ClaimsPrincipal(identity);
			await HttpContext.SignInAsync(
			  CookieAuthenticationDefaults.AuthenticationScheme, principal);
			return Json(new { role = user.Role, email=user.Email, user.FirstName, user.LastName, user.MiddleName, user.Specialization, userId = user.UserId, hospitalId = user.HospitalId });
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
		public IActionResult GetAllChiefDoctors()
		{
			var chiefDoctors = _context.Users
				.Where(u => u.Role == "Chief Medical Officer")
				.Select(u => new
				{
					u.Email,
					u.FirstName,
					u.LastName,
					u.MiddleName,
					u.HospitalId
				})
				.ToList();

			return Ok(chiefDoctors);
		}

		[HttpPost]
		public async Task<IActionResult> UpdateChiefDoctor([FromBody] ChiefDoctorUpdateModel model)
		{
			var existingDoctor = _context.Users.FirstOrDefault(u => u.Email == model.OriginalEmail && u.Role == "Chief Medical Officer");

			if (existingDoctor == null)
			{
				return NotFound(new { message = "Главврач не найден" });
			}

			// Проверка уникальности почты (если email изменился)
			if (model.Email != model.OriginalEmail && _context.Users.Any(u => u.Email == model.Email))
			{
				return BadRequest(new { message = "Пользователь с таким адресом электронной почты уже существует" });
			}

			// Проверка, что для данной больницы нет уже главврача
			if (model.HospitalId != existingDoctor.HospitalId && _context.Users.Any(u => u.HospitalId == model.HospitalId && u.Role == "Chief Medical Officer"))
			{
				return BadRequest(new { message = "Для этой больницы уже существует главврач" });
			}

			existingDoctor.FirstName = model.FirstName;
			existingDoctor.LastName = model.LastName;
			existingDoctor.MiddleName = model.MiddleName;
			existingDoctor.Email = model.Email;
			existingDoctor.HospitalId = model.HospitalId;

			await _context.SaveChangesAsync();

			return Ok(new { message = "Данные главврача успешно изменены" });
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

			var chiefDoctor = await _context.Users.SingleOrDefaultAsync(u => u.Role == "Chief Medical Officer" && u.HospitalId == model.HospitalId);

			if (chiefDoctor == null)
			{
				ModelState.AddModelError("HospitalID", "Chief Medical Officer for the specified hospital not found.");
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
				Specialization = model.Specialization,
				HospitalId = chiefDoctor.HospitalId
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

				return Ok(doctors);

			}
			catch (Exception ex)
			{
				Console.Error.WriteLine($"Error retrieving doctors: {ex.Message}");
				return StatusCode(500, "Internal Server Error");
			}
		}

		[HttpPost]
		public IActionResult AddChiefDoctor([FromBody] ChiefDoctorModel model)
		{
			try
			{
				var hospital = _context.Hospitals.Find(model.HospitalId);
				if (hospital == null)
				{
					return NotFound("Больница не найдена");
				}

				if (_context.Users.Any(u => u.Email == model.Email))
				{
					return BadRequest(new { message = "Пользователь с таким адресом электронной почты уже существует" });
				}

				if (_context.Users.Any(u => u.HospitalId == model.HospitalId && u.Role == "Chief Medical Officer"))
				{
					return BadRequest(new { message = "Для этой больницы уже существует главврач" });
				}

				var chiefDoctor = new User
				{
					FirstName = model.FirstName,
					LastName = model.LastName,
					MiddleName = model.MiddleName,
					Email = model.Email,
					Password = model.Password,
					Role = "Chief Medical Officer",
					HospitalId = model.HospitalId
				};

				_context.Users.Add(chiefDoctor);
				_context.SaveChanges();

				return Ok(new { message = "Главврач успешно добавлен" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
			}
		}

		[HttpGet]
		public ActionResult<IEnumerable<DoctorDto>> GetDoctorsByHospital(int hospitalId)
		{
			try
			{
				var doctors = _context.Users
					.Where(d => d.HospitalId == hospitalId && d.Role == "Doctor")
					.Select(d => new DoctorDto
					{
						UserId = d.UserId,
						FirstName = d.FirstName,
						LastName = d.LastName,
						Specialization = d.Specialization,
					})
					.ToList();

				return Ok(doctors);
			}
			catch (Exception ex)
			{
				return StatusCode(500, "Internal server error");
			}
		}

		[HttpGet]
		public ActionResult<DoctorDto> GetDoctorById(int userId)
		{
			try
			{
				var doctor = _context.Users
					.Where(u => u.UserId == userId && u.Role == "Doctor")
					.Select(u => new DoctorDto
					{
						UserId = u.UserId,
						FirstName = u.FirstName,
						LastName = u.LastName,
						Specialization = u.Specialization,
					})
					.SingleOrDefault();

				if (doctor == null)
				{
					return NotFound();
				}

				return Ok(doctor);
			}
			catch (Exception ex)
			{
				return StatusCode(500, "Internal server error");
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
        [HttpPost]
        public async Task<IActionResult> SendCodeToEmail(string email)
        {
            codes.Where(n => n.Value.expireTime < DateTime.Now)
                .ToList().ForEach(n => codes.Remove(n.Key));
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) return Json(new { error = $"Пользователь с таким email не существует" });
            string code = ((int)(Math.Floor(246 + random.NextDouble() * DateTime.Now.Ticks) % 1000000)).ToString();
            if (codes.ContainsKey(email))
            {
                codes[email] = (code, DateTime.Now.AddMinutes(5));
            }
            else
            {
                codes.Add(email, (code, DateTime.Now.AddMinutes(5)));
            }
            if (await MailWorker.SendMessage(email, "Код подтверждения", code))
            {
                return Json(new { message = $"На email {email} был отправлен код подтверждения" });
            }
            else
            {
                return Json(new { error = $"Не удалось отправить код на email {email}" });
            }
        }
        [HttpPost]
        public async Task<IActionResult> LoginByEmail(string email, string code)
        {
            codes.Where(n => n.Value.expireTime < DateTime.Now)
                .ToList().ForEach(n => codes.Remove(n.Key));
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) return Json(new { error = $"Пользователь с таким email не существует" });
            if (codes.ContainsKey(email))
            {
                if (codes[email].code == code)
                {
                    codes.Remove(email);
                    //var token = GenerateToken(user);

                    ClaimsIdentity identity = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("ClaimTypes.UserId", user.UserId.ToString()),
                        new Claim(ClaimTypes.Role, user.Role),
                    },
                    CookieAuthenticationDefaults.AuthenticationScheme);
                    ClaimsPrincipal principal = new ClaimsPrincipal(identity);
                    await HttpContext.SignInAsync(
                      CookieAuthenticationDefaults.AuthenticationScheme, principal);
                    return Json(new { role = user.Role, email = user.Email, user.FirstName, user.LastName, user.MiddleName, user.Specialization, userId = user.UserId, hospitalId = user.HospitalId });
                }
                return Json(new { error = $"Неверный код" });
            }
            return Json(new { error = $"Код устарел попробуйте снова" });
        }
    }
}	

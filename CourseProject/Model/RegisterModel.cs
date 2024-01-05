using System.ComponentModel.DataAnnotations;

namespace Store.Domain.Model
{
	public class RegisterModel
	{
		[Required(ErrorMessage = "Имя пользователя обязательно.")]
		public string Name { get; set; }

		[Required(ErrorMessage = "Фамилия пользователя обязательно.")]
		public string Surname { get; set; }

		[Required(ErrorMessage = "Отчество пользователя обязательно.")]
		public string Patronymic { get; set; }

		[Required(ErrorMessage = "Email обязателен.")]
		[EmailAddress(ErrorMessage = "Некорректный формат email.")]
		public string Email { get; set; }

		[Required(ErrorMessage = "Пароль обязателен.")]
		[MinLength(8, ErrorMessage = "Пароль должен содержать минимум 8 символов.")]
		public string Password { get; set; }
	}
}

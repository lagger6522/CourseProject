using System.ComponentModel.DataAnnotations;

namespace CourseProject.Model;

public class ChiefDoctorModel
{
	[Required(ErrorMessage = "Имя обязательно.")]
	public string FirstName { get; set; }

	[Required(ErrorMessage = "Фамилия обязательна.")]
	public string LastName { get; set; }

	[Required(ErrorMessage = "Отчество обязательно.")]
	public string MiddleName { get; set; }

	[Required(ErrorMessage = "Пароль обязателен.")]
	[MinLength(8, ErrorMessage = "Пароль должен содержать минимум 8 символов.")]
	public string Password { get; set; }

	[Required(ErrorMessage = "Email обязателен.")]
	[EmailAddress(ErrorMessage = "Некорректный формат email.")]
	public string Email { get; set; }

}

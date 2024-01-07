using System.ComponentModel.DataAnnotations;

namespace CourseProject.Model;

public class DoctorRegisterModel
{
	[Required(ErrorMessage = "Email is required.")]
	[EmailAddress(ErrorMessage = "Invalid email format.")]
	public string Email { get; set; }

	[Required(ErrorMessage = "Password is required.")]
	[MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
	public string Password { get; set; }

	[Required(ErrorMessage = "First Name is required.")]
	public string FirstName { get; set; }

	[Required(ErrorMessage = "Last Name is required.")]
	public string LastName { get; set; }

	[Required(ErrorMessage = "Middle Name is required.")]
	public string MiddleName { get; set; }

	[Required(ErrorMessage = "Specialization is required.")]
	public string Specialization { get; set; }
}


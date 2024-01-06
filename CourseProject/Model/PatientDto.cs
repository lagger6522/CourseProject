namespace CourseProject.Model;

public class PatientDto
{
	public string FirstName { get; set; } = null!;
	public string LastName { get; set; } = null!;
	public string MiddleName { get; set; } = null!;
	public DateTime BirthDate { get; set; }
	public string Gender { get; set; } = null!;
	public int UserId { get; set; }
}

using System.ComponentModel.DataAnnotations;

namespace CourseProject.Model;

public class ChiefDoctorUpdateModel
{
    public string OriginalEmail { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string MiddleName { get; set; }
    public string Email { get; set; }
    public int HospitalId { get; set; }
}


using System.ComponentModel.DataAnnotations;

namespace CourseProject.Model;

public class DoctorScheduleModel
{
	public string DayOfWeek { get; set; }
	public string StartTime { get; set; }
	public string EndTime { get; set; }
	public string LunchBreakStart { get; set; }
	public string LunchBreakEnd { get; set; }
}

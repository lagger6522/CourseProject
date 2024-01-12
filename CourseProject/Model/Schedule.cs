using System;
using System.Collections.Generic;

namespace CourseProject.Model;

public partial class Schedule
{
    public int ScheduleId { get; set; }

    public int DoctorId { get; set; }

    public string DayOfWeek { get; set; } = null!;

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public TimeSpan? LunchBreakStart { get; set; }

    public TimeSpan? LunchBreakEnd { get; set; }

    public virtual User Doctor { get; set; } = null!;

    public virtual ICollection<Talon> Talons { get; set; } = new List<Talon>();
}

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

namespace Store.controllers
{
	public class ScheduleController : Controller
	{

		private readonly QueuedbContext _context;

		public ScheduleController(QueuedbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<IActionResult> GetDoctorSchedule(int doctorId)
		{
			try
			{
				var doctorSchedule = await _context.Schedules
					.Where(s => s.DoctorId == doctorId)
					.Select(s => new
					{
						s.DayOfWeek,
						s.StartTime,
						s.EndTime,
						s.LunchBreakStart,
						s.LunchBreakEnd
					})
					.ToListAsync();

				return Ok(doctorSchedule);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpPost]
		public async Task<IActionResult> UpdateDoctorSchedule(int doctorId, List<DoctorScheduleModel> schedule)
		{
			try
			{
				var existingSchedule = await _context.Schedules
					.Where(s => s.DoctorId == doctorId)
					.ToListAsync();

				_context.Schedules.RemoveRange(existingSchedule);
				await _context.SaveChangesAsync();

				var newSchedule = schedule.Select(s => new Schedule
				{
					DoctorId = doctorId,
					DayOfWeek = s.DayOfWeek,
					StartTime = TimeSpan.Parse(s.StartTime),
					EndTime = TimeSpan.Parse(s.EndTime),
					LunchBreakStart = s.LunchBreakStart != null ? (TimeSpan?)TimeSpan.Parse(s.LunchBreakStart) : null,
					LunchBreakEnd = s.LunchBreakEnd != null ? (TimeSpan?)TimeSpan.Parse(s.LunchBreakEnd) : null
				}).ToList();

				_context.Schedules.AddRange(newSchedule);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Doctor schedule updated successfully." });
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}
	}
}	

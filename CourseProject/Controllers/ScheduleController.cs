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
					.ToListAsync();

				return Ok(doctorSchedule);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");
			}
		}

		[HttpPost]
		public async Task<IActionResult> UpdateDoctorSchedule(int doctorId, List<Schedule> updatedSchedule)
		{
			try
			{
				var existingSchedule = await _context.Schedules
					.Where(s => s.DoctorId == doctorId)
					.ToListAsync();

				// Удаляем старое расписание врача
				_context.Schedules.RemoveRange(existingSchedule);

				// Добавляем новое расписание
				updatedSchedule.ForEach(s => s.DoctorId = doctorId);
				_context.Schedules.AddRange(updatedSchedule);

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

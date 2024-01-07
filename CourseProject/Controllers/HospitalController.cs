using Microsoft.AspNetCore.Mvc;
using CourseProject.Model;
using Microsoft.EntityFrameworkCore;

namespace Store.controllers
{
	public class HospitalController : Controller
	{

		private readonly QueuedbContext _context;

		public HospitalController(QueuedbContext context)
		{
			_context = context;
		}

		[HttpPost]
		public async Task<IActionResult> UpdateHospital([FromBody] HospitalDto updatedHospital)
		{
			if (updatedHospital == null)
			{
				return BadRequest("Invalid hospital data");
			}

			var existingHospital = await _context.Hospitals
				.FirstOrDefaultAsync(h => h.ClinicName == updatedHospital.ClinicName);

			if (existingHospital == null)
			{
				return NotFound("Hospital not found");
			}

			existingHospital.City = updatedHospital.AddressCity;
			existingHospital.Street = updatedHospital.AddressStreet;
			existingHospital.HouseNumber = updatedHospital.AddressHouse;
			existingHospital.RegistrationNumber = updatedHospital.RegistrationNumber;
			existingHospital.WorkingHours = updatedHospital.Schedule;
			existingHospital.ClinicType = updatedHospital.Type;

			try
			{
				await _context.SaveChangesAsync();
				return Ok("Hospital updated successfully");
			}
			catch (DbUpdateException ex)
			{
				return StatusCode(500, $"Error updating hospital: {ex.Message}");
			}
		}

		[HttpGet]
		public async Task<IActionResult> GetAllHospitals()
		{
			var hospitals = await _context.Hospitals.Select(h => h.ClinicName).ToListAsync();
			return Ok(hospitals);
		}

		[HttpGet]
		public async Task<ActionResult<Hospital>> GetHospitalByClinicName(string clinicName)
		{
			var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.ClinicName == clinicName);

			if (hospital == null)
			{
				return NotFound();
			}

			return Ok(hospital);
		}

		[HttpPost]
		public async Task<IActionResult> AddHospital([FromBody] HospitalDto hospitalDto)
		{
			try
			{
				var hospital = new Hospital
				{
					ClinicName = hospitalDto.ClinicName,
					City = hospitalDto.AddressCity,
					Street = hospitalDto.AddressStreet,
					HouseNumber = hospitalDto.AddressHouse,
					RegistrationNumber = hospitalDto.RegistrationNumber,
					WorkingHours = hospitalDto.Schedule,
					ClinicType = hospitalDto.Type
				};

				_context.Hospitals.Add(hospital);
				await _context.SaveChangesAsync();

				return Ok(new { Message = "Hospital added successfully" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { Message = "Error adding hospital", Error = ex.Message });
			}
		}
	}
}	

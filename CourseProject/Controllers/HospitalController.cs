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

		[HttpDelete]
		public IActionResult DeleteHospital(int hospitalId)
		{
			var hospital = _context.Hospitals.FirstOrDefault(n => n.HospitalId == hospitalId);

			if (hospital == null)
			{
				return NotFound();
			}

			_context.Hospitals.Remove(hospital);
			_context.SaveChanges();

			return Ok(new { message = "Удалено." });
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
			var hospitals = await _context.Hospitals.ToListAsync();
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

		[HttpPost]
		public async Task<IActionResult> CheckDuplicate([FromBody] HospitalNameDto clinicNameDto)
		{
			try
			{
				bool isDuplicate = await _context.Hospitals.AnyAsync(h => h.ClinicName == clinicNameDto.ClinicName);
				return Ok(new { Duplicate = isDuplicate });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { Message = "Error checking duplicate", Error = ex.Message });
			}
		}

		[HttpPost]
		public IActionResult CheckPhoneDuplicate([FromBody] PhoneDto phoneDto)
		{
			try
			{
				var isDuplicate = _context.Hospitals.Any(h => h.RegistrationNumber == phoneDto.RegistrationNumber);
				return Ok(new { Duplicate = isDuplicate });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { Message = "Error checking phone duplicate", Error = ex.Message });
			}
		}
	}
}	

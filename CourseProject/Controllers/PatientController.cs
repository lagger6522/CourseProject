using Microsoft.AspNetCore.Mvc;
using CourseProject.Model;

namespace Store.controllers
{
	public class PatientController : Controller
	{

		private readonly QueuedbContext _context;

		public PatientController(QueuedbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<IActionResult> GetPatientById(int patientId)
		{
			try
			{
				var patient = await _context.Patients.FindAsync(patientId);

				if (patient == null)
				{
					return NotFound();
				}

				return Ok(patient);
			}
			catch (Exception ex)
			{
				return StatusCode(500, "Internal Server Error");
			}
		}

		[HttpPost]
		public async Task<IActionResult> UpdatePatient(int patientId, Patient updatedPatient)
		{
			try
			{
				var existingPatient = await _context.Patients.FindAsync(patientId);

				if (existingPatient == null)
				{
					return NotFound();
				}

				existingPatient.FirstName = updatedPatient.FirstName;
				existingPatient.LastName = updatedPatient.LastName;
				existingPatient.MiddleName = updatedPatient.MiddleName;
				existingPatient.BirthDate = updatedPatient.BirthDate;
				existingPatient.Gender = updatedPatient.Gender;

				_context.Entry(existingPatient).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
				await _context.SaveChangesAsync();

				return Ok("Patient data updated successfully");
			}
			catch (Exception ex)
			{
				return StatusCode(500, "Internal Server Error");
			}
		}

		[HttpDelete]
		public IActionResult DeletePatient(int patientId)
		{
			try
			{
				 var patient = _context.Patients.Find(patientId);
				if (patient == null)
				{
					return NotFound();
				}
				_context.Patients.Remove(patient);
				_context.SaveChanges();

				return NoContent(); 
			}
			catch (Exception ex)
			{
				// Обработка ошибок, например, логирование
				return StatusCode(500, "Internal Server Error");
			}
		}

		[HttpGet]
		public IActionResult GetPatientsByUser(int userId)
		{
			try
			{
				var patients = _context.Patients
					.Where(p => p.UserId == userId)
					.Select(p => new
					{
						p.PatientId,
						p.FirstName,
						p.LastName,
						p.MiddleName,
						p.BirthDate,
						p.Gender
					})
					.ToList();

				return Ok(patients);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { Message = "Error fetching patient list", Error = ex.Message });
			}
		}

		[HttpPost]
		public async Task<IActionResult> AddPatient([FromBody] PatientDto patientDto)
		{
			try
			{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}

				var patient = new Patient
				{
					FirstName = patientDto.FirstName,
					LastName = patientDto.LastName,
					MiddleName = patientDto.MiddleName,
					BirthDate = patientDto.BirthDate,
					Gender = patientDto.Gender,
					UserId = patientDto.UserId,
				};

				_context.Patients.Add(patient);
				await _context.SaveChangesAsync();

				return Ok(new { Message = "Patient added successfully" });
			}
			catch (Exception ex)
			{
				// Логирование ошибок, если необходимо
				return StatusCode(500, new { Message = "Error adding patient", Error = ex.Message });
			}
		}
	}
}	

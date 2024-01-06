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

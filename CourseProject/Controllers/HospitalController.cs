using Microsoft.AspNetCore.Mvc;
using CourseProject.Model;

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

                return Ok(new { Message = "Hospital added successfully", HospitalId = hospital.HospitalId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding hospital", Error = ex.Message });
            }
        }
	}
}	

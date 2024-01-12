using CourseProject.Model;
using CourseProject.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseProject.Controllers
{
    public class TalonController : Controller
    {
        private readonly QueuedbContext _context;
        public TalonController(QueuedbContext context)
        {
            _context = context;
        }
        [NonAction]
        private static string GetDayOfWeek(DateTime date)
        {
            switch (date.DayOfWeek)
            {
                case DayOfWeek.Monday: return "Monday";
                case DayOfWeek.Tuesday: return "Tuesday";
                case DayOfWeek.Wednesday: return "Wednesday";
                case DayOfWeek.Thursday: return "Thursday";
                case DayOfWeek.Friday: return "Friday";
                case DayOfWeek.Saturday: return "Saturday";
                case DayOfWeek.Sunday: return "Sunday";
            }
            return "";
        }
        [Authorize]
        [HttpGet]
        public IActionResult GetTalons(int userId, int? patientId)
        {
            if(patientId == null)
            {
                var patients = _context.Patients.Where(n => n.UserId == userId);
                var talons = _context.Talons.Join(patients, n => n.PatientId, k => k.PatientId, (n, k) =>new { 
                    n.TalonId,
                    n.PatientId,
                    n.ScheduleDayId,
                    n.OrderDate,
                    n.OrderTime,
                    Patient = k }).Where(n=>n.OrderDate > DateTime.Now.Date || n.OrderDate == DateTime.Now.Date && n.OrderTime > DateTime.Now.TimeOfDay);
                return Json(new { data = talons });
            }
            else
            {
                var talons = _context.Talons.Join(_context.Patients, n => n.PatientId, k => k.PatientId, (n, k) => new {
                    n.TalonId,
                    n.PatientId,
                    n.ScheduleDayId,
                    n.OrderDate,
                    n.OrderTime,
                    Patient = k
                }).Where(n => n.PatientId == patientId && (n.OrderDate > DateTime.Now.Date || n.OrderDate == DateTime.Now.Date && n.OrderTime >= DateTime.Now.TimeOfDay));
                return Json(new { data = talons });
            }
        }
        [Authorize]
        [HttpGet]
        public IActionResult GetAvailableTalons(int docktorId, DateTime date)
        {
            var schedule = _context.Schedules.FirstOrDefault(n => n.DoctorId == docktorId && n.DayOfWeek == GetDayOfWeek(date));
            if (schedule == null) return Json(new object[] { });
            if(DateTime.Now.Date > date.Date) return Json(new object[] { });
            List<TimeSpan> timeSpans = new List<TimeSpan>();
            var lunckEnd = schedule.LunchBreakStart == null || schedule.LunchBreakEnd == null ?
                 schedule.EndTime : schedule.LunchBreakEnd.Value;
            var lunchStart = schedule.LunchBreakStart != null? schedule.LunchBreakStart.Value : schedule.EndTime;
            for (var time = schedule.StartTime; time < lunchStart; time += TimeSpan.FromMinutes(15))
            {
                timeSpans.Add(time);
            }
            for (var time = schedule.EndTime; time < schedule.EndTime; time += TimeSpan.FromMinutes(15))
            {
                timeSpans.Add(time);
            }
            if(DateTime.Now.Date==date.Date )timeSpans = timeSpans.Where(n=>n > DateTime.Now.TimeOfDay).ToList();
            var orderedTimes = _context.Talons.Where(n => n.ScheduleDayId == schedule.ScheduleId && n.OrderDate.Date == date.Date)
                .Select(n=>n.OrderTime).ToList();
            return Json(
                    timeSpans.Select(n => new { Time=n, IsAvailable=!orderedTimes.Contains(n), SheduleId=schedule.ScheduleId})
                );
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> OrderTalon(int scheduleId, int patientId, DateTime orderDate, TimeSpan orderTime)
        {
            Talon talon = new Talon() { 
                ScheduleDayId = scheduleId,
                PatientId = patientId,
                OrderDate = orderDate.Date,
                OrderTime = orderTime
            };
            var patient = _context.Patients.FirstOrDefault(n => n.PatientId == patientId);
            if(patient == null) return Json(new { error = "Данный пациент не существует" });
            if (_context.Talons.Any(n=>n.ScheduleDayId == scheduleId &&
                                      n.PatientId == patientId &&
                                      orderDate.Date == orderDate.Date && 
                                      n.OrderTime == orderTime))return Json(new { error="Данное время уже занято"});
            var user = _context.Users.FirstOrDefault(n => n.UserId == patient.UserId);
            if (user == null) return Json(new { error = "Неизвестный пользователь" });
            _context.Talons.Add(talon);
            _context.SaveChanges();
            await MailWorker.SendMessage(user.Email,"Заказ талона","Успешно выполнен заказ талона под номером №" + talon.TalonId);
            return Json(new { message="Талон успешно забронирован", talonId=talon.TalonId });
        }
        [Authorize]
        [HttpDelete]
        public IActionResult DeleteTalon(int talonId)
        {
            var talon = _context.Talons.FirstOrDefault(n => n.TalonId == talonId);
            if (talon == null) return Json(new { error = "Талон с данным id не существует" });
            if (talon.OrderDate < DateTime.Now.Date ) return Json(new { error = "Талон уже истёк и не подлежит отмене" });
            _context.Talons.Remove(talon);
            _context.SaveChanges();
            return Json(new { message = $"Талон {talon.TalonId} успешно отменён" });
        }
    }
}

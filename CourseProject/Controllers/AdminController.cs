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
	public class AdminController : Controller
	{

		private readonly QueuedbContext _context;

		public AdminController(QueuedbContext context)
		{
			_context = context;
		}


	}
}	

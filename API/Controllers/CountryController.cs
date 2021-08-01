using Microsoft.AspNetCore.Mvc;
using API.Data;
using System.Collections.Generic;
using API.Entities;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.DTOs;
using System.Net;
using API.Interfaces;

namespace API.Controllers
{
    public class CountryController : BaseApiController
    {
        private readonly DataContext _context;
        public CountryController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("AddCountry")]
        public async Task<ActionResult<ResponseDto>> AddCountry(CountryDto oCountryDto)
        {
            Country oCountry = new Country
            {
                CountryName = oCountryDto.countryName
            };
            _context.countries.Add(oCountry);
            await _context.SaveChangesAsync();
            return new ResponseDto
            {
                Message = "Country Added successfully",
                Data = string.Empty
            };
        }

        [HttpGet]
        [Route("getCountry")]
        public async Task<ActionResult<IEnumerable<Country>>> getCountry()
        {
            return await _context.countries.ToListAsync();

        }
    }
}
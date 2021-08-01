using Microsoft.AspNetCore.Mvc;
using API.Data;
using System.Collections.Generic;
using API.Entities;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using System.Net.Http;
using API.Interfaces;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDTO oRegisterDTO)
        {
            if (await isUserExist(oRegisterDTO.username))
            {
                return BadRequest("UserName is already taken!!");
            }
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = oRegisterDTO.username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(oRegisterDTO.password)),
                PasswordSalt = hmac.Key
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDto{
                userName = user.UserName,
                token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> login(LoginDto oLoginDto)
        {
            ResponseDto oResponseDto = new ResponseDto();
            var user = await _context.Users
            .SingleOrDefaultAsync(x => x.UserName == oLoginDto.username);
            if (user == null)
            {
                return Unauthorized("invalid username");
            }
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var ComputeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(oLoginDto.password));
            for (int i = 0; i < ComputeHash.Length; i++)
            {
                if (ComputeHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("invalid username");
                }
            }
            oResponseDto.Message = "authorized";
           return new UserDto{
                userName = user.UserName,
                token = _tokenService.CreateToken(user)
            };
        }
        private async Task<bool> isUserExist(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}
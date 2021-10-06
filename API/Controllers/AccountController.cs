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
using AutoMapper;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
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
            var user = _mapper.Map<AppUser>(oRegisterDTO);
            using var hmac = new HMACSHA512();
            user.UserName = oRegisterDTO.username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(oRegisterDTO.password));
            user.PasswordSalt = hmac.Key;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDto
            {
                userName = user.UserName,
                token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                PhotoUrl = "./assets/user.png"
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> login(LoginDto oLoginDto)
        {
            ResponseDto oResponseDto = new ResponseDto();
            var user = await _context.Users
            .Include(p => p.Photos)
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
            return new UserDto
            {
                userName = user.UserName,
                token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.ImageUrl,
                KnownAs = user.KnownAs
            };
        }
        private async Task<bool> isUserExist(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}
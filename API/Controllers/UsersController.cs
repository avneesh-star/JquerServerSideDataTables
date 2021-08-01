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
using AutoMapper;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            // var users = await _userRepository.GetUsersAsync();
            // var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);

            return Ok(await _userRepository.GetMembersAsync());
        }

        [HttpGet("User/{id}")]
        public async Task<ActionResult<MemberDto>> GetUsers(int id)
         {
            var user = await _userRepository.GetUserByIdAsync(id);
            return _mapper.Map<MemberDto>(user);
        }
         

        [HttpGet("{UserName}")]
        public async Task<ActionResult<MemberDto>> GetUsers(string UserName) 
        {
            return  await _userRepository.GetMemberAsync(UserName);

            //return _mapper.Map<MemberDto>(user);
        }
         
    }
}
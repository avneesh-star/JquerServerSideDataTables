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
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using API.Extensions;
using API.Helpers;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoservice;
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoservice)
        {
            _photoservice = photoservice;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            // var users = await _userRepository.GetUsersAsync();
            // var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            var user = await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(user.CurrentPage, user.PageSize, user.TotalCount, user.TotalPage);
            return Ok(user);
        }

        [HttpGet("User/{id}")]
        public async Task<ActionResult<MemberDto>> GetUsers(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            return _mapper.Map<MemberDto>(user);
        }


        [HttpGet("{UserName}", Name ="GetUser")]
        public async Task<ActionResult<MemberDto>> GetUsers(string UserName)
        {
            return await _userRepository.GetMemberAsync(UserName);

            //return _mapper.Map<MemberDto>(user);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUserNameAsync(userName);
            _mapper.Map(memberUpdateDto, user);
            _userRepository.UpdateUser(user);
            if (await _userRepository.SaveAllAsync())
                return NoContent();
            return BadRequest("Faild to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotosDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            var result = await _photoservice.AddPhotoAsync(file);

            if(result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                ImageUrl = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count ==0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync())
            {
                 //return _mapper.Map<PhotosDto>(photo);
                 return CreatedAtRoute("GetUser",new {UserName = user.UserName},  _mapper.Map<PhotosDto>(photo));
            }
               
            return BadRequest("Prblom in adding photos");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            var photo = user.Photos.FirstOrDefault(x=>x.Id == photoId);

            if(photo.IsMain) return BadRequest("This is already yout main photo");

            var currentMain = user.Photos.FirstOrDefault(x=>x.IsMain);

            if(currentMain !=null) currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Faild to set main photo");
        }

        [HttpDelete("DeletePhoto/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            var photo = user.Photos.FirstOrDefault(x=>x.Id == photoId);

            if(photo == null) return NotFound();

            if(photo.IsMain) return BadRequest("You can not delete your main photo");

            if(photo.PublicId != null)
            {
                 var result = await _photoservice.deletePhotoAsync(photo.PublicId);
                if(result.Error!=null) return BadRequest(result.Error.Message);

            }

            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Faild to delete photo");
        }

        

    }
}
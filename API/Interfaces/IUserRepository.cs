using System.Threading.Tasks;
using API.Entities;
using System.Collections.Generic;
using API.DTOs;

namespace API.Interfaces
{
    public interface IUserRepository
    {
         void UpdateUser(AppUser user);
         Task<bool> SaveAllAsync();
         Task<IEnumerable<AppUser>> GetUsersAsync();
         Task<AppUser> GetUserByIdAsync(int Id);
          Task<AppUser> GetUserByUserNameAsync(string UserName);

          Task<IEnumerable<MemberDto>> GetMembersAsync();

          Task<MemberDto> GetMemberAsync(string UserName);
          

    }
}
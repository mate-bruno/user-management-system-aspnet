using FSD_ViktorMate_SFQ6PO.Data;
using FSD_ViktorMate_SFQ6PO.Models;
using Microsoft.AspNetCore.Mvc;

namespace FSD_ViktorMate_SFQ6PO.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repository;

        public UserController(IUserRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IEnumerable<User> GetUsers()
        {
            return _repository.Read();
        }

        [HttpGet("{id}")]
        public User? GetUsers(int id)
        {
            return _repository.Read(id);
        }

        [HttpPost]
        public void CreateUser([FromBody] User user)
        {
            _repository.Create(user);
        }

        [HttpPut("{id}")]
        public void EditUser([FromBody] User user)
        {
            _repository.Update(user);
        }

        [HttpDelete("{id}")]
        public void DeleteUser(int id)
        {
            _repository.Delete(id);
        }
    }
}

using FSD_ViktorMate_SFQ6PO.Models;

namespace FSD_ViktorMate_SFQ6PO.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly UserDbContext _context;
        public UserRepository(UserDbContext context)
        {
            _context = context;
        }
        public void Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public User? Read(int id)
        {
            return _context.Users.Find(id);
        }

        public List<User> Read()
        {
            return _context.Users.ToList();
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }
    }
}

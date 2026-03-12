using FSD_ViktorMate_SFQ6PO.Models;

namespace FSD_ViktorMate_SFQ6PO.Data
{
    public interface IUserRepository
    {
        void Create(User user);
        User? Read(int id);
        List<User> Read();
        void Update(User user);
        void Delete(int id);
    }
}

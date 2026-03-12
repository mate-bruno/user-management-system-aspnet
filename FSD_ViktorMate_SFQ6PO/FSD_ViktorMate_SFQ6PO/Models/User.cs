using System.ComponentModel.DataAnnotations;

namespace FSD_ViktorMate_SFQ6PO.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime BirthDate { get; set; }
        public DateTime RegistrationDate { get; set; }
    }
}

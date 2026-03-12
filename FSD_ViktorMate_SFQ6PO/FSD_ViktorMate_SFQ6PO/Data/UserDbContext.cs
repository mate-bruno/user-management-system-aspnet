using FSD_ViktorMate_SFQ6PO.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace FSD_ViktorMate_SFQ6PO.Data
{
    public class UserDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public UserDbContext()
        {
            Database.EnsureCreated(); //Using the code first approach, if the database does not exist this method will create it.
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=UserDB;Trusted_Connection=True;");

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Seed initial data for testing purposes
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, FullName = "Alice", Email = "alice@company.com", BirthDate = DateTime.Parse("2001.01.01"), RegistrationDate = DateTime.Now.AddYears(-2)},
                new User { Id = 2, FullName = "Bob", Email = "bob@company.com", BirthDate = DateTime.Parse("2000.01.01"), RegistrationDate = DateTime.Now.AddYears(-1)}
            );
        }

    }
}

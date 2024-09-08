using Microsoft.EntityFrameworkCore;
using MovieAPI.Domain.Models.UserAggregate;

namespace MovieAPI.Data.Repositories {
    public class UserRepository : IUserRepository {

        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context) {
            _context = context;
        }

        public async Task AddUser(User user) {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetUserByUsername(string username) {
            return await _context.Users.SingleOrDefaultAsync(p => p.Username == username);
        }

        public async Task<User?> GetUserByUsernameAndEmail(string username, string email) {
            return await _context.Users.SingleOrDefaultAsync(p => p.Username == username || p.Email == email);
        }
    }
}

namespace MovieAPI.Domain.Models.UserAggregate {
    public interface IUserRepository {

        Task AddUser(User user);
        Task<User?> GetUserByUsername(string username);
        Task<User?> GetUserByUsernameAndEmail(string username, string email);
    }
}

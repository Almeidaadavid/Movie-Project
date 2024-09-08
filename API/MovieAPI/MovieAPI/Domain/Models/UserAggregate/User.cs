using MovieAPI.Domain.Models.FavoriteMovieAggregate;

namespace MovieAPI.Domain.Models.UserAggregate
{
    public class User {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public ICollection<FavoriteMovie> FavoriteMovies { get; set; }

        public User(string username, string password, string email) {
            this.Username = username;
            this.Password = password;
            this.Email = email;
        }

        public User() { }
    }
}

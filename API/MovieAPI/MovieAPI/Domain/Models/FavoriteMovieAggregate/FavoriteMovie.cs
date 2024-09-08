using MovieAPI.Domain.Models.UserAggregate;

namespace MovieAPI.Domain.Models.FavoriteMovieAggregate
{
    public class FavoriteMovie {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string Title { get; set; }
        public double Rating { get; set; }
        public int UserId { get; set; }

        public User User { get; set; }

        public FavoriteMovie(int movieId, string title, double rating, int userId) {
            this.MovieId = movieId;
            this.Title = title;
            this.Rating = rating;
            this.UserId = userId;
        }

        public FavoriteMovie() { }

    }
}

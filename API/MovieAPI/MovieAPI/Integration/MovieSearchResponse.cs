using MovieAPI.Domain.Models.MovieAggregate;

namespace MovieAPI.Integration
{
    public class MovieSearchResponse {
        public int Page { get; set; }
        public List<Movie> Results { get; set; }
        public int TotalPages { get; set; }
        public int TotalResults { get; set; }
    }
}

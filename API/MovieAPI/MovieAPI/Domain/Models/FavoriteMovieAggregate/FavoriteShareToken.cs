namespace MovieAPI.Domain.Models.FavoriteMovieAggregate {
    public class FavoriteShareToken {
        public string Token { get; set; }
        public List<int> FavoriteMovieIds { get; set; }
        public DateTime ExpirationDate { get; set; }
    }
}

namespace MovieAPI.Domain.DTOs {
    public class FavoriteMovieDTO {
        public int MovieId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public string PosterPath { get; set; }
        public string Date { get; set; }
        public double Rating { get; set; }
    }
}

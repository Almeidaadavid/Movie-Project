namespace MovieAPI.Domain.Models.FavoriteMovieAggregate {
    public interface IFavoriteMovieRepository {

        Task AddFavoriteMovie(FavoriteMovie FavoriteMovie);
        Task DeleteFavoriteMovie(FavoriteMovie FavorirteMovie);
        Task<FavoriteMovie?> GetFavoriteByMovieIdAndUserId(int MovieID, int UserID);
        Task<FavoriteMovie?> GetFavoriteByIdAndUserId(int ID, int UserID);
        Task<List<FavoriteMovie>> GetFavoriteMovies(int UserID);
    }
}

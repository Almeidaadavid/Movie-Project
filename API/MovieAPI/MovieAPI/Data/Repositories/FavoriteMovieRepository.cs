using Microsoft.EntityFrameworkCore;
using MovieAPI.Domain.Models.FavoriteMovieAggregate;

namespace MovieAPI.Data.Repositories {
    public class FavoriteMovieRepository : IFavoriteMovieRepository {
        private readonly AppDbContext _context;
        public FavoriteMovieRepository(AppDbContext context) {
            _context = context;
        }

        public async Task AddFavoriteMovie(FavoriteMovie favoriteMovie) {
            _context.FavoriteMovies.Add(favoriteMovie);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFavoriteMovie(FavoriteMovie FavoriteMovie) {
            _context.FavoriteMovies.Remove(FavoriteMovie);
            await _context.SaveChangesAsync();
        }

        public async Task<FavoriteMovie?> GetFavoriteByMovieIdAndUserId(int MovieId, int UserID) {
            return await _context.FavoriteMovies.FirstOrDefaultAsync(p => p.MovieId == MovieId && p.UserId == UserID);
        }

        public async Task<FavoriteMovie?> GetFavoriteByIdAndUserId(int ID, int UserID) {
            return await _context.FavoriteMovies.FirstOrDefaultAsync(p => p.Id == ID && p.UserId == UserID);
        }

        public async Task<List<FavoriteMovie>> GetFavoriteMovies(int UserID) {
            return await _context.FavoriteMovies.Where(p => p.UserId == UserID).ToListAsync();
        }
    }
}

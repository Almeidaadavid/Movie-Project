using Microsoft.EntityFrameworkCore;
using MovieAPI.Domain.Models.FavoriteMovieAggregate;
using MovieAPI.Domain.Models.UserAggregate;

namespace MovieAPI.Data.Repositories
{
    public class AppDbContext : DbContext {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<FavoriteMovie> FavoriteMovies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<User>()
                .HasMany(p => p.FavoriteMovies)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);
        }
    }
}

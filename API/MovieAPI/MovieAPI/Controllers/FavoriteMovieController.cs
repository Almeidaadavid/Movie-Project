using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using MovieAPI.Domain.DTOs;
using MovieAPI.Domain.Models.FavoriteMovieAggregate;
using MovieAPI.Integration;
using MovieAPI.Services;
using System.Security.Claims;

namespace MovieAPI.Controllers {
    [ApiController]
    [Route("api/favorite-movies")]
    [Authorize]
    public class FavoriteMovieController : ControllerBase {
        private readonly IFavoriteMovieRepository _favoriteMovieRepository;
        private readonly MovieService _movieService;
        private readonly IMemoryCache _memoryCache;
        public FavoriteMovieController(IFavoriteMovieRepository favoriteMovieRepository, MovieService movieService, IMemoryCache memoryCache) {
            _favoriteMovieRepository = favoriteMovieRepository;
            _movieService = movieService;
            _memoryCache = memoryCache;
        }

        [HttpPost]
        [Route("add-favorite-movie/{movieID}")]
        public async Task<IActionResult> AddFavoriteMovie(int movieID) {
            int? UserID = GetUserId();
            if (UserID == null) {
                return Unauthorized();
            }

            MovieDetails? movieDetails = await _movieService.GetMovieDetailsAsync(movieID);
            if (movieDetails == null) {
                return NotFound("Filme não encontrado na API do TMDb.");
            }

            FavoriteMovie? ExistingFavorite = await _favoriteMovieRepository.GetFavoriteByMovieIdAndUserId(movieID, UserID.Value);
            if (ExistingFavorite != null) {
                return BadRequest("Esse filme já está na lista de favoritos.");
            }

            FavoriteMovie FavoriteMovie = new FavoriteMovie(movieDetails.Id, movieDetails.Title, movieDetails.VoteAverage, UserID.Value);
            await _favoriteMovieRepository.AddFavoriteMovie(FavoriteMovie);
            return Ok("Filme adicionado aos favoritos.");
        }

        [HttpDelete]
        [Route("delete-favorite-movie/{movieID}")]
        public async Task<IActionResult> DeleteFavoriteMovie(int movieID) {
            int? UserID = GetUserId();
            if (UserID == null) {
                return Unauthorized();
            }

            FavoriteMovie? FavoriteMovie = await _favoriteMovieRepository.GetFavoriteByMovieIdAndUserId(movieID, UserID.Value);
            if (FavoriteMovie == null) {
                return NotFound("O filme não está na lista de favoritos.");
            }

            await _favoriteMovieRepository.DeleteFavoriteMovie(FavoriteMovie);
            return Ok("Filme removido dos favoritos.");
        }

        [HttpGet]
        [Route("get-favorite-movies")]
        public async Task<IActionResult> GetFavoriteMovies() {
            int? UserID = GetUserId();
            if (UserID == null) {
                return Unauthorized();
            }

            List<FavoriteMovie> FavoriteMovies = await _favoriteMovieRepository.GetFavoriteMovies(UserID.Value);

            if (FavoriteMovies.Count == 0) {
                return NotFound("Nenhum filme encontrado na lista de favoritos.");
            }

            List<MovieDetailDTO> lstFavoriteMovieDTO = new List<MovieDetailDTO>();

            foreach (FavoriteMovie Movies in FavoriteMovies) {
                MovieDetails? movieDetails = await _movieService.GetMovieDetailsAsync(Movies.MovieId);
                if (movieDetails == null) {
                    continue;
                }

                MovieDetailDTO movieDetailDTO = new MovieDetailDTO {
                    Id = movieDetails.Id,
                    Title = movieDetails.Title,
                    Description = movieDetails.Overview,
                    PosterPath = movieDetails.PosterPath,
                    Rating = movieDetails.VoteAverage,
                    Date = movieDetails.ReleaseDate,
                    Budget = movieDetails.Budget.ToString("N0")
                };
                lstFavoriteMovieDTO.Add(movieDetailDTO);
            }

            return Ok(lstFavoriteMovieDTO);
        }

        [HttpGet]
        [Route("fetch-favorite-movie")]
        public async Task<IActionResult> GetFavoriteMoviesID() {
            int? UserID = GetUserId();
            if (UserID == null) {
                return Unauthorized();
            }

            List<FavoriteMovie> lstFavoriteMovies = await _favoriteMovieRepository.GetFavoriteMovies(UserID.Value);

            List<int> lstFavoriteMoviesID = lstFavoriteMovies.ConvertAll(x => x.MovieId);
            return Ok(lstFavoriteMoviesID);
        }


        [HttpPost]
        [Route("generate-favorites-token")]
        public async Task<IActionResult> GenerateFavoritesToken() {
            int? UserID = GetUserId();
            if (UserID == null) {
                return Unauthorized();
            }
            List<FavoriteMovie> lstFavoriteMovies = await _favoriteMovieRepository.GetFavoriteMovies(UserID.Value);
            List<int> favoriteMovieIds = lstFavoriteMovies.ConvertAll(x => x.MovieId);

            DateTime ExpirationDate = DateTime.UtcNow.AddHours(24);

            string? token = Guid.NewGuid().ToString();
            var favoriteShareToken = new FavoriteShareToken {
                Token = token,
                FavoriteMovieIds = favoriteMovieIds,
                ExpirationDate = ExpirationDate
            };

            _memoryCache.Set(token, favoriteShareToken, new MemoryCacheEntryOptions {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
            });

            return Ok(new {Token = token, success = true});
        }

        [HttpGet]
        [Route("shared-favorites/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSharedFavorites(string token) {
            if (string.IsNullOrEmpty(token)) {
                return NotFound();
            }

            if (!_memoryCache.TryGetValue(token, out FavoriteShareToken? tokenData) || tokenData!.ExpirationDate < DateTime.UtcNow) {
                return NotFound();
            }

            List<MovieDetailDTO> lstFavoriteMovieDTO = new List<MovieDetailDTO>();
            foreach (var Movies in tokenData.FavoriteMovieIds) {
                MovieDetails? movieDetails = await _movieService.GetMovieDetailsAsync(Movies);
                if (movieDetails == null) {
                    continue;
                }

                MovieDetailDTO movieDetailDTO = new MovieDetailDTO {
                    Id = movieDetails.Id,
                    Title = movieDetails.Title,
                    Description = movieDetails.Overview,
                    PosterPath = movieDetails.PosterPath,
                    Rating = movieDetails.VoteAverage,
                    Date = movieDetails.ReleaseDate,
                    Budget = movieDetails.Budget.ToString("N0")
                };
                lstFavoriteMovieDTO.Add(movieDetailDTO);
            }

            return Ok(lstFavoriteMovieDTO);
        }

        private int? GetUserId() {
            string? strUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(strUserId)) {
                return null;
            }

            int UserID = Convert.ToInt32(strUserId);
            return UserID;
        }
    }
}

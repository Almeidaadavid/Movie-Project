using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieAPI.Domain.DTOs;
using MovieAPI.Domain.Models.FavoriteMovieAggregate;
using MovieAPI.Integration;
using MovieAPI.Services;
using System.Security.Claims;

namespace MovieAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoriteMovieController : ControllerBase {
        private readonly IFavoriteMovieRepository _favoriteMovieRepository;
        private readonly MovieService _movieService;
        public FavoriteMovieController(IFavoriteMovieRepository favoriteMovieRepository, MovieService movieService) {
            _favoriteMovieRepository = favoriteMovieRepository;
            _movieService = movieService;
        }

        [HttpPost]
        [Route("AddFavoriteMovie/{MovieID}")]
        public async Task<IActionResult> AddFavoriteMovie(int MovieID) {
            int? UserID = GetUserId();
            if (UserID == null) {
                return Unauthorized();
            }

            MovieDetails? movieDetails = await _movieService.GetMovieDetailsAsync(MovieID);
            if (movieDetails == null) {
                return NotFound("Filme não encontrado na API do TMDb.");
            }

            FavoriteMovie? ExistingFavorite = await _favoriteMovieRepository.GetFavoriteByMovieIdAndUserId(MovieID, UserID.Value);
            if (ExistingFavorite != null) {
                return BadRequest("Esse filme já está na lista de favoritos.");
            }

            FavoriteMovie FavoriteMovie = new FavoriteMovie(movieDetails.Id, movieDetails.Title, movieDetails.VoteAverage, UserID.Value);
            await _favoriteMovieRepository.AddFavoriteMovie(FavoriteMovie);
            return Ok("Filme adicionado aos favoritos.");
        }

        [HttpDelete]
        [Route("DeleteFavoriteMovie/{MovieID}")]
        public async Task<IActionResult> DeleteFavoriteMovie(int MovieID) {
            int? UserID = GetUserId();
            if (UserID == null) {
                return Unauthorized();
            }

            FavoriteMovie? FavoriteMovie = await _favoriteMovieRepository.GetFavoriteByMovieIdAndUserId(MovieID, UserID.Value);
            if (FavoriteMovie == null) {
                return NotFound("O filme não está na lista de favoritos.");
            }

            await _favoriteMovieRepository.DeleteFavoriteMovie(FavoriteMovie);
            return Ok("Filme removido dos favoritos.");
        }

        [HttpGet]
        [Route("GetFavoriteMovies")]
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
                    Budget = movieDetails.Budget.ToString("N0"),
                    BackdropPath = movieDetails.BackdropPath
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

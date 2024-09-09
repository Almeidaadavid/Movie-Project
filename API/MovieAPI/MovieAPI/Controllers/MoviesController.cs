using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieAPI.Domain.DTOs;
using MovieAPI.Domain.Models.FavoriteMovieAggregate;
using MovieAPI.Domain.Models.MovieAggregate;
using MovieAPI.Integration;
using MovieAPI.Services;
using System.Security.Claims;

namespace MovieAPI.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase {
        private readonly MovieService _movieService;

        public MoviesController(MovieService movieService) {
            _movieService = movieService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMovies([FromQuery] string query) {
            MovieSearchResponse? result = await _movieService.SearchMoviesAsync(query);
            if (result == null) {
                return NotFound();
            }
            List<MovieDetailDTO> lstMovieDetailDTO = result.Results.ConvertAll(x => new MovieDetailDTO {
                MovieId = x.Id,
                Title = x.Title,
                Description = x.Overview,
                PosterPath = x.PosterPath
            });

            return Ok(lstMovieDetailDTO);
        }

        [HttpGet]
        [Route("GetAllMovies")]
        public async Task<IActionResult> GetMovies() {
            MovieSearchResponse? result = await _movieService.SearchPopularMoviesAsync();
            if (result == null) {
                return NotFound();
            }
            List<MovieDetailDTO> lstMovieDetailDTO = result.Results.ConvertAll(x => new MovieDetailDTO {
                MovieId = x.Id,
                Title = x.Title,
                Description = x.Overview,
                PosterPath = x.PosterPath
            });
            return Ok(lstMovieDetailDTO);
        }

        [HttpGet]
        [Route("GetMovieDetails/{MovieID}")]
        public async Task<IActionResult> GetMovieDetails(int MovieID) {
            MovieDetails? movieDetails = await _movieService.GetMovieDetailsAsync(MovieID);
            if (movieDetails == null) {
                return NotFound();
            }
            MovieDetailDTO movieDetailDTO = new MovieDetailDTO {
                MovieId = movieDetails.Id,
                Title = movieDetails.Title,
                Description = movieDetails.Overview,
                PosterPath = movieDetails.PosterPath,
                Rating = movieDetails.VoteAverage,
                Date = movieDetails.ReleaseDate,
                Budget = movieDetails.Budget.ToString("N0"),
                BackdropPath = movieDetails.BackdropPath
            };
            return Ok(movieDetailDTO);
        }
    }
}

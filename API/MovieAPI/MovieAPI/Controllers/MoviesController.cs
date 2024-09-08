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
        public async Task<IActionResult> GetMovies([FromQuery] string query, int page) {
            //TODO: Corrigir retorno dos dados, pois aqui está retornando todas as infos de retorno da API para o usuário. (Criar DTO para o retorno de tela).
            MovieSearchResponse? result = await _movieService.SearchMoviesAsync(query, page);
            if (result == null) {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAllMovies")]
        public async Task<IActionResult> GetMovies() {
            //TODO: Corrigir retorno dos dados, pois aqui está retornando todas as infos de retorno da API para o usuário. (Criar DTO para o retorno de tela).
            MovieSearchResponse? result = await _movieService.SearchPopularMoviesAsync();
            if (result == null) {
                return NotFound();
            }
            return Ok(result);
        }
    }
}

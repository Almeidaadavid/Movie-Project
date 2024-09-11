using MovieAPI.Domain.Models.FavoriteMovieAggregate;
using MovieAPI.Integration;
using Newtonsoft.Json;
using System.Net.Http;

namespace MovieAPI.Services {
    public class MovieService {
        private readonly HttpClient _httpClient;
        public MovieService(IHttpClientFactory httpClientFactory) {
            _httpClient = httpClientFactory.CreateClient("tmdb");
        }

        public async Task<MovieSearchResponse?> SearchMoviesAsync(int page, string Query) {
            string? Url = $"search/movie?query={Query}&language=pt-BR&page={page}";
            return await GetAsync<MovieSearchResponse>(Url);
        }

        public async Task<MovieSearchResponse?> SearchPopularMoviesAsync(int page) {
            return await GetAsync<MovieSearchResponse>($"movie/popular?page={page}&language=pt-BR");
        }

        public async Task<MovieDetails?> GetMovieDetailsAsync(int MovieId) {
            string? url = $"movie/{MovieId}?language=pt-BR";
            return await GetAsync<MovieDetails>(url);
        }

        private async Task<T?> GetAsync<T>(string Url) where T : class {
            HttpResponseMessage response;

            try {
                response = await _httpClient.GetAsync(Url);
                response.EnsureSuccessStatusCode();
            } catch (HttpRequestException) {
                return null;
            }

            string? json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}

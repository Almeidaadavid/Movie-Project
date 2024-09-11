using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using MovieAPI.Domain.DTOs;
using MovieAPI.Domain.Models.UserAggregate;
using MovieAPI.Services;

namespace MovieAPI.Controllers {

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;
        public AuthController(IUserRepository userRepository, JwtService jwtService) {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO UserDTO) {
            User User = new User(UserDTO.Username, BCrypt.Net.BCrypt.HashPassword(UserDTO.Password),UserDTO.Email);
            User? Credentials = await _userRepository.GetUserByUsernameAndEmail(UserDTO.Username, UserDTO.Email);

            if (Credentials?.Username != null && Credentials?.Username == UserDTO.Username) {
                return BadRequest(new { message = "Nome de usuário já está em uso." });
            }

            if (Credentials?.Email != null) {
                return BadRequest(new { message = "Email já está em uso." });
            }

            try {
                await _userRepository.AddUser(User);
                return Ok(new { message = "Usuário criado com sucesso." });
            } catch (Exception ex) {
                return BadRequest(ex.Message);
            }            
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO Login) {
            User? User = await _userRepository.GetUserByUsername(Login.Username);
            if (User == null) {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }

            bool validPasword = BCrypt.Net.BCrypt.Verify(Login.Password, User.Password);
            if (!validPasword) {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }

            string token = _jwtService.GenerateToken(User.Id.ToString(), User.Username);
            return Ok(new { token });
        }
    }
}

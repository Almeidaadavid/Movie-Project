using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MovieAPI.Services {
    public class JwtService {
        private readonly IConfiguration _configuration;
        public JwtService(IConfiguration configuration) {
            _configuration = configuration;
        }

        public string GenerateToken(string userid, string username) {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.UTF8.GetBytes(_configuration["JWT:Key"]);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new[] { 
                    new Claim(ClaimTypes.NameIdentifier, userid),
                    new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _configuration["JWT:Issuer"], 
                Audience = _configuration["JWT:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            try {
                SecurityToken? token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            } catch (Exception ex) {
                throw new Exception("Erro ao gerar token JWT", ex);
            }
        }
    }
}

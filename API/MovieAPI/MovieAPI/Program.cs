
using dotenv.net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MovieAPI.Data.Repositories;
using MovieAPI.Domain.Models.FavoriteMovieAggregate;
using MovieAPI.Domain.Models.UserAggregate;
using MovieAPI.Services;
using System.Text;

namespace MovieAPI {
    public class Program {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);
            DotEnv.Load();
            LoadEnvironmentVariables(builder.Configuration);

            builder.Services.AddDbContext<AppDbContext>(options => {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.Services.AddSwaggerGen(p => {
                p.SwaggerDoc("v1", new OpenApiInfo { Title = "MovieAPI", Version = "v1" });

                p.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
                    In = ParameterLocation.Header,
                    Description = "Please enter token in the format: Bearer {your token}",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });

                p.AddSecurityRequirement(new OpenApiSecurityRequirement { 
                    {
                        new OpenApiSecurityScheme {
                            Reference = new OpenApiReference {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"], 
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            builder.Services.AddHttpClient("tmdb", p => {
                p.BaseAddress = new Uri($"{builder.Configuration["TMDb:BaseUrl"]}/");
                p.DefaultRequestHeaders.Add("Accept", "application/json");
                p.DefaultRequestHeaders.Add("Authorization", $"Bearer {builder.Configuration["TMDb:ApiKey"]}");
            });

            builder.Services.AddAuthorization();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IFavoriteMovieRepository, FavoriteMovieRepository>();

            builder.Services.AddScoped<JwtService>();
            builder.Services.AddScoped<MovieService>();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(app => {
                app.AllowAnyOrigin();
                app.AllowAnyMethod();
                app.AllowAnyHeader();
            });

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }

        private static void LoadEnvironmentVariables(ConfigurationManager configuration) {
            string? ConnectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
            string? JwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
            string? JwtIssuerKey = Environment.GetEnvironmentVariable("JWT_ISSUER_KEY");
            string? JwtAudienceKey = Environment.GetEnvironmentVariable("JWT_AUDIENCE_KEY");
            string? TmdbApiKey = Environment.GetEnvironmentVariable("TMDB_API_KEY");
            string? TmdbUrlBase = Environment.GetEnvironmentVariable("TMDB_URL_BASE") ?? "https://api.themoviedb.org/3";

            if (string.IsNullOrWhiteSpace(ConnectionString)) {
                throw new InvalidOperationException("The environment variable CONNECTION_STRING was not found or is empty.");
            }

            if (string.IsNullOrWhiteSpace(JwtKey)) {
                throw new InvalidOperationException("The environment variable JWT_KEY was not found or is empty.");
            }

            if (string.IsNullOrWhiteSpace(JwtIssuerKey)) {
                throw new InvalidOperationException("The environment variable JWT_ISSUER_KEY was not found or is empty.");
            }

            if (string.IsNullOrWhiteSpace(JwtAudienceKey)) {
                throw new InvalidOperationException("The environment variable JWT_AUDIENCE_KEY was not found or is empty.");
            }

            if (string.IsNullOrWhiteSpace(TmdbApiKey)) {
                throw new InvalidOperationException("The environment variable TMDB_API_KEY was not found or is empty.");
            }
            
            if (string.IsNullOrWhiteSpace(TmdbUrlBase)) {
                throw new InvalidOperationException("The environment variable TMDB_URL_BASE was not found or is empty.");
            }

            configuration["ConnectionStrings:DefaultConnection"] = ConnectionString;
            configuration["Jwt:Key"] = JwtKey;
            configuration["Jwt:Issuer"] = JwtIssuerKey;
            configuration["Jwt:Audience"] = JwtAudienceKey;
            configuration["TMDb:ApiKey"] = TmdbApiKey;
            configuration["TMDb:BaseUrl"] = TmdbUrlBase;
        }
    }
}